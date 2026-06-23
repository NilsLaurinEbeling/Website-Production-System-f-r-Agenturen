import { z } from "zod"
import { SiteConfigSchema } from "@/lib/schema/site-config"

/**
 * JSON Schema for the SiteConfig, used as the `input_schema` of the
 * `emit_site_config` tool. Refs are inlined so Claude sees a single
 * self-contained schema. The output is still validated with Zod after
 * the model responds — this schema only steers generation.
 */
function buildSiteConfigJsonSchema(): Record<string, unknown> {
  const schema = z.toJSONSchema(SiteConfigSchema, {
    io: "input",
    reused: "inline",
    unrepresentable: "any",
  }) as Record<string, unknown>

  // Anthropic tool input_schema does not need the $schema dialect marker.
  delete schema["$schema"]
  return schema
}

export const SITE_CONFIG_JSON_SCHEMA = buildSiteConfigJsonSchema()
