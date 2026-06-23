import { z } from "zod"

const HEX_COLOR = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color like #1a2b3c")

// ─── Theme ────────────────────────────────────────────────────────────────────

export const THEME_STYLES = [
  "luxury", "startup", "craft", "medical", "legal",
  "restaurant", "tech", "minimal", "bold", "modern",
] as const
export type ThemeStyle = (typeof THEME_STYLES)[number]

const ThemeSchema = z.object({
  style: z.enum(THEME_STYLES).optional(),
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

// ─── SEO ──────────────────────────────────────────────────────────────────────

const LocalBusinessSchema = z.object({
  schema_type: z.enum([
    "LocalBusiness", "Restaurant", "MedicalBusiness",
    "LegalService", "HomeAndConstructionBusiness", "HealthAndBeautyBusiness",
  ]),
  name:        z.string().max(80),
  address:     z.string().max(200),
  city:        z.string().max(80),
  zip:         z.string().max(20),
  country:     z.string().max(2).default("DE"),
  phone:       z.string().max(30).optional(),
  email:       z.string().email().optional(),
  price_range: z.enum(["€", "€€", "€€€", "€€€€"]).optional(),
  latitude:    z.number().optional(),
  longitude:   z.number().optional(),
  hours: z.array(
    z.object({ days: z.string().max(40), open: z.string().max(10), close: z.string().max(10) })
  ).max(7).optional(),
})

const SEOSchema = z.object({
  local_business:  LocalBusinessSchema.optional(),
  social_profiles: z.array(
    z.object({
      platform: z.enum(["twitter", "linkedin", "instagram", "facebook", "youtube"]),
      url:      z.string().url(),
    })
  ).max(6).optional(),
  noindex: z.boolean().default(false).optional(),
})

// ─── Navigation ───────────────────────────────────────────────────────────────

const NavigationSchema = z.object({
  logo_text: z.string().max(40).optional(),
  logo_url:  z.string().url().optional(),
  links: z.array(
    z.object({ label: z.string().max(30), href: z.string() })
  ).max(8),
  cta: z.object({ label: z.string().max(30), href: z.string() }).optional(),
})

// ─── Section base ─────────────────────────────────────────────────────────────

const SectionBase = z.object({
  id:      z.string().uuid(),
  order:   z.number().int().min(0),
  enabled: z.boolean(),
})

// ─── Original 7 sections ──────────────────────────────────────────────────────

const HeroSectionSchema = SectionBase.extend({
  type:    z.literal("hero"),
  variant: z.enum(["center", "split", "minimal", "editorial", "saas", "luxury", "agency", "local-business"]),
  content: z.object({
    headline:      z.string().max(80),
    subheadline:   z.string().max(160),
    cta_primary:   z.object({ label: z.string().max(30), href: z.string() }),
    cta_secondary: z.object({ label: z.string().max(30), href: z.string() }).optional(),
    image_url:     z.string().url().optional(),
    badge:         z.string().max(40).optional(),
  }),
})

const FeaturesSectionSchema = SectionBase.extend({
  type:    z.literal("features"),
  variant: z.enum(["grid", "alternating", "tabs", "cards", "checklist"]),
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
    ).min(2).max(8),
  }),
})

const TestimonialsSectionSchema = SectionBase.extend({
  type:    z.literal("testimonials"),
  variant: z.enum(["cards", "carousel", "wall", "quote"]),
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
    ).min(1).max(8),
  }),
})

const PricingSectionSchema = SectionBase.extend({
  type:    z.literal("pricing"),
  variant: z.enum(["cards", "table", "list"]),
  content: z.object({
    headline: z.string().max(60).optional(),
    plans: z.array(
      z.object({
        name:        z.string().max(30),
        price:       z.string().max(20),
        features:    z.array(z.string().max(80)).min(1).max(12),
        cta_label:   z.string().max(30),
        cta_href:    z.string(),
        highlighted: z.boolean().default(false),
      })
    ).min(1).max(4),
  }),
})

const AboutSectionSchema = SectionBase.extend({
  type:    z.literal("about"),
  variant: z.enum(["text", "split"]),
  content: z.object({
    headline:  z.string().max(60),
    body:      z.string().max(800),
    image_url: z.string().url().optional(),
    stats: z.array(
      z.object({ value: z.string().max(20), label: z.string().max(40) })
    ).max(4).optional(),
  }),
})

const CTASectionSchema = SectionBase.extend({
  type:    z.literal("cta"),
  variant: z.enum(["centered", "banner", "newsletter"]),
  content: z.object({
    headline:           z.string().max(60),
    subheadline:        z.string().max(120).optional(),
    cta_primary:        z.object({ label: z.string().max(30), href: z.string() }),
    cta_secondary:      z.object({ label: z.string().max(30), href: z.string() }).optional(),
    email_placeholder:  z.string().max(40).optional(),
  }),
})

