import { z } from "zod"
import { THEME_STYLES } from "./site-config"

/**
 * Research Agent output (Sonnet + web_search). Bridges the customer Brief
 * and the SiteConfig generation step: it decides the design direction,
 * which sections to include, and the copy tone.
 */
export const DesignBriefingSchema = z.object({
  industry_analysis: z.string().min(20).max(2000),
  recommended_theme_style: z.enum(THEME_STYLES),
  recommended_sections: z
    .array(
      z.enum([
        "hero", "features", "testimonials", "pricing", "about", "cta", "footer",
        "faq", "team", "gallery", "contact-form", "case-studies", "logos",
        "timeline", "process", "services", "blog-preview", "map", "stats",
        "lead-magnet",
      ])
    )
    .min(2)
    .max(20),
  tone_guidance: z.string().min(10).max(800),
  copy_examples: z
    .array(z.object({ context: z.string().max(60), text: z.string().max(300) }))
    .max(8)
    .optional(),
  local_seo_needed: z.boolean(),
  competitor_insights: z.string().max(1000).optional(),
})

export type DesignBriefing = z.infer<typeof DesignBriefingSchema>
