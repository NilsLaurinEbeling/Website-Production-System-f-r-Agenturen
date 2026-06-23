import { type SiteConfig, type AnySection } from "@/lib/schema/site-config"
import { type RevisionIntent } from "@/lib/schema/revision-intent"
import { THEME_PRESETS } from "@/lib/theme/presets"

function setDeep(obj: unknown, path: string, value: unknown): unknown {
  const keys = path.split(".")
  const clone = structuredClone(obj) as Record<string, unknown>
  let current = clone
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]] as Record<string, unknown>
  }
  current[keys[keys.length - 1]] = value
  return clone
}

export function applyIntent(config: SiteConfig, intent: RevisionIntent): SiteConfig {
  switch (intent.type) {
    case "theme.set_color": {
      const clone = structuredClone(config)
      clone.theme.colors[intent.token] = intent.value
      return clone
    }

    case "theme.apply_preset": {
      const preset = THEME_PRESETS[intent.preset]
      return {
        ...config,
        theme: { ...preset, style: intent.preset },
      }
    }

    case "theme.set_font": {
      const clone = structuredClone(config)
      if (intent.role === "heading") {
        clone.theme.typography.headingFont = intent.value as SiteConfig["theme"]["typography"]["headingFont"]
      } else {
        clone.theme.typography.bodyFont = intent.value as SiteConfig["theme"]["typography"]["bodyFont"]
      }
      return clone
    }

    case "theme.set_radius": {
      const clone = structuredClone(config)
      clone.theme.radius = intent.value
      return clone
    }

    case "section.enable":
    case "section.disable": {
      const clone = structuredClone(config)
      const section = clone.sections.find(s => s.type === intent.section_type)
      if (section) section.enabled = intent.type === "section.enable"
      return clone
    }

    case "section.reorder": {
      const clone = structuredClone(config)
      const sections = clone.sections
      if (intent.from_index < 0 || intent.from_index >= sections.length) return clone
      if (intent.to_index < 0 || intent.to_index >= sections.length) return clone
      const [moved] = sections.splice(intent.from_index, 1)
      sections.splice(intent.to_index, 0, moved)
      sections.forEach((s, i) => { s.order = i })
      return clone
    }

    case "section.change_variant": {
      const clone = structuredClone(config)
      const section = clone.sections.find(s => s.id === intent.section_id)
      // variant is validated at runtime by Zod before reaching the patcher
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (section) (section as any).variant = intent.variant
      return clone
    }

    case "section.update_content": {
      const clone = structuredClone(config)
      const idx = clone.sections.findIndex(s => s.id === intent.section_id)
      if (idx === -1) return clone
      clone.sections[idx] = setDeep(
        clone.sections[idx],
        `content.${intent.path}`,
        intent.value
      ) as AnySection
      return clone
    }

    case "metadata.update": {
      const clone = structuredClone(config)
      clone.metadata = setDeep(clone.metadata, intent.field, intent.value) as SiteConfig["metadata"]
      return clone
    }

    // AI intents — callers handle these; patcher returns config unchanged
    case "section.add":
    case "section.regenerate_copy":
      return config

    default:
      return config
  }
}

export function applyIntents(config: SiteConfig, intents: RevisionIntent[]): SiteConfig {
  return intents.reduce(applyIntent, config)
}
