import { NextResponse } from "next/server"
import { z } from "zod"
import type Anthropic from "@anthropic-ai/sdk"
import { BriefSchema } from "@/lib/schema/brief"
import { DesignBriefingSchema } from "@/lib/schema/design-briefing"
import { createAdminClient } from "@/lib/supabase/admin"
import { anthropic, MODELS } from "@/lib/anthropic/client"
import { callToolForOutput } from "@/lib/anthropic/structured"
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

const DESIGN_BRIEFING_JSON_SCHEMA = (() => {
  const schema = z.toJSONSchema(DesignBriefingSchema, {
    io: "input",
    reused: "inline",
    unrepresentable: "any",
  }) as Record<string, unknown>
  delete schema["$schema"]
  return schema
})()

/**
 * Step 2 — research (Sonnet + web_search).
 *
 * Researches the industry/competitors, then emits a structured
 * DesignBriefing that drives generation. On success advances to `generating`.
 */
export const POST = withQStashVerification<Payload>(async ({ projectId }) => {
  const project = await loadProject(projectId)
  if (!project) return NextResponse.json({ skipped: "project not found" })
  if (isAtOrPast(project.status, "generating")) {
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

  const parsedBrief = BriefSchema.safeParse(brief?.data)
  if (!parsedBrief.success) {
    await failProject(projectId, "No valid brief at research step")
    return NextResponse.json({ error: "No brief" }, { status: 200 })
  }
  const b = parsedBrief.data

  try {
    // Pass 1: research with web_search (server-executed tool).
    const research = await anthropic.messages.create({
      model: MODELS.reasoning,
      max_tokens: 2000,
      system:
        "You are a web design strategist researching how to build an " +
        "effective marketing website for a small/medium business. Use web " +
        "search to understand the industry, typical competitors, and what " +
        "converts. Be concise and concrete.",
      messages: [
        {
          role: "user",
          content:
            `Research the best website approach for this business:\n\n` +
            `Business: ${b.business_name}\n` +
            `Industry: ${b.industry}\n` +
            `Description: ${b.description}\n` +
            (b.target_audience ? `Audience: ${b.target_audience}\n` : "") +
            (b.address ? `Location: ${b.address}\n` : "") +
            (b.competitors?.length
              ? `Competitors: ${b.competitors.join(", ")}\n`
              : "") +
            `\nSummarise: industry conventions, what builds trust, which ` +
            `page sections convert best, tone of voice, and whether local ` +
            `SEO matters.`,
        },
      ],
      tools: [
        { type: "web_search_20250305", name: "web_search", max_uses: 5 },
      ],
    })

    const researchText = research.content
      .filter((blk): blk is Anthropic.TextBlock => blk.type === "text")
      .map((blk) => blk.text)
      .join("\n")

    // Pass 2: distil into a structured DesignBriefing.
    const raw = await callToolForOutput({
      model: MODELS.reasoning,
      maxTokens: 2000,
      system:
        "Turn the research notes into a structured design briefing for a " +
        "website generator. Pick the single best theme style and an ordered " +
        "set of page sections (always start with hero, end with footer).",
      messages: [
        {
          role: "user",
          content:
            `Brief:\n${JSON.stringify(b, null, 2)}\n\n` +
            `Research notes:\n${researchText}`,
        },
      ],
      toolName: "emit_design_briefing",
      toolDescription: "Emit the structured design briefing.",
      inputSchema: DESIGN_BRIEFING_JSON_SCHEMA,
    })

    const briefing = DesignBriefingSchema.parse(raw)

    await supabase
      .from("design_briefings")
      .insert({ project_id: projectId, data: briefing })

    await setProjectStatus(projectId, "generating")
    await enqueuePipelineStep("generate", { projectId })

    return NextResponse.json({ ok: true, status: "generating" })
  } catch (err) {
    const message = err instanceof Error ? err.message : "research failed"
    console.error("[research]", err)
    // Throw → 500 → QStash retries (transient model/network errors).
    throw new Error(message)
  }
})
