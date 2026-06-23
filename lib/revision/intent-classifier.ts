import { z } from "zod"
import { MODELS } from "@/lib/anthropic/client"
import { callToolForOutput } from "@/lib/anthropic/structured"
import { type SiteConfig } from "@/lib/schema/site-config"
import {
  RevisionIntentsSchema,
  type RevisionIntents,
} from "@/lib/schema/revision-intent"
import { THEME_STYLES } from "@/lib/schema/site-config"
import { SECTION_VARIANTS } from "./section-variants"

const INTENTS_TOOL_SCHEMA: Record<string, unknown> = {
  type: "object",
  properties: {
    intents: z.toJSONSchema(RevisionIntentsSchema, {
      io: "input",
      reused: "inline",
      unrepresentable: "any",
    }),
  },
  required: ["intents"],
  additionalProperties: false,
}

const SYSTEM_PROMPT =
  "You are a revision-intent classifier for a website builder. The agency " +
  "describes a change in natural language (usually German); you translate it " +
  "into one or more structured intents by calling the emit_intents tool.\n\n" +
  "Rules:\n" +
  "- Only emit intents that match the request. A single message may map to " +
  "several intents.\n" +
  "- Prefer the most specific intent. To recolor, use theme.set_color; to " +
  "switch the whole look, use theme.apply_preset.\n" +
  "- section_id MUST be copied verbatim from the section inventory; never " +
  "invent one. section_type MUST be one of the listed types.\n" +
  "- For wording/content tweaks where the new value is explicit (e.g. " +
  "\"change the headline to X\"), use section.update_content with a content " +
  "path (e.g. \"headline\", \"items.0.title\", \"cta_primary.label\").\n" +
  "- For \"rewrite/improve/make punchier\" requests without explicit text, " +
  "use section.regenerate_copy with concise guidance.\n" +
  "- To add a section, use section.add with a valid section_type (and " +
  "optionally a variant).\n" +
  "- Colors must be 6-digit hex (#rrggbb). Theme presets must be one of: " +
  THEME_STYLES.join(", ") + ".\n" +
  "- If the request is ambiguous or impossible to express as an intent, " +
  "return an empty intents array."

/** Compact, model-facing summary of the current config. */
function summarizeConfig(config: SiteConfig): string {
  const sections = config.sections
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((s) => {
      const content = (s as { content?: Record<string, unknown> }).content ?? {}
      const headline =
        (content.headline as string | undefined) ??
        (content.title as string | undefined) ??
        ""
      return {
        section_id: s.id,
        type: s.type,
        variant: s.variant,
        order: s.order,
        enabled: s.enabled,
        variants_available: SECTION_VARIANTS[s.type] ?? [],
        headline: headline.slice(0, 60),
      }
    })

  return JSON.stringify(
    {
      theme: {
        style: config.theme.style ?? null,
        colors: config.theme.colors,
        headingFont: config.theme.typography.headingFont,
        bodyFont: config.theme.typography.bodyFont,
        radius: config.theme.radius,
      },
      metadata: config.metadata,
      sections,
      addable_section_types: Object.keys(SECTION_VARIANTS),
    },
    null,
    2
  )
}

/**
 * Classify a free-text revision message into structured intents (Haiku).
 * The result is Zod-validated; an invalid or empty classification yields [].
 */
export async function classifyRevision(
  message: string,
  config: SiteConfig
): Promise<RevisionIntents> {
  const raw = await callToolForOutput({
    model: MODELS.fast,
    maxTokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content:
          `Current site config:\n${summarizeConfig(config)}\n\n` +
          `Revision request:\n"${message}"\n\n` +
          `Emit the matching intents now.`,
      },
    ],
    toolName: "emit_intents",
    toolDescription: "Emit the structured revision intents for this request.",
    inputSchema: INTENTS_TOOL_SCHEMA,
  })

  const wrapper = (raw ?? {}) as { intents?: unknown }
  const parsed = RevisionIntentsSchema.safeParse(wrapper.intents)
  return parsed.success ? parsed.data : []
}
