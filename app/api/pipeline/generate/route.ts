import { NextResponse } from "next/server"
import type Anthropic from "@anthropic-ai/sdk"
import { randomUUID } from "node:crypto"
import { BriefSchema } from "@/lib/schema/brief"
import { DesignBriefingSchema } from "@/lib/schema/design-briefing"
import { SiteConfigSchema } from "@/lib/schema/site-config"
import { createAdminClient } from "@/lib/supabase/admin"
import { MODELS } from "@/lib/anthropic/client"
import { callToolForOutput } from "@/lib/anthropic/structured"
import { SITE_CONFIG_JSON_SCHEMA } from "@/lib/pipeline/site-config-jsonschema"
import { withQStashVerification } from "@/lib/pipeline/verify"
import {
  failProject,
  isAtOrPast,
  loadProject,
  setProjectStatus,
} from "@/lib/pipeline/project"

interface Payload {
  projectId: string
}

const SYSTEM_PROMPT =
  "You are an expert web designer and conversion copywriter. Generate a " +
  "complete, production-ready website configuration by calling the " +
  "emit_site_config tool. Follow the design briefing's theme style and " +
  "section list. Write all copy in German unless the brief is clearly in " +
  "another language. Rules: the first section is a hero and the last is a " +
  "footer; every CTA href points to an on-page anchor (e.g. #contact) that " +
  "matches a section; use realistic, specific copy — never lorem ipsum or " +
  "placeholder brackets; only reference image_url fields if you have a real " +
  "URL, otherwise omit them; keep all text within the schema length limits."

/**
 * Step 3 — generate (Sonnet, structured output).
 *
 * Brief + DesignBriefing → full SiteConfig. Zod-validated before it touches
 * the DB (with one self-correcting retry). Writes site_configs v1 (draft)
 * and advances to `review`.
 */
export const POST = withQStashVerification<Payload>(async ({ projectId }) => {
  const project = await loadProject(projectId)
  if (!project) return NextResponse.json({ skipped: "project not found" })
  if (isAtOrPast(project.status, "review")) {
    return NextResponse.json({ skipped: project.status })
  }

  const supabase = createAdminClient()

  const [{ data: briefRow }, { data: briefingRow }] = await Promise.all([
    supabase
      .from("briefs")
      .select("data")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("design_briefings")
      .select("data")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ])

  const brief = BriefSchema.safeParse(briefRow?.data)
  const briefing = DesignBriefingSchema.safeParse(briefingRow?.data)
  if (!brief.success || !briefing.success) {
    await failProject(projectId, "Missing brief or design briefing at generate step")
    return NextResponse.json({ error: "Missing inputs" }, { status: 200 })
  }

  const baseUserContent =
    `Customer brief:\n${JSON.stringify(brief.data, null, 2)}\n\n` +
    `Design briefing:\n${JSON.stringify(briefing.data, null, 2)}\n\n` +
    `Generate the full SiteConfig now.`

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: baseUserContent },
  ]

  try {
    let lastError = ""
    for (let attempt = 0; attempt < 2; attempt++) {
      const raw = await callToolForOutput({
        model: MODELS.reasoning,
        maxTokens: 16000,
        system: SYSTEM_PROMPT,
        messages,
        toolName: "emit_site_config",
        toolDescription: "Emit the complete, valid SiteConfig.",
        inputSchema: SITE_CONFIG_JSON_SCHEMA,
      })

      const normalized = normalizeSections(raw)
      const parsed = SiteConfigSchema.safeParse(normalized)
      if (parsed.success) {
        const { error: insertError } = await supabase
          .from("site_configs")
          .insert({
            project_id: projectId,
            version: 1,
            status: "draft",
            config: parsed.data,
          })
        if (insertError) {
          throw new Error(`Could not save config: ${insertError.message}`)
        }

        await setProjectStatus(projectId, "review")
        return NextResponse.json({ ok: true, status: "review" })
      }

      lastError = parsed.error.issues
        .slice(0, 10)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("\n")

      messages.push({
        role: "user",
        content:
          `The previous SiteConfig failed validation:\n${lastError}\n\n` +
          `Return a corrected SiteConfig via emit_site_config.`,
      })
    }

    await failProject(projectId, `Generated config invalid after retry:\n${lastError}`)
    return NextResponse.json({ error: "Validation failed" }, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "generate failed"
    console.error("[generate]", err)
    throw new Error(message)
  }
})

/**
 * Section ids/order/enabled are bookkeeping, not creative output. Assign
 * them deterministically so generation never fails on a malformed uuid or a
 * missing order index.
 */
function normalizeSections(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw
  const config = raw as Record<string, unknown>
  if (!Array.isArray(config.sections)) return raw

  config.sections = config.sections.map((section, index) => {
    const s = (section ?? {}) as Record<string, unknown>
    return {
      ...s,
      id: randomUUID(),
      order: index,
      enabled: s.enabled !== false,
    }
  })
  return config
}
