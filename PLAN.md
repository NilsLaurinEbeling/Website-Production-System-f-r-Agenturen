# AutoWebsiteBuilder Agency — Implementation Plan

## Architecture Decision: Config-Driven

One fixed Next.js renderer. Agents generate/patch JSON configs — never code.
The site_config is the single source of truth, Zod-validated, versioned in Supabase.

**Why this wins for SMB/agency volume:**
- Template never breaks (no codegen build failures)
- Theme changes = token patch (deterministic, instant)
- Section reorder = array mutation (no code rewrite)
- Multi-tenancy = one codebase, many configs + many agencies
- No build sandbox needed

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 App Router | SSR + API routes + middleware in one |
| Language | TypeScript | End-to-end type safety via Zod schemas |
| Styling | Tailwind CSS + CSS variables | Theme tokens → CSS vars → Tailwind utilities |
| UI Components | shadcn/ui | Accessible primitives, fully owned |
| Database | Supabase (Postgres) | Auth + realtime + typed client |
| Queue | Upstash QStash | Durable, retriable, idempotent pipeline steps |
| AI | Anthropic SDK (Claude) | Sonnet for generation, Haiku for orchestration |
| Deployment | Vercel | Programmatic domain management via REST API |
| Validation | Zod | Runtime schema enforcement on all config writes |
| State | Zustand (client) | Revision chat UI state |

---

## Project Structure

```
autowebsitebuilder-agency/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # Agency's project list
│   │   └── projects/
│   │       └── [id]/
│   │           └── page.tsx           # Project detail: status, preview, revision chat
│   ├── p/
│   │   └── [id]/
│   │       └── page.tsx               # Preview renderer — reads draft site_config
│   ├── api/
│   │   ├── projects/
│   │   │   ├── route.ts               # POST: create project
│   │   │   └── [id]/
│   │   │       ├── route.ts           # GET: project state
│   │   │       ├── brief/route.ts     # POST: submit intake brief
│   │   │       ├── approve/route.ts   # POST: draft → published + Vercel domain
│   │   │       └── revise/route.ts    # POST: revision chat message
│   │   └── pipeline/
│   │       ├── validate-brief/route.ts
│   │       ├── research/route.ts
│   │       ├── generate/route.ts
│   │       └── deploy/route.ts
│   └── layout.tsx
├── components/
│   ├── blocks/                        # 20-section block library
│   │   ├── Hero/
│   │   ├── Features/
│   │   ├── Testimonials/
│   │   ├── Pricing/
│   │   ├── About/
│   │   ├── CTA/
│   │   ├── Footer/
│   │   ├── FAQ/
│   │   ├── Team/
│   │   ├── Gallery/
│   │   ├── ContactForm/
│   │   ├── CaseStudies/
│   │   ├── Logos/
│   │   ├── Timeline/
│   │   ├── Process/
│   │   ├── Services/
│   │   ├── BlogPreview/
│   │   ├── Map/
│   │   ├── Stats/
│   │   ├── LeadMagnet/
│   │   └── Navigation/
│   ├── renderer/
│   │   ├── SiteRenderer.tsx           # Maps config.sections[] → block components
│   │   └── ThemeProvider.tsx          # Injects --site-* CSS variables from config.theme
│   └── dashboard/
│       ├── ProjectStatus.tsx
│       ├── PreviewFrame.tsx
│       └── RevisionChat.tsx
├── lib/
│   ├── schema/
│   │   ├── site-config.ts             # Zod schema (authoritative)
│   │   ├── revision-intent.ts
│   │   └── brief.ts
│   ├── theme/
│   │   └── presets.ts                 # Named theme presets (luxury, startup, craft …)
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── pipeline/
│   │   ├── qstash.ts
│   │   ├── research-agent.ts
│   │   └── generator-agent.ts
│   ├── revision/
│   │   ├── intent-classifier.ts
│   │   └── config-patcher.ts
│   └── vercel/
│       └── api.ts
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       └── 003_agency_mode.sql
└── types/
    └── index.ts
```

---

## State Machine

```
intake → planning → research → generating → review
       → revising ⇄ preview → approved → deploying → live
                                        ↘ failed
```

Transitions written to `projects.status` by pipeline steps. Each step is
idempotent — QStash retries on non-2xx with exponential backoff.

