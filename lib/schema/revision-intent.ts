import { z } from "zod"
import { THEME_STYLES } from "./site-config"

const HEX_COLOR = z.string().regex(/^#[0-9a-fA-F]{6}$/)

export const RevisionIntentSchema = z.discriminatedUnion("type", [
  // Theme — all deterministic
  z.object({
    type:  z.literal("theme.set_color"),
    token: z.enum(["primary", "secondary", "accent", "background", "text", "muted"]),
    value: HEX_COLOR,
  }),
  z.object({
    type:   z.literal("theme.apply_preset"),
    preset: z.enum(THEME_STYLES),
  }),
  z.object({
    type:  z.literal("theme.set_font"),
    role:  z.enum(["heading", "body"]),
    value: z.string(),
  }),
  z.object({
    type:  z.literal("theme.set_radius"),
    value: z.enum(["none", "sm", "md", "lg", "full"]),
  }),
  // Sections — deterministic
  z.object({ type: z.literal("section.enable"),  section_type: z.string() }),
  z.object({ type: z.literal("section.disable"), section_type: z.string() }),
  z.object({
    type:       z.literal("section.reorder"),
    from_index: z.number().int().min(0),
    to_index:   z.number().int().min(0),
  }),
  z.object({
    type:       z.literal("section.change_variant"),
    section_id: z.string().uuid(),
    variant:    z.string(),
  }),
  z.object({
    type:       z.literal("section.update_content"),
    section_id: z.string().uuid(),
    path:       z.string(),
    value:      z.unknown(),
  }),
  // Sections — AI-powered
  z.object({
    type:         z.literal("section.add"),
    section_type: z.string(),
    variant:      z.string().optional(),
  }),
  z.object({
    type:       z.literal("section.regenerate_copy"),
    section_id: z.string().uuid(),
    guidance:   z.string().max(300),
  }),
  // Metadata — deterministic
  z.object({
    type:  z.literal("metadata.update"),
    field: z.string(),
    value: z.string(),
  }),
])

export const RevisionIntentsSchema = z.array(RevisionIntentSchema).min(1).max(10)

export type RevisionIntent  = z.infer<typeof RevisionIntentSchema>
export type RevisionIntents = z.infer<typeof RevisionIntentsSchema>
