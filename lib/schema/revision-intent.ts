import { z } from "zod"

export const RevisionIntentSchema = z.discriminatedUnion("type", [
  z.object({
    type:  z.literal("theme.set_color"),
    token: z.enum(["primary", "secondary", "accent", "background", "text", "muted"]),
    value: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
  z.object({
    type: z.literal("theme.modernize"),
  }),
  z.object({
    type:  z.literal("theme.set_font"),
    role:  z.enum(["heading", "body"]),
    value: z.string(),
  }),
  z.object({
    type:         z.literal("section.enable"),
    section_type: z.string(),
  }),
  z.object({
    type:         z.literal("section.disable"),
    section_type: z.string(),
  }),
  z.object({
    type:       z.literal("section.reorder"),
    from_index: z.number().int().min(0),
    to_index:   z.number().int().min(0),
  }),
  z.object({
    type:       z.literal("section.update_content"),
    section_id: z.string().uuid(),
    path:       z.string(),
    value:      z.unknown(),
  }),
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
  z.object({
    type:  z.literal("metadata.update"),
    field: z.string(),
    value: z.string(),
  }),
])

export const RevisionIntentsSchema = z.array(RevisionIntentSchema).min(1).max(10)

export type RevisionIntent  = z.infer<typeof RevisionIntentSchema>
export type RevisionIntents = z.infer<typeof RevisionIntentsSchema>
