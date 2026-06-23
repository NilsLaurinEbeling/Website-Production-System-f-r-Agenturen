import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { SiteConfigSchema } from "@/lib/schema/site-config"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { classifyRevision } from "@/lib/revision/intent-classifier"
import { applyRevisionIntents } from "@/lib/revision/apply"

const BodySchema = z.object({
  message: z.string().trim().min(2).max(1000),
})

/** Revisions are only meaningful once a draft exists and before approval. */
const REVISABLE_STATUSES = ["review", "preview", "revising"]

/**
 * POST /api/projects/[id]/revise
 *
 * The revision loop. A free-text message is classified into structured
 * intents (Haiku), applied to the latest draft config (deterministic patcher +
 * Sonnet for AI intents), Zod-validated, and persisted as a new draft version.
 * Records the revision and returns the project to a reviewable state.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const body = await request.json().catch(() => null)
  const parsedBody = BodySchema.safeParse(body)
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid message", issues: parsedBody.error.issues },
      { status: 400 }
    )
  }
  const { message } = parsedBody.data

  // Authorize via RLS: this only returns the project if it belongs to the user.
  const supabase = await createClient()
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, status")
    .eq("id", projectId)
    .single()

  if (projectError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }
  if (!REVISABLE_STATUSES.includes(project.status)) {
    return NextResponse.json(
      { error: `Revisions are not allowed in status "${project.status}"` },
      { status: 409 }
    )
  }

  // Privileged work: site_configs has no owner INSERT policy by design.
  const admin = createAdminClient()

  const { data: latest, error: latestError } = await admin
    .from("site_configs")
    .select("version, config")
    .eq("project_id", projectId)
    .eq("status", "draft")
    .order("version", { ascending: false })
    .limit(1)
    .single()

  if (latestError || !latest) {
    return NextResponse.json({ error: "No draft config to revise" }, { status: 404 })
  }

  const currentConfig = SiteConfigSchema.safeParse(latest.config)
  if (!currentConfig.success) {
    return NextResponse.json({ error: "Stored config is invalid" }, { status: 500 })
  }

  // Classify → apply.
  const intents = await classifyRevision(message, currentConfig.data)
  if (intents.length === 0) {
    await admin.from("revisions").insert({
      project_id: projectId,
      message,
      intents: [],
      config_patch: null,
    })
    return NextResponse.json({
      ok: false,
      reason: "no_intents",
      message:
        "Die Anfrage konnte keiner konkreten Änderung zugeordnet werden. " +
        "Bitte formuliere sie etwas spezifischer.",
    })
  }

  const { config: revised, applied } = await applyRevisionIntents(
    currentConfig.data,
    intents
  )

  const validated = SiteConfigSchema.safeParse(revised)
  if (!validated.success) {
    return NextResponse.json(
      {
        ok: false,
        reason: "validation_failed",
        issues: validated.error.issues.slice(0, 10).map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 422 }
    )
  }

  const appliedCount = applied.filter((a) => a.ok).length
  if (appliedCount === 0) {
    await admin.from("revisions").insert({
      project_id: projectId,
      message,
      intents,
      config_patch: { applied },
    })
    return NextResponse.json({
      ok: false,
      reason: "nothing_applied",
      applied,
    })
  }

  const nextVersion = latest.version + 1
  const { error: insertError } = await admin.from("site_configs").insert({
    project_id: projectId,
    version: nextVersion,
    status: "draft",
    config: validated.data,
  })
  if (insertError) {
    return NextResponse.json(
      { error: `Could not save revised config: ${insertError.message}` },
      { status: 500 }
    )
  }

  await admin.from("revisions").insert({
    project_id: projectId,
    message,
    intents,
    config_patch: { applied },
  })

  // Return to the reviewable state the project came from.
  const nextStatus = project.status === "review" ? "review" : "preview"
  await admin
    .from("projects")
    .update({ status: nextStatus, error_message: null })
    .eq("id", projectId)

  return NextResponse.json({
    ok: true,
    version: nextVersion,
    status: nextStatus,
    applied,
  })
}

// AI intents can take a while; allow a generous server budget.
export const maxDuration = 60
export const runtime = "nodejs"
