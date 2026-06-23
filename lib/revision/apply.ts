import { type SiteConfig } from "@/lib/schema/site-config"
import { type RevisionIntent } from "@/lib/schema/revision-intent"
import { applyIntent } from "./config-patcher"
import { generateSection, regenerateSectionCopy } from "./ai-intents"

export interface AppliedIntent {
  intent: RevisionIntent
  ok: boolean
  note?: string
}

export interface RevisionResult {
  config: SiteConfig
  applied: AppliedIntent[]
}

/** Insert a section before the footer (if any) so the footer stays last. */
function insertSection(
  config: SiteConfig,
  section: SiteConfig["sections"][number]
): SiteConfig {
  const clone = structuredClone(config)
  const footerIdx = clone.sections.findIndex((s) => s.type === "footer")
  if (footerIdx === -1) {
    clone.sections.push(section)
  } else {
    clone.sections.splice(footerIdx, 0, section)
  }
  clone.sections.forEach((s, i) => {
    s.order = i
  })
  return clone
}

/**
 * Apply a list of revision intents to a config, in order. Deterministic
 * intents go through the config patcher; AI intents (section.add,
 * section.regenerate_copy) call Sonnet. A failed individual intent is
 * recorded and skipped — the rest still apply. The returned config is NOT
 * yet Zod-validated; the caller must parse it before persisting.
 */
export async function applyRevisionIntents(
  initial: SiteConfig,
  intents: RevisionIntent[]
): Promise<RevisionResult> {
  let config = initial
  const applied: AppliedIntent[] = []

  for (const intent of intents) {
    try {
      if (intent.type === "section.add") {
        const order = config.sections.length
        const section = await generateSection({
          config,
          sectionType: intent.section_type,
          variant: intent.variant,
          order,
        })
        config = insertSection(config, section)
        applied.push({ intent, ok: true })
      } else if (intent.type === "section.regenerate_copy") {
        const target = config.sections.find((s) => s.id === intent.section_id)
        if (!target) {
          applied.push({ intent, ok: false, note: "section not found" })
          continue
        }
        const updated = await regenerateSectionCopy({
          config,
          section: target,
          guidance: intent.guidance,
        })
        const clone = structuredClone(config)
        const idx = clone.sections.findIndex((s) => s.id === intent.section_id)
        clone.sections[idx] = updated
        config = clone
        applied.push({ intent, ok: true })
      } else {
        config = applyIntent(config, intent)
        applied.push({ intent, ok: true })
      }
    } catch (err) {
      applied.push({
        intent,
        ok: false,
        note: err instanceof Error ? err.message : "failed",
      })
    }
  }

  return { config, applied }
}
