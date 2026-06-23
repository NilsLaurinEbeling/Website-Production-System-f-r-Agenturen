import { z } from "zod"

const HEX_COLOR = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color like #1a2b3c")

const ThemeSchema = z.object({
  colors: z.object({
    primary:    HEX_COLOR,
    secondary:  HEX_COLOR,
    accent:     HEX_COLOR,
    background: HEX_COLOR,
    text:       HEX_COLOR,
    muted:      HEX_COLOR,
  }),
  typography: z.object({
    headingFont: z.enum(["inter", "cal-sans", "playfair", "space-grotesk", "dm-sans"]),
    bodyFont:    z.enum(["inter", "lato", "source-sans", "nunito"]),
    scale:       z.enum(["compact", "default", "spacious"]),
  }),
  radius: z.enum(["none", "sm", "md", "lg", "full"]),
  shadow: z.enum(["none", "sm", "md", "dramatic"]),
})

const SectionBaseSchema = z.object({
  id:      z.string().uuid(),
  order:   z.number().int().min(0),
  enabled: z.boolean(),
})

const HeroSectionSchema = SectionBaseSchema.extend({
  type:    z.literal("hero"),
  variant: z.enum(["center", "split", "minimal"]),
  content: z.object({
    headline:      z.string().max(80),
    subheadline:   z.string().max(160),
    cta_primary:   z.object({ label: z.string().max(30), href: z.string() }),
    cta_secondary: z.object({ label: z.string().max(30), href: z.string() }).optional(),
    image_url:     z.string().url().optional(),
    badge:         z.string().max(40).optional(),
  }),
})

const FeaturesSectionSchema = SectionBaseSchema.extend({
  type:    z.literal("features"),
  variant: z.enum(["grid", "alternating"]),
  content: z.object({
    headline:    z.string().max(60),
    subheadline: z.string().max(120).optional(),
    items: z.array(
      z.object({
        icon:        z.string(),
        title:       z.string().max(40),
        description: z.string().max(160),
        image_url:   z.string().url().optional(),
      })
    ).min(2).max(6),
  }),
})

const TestimonialsSectionSchema = SectionBaseSchema.extend({
  type:    z.literal("testimonials"),
  variant: z.enum(["cards", "carousel"]),
  content: z.object({
    headline: z.string().max(60).optional(),
    items: z.array(
      z.object({
        quote:      z.string().max(300),
        author:     z.string().max(60),
        role:       z.string().max(60).optional(),
        avatar_url: z.string().url().optional(),
        rating:     z.number().min(1).max(5).optional(),
      })
    ).min(1).max(6),
  }),
})

const PricingSectionSchema = SectionBaseSchema.extend({
  type:    z.literal("pricing"),
  variant: z.enum(["cards", "table"]),
  content: z.object({
    headline: z.string().max(60).optional(),
    plans: z.array(
      z.object({
        name:        z.string().max(30),
        price:       z.string().max(20),
        features:    z.array(z.string().max(80)).min(1).max(10),
        cta_label:   z.string().max(30),
        cta_href:    z.string(),
        highlighted: z.boolean().default(false),
      })
    ).min(1).max(4),
  }),
})

const AboutSectionSchema = SectionBaseSchema.extend({
  type:    z.literal("about"),
  variant: z.enum(["text", "split"]),
  content: z.object({
    headline:  z.string().max(60),
    body:      z.string().max(800),
    image_url: z.string().url().optional(),
    stats: z.array(
      z.object({
        value: z.string().max(20),
        label: z.string().max(40),
      })
    ).max(4).optional(),
  }),
})

const CTASectionSchema = SectionBaseSchema.extend({
  type:    z.literal("cta"),
  variant: z.enum(["centered", "banner"]),
  content: z.object({
    headline:      z.string().max(60),
    subheadline:   z.string().max(120).optional(),
    cta_primary:   z.object({ label: z.string().max(30), href: z.string() }),
    cta_secondary: z.object({ label: z.string().max(30), href: z.string() }).optional(),
  }),
})

const FooterSectionSchema = SectionBaseSchema.extend({
  type:    z.literal("footer"),
  variant: z.enum(["minimal", "columns"]),
  content: z.object({
    logo_text:  z.string().max(40).optional(),
    tagline:    z.string().max(100).optional(),
    links: z.array(
      z.object({
        group: z.string().max(30),
        items: z.array(z.object({ label: z.string().max(30), href: z.string() })),
      })
    ).max(4).optional(),
    social_links: z.array(
      z.object({
        platform: z.enum(["twitter", "linkedin", "instagram", "facebook", "youtube", "tiktok"]),
        href:     z.string().url(),
      })
    ).max(6).optional(),
    legal_links: z.array(z.object({ label: z.string().max(30), href: z.string() })).max(4).optional(),
    copyright:   z.string().max(100),
  }),
})

const NavigationSchema = z.object({
  logo_text: z.string().max(40).optional(),
  logo_url:  z.string().url().optional(),
  links: z.array(
    z.object({
      label: z.string().max(30),
      href:  z.string(),
    })
  ).max(6),
  cta: z.object({ label: z.string().max(30), href: z.string() }).optional(),
})

export const AnySectionSchema = z.discriminatedUnion("type", [
  HeroSectionSchema,
  FeaturesSectionSchema,
  TestimonialsSectionSchema,
  PricingSectionSchema,
  AboutSectionSchema,
  CTASectionSchema,
  FooterSectionSchema,
])

export const SiteConfigSchema = z.object({
  version:    z.literal(1),
  metadata: z.object({
    title:         z.string().max(60),
    description:   z.string().max(160),
    favicon_emoji: z.string().max(2).optional(),
    og_image_url:  z.string().url().optional(),
  }),
  navigation: NavigationSchema,
  theme:      ThemeSchema,
  sections:   z.array(AnySectionSchema).min(2).max(12),
})

export type SiteConfig    = z.infer<typeof SiteConfigSchema>
export type AnySection    = z.infer<typeof AnySectionSchema>
export type HeroSection   = z.infer<typeof HeroSectionSchema>
export type FeaturesSection = z.infer<typeof FeaturesSectionSchema>
export type TestimonialsSection = z.infer<typeof TestimonialsSectionSchema>
export type PricingSection = z.infer<typeof PricingSectionSchema>
export type AboutSection  = z.infer<typeof AboutSectionSchema>
export type CTASection    = z.infer<typeof CTASectionSchema>
export type FooterSection = z.infer<typeof FooterSectionSchema>
export type Navigation    = z.infer<typeof NavigationSchema>
export type Theme         = z.infer<typeof ThemeSchema>