---

## Database Schema

### Core Tables

#### `agencies`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
name          text NOT NULL
slug          text UNIQUE NOT NULL          -- used for white-label subdomains
logo_url      text
plan          text NOT NULL DEFAULT 'free'  -- 'free' | 'growth' | 'agency'
owner_id      uuid REFERENCES auth.users(id)
created_at    timestamptz DEFAULT now()
```

#### `agency_members`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
agency_id   uuid REFERENCES agencies(id) ON DELETE CASCADE
user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE
role        text NOT NULL DEFAULT 'member'  -- 'owner' | 'admin' | 'member'
created_at  timestamptz DEFAULT now()
UNIQUE (agency_id, user_id)
```

#### `white_label_configs`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
agency_id       uuid UNIQUE REFERENCES agencies(id) ON DELETE CASCADE
agency_name     text NOT NULL
logo_url        text
custom_domain   text UNIQUE              -- dashboard domain, e.g. portal.agency.com
from_email      text                     -- no-reply@agency.com
reply_to_email  text
created_at      timestamptz DEFAULT now()
```

#### `projects`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
agency_id     uuid REFERENCES agencies(id)   -- owning agency
created_by    uuid REFERENCES auth.users(id) -- agency member who created it
client_name   text NOT NULL
client_email  text
status        text NOT NULL DEFAULT 'intake'
              CHECK (status IN ('intake','planning','research','generating',
                                'review','preview','revising','approved',
                                'deploying','live','failed'))
domain        text UNIQUE
error_message text
created_at    timestamptz DEFAULT now()
updated_at    timestamptz DEFAULT now()
```

#### `briefs`
```sql
id         uuid PRIMARY KEY DEFAULT gen_random_uuid()
project_id uuid REFERENCES projects(id) ON DELETE CASCADE
data       jsonb NOT NULL    -- validated against BriefSchema
created_at timestamptz DEFAULT now()
```

#### `design_briefings`
```sql
id         uuid PRIMARY KEY DEFAULT gen_random_uuid()
project_id uuid REFERENCES projects(id) ON DELETE CASCADE
data       jsonb NOT NULL    -- DesignBriefing from Research Agent
created_at timestamptz DEFAULT now()
```

#### `site_configs`
```sql
id         uuid PRIMARY KEY DEFAULT gen_random_uuid()
project_id uuid REFERENCES projects(id) ON DELETE CASCADE
version    integer NOT NULL DEFAULT 1
status     text NOT NULL DEFAULT 'draft'  -- 'draft' | 'published'
config     jsonb NOT NULL                 -- validated SiteConfig JSON
created_at timestamptz DEFAULT now()
UNIQUE (project_id, version)
```

#### `revisions`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
project_id   uuid REFERENCES projects(id) ON DELETE CASCADE
message      text NOT NULL
intents      jsonb
config_patch jsonb
created_at   timestamptz DEFAULT now()
```

#### `deployments`
```sql
id                   uuid PRIMARY KEY DEFAULT gen_random_uuid()
project_id           uuid REFERENCES projects(id) ON DELETE CASCADE
vercel_deployment_id text
vercel_project_id    text
domain               text
status               text NOT NULL DEFAULT 'queued'
                     CHECK (status IN ('queued','building','ready','error'))
created_at           timestamptz DEFAULT now()
```

---

## SiteConfig Zod Schema

### ThemeSchema — extended with `style` preset

```typescript
export const THEME_STYLES = [
  "luxury",         // dark bg, Playfair, gold/cream
  "startup",        // clean white, Inter, blue/purple
  "craft",          // warm browns, Playfair, earthy
  "medical",        // white/light-blue, trustworthy, clean
  "legal",          // navy, serif, formal
  "restaurant",     // warm, inviting, food photography focus
  "tech",           // dark mode, monospace accents
  "minimal",        // ultra-clean, heavy whitespace
  "bold",           // high contrast, punchy colors, large type
  "modern",         // gradient accents, Space Grotesk
] as const

