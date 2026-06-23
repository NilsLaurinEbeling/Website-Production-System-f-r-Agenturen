import { NextResponse } from "next/server"
import { BriefSchema } from "@/lib/schema/brief"
import { createAdminClient } from "@/lib/supabase/admin"
import { anthropic, MODELS } from "@/lib/anthropic/client"
import { withQStashVerification } from "@/lib/pipeline/verify"
import {
  failProject,
  isAtOrPast,
  loadProject,
  setProjectStatus,
} from "@/lib/pipeline/project"
import { enqueuePipelineStep } from "@/lib/pipeline/qstash"

interface Payload {
  projectId: string
}

/**
 * Step 1 — validate-brief (Haiku).
 *
 * Re-validates the saved brief against the schema and runs a quick
 * coherence check (catches spam / nonsensical input that still passes Zod).
 * On success advances to `research`.
 */
export const POST = withQStashVerification<Payload>(async ({ projectId }) => {
  const project = await loadProject(projectId)
  if (!project) {
    // Nothing to retry — ack so QStash stops.
    return NextResponse.json({ skipped: "project not found" })
  }

  // Idempotency: already moved past this step.
  if (isAtOrPast(project.status, "research")) {
    return NextResponse.json({ skipped: project.status })
  }

  const supabase = createAdminClient()
  const { data: brief } = await supabase
    .from("briefs")
    .select("data")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!brief) {
    await failProject(projectId, "No brief found for project")
    return NextResponse.json({ error: "No brief" }, { status: 200 })
  }

  const parsed = BriefSchema.safeParse(brief.data)
  if (!parsed.success) {
    await failProject(projectId, "Brief failed schema validation")
    return NextResponse.json({ error: "Invalid brief" }, { status: 200 })
  }

  // Lightweight coherence gate.
  try {
    const result = await anthropic.messages.create({
      model: MODELS.fast,
      max_tokens: 256,
      system:
        "You validate website intake briefs. Decide if the brief describes a " +
        "real, coherent business and is suitable for generating a marketing " +
        "website. Reject only obvious spam, gibberish, or empty content. " +
        'Reply with strict JSON: {"ok": boolean, "reason": string}.',
      messages: [
        {
          role: "user",
          content: `Brief:\n${JSON.stringify(parsed.data, null, 2)}`,
        },
      ],
    })

    const text = result.content.find((b) => b.type === "text")
    const verdict = text?.type === "text" ? extractJson(text.text) : null
    if (verdict && verdict.ok === false) {
      await failProject(
        projectId,
        `Brief rejected: ${verdict.reason ?? "not coherent"}`
      )
      return NextResponse.json({ rejected: true }, { status: 200 })
    }
  } catch (err) {
    // A model hiccup shouldn't block the pipeline — the schema already passed.
    console.warn("[validate-brief] coherence check skipped:", err)
  }

  await setProjectStatus(projectId, "research")
  await enqueuePipelineStep("research", { projectId })

  return NextResponse.json({ ok: true, status: "research" })
})

function extractJson(text: string): { ok?: boolean; reason?: string } | null {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(match[0])
  } catch {
    return null
  }
}
