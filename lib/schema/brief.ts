import { z } from "zod"

export const BriefSchema = z.object({
  business_name:   z.string().min(1).max(80),
  industry:        z.string().min(1).max(80),
  tagline:         z.string().max(120).optional(),
  description:     z.string().min(20).max(1000),
  target_audience: z.string().max(200).optional(),
  tone:            z.enum(["professional", "friendly", "bold"]),
  primary_color_hint: z.string().max(50).optional(),
  sections_wanted: z.array(
    z.enum(["hero", "features", "testimonials", "pricing", "about", "cta"])
  ).min(1).max(6).optional(),
  contact_email:  z.string().email().optional(),
  contact_phone:  z.string().max(30).optional(),
  address:        z.string().max(200).optional(),
  website_goal:   z.string().max(300).optional(),
  competitors:    z.array(z.string().url()).max(3).optional(),
})

export type Brief = z.infer<typeof BriefSchema>