const ThemeSchema = z.object({
  style: z.enum(THEME_STYLES).optional(),  // applied as a preset; tokens below can override
  colors: z.object({
    primary:    HEX_COLOR,
    secondary:  HEX_COLOR,
    accent:     HEX_COLOR,
    background: HEX_COLOR,
    text:       HEX_COLOR,
    muted:      HEX_COLOR,
  }),
  typography: z.object({
    headingFont: z.enum(["inter","cal-sans","playfair","space-grotesk","dm-sans"]),
    bodyFont:    z.enum(["inter","lato","source-sans","nunito"]),
    scale:       z.enum(["compact","default","spacious"]),
  }),
  radius: z.enum(["none","sm","md","lg","full"]),
  shadow: z.enum(["none","sm","md","dramatic"]),
})
```

### SEO Schema — top-level field on SiteConfig

```typescript
const LocalBusinessSchema = z.object({
  schema_type: z.enum(["LocalBusiness","Restaurant","MedicalBusiness","LegalService",
                        "HomeAndConstructionBusiness","HealthAndBeautyBusiness"]),
  name:        z.string().max(80),
  address:     z.string().max(200),
  city:        z.string().max(80),
  zip:         z.string().max(20),
  country:     z.string().max(2).default("DE"),
  phone:       z.string().max(30).optional(),
  email:       z.string().email().optional(),
  price_range: z.enum(["€","€€","€€€","€€€€"]).optional(),
  latitude:    z.number().optional(),
  longitude:   z.number().optional(),
  hours: z.array(z.object({
    days:  z.string().max(40),    // "Mo–Fr"
    open:  z.string().max(10),    // "08:00"
    close: z.string().max(10),    // "18:00"
  })).max(7).optional(),
})