const FooterSectionSchema = SectionBase.extend({
  type:    z.literal("footer"),
  variant: z.enum(["minimal", "columns", "dark"]),
  content: z.object({
    logo_text:   z.string().max(40).optional(),
    tagline:     z.string().max(100).optional(),
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

// ─── 13 new sections ──────────────────────────────────────────────────────────

const FAQSectionSchema = SectionBase.extend({
  type:    z.literal("faq"),
  variant: z.enum(["accordion", "two-column"]),
  content: z.object({
    headline: z.string().max(60).optional(),
    items: z.array(
      z.object({
        question: z.string().max(120),
        answer:   z.string().max(600),
      })
    ).min(1).max(16),
  }),
})

const TeamSectionSchema = SectionBase.extend({
  type:    z.literal("team"),
  variant: z.enum(["grid", "list", "carousel"]),
  content: z.object({
    headline:    z.string().max(60).optional(),
    subheadline: z.string().max(120).optional(),
    members: z.array(
      z.object({
        name:       z.string().max(60),
        role:       z.string().max(60),
        bio:        z.string().max(300).optional(),
        avatar_url: z.string().url().optional(),
        linkedin:   z.string().url().optional(),
      })
    ).min(1).max(16),
  }),
})

const GallerySectionSchema = SectionBase.extend({
  type:    z.literal("gallery"),
  variant: z.enum(["masonry", "grid", "carousel"]),
  content: z.object({
    headline: z.string().max(60).optional(),
    images: z.array(
      z.object({
        url:     z.string().url(),
        caption: z.string().max(100).optional(),
        alt:     z.string().max(100),
      })
    ).min(1).max(24),
  }),
})

const ContactFormSectionSchema = SectionBase.extend({
  type:    z.literal("contact-form"),
  variant: z.enum(["simple", "split"]),
  content: z.object({
    headline:        z.string().max(60),
    subheadline:     z.string().max(160).optional(),
    submit_label:    z.string().max(30).default("Absenden"),
    success_message: z.string().max(200).default("Vielen Dank! Wir melden uns bald."),
    submit_to_email: z.string().email(),
    show_phone:      z.boolean().default(false),
    image_url:       z.string().url().optional(),
  }),
})

const CaseStudiesSectionSchema = SectionBase.extend({
  type:    z.literal("case-studies"),
  variant: z.enum(["cards", "featured"]),
  content: z.object({
    headline: z.string().max(60).optional(),
    items: z.array(
      z.object({
        title:       z.string().max(80),
        client:      z.string().max(60).optional(),
        description: z.string().max(300),
        tags:        z.array(z.string().max(30)).max(5),
        image_url:   z.string().url().optional(),
        url:         z.string().optional(),
      })
    ).min(1).max(8),
  }),
})

const LogosSectionSchema = SectionBase.extend({
  type:    z.literal("logos"),
  variant: z.enum(["strip", "grid"]),
  content: z.object({
    headline: z.string().max(60).optional(),
    logos: z.array(
      z.object({
        name:      z.string().max(60),
        image_url: z.string().url(),
        url:       z.string().optional(),
      })
    ).min(2).max(20),
  }),
})

const TimelineSectionSchema = SectionBase.extend({
  type:    z.literal("timeline"),
  variant: z.enum(["vertical", "horizontal"]),
  content: z.object({
    headline: z.string().max(60).optional(),
    items: z.array(
      z.object({
        year:        z.string().max(20),
        title:       z.string().max(80),
        description: z.string().max(300),
      })
    ).min(2).max(12),
  }),
})

const ProcessSectionSchema = SectionBase.extend({
  type:    z.literal("process"),
  variant: z.enum(["steps", "numbered"]),
  content: z.object({
    headline:    z.string().max(60),
    subheadline: z.string().max(120).optional(),
    items: z.array(
      z.object({
        step:        z.string().max(20),
        title:       z.string().max(60),
        description: z.string().max(200),
        icon:        z.string().optional(),
      })
    ).min(2).max(8),
  }),
})

const ServicesSectionSchema = SectionBase.extend({
  type:    z.literal("services"),
  variant: z.enum(["cards", "list", "grid"]),
  content: z.object({
    headline:    z.string().max(60),
    subheadline: z.string().max(120).optional(),
    items: z.array(
      z.object({
        title:       z.string().max(60),
        description: z.string().max(200),
        price:       z.string().max(40).optional(),
        icon:        z.string().optional(),
        cta:         z.object({ label: z.string().max(30), href: z.string() }).optional(),
      })
    ).min(1).max(12),
  }),
})

const BlogPreviewSectionSchema = SectionBase.extend({
  type:    z.literal("blog-preview"),
  variant: z.enum(["cards", "featured"]),
  content: z.object({
    headline: z.string().max(60).optional(),
    items: z.array(
      z.object({
        title:     z.string().max(100),
        excerpt:   z.string().max(200),
        date:      z.string().max(20),
        author:    z.string().max(60).optional(),
        image_url: z.string().url().optional(),
        slug:      z.string().max(100),
      })
    ).min(1).max(6),
  }),
})

const MapSectionSchema = SectionBase.extend({
  type:    z.literal("map"),
  variant: z.enum(["embedded"]),
  content: z.object({
    headline:      z.string().max(60).optional(),
    address:       z.string().max(200),
    embed_url:     z.string().url(),
    business_name: z.string().max(80).optional(),
    hours: z.array(
      z.object({ days: z.string().max(40), open: z.string().max(10), close: z.string().max(10) })
    ).max(7).optional(),
    phone: z.string().max(30).optional(),
  }),
})

const StatsSectionSchema = SectionBase.extend({
  type:    z.literal("stats"),
  variant: z.enum(["centered", "grid", "banner"]),
  content: z.object({
    headline: z.string().max(60).optional(),
    items: z.array(
      z.object({
        value:       z.string().max(20),
        label:       z.string().max(60),
        description: z.string().max(100).optional(),
      })
    ).min(2).max(8),
  }),
})

const LeadMagnetSectionSchema = SectionBase.extend({
  type:    z.literal("lead-magnet"),
  variant: z.enum(["centered", "split"]),
  content: z.object({
    headline:          z.string().max(60),
    description:       z.string().max(200),
    offer_text:        z.string().max(80),
    email_placeholder: z.string().max(40).default("Ihre E-Mail-Adresse"),
    cta_label:         z.string().max(30).default("Jetzt herunterladen"),
    submit_to_email:   z.string().email(),
    image_url:         z.string().url().optional(),
  }),
})

// ─── Union ────────────────────────────────────────────────────────────────────

export const AnySectionSchema = z.discriminatedUnion("type", [
  HeroSectionSchema,
  FeaturesSectionSchema,
  TestimonialsSectionSchema,
  PricingSectionSchema,
  AboutSectionSchema,
  CTASectionSchema,
  FooterSectionSchema,
  FAQSectionSchema,
  TeamSectionSchema,
  GallerySectionSchema,
  ContactFormSectionSchema,
  CaseStudiesSectionSchema,
  LogosSectionSchema,
  TimelineSectionSchema,
  ProcessSectionSchema,
  ServicesSectionSchema,
  BlogPreviewSectionSchema,
  MapSectionSchema,
  StatsSectionSchema,
  LeadMagnetSectionSchema,
])

// ─── Root config ──────────────────────────────────────────────────────────────

export const SiteConfigSchema = z.object({
  version: z.literal(1),
  metadata: z.object({
    title:         z.string().max(60),
    description:   z.string().max(160),
    favicon_emoji: z.string().max(2).optional(),
    og_image_url:  z.string().url().optional(),
  }),
  seo:        SEOSchema.optional(),
  navigation: NavigationSchema,
  theme:      ThemeSchema,
  sections:   z.array(AnySectionSchema).min(2).max(20),
})

// ─── Inferred types ───────────────────────────────────────────────────────────

export type SiteConfig    = z.infer<typeof SiteConfigSchema>
export type AnySection    = z.infer<typeof AnySectionSchema>
export type Theme         = z.infer<typeof ThemeSchema>
export type Navigation    = z.infer<typeof NavigationSchema>
export type SEO           = z.infer<typeof SEOSchema>
export type LocalBusiness = z.infer<typeof LocalBusinessSchema>

export type HeroSection         = z.infer<typeof HeroSectionSchema>
export type FeaturesSection     = z.infer<typeof FeaturesSectionSchema>
export type TestimonialsSection = z.infer<typeof TestimonialsSectionSchema>
export type PricingSection      = z.infer<typeof PricingSectionSchema>
export type AboutSection        = z.infer<typeof AboutSectionSchema>
export type CTASection          = z.infer<typeof CTASectionSchema>
export type FooterSection       = z.infer<typeof FooterSectionSchema>
export type FAQSection          = z.infer<typeof FAQSectionSchema>
export type TeamSection         = z.infer<typeof TeamSectionSchema>
export type GallerySection      = z.infer<typeof GallerySectionSchema>
export type ContactFormSection  = z.infer<typeof ContactFormSectionSchema>
export type CaseStudiesSection  = z.infer<typeof CaseStudiesSectionSchema>
export type LogosSection        = z.infer<typeof LogosSectionSchema>
export type TimelineSection     = z.infer<typeof TimelineSectionSchema>
export type ProcessSection      = z.infer<typeof ProcessSectionSchema>
export type ServicesSection     = z.infer<typeof ServicesSectionSchema>
export type BlogPreviewSection  = z.infer<typeof BlogPreviewSectionSchema>
export type MapSection          = z.infer<typeof MapSectionSchema>
export type StatsSection        = z.infer<typeof StatsSectionSchema>
export type LeadMagnetSection   = z.infer<typeof LeadMagnetSectionSchema>
