import { z } from "zod"
import { randomUUID } from "node:crypto"
import { MODELS } from "@/lib/anthropic/client"
import { callToolForOutput } from "@/lib/anthropic/structured"
import {
  AnySectionSchema,
  type AnySection,
  type SiteConfig,
} from "@/lib/schema/site-config"
import { SECTION_VARIANTS } from "./section-variants"

/**
 * JSON Schema for a single section (the discriminated union → anyOf), used as
 * the tool input for AI-powered section intents. Output is Zod-validated after
 * the model responds — this only steers generation.
 */
const SECTION_TOOL_SCHEMA: Record<string, unknown> = (() => {
  const section = z.toJSONSchema(AnySectionSchema, {
    io: "input",
    reused: "inline",
    unrepresentable: "any",
  })
  return {
    type: "object",
    properties: { section },
    required: ["section"],
  }
})()

const COPY_RULES =
  "Write all copy in German unless the existing content is clearly in another " +
  "language. Use realistic, specific, conversion-focused copy — never lorem " +
  "ipsum or placeholder brackets. Only include image_url fields if you have a " +
  "real URL, otherwise omit them. Respect every schema length limit. Keep " +
  "CTA hrefs pointing to on-page anchors (e.g. #contact)."

/** Bookkeeping fields are assigned by us, never by the model. */
function normalizeSection(
  raw: unknown,
  bookkeeping: { id: string; order: number; enabled: boolean }
): AnySection {
  const s = (raw ?? {}) as Record<string, unknown>
  const parsed = AnySectionSchema.safeParse({ ...s, ...bookkeeping })
  if (!parsed.success) {
    throw new Error(
      "AI section failed validation:\n" +
        parsed.error.issues
          .slice(0, 8)
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("\n")
    )
  }
  return parsed.data
}

/**
 * section.add — generate a brand-new section of the requested type/variant
 * (Sonnet). The section is appended (caller assigns final order).
 */
export async function generateSection(args: {
  config: SiteConfig
  sectionType: string
  variant?: string
  order: number
}): Promise<AnySection> {
  const variants = SECTION_VARIANTS[args.sectionType]
  if (!variants) {
    throw new Error(`Unknown section type "${args.sectionType}"`)
  }
  const variant =
    args.variant && variants.includes(args.variant) ? args.variant : variants[0]

  const raw = await callToolForOutput({
    model: MODELS.reasoning,
    maxTokens: 4000,
    system:
      "You are a conversion copywriter for a website builder. Generate one " +
      `new "${args.sectionType}" section (variant "${variant}") that fits the ` +
      "existing site, by calling the emit_section tool. " +
      COPY_RULES,
    messages: [
      {
        role: "user",
        content:
          `Site title: ${args.config.metadata.title}\n` +
          `Site description: ${args.config.metadata.description}\n` +
          `Existing sections: ${args.config.sections
            .map((s) => s.type)
            .join(", ")}\n\n` +
          `Generate a "${args.sectionType}" section with variant ` +
          `"${variant}". Use type="${args.sectionType}" and ` +
          `variant="${variant}".`,
      },
    ],
    toolName: "emit_section",
    toolDescription: "Emit one complete, valid section.",
    inputSchema: SECTION_TOOL_SCHEMA,
  })

  const section = (raw as { section?: unknown }).section ?? raw
  // Force the requested type/variant — the model occasionally drifts.
  const coerced = {
    ...(section as Record<string, unknown>),
    type: args.sectionType,
    variant,
  }
  return normalizeSection(coerced, {
    id: randomUUID(),
    order: args.order,
    enabled: true,
  })
}

/**
 * section.regenerate_copy — rewrite the copy of an existing section with
 * guidance (Sonnet), preserving its type, variant, and bookkeeping.
 */
export async function regenerateSectionCopy(args: {
  config: SiteConfig
  section: AnySection
  guidance: string
}): Promise<AnySection> {
  const { section } = args

  const raw = await callToolForOutput({
    model: MODELS.reasoning,
    maxTokens: 4000,
    system:
      "You are a conversion copywriter. Rewrite the copy of the given " +
      "section, keeping its type, variant, and overall structure (same " +
      "number and kind of items where it makes sense). Emit the full updated " +
      "section via the emit_section tool. " +
      COPY_RULES,
    messages: [
      {
        role: "user",
        content:
          `Site title: ${args.config.metadata.title}\n\n` +
          `Current section:\n${JSON.stringify(section, null, 2)}\n\n` +
          `Rewrite guidance: ${args.guidance}\n\n` +
          `Keep type="${section.type}" and variant="${section.variant}". ` +
          `Emit the updated section.`,
      },
    ],
    toolName: "emit_section",
    toolDescription: "Emit the rewritten section.",
    inputSchema: SECTION_TOOL_SCHEMA,
  })

  const updated = (raw as { section?: unknown }).section ?? raw
  // Preserve identity/type/variant — only the copy may change.
  const coerced = {
    ...(updated as Record<string, unknown>),
    type: section.type,
    variant: section.variant,
  }
  return normalizeSection(coerced, {
    id: section.id,
    order: section.order,
    enabled: section.enabled,
  })
}