const SEOSchema = z.object({
  local_business:  LocalBusinessSchema.optional(),
  social_profiles: z.array(z.object({
    platform: z.enum(["twitter","linkedin","instagram","facebook","youtube"]),
    url:      z.string().url(),
  })).max(6).optional(),
  noindex: z.boolean().default(false),
})
```

The renderer auto-generates `<script type="application/ld+json">` from `seo.local_business`.

### Full SiteConfig

```typescript
export const SiteConfigSchema = z.object({
  version:    z.literal(1),
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
```

---

## Block Library — 20 Section Types

### Existing (7) — Phase 1 ✓

| Section | Variants |
|---|---|
| `hero` | `center` `split` `minimal` |
| `features` | `grid` `alternating` |
| `testimonials` | `cards` `carousel` |
| `pricing` | `cards` `table` |
| `about` | `text` `split` |
| `cta` | `centered` `banner` |
| `footer` | `minimal` `columns` |

### New (13) — Phase 2

| Section | Variants | Key content fields |
|---|---|---|
| `faq` | `accordion` `two-column` | `headline?`, `items[]{question, answer}` |
| `team` | `grid` `list` `carousel` | `headline?`, `members[]{name, role, bio?, avatar_url?, linkedin?}` |
| `gallery` | `masonry` `grid` `carousel` | `headline?`, `images[]{url, caption?, alt}` |
| `contact-form` | `simple` `split` | `headline`, `subheadline?`, `fields{name,email,phone?,message,extras[]?}`, `submit_label`, `success_message`, `submit_to_email` |
| `case-studies` | `cards` `featured` | `headline?`, `items[]{title, client?, description, tags[], image_url?, url?}` |
| `logos` | `strip` `grid` | `headline?`, `logos[]{name, image_url, url?}` |
| `timeline` | `vertical` `horizontal` | `headline?`, `items[]{year, title, description}` |
| `process` | `steps` `numbered` | `headline`, `subheadline?`, `items[]{step, title, description, icon?}` |
| `services` | `cards` `list` `grid` | `headline`, `subheadline?`, `items[]{title, description, price?, icon?, cta?}` |
| `blog-preview` | `cards` `featured` | `headline?`, `items[]{title, excerpt, date, author?, image_url?, slug}` |
| `map` | `embedded` | `headline?`, `address`, `embed_url`, `business_name?`, `hours[]?` |
| `stats` | `centered` `grid` `banner` | `headline?`, `items[]{value, label, description?}` |
| `lead-magnet` | `centered` `split` | `headline`, `description`, `offer_text`, `email_placeholder`, `cta_label`, `image_url?` |

### Hero — expanded variants (Phase 3)

| Variant | Description |
|---|---|
| `center` | Centered headline, optional image below (✓ Phase 1) |
| `split` | Text left, image right (✓ Phase 1) |
| `minimal` | Large editorial type, no image (✓ Phase 1) |
| `editorial` | Full-bleed background image, text overlay |
| `saas` | Product mockup/screenshot + headline + bullet list |
| `luxury` | Dark bg, large serif, full-viewport, minimal CTA |
| `agency` | Bold typographic, animated gradient accent |
| `local-business` | Warm photo, location badge, phone number prominent |

### Features — expanded variants (Phase 3)

`grid` `alternating` (✓) + `tabs` + `cards` + `checklist`

### Testimonials — expanded variants (Phase 3)

`cards` `carousel` (✓) + `wall` + `quote` (single large featured quote)

---

## Theme Presets

Each preset is a full `ThemeSchema` object stored in `lib/theme/presets.ts`.
The agent can set `theme.style = "craft"` and the config patcher applies the preset tokens.
Individual token overrides always win over the preset default.

```typescript
// lib/theme/presets.ts

export const THEME_PRESETS: Record<ThemeStyle, Omit<Theme, "style">> = {
  luxury: {
    colors: { primary: "#c9a96e", secondary: "#1a1208", accent: "#2d2010",
              background: "#0d0d0d", text: "#f5f0e8", muted: "#8b7355" },
    typography: { headingFont: "playfair", bodyFont: "lato", scale: "spacious" },
    radius: "none", shadow: "none",
  },
  startup: {
    colors: { primary: "#6366f1", secondary: "#4f46e5", accent: "#eef2ff",
              background: "#ffffff", text: "#111827", muted: "#6b7280" },
    typography: { headingFont: "inter", bodyFont: "inter", scale: "default" },
    radius: "lg", shadow: "md",
  },
  craft: {
    colors: { primary: "#7c4a1e", secondary: "#a86a2d", accent: "#fdf6ee",
              background: "#fafaf8", text: "#2c1a0e", muted: "#8a6a4a" },
    typography: { headingFont: "playfair", bodyFont: "lato", scale: "default" },
    radius: "sm", shadow: "sm",
  },
  medical: {
    colors: { primary: "#0891b2", secondary: "#0e7490", accent: "#ecfeff",
              background: "#f8fafc", text: "#0f172a", muted: "#64748b" },
    typography: { headingFont: "dm-sans", bodyFont: "inter", scale: "default" },
    radius: "md", shadow: "sm",
  },
  legal: {
    colors: { primary: "#1e3a5f", secondary: "#162d4a", accent: "#f0f4f8",
              background: "#fafafa", text: "#1a1a2e", muted: "#64748b" },
    typography: { headingFont: "playfair", bodyFont: "source-sans", scale: "spacious" },
    radius: "none", shadow: "none",
  },
  restaurant: {
    colors: { primary: "#b45309", secondary: "#92400e", accent: "#fef3c7",
              background: "#fffbf5", text: "#1c1917", muted: "#78716c" },
    typography: { headingFont: "playfair", bodyFont: "lato", scale: "default" },
    radius: "sm", shadow: "md",
  },
  tech: {
    colors: { primary: "#22d3ee", secondary: "#06b6d4", accent: "#083344",
              background: "#0f172a", text: "#f1f5f9", muted: "#64748b" },
    typography: { headingFont: "space-grotesk", bodyFont: "inter", scale: "compact" },
    radius: "md", shadow: "dramatic",
  },
  minimal: {
    colors: { primary: "#000000", secondary: "#171717", accent: "#f5f5f5",
              background: "#ffffff", text: "#171717", muted: "#737373" },
    typography: { headingFont: "inter", bodyFont: "inter", scale: "spacious" },
    radius: "none", shadow: "none",
  },
  bold: {
    colors: { primary: "#dc2626", secondary: "#b91c1c", accent: "#fef2f2",
              background: "#fafafa", text: "#0a0a0a", muted: "#6b7280" },
    typography: { headingFont: "space-grotesk", bodyFont: "inter", scale: "compact" },
    radius: "sm", shadow: "dramatic",
  },
  modern: {
    colors: { primary: "#7c3aed", secondary: "#6d28d9", accent: "#f5f3ff",
              background: "#fafafa", text: "#0f0a1e", muted: "#6b7280" },
    typography: { headingFont: "dm-sans", bodyFont: "inter", scale: "default" },
    radius: "lg", shadow: "md",
  },
}
```

---

## RevisionIntent Zod Schema

```typescript
export const RevisionIntentSchema = z.discriminatedUnion("type", [
  // Theme
  z.object({ type: z.literal("theme.set_color"), token: z.enum(["primary","secondary","accent","background","text","muted"]), value: HEX_COLOR }),
  z.object({ type: z.literal("theme.apply_preset"), preset: z.enum(THEME_STYLES) }),
  z.object({ type: z.literal("theme.set_font"), role: z.enum(["heading","body"]), value: z.string() }),
  z.object({ type: z.literal("theme.set_radius"), value: z.enum(["none","sm","md","lg","full"]) }),
  // Sections
  z.object({ type: z.literal("section.enable"),  section_type: z.string() }),
  z.object({ type: z.literal("section.disable"), section_type: z.string() }),
  z.object({ type: z.literal("section.reorder"), from_index: z.number().int().min(0), to_index: z.number().int().min(0) }),
  z.object({ type: z.literal("section.change_variant"), section_id: z.string().uuid(), variant: z.string() }),
  z.object({ type: z.literal("section.update_content"), section_id: z.string().uuid(), path: z.string(), value: z.unknown() }),
  z.object({ type: z.literal("section.add"), section_type: z.string(), variant: z.string().optional() }),
  z.object({ type: z.literal("section.regenerate_copy"), section_id: z.string().uuid(), guidance: z.string().max(300) }),
  // Metadata
  z.object({ type: z.literal("metadata.update"), field: z.string(), value: z.string() }),
])
```

**Deterministic intents** (no AI call, instant):
`theme.set_color`, `theme.apply_preset`, `theme.set_font`, `theme.set_radius`,
`section.enable`, `section.disable`, `section.reorder`, `section.change_variant`,
`section.update_content`, `metadata.update`

**AI intents** (Sonnet call):
`section.add` (generates content for the new section),
`section.regenerate_copy` (rewrites copy for one section with guidance)

---

## Pipeline Architecture

Each step is a `POST /api/pipeline/{step}` protected by QStash signature verification.

```
[Brief submitted]
        ↓
/api/pipeline/validate-brief   (Haiku)
  → validates Brief schema
  → status = 'research'
        ↓
/api/pipeline/research         (Sonnet + web_search)
  → Brief → DesignBriefing JSON
    { industry_analysis, recommended_theme_style, recommended_sections[],
      tone_guidance, copy_examples, local_seo_needed: bool }
  → status = 'generating'
        ↓
/api/pipeline/generate         (Sonnet, structured output)
  → Brief + DesignBriefing → full SiteConfig JSON
  → Zod.parse → write site_configs (draft, v1)
  → status = 'review'
        ↓  [QA gate — internal "send to client" button]
  → status = 'preview'
        ↓
[Revision loop]
  → Haiku: message → RevisionIntent[]
  → deterministic intents: config-patcher (no AI)
  → AI intents: Sonnet call
  → Zod.parse → new site_configs row (version++)
  → status = 'revising' → 'preview'
        ↓
[Freigeben]
  → site_config status = 'published'
  → status = 'approved'
        ↓
/api/pipeline/deploy
  → Vercel REST API: assign custom domain
  → status = 'live'
```

---

## SEO in the Renderer

`/p/[id]` and the live site renderer both:

1. Inject `<title>` and `<meta name="description">` from `metadata`
2. If `seo.local_business` is set, render:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "...",
  "address": { "@type": "PostalAddress", ... },
  "telephone": "...",
  "openingHours": ["Mo-Fr 09:00-18:00"],
  "priceRange": "€€"
}
</script>
```
3. Inject Open Graph tags (`og:title`, `og:description`, `og:image`)
4. Auto-generate `sitemap.xml` at `/sitemap.xml` (Next.js route handler)
5. `robots.txt` respects `seo.noindex`

This gives every SMB site Basic Local SEO out of the box — no extra config.

---

## Agency Mode

### Domain model

```
agencies (1)
  └── agency_members (N) — auth.users with roles
  └── projects (N)       — one per client website
      └── site_configs
      └── revisions
      └── deployments
  └── white_label_configs (1) — dashboard branding
```

### How white-labeling works

1. Agency signs up → creates `agencies` row
2. Optionally configures `white_label_configs` (their logo, domain, from-email)
3. Their portal is at `portal.theiragency.com` (Vercel middleware resolves by `white_label_configs.custom_domain`)
4. Client sites live on any domain — the renderer is the same, only the config differs
5. From the client's perspective they're dealing with "Schmidt Digital" not "AutoWebsiteBuilder"

### RLS Rules (agency mode)

- Agency members can only see `projects` where `agency_id = their agency`
- `owner` and `admin` can create/delete projects; `member` can only edit
- Service role key (pipeline) bypasses RLS entirely

---

## Config Patcher — Deterministic Intents

```typescript
// lib/revision/config-patcher.ts

import { THEME_PRESETS } from "@/lib/theme/presets"
import { set } from "lodash-es"

export function applyIntent(config: SiteConfig, intent: RevisionIntent): SiteConfig {
  switch (intent.type) {
    case "theme.set_color":
      return set(structuredClone(config), `theme.colors.${intent.token}`, intent.value)

    case "theme.apply_preset": {
      const preset = THEME_PRESETS[intent.preset]
      return { ...config, theme: { ...preset, style: intent.preset } }
    }

    case "theme.set_font":
      return set(structuredClone(config), `theme.typography.${intent.role}Font`, intent.value)

    case "theme.set_radius":
      return { ...config, theme: { ...config.theme, radius: intent.value } }

    case "section.change_variant": {
      const clone = structuredClone(config)
      const section = clone.sections.find(s => s.id === intent.section_id)
      if (section) (section as { variant: string }).variant = intent.variant
      return clone
    }

    case "section.reorder": {
      const clone = structuredClone(config)
      const [moved] = clone.sections.splice(intent.from_index, 1)
      clone.sections.splice(intent.to_index, 0, moved)
      clone.sections.forEach((s, i) => { s.order = i })
      return clone
    }

    case "section.enable":
    case "section.disable": {
      const clone = structuredClone(config)
      const section = clone.sections.find(s => s.type === intent.section_type)
      if (section) section.enabled = intent.type === "section.enable"
      return clone
    }

    case "section.update_content": {
      const clone = structuredClone(config)
      const section = clone.sections.find(s => s.id === intent.section_id)
      if (section) set(section, `content.${intent.path}`, intent.value)
      return clone
    }

    case "metadata.update":
      return set(structuredClone(config), `metadata.${intent.field}`, intent.value)

    default:
      return config  // AI intents handled outside patcher
  }
}
```

---

## Renderer Architecture

`/p/[id]` — server component:
1. Reads latest `draft` site_config from Supabase
2. `ThemeProvider` → CSS variables (`--site-primary`, `--site-background` …) on wrapper div
3. `SiteRenderer` → sorted + enabled sections → block registry → components

Custom domain (live site): Next.js middleware reads hostname, resolves `project_id`
from `projects.domain`, renders `published` config. Same renderer, different config status.

```typescript
// components/renderer/SiteRenderer.tsx
const BLOCK_REGISTRY = {
  hero:          { center: HeroCenter, split: HeroSplit, minimal: HeroMinimal,
                   editorial: HeroEditorial, saas: HeroSaas, luxury: HeroLuxury,
                   agency: HeroAgency, "local-business": HeroLocalBusiness },
  features:      { grid: FeaturesGrid, alternating: FeaturesAlternating,
                   tabs: FeaturesTabs, cards: FeaturesCards, checklist: FeaturesChecklist },
  testimonials:  { cards: TestimonialsCards, carousel: TestimonialsCarousel,
                   wall: TestimonialsWall, quote: TestimonialsQuote },
  pricing:       { cards: PricingCards, table: PricingTable },
  about:         { text: AboutText, split: AboutSplit },
  cta:           { centered: CTACentered, banner: CTABanner },
  footer:        { minimal: FooterMinimal, columns: FooterColumns },
  faq:           { accordion: FAQAccordion, "two-column": FAQTwoColumn },
  team:          { grid: TeamGrid, list: TeamList, carousel: TeamCarousel },
  gallery:       { masonry: GalleryMasonry, grid: GalleryGrid, carousel: GalleryCarousel },
  "contact-form":{ simple: ContactFormSimple, split: ContactFormSplit },
  "case-studies":{ cards: CaseStudiesCards, featured: CaseStudiesFeatured },
  logos:         { strip: LogosStrip, grid: LogosGrid },
  timeline:      { vertical: TimelineVertical, horizontal: TimelineHorizontal },
  process:       { steps: ProcessSteps, numbered: ProcessNumbered },
  services:      { cards: ServicesCards, list: ServicesList, grid: ServicesGrid },
  "blog-preview":{ cards: BlogPreviewCards, featured: BlogPreviewFeatured },
  map:           { embedded: MapEmbedded },
  stats:         { centered: StatsCentered, grid: StatsGrid, banner: StatsBanner },
  "lead-magnet": { centered: LeadMagnetCentered, split: LeadMagnetSplit },
}
```

---

## Build Roadmap

### ✓ Phase 1 — Foundation (done)
- Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui
- Zod schemas: SiteConfig, Brief, RevisionIntent
- ThemeProvider + CSS variable injection
- 7 section types, 1–2 variants each
- `/p/[id]` renderer + `/p/seed` test route
- Supabase migrations (SQL files)
- QStash client + enqueue helpers

### Phase 2 — Block Library Expansion
- 13 new section types (FAQ, Team, Gallery, ContactForm, CaseStudies,
  Logos, Timeline, Process, Services, BlogPreview, Map, Stats, LeadMagnet)
- Theme preset system (`lib/theme/presets.ts` + 10 presets)
- `theme.apply_preset` in config patcher
- `section.change_variant` in config patcher
- Update seed config to demonstrate 3+ new sections
- SEO renderer: Schema.org JSON-LD, OG tags, sitemap.xml

### Phase 3 — Pipeline
- `/api/pipeline/generate` — Sonnet structured output → SiteConfig
- `/api/projects/[id]/brief` — save brief, enqueue pipeline
- `/api/pipeline/research` — Sonnet + web_search → DesignBriefing
- QStash signature verification middleware
- Idempotency: check project.status before each step

### Phase 4 — Revision Loop
- Intent classifier: Haiku call → RevisionIntent[]
- Config patcher: all deterministic intents
- `/api/projects/[id]/revise` — classify → patch → new draft version
- AI intents: section.add (Sonnet), section.regenerate_copy (Sonnet)
- RevisionChat component in dashboard

### Phase 5 — Approval + Deploy
- `/api/projects/[id]/approve` → publish config
- `lib/vercel/api.ts` — assign custom domain via Vercel REST API
- `/api/pipeline/deploy`
- Next.js middleware: hostname → project_id → published config

### Phase 6 — Dashboard
- Projects list (per agency)
- Project detail: status timeline, PreviewFrame iframe, RevisionChat
- "Send preview to client" button (internal QA gate)
- "Freigeben" button

### Phase 7 — Agency Mode
- `003_agency_mode.sql` migration
- Agency signup + onboarding
- `agency_members` invite flow
- White-label config UI (logo, domain, email)
- RLS policy update for agency isolation
- Middleware: custom portal domain → agency dashboard

---

## Key Invariants

- Every `site_configs.config` write goes through `SiteConfigSchema.parse()` — invalid configs never reach the DB
- Pipeline steps are idempotent: check `project.status` at step entry, skip if past
- Revision creates a new `site_configs` row (version++) — never mutates existing rows
- The renderer always reads the latest draft; custom domain reads `published` only
- QStash retries on non-2xx; unrecoverable errors set `project.status = 'failed'`
- Theme preset tokens are defaults; individual token overrides always win

---

## V2 Scope (Not Now)

- Hero variant expansion (editorial, saas, luxury, agency, local-business)
- Features: tabs, cards, checklist variants
- Repo-per-customer (Vercel project per client vs. shared renderer)
- Codegen escape hatch (bespoke sections outside block library)
- CEO multi-step orchestration (pipeline variant selection by industry)
- Image generation (Replicate / fal.ai for hero images)
- Customer-facing self-edit portal (edit config fields directly)
- Blog/CMS (Sanity or Contentlayer behind a blog-post route)
- Programmatic SEO (location × service landing pages from config array)
- Stripe billing (agency plans: free/growth/agency)
- Usage metering (AI calls per agency per month)
- Competitor research in pipeline
