import Anthropic from "@anthropic-ai/sdk"

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

/**
 * Model roles for the pipeline. Keep model IDs in one place so a model
 * upgrade is a single-line change.
 */
export const MODELS = {
  /** Fast, cheap — brief validation and revision intent classification. */
  fast:      "claude-haiku-4-5-20251001",
  /** Research + web_search, and full SiteConfig generation. */
  reasoning: "claude-sonnet-4-6",
} as const
