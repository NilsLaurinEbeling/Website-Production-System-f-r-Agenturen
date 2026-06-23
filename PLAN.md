# AutoWebsiteBuilder Agency — V1 Implementation Plan

## Architecture Decision: Config-Driven

One fixed Next.js renderer. Agents generate/patch JSON configs — never code.
The site_config is the single source of truth, Zod-validated, versioned in Supabase.

**Why this wins for SMB volume:**
- Template never breaks (no codegen build failures)
- Theme changes = token patch (deterministic, instant)
- Section reorder = array mutation (no code rewrite)
- Multi-tenancy = one codebase, many configs
- No build sandbox needed

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 App Router | SSR + API routes in one |
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
│   │   ├── layout.tsx             # Dashboard shell with auth
│   │   ├── page.tsx               # Projects list
│   │   └── projects/
│   │       └── [id]/
│   │           └── page.tsx       # Project detail: status, preview, revision chat
│   ├── p/
│   │   └── [id]/
│   │       └── page.tsx           # Public renderer — reads draft site_config
│   ├── api/
│   │   ├── projects/
│   │   │   ├── route.ts           # POST: create project
│   │   │   └── [id]/
│   │   │       ├── route.ts       # GET: project state
│   │   │       ├── brief/route.ts # POST: submit intake brief
│   │   │       ├── approve/route.ts # POST: draft → published + Vercel domain
│   │   │       └── revise/route.ts  # POST: revision chat message
│   │   └── pipeline/
│   │       ├── validate-brief/route.ts
│   │       ├── research/route.ts
│   │       ├── generate/route.ts
│   │       └── deploy/route.ts
│   └── layout.tsx
├── components/
│   ├── blocks/                    # Section components (the block library)
│   │   ├── Hero/
│   │   │   ├── HeroCenter.tsx     # Variant A: centered, full-width background
│   │   │   ├── HeroSplit.tsx      # Variant B: text left, image right
│   │   │   └── HeroMinimal.tsx    # Variant C: headline + CTA only
│   │   ├── Features/
│   │   │   ├── FeaturesGrid.tsx   # 3-col grid with icons
│   │   │   └── FeaturesAlternating.tsx # Alternating image + text rows
│   │   ├── Testimonials.tsx
│   │   ├── Pricing.tsx
│   │   ├── About.tsx
│   │   ├── CTA.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── renderer/
│   │   ├── SiteRenderer.tsx       # Maps config.sections[] → block components
│   │   └── ThemeProvider.tsx      # Injects CSS variables from config.theme
│   └── dashboard/
│       ├── ProjectStatus.tsx      # Status timeline chip
│       ├── PreviewFrame.tsx       # <iframe> wrapper for /p/[id]
│       └── RevisionChat.tsx       # Chat UI for revision requests
├── lib/
│   ├── schema/
│   │   ├── site-config.ts         # Zod schema for SiteConfig (authoritative)
│   │   ├── revision-intent.ts     # Zod schema for RevisionIntent
│   │   └── brief.ts               # Zod schema for intake Brief
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   └── server.ts              # Server client (cookies)
│   ├── pipeline/
│   │   ├── qstash.ts              # QStash client + enqueue helpers
│   │   ├── research-agent.ts      # Sonnet call → DesignBriefing
│   │   └── generator-agent.ts     # Sonnet call → SiteConfig
│   ├── revision/
│   │   ├── intent-classifier.ts   # Haiku call → RevisionIntent[]
│   │   └── config-patcher.ts      # Deterministic intent → config patch
│   └── vercel/
│       └── api.ts                 # Vercel REST API: assign domain, get deployment
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_rls_policies.sql
└── types/
    └── index.ts                   # Re-exports from Zod inferred types
```

---

## State Machine

```
intake → planning → research → generating → review
       → revising ⇄ preview → approved → deploying → live
                                        ↘ failed (with error_message)
```

Transitions are written to `projects.status` by pipeline steps. Each step is
idempotent — QStash retries on non-2xx with exponential backoff.

---

## Database Schema

### `projects`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
customer_id   uuid REFERENCES auth.users(id)
status        text NOT NULL DEFAULT 'intake'
domain        text                        -- assigned custom domain
error_message text
created_at    timestamptz DEFAULT now()
updated_at    timestamptz DEFAULT now()
```

### `briefs`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
project_id    uuid REFERENCES projects(id) ON DELETE CASCADE
data          jsonb NOT NULL              -- validated against Brief Zod schema
created_at    timestamptz DEFAULT now()
```

Brief fields: `business_name`, `industry`, `tagline`, `description`, `target_audience`,
`tone` (professional/friendly/bold), `primary_color_hint`, `sections_wanted[]`,
`contact_email`, `contact_phone`, `address`.

### `design_briefings`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
project_id    uuid REFERENCES projects(id) ON DELETE CASCADE
data          jsonb NOT NULL              -- DesignBriefing JSON from Research Agent
created_at    timestamptz DEFAULT now()
```

DesignBriefing fields: `industry_analysis`, `recommended_theme`, `recommended_sections[]`,
`tone_guidance`, `copy_examples`.

### `site_configs`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
project_id    uuid REFERENCES projects(id) ON DELETE CASCADE
version       integer NOT NULL DEFAULT 1
status        text NOT NULL DEFAULT 'draft'  -- 'draft' | 'published'
config        jsonb NOT NULL               -- validated SiteConfig JSON
created_at    timestamptz DEFAULT now()
```

### `revisions`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
project_id    uuid REFERENCES projects(id) ON DELETE CASCADE
message       text NOT NULL               -- raw customer message
intents       jsonb                       -- parsed RevisionIntent[]
config_patch  jsonb                       -- resulting patch applied to config
created_at    timestamptz DEFAULT now()
```

### `deployments`
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
project_id          uuid REFERENCES projects(id) ON DELETE CASCADE
vercel_deployment_id text
vercel_project_id   text
domain              text
status              text DEFAULT 'queued'  -- 'queued' | 'building' | 'ready' | 'error'
created_at          timestamptz DEFAULT now()
```

---

## SiteConfig Zod Schema

```typescript
// lib/schema/site-config.ts

const ThemeSchema = z.object({
  colors: z.object({
    primary:    z.string().regex(/^#[0-9a-fA-F]{6}$/),
    secondary:  z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accent:     z.string().regex(/^#[0-9a-fA-F]{6}$/),
    background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    text:       z.string().regex(/^#[0-9a-fA-F]{6}$/),
    muted:      z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
  typography: z.object({
    headingFont: z.enum(['inter', 'cal-sans', 'playfair', 'space-grotesk', 'dm-sans']),
    bodyFont:    z.enum(['inter', 'lato', 'source-sans', 'nunito']),
    scale:       z.enum(['compact', 'default', 'spacious']),
  }),
  radius: z.enum(['none', 'sm', 'md', 'lg', 'full']),
  shadow: z.enum(['none', 'sm', 'md', 'dramatic']),
})

const SectionBaseSchema = z.object({
  id:      z.string().uuid(),
  order:   z.number().int().min(0),
  enabled: z.boolean(),
})

const HeroSectionSchema = SectionBaseSchema.extend({
  type:    z.literal('hero'),
  variant: z.enum(['center', 'split', 'minimal']),
  content: z.object({
    headline:    z.string().max(80),
    subheadline: z.string().max(160),
    cta_primary: z.object({ label: z.string().max(30), href: z.string() }),
    cta_secondary: z.object({ label: z.string().max(30), href: z.string() }).optional(),
    image_url:   z.string().url().optional(),
    badge:       z.string().max(40).optional(),
  }),
})

const FeaturesSectionSchema = SectionBaseSchema.extend({
  type:    z.literal('features'),
  variant: z.enum(['grid', 'alternating']),
  content: z.object({
    headline: z.string().max(60),
    subheadline: z.string().max(120).optional(),
    items: z.array(z.object({
      icon:        z.string(),          // lucide icon name
      title:       z.string().max(40),
      description: z.string().max(160),
      image_url:   z.string().url().optional(),
    })).min(2).max(6),
  }),
})

const TestimonialsSectionSchema = SectionBaseSchema.extend({
  type:    z.literal('testimonials'),
  variant: z.enum(['cards', 'carousel']),
  content: z.object({
    headline: z.string().max(60).optional(),
    items: z.array(z.object({
      quote:    z.string().max(300),
      author:   z.string().max(60),
      role:     z.string().max(60).optional(),
      avatar_url: z.string().url().optional(),
      rating:   z.number().min(1).max(5).optional(),
    })).min(1).max(6),
  }),
})

const PricingSectionSchema = SectionBaseSchema.extend({
  type:    z.literal('pricing'),
  variant: z.enum(['cards', 'table']),
  content: z.object({
    headline: z.string().max(60).optional(),
    plans: z.array(z.object({
      name:       z.string().max(30),
      price:      z.string().max(20),   // "€ 99/mo" — string for flexibility
      features:   z.array(z.string().max(80)).min(1).max(10),
      cta_label:  z.string().max(30),
      cta_href:   z.string(),
      highlighted: z.boolean().default(false),
    })).min(1).max(4),
  }),
})

const AboutSectionSchema = SectionBaseSchema.extend({
  type:    z.literal('about'),
  variant: z.enum(['text', 'split']),
  content: z.object({
    headline:  z.string().max(60),
    body:      z.string().max(800),
    image_url: z.string().url().optional(),
    stats: z.array(z.object({
      value: z.string().max(20),
      label: z.string().max(40),
    })).max(4).optional(),
  }),
})

const CTASectionSchema = SectionBaseSchema.extend({
  type:    z.literal('cta'),
  variant: z.enum(['centered', 'banner']),
  content: z.object({
    headline:    z.string().max(60),
    subheadline: z.string().max(120).optional(),
    cta_primary: z.object({ label: z.string().max(30), href: z.string() }),
    cta_secondary: z.object({ label: z.string().max(30), href: z.string() }).optional(),
  }),
})

const FooterSchema = SectionBaseSchema.extend({
  type:    z.literal('footer'),
  variant: z.enum(['minimal', 'columns']),
  content: z.object({
    logo_text:   z.string().max(40).optional(),
    tagline:     z.string().max(100).optional(),
    links: z.array(z.object({
      group: z.string().max(30),
      items: z.array(z.object({ label: z.string().max(30), href: z.string() })),
    })).max(4).optional(),
    social_links: z.array(z.object({
      platform: z.enum(['twitter', 'linkedin', 'instagram', 'facebook', 'youtube', 'tiktok']),
      href:     z.string().url(),
    })).max(6).optional(),
    legal_links: z.array(z.object({ label: z.string().max(30), href: z.string() })).max(4).optional(),
    copyright: z.string().max(100),
  }),
})

const NavigationSchema = z.object({
  logo_text:   z.string().max(40).optional(),
  logo_url:    z.string().url().optional(),
  links: z.array(z.object({
    label: z.string().max(30),
    href:  z.string(),
  })).max(6),
  cta: z.object({ label: z.string().max(30), href: z.string() }).optional(),
})

const AnySection = z.discriminatedUnion('type', [
  HeroSectionSchema,
  FeaturesSectionSchema,
  TestimonialsSectionSchema,
  PricingSectionSchema,
  AboutSectionSchema,
  CTASectionSchema,
  FooterSchema,
])

export const SiteConfigSchema = z.object({
  version:    z.literal(1),
  metadata: z.object({
    title:        z.string().max(60),
    description:  z.string().max(160),
    favicon_emoji: z.string().max(2).optional(),
    og_image_url:  z.string().url().optional(),
  }),
  navigation: NavigationSchema,
  theme:      ThemeSchema,
  sections:   z.array(AnySection).min(2).max(12),
})

export type SiteConfig = z.infer<typeof SiteConfigSchema>
```

---

## RevisionIntent Zod Schema

```typescript
// lib/schema/revision-intent.ts

export const RevisionIntentSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('theme.set_color'), token: z.string(), value: z.string() }),
  z.object({ type: z.literal('theme.modernize') }),         // predefined "modern" token preset
  z.object({ type: z.literal('theme.set_font'), role: z.enum(['heading', 'body']), value: z.string() }),
  z.object({ type: z.literal('section.enable'),  section_type: z.string() }),
  z.object({ type: z.literal('section.disable'), section_type: z.string() }),
  z.object({ type: z.literal('section.reorder'), from_index: z.number(), to_index: z.number() }),
  z.object({ type: z.literal('section.update_content'), section_id: z.string(), path: z.string(), value: z.unknown() }),
  z.object({ type: z.literal('section.add'), section_type: z.string(), variant: z.string().optional() }),
  z.object({ type: z.literal('section.regenerate_copy'), section_id: z.string(), guidance: z.string() }),
  z.object({ type: z.literal('metadata.update'), field: z.string(), value: z.string() }),
])

export type RevisionIntent = z.infer<typeof RevisionIntentSchema>
```

---

## Pipeline Architecture

Each step is a `POST /api/pipeline/{step}` route, protected by QStash signature verification.

```
[Customer submits brief]
        ↓
POST /api/projects/{id}/brief
  → writes brief to DB
  → sets status = 'planning'
  → QStash.enqueue('/api/pipeline/validate-brief', { projectId })
        ↓
/api/pipeline/validate-brief   (Haiku, fast)
  → validates Brief fields
  → sets status = 'research'
  → QStash.enqueue('/api/pipeline/research', { projectId })
        ↓
/api/pipeline/research         (Sonnet + web_search tool)
  → reads brief from DB
  → Claude call: Brief → DesignBriefing JSON
  → writes design_briefings row
  → sets status = 'generating'
  → QStash.enqueue('/api/pipeline/generate', { projectId })
        ↓
/api/pipeline/generate         (Sonnet, structured output)
  → reads brief + design_briefing
  → Claude call: Brief + DesignBriefing → SiteConfig JSON
  → Zod.parse(SiteConfigSchema, result) — throws on invalid
  → writes site_configs row (status='draft', version=1)
  → sets project status = 'review'
  [QA gate: human reviews before preview goes to customer]
        ↓  (manual "send preview" button in internal dashboard)
  → sets project status = 'preview'
  → customer receives preview link notification
        ↓
[Revision loop — any number of times]
POST /api/projects/{id}/revise  { message: "..." }
  → Haiku call: message → RevisionIntent[]
  → for each intent:
      - deterministic intents → config-patcher.ts (no AI)
      - section.regenerate_copy → Sonnet call for that section
  → Zod.parse new config
  → writes new site_configs row (version++)
  → sets status = 'revising' → 'preview'
        ↓
[Customer clicks "Freigeben" / Approve]
POST /api/projects/{id}/approve
  → sets site_config status = 'published'
  → sets project status = 'approved'
  → QStash.enqueue('/api/pipeline/deploy', { projectId })
        ↓
/api/pipeline/deploy
  → Vercel REST API: assign custom domain to renderer app
  → writes deployments row
  → sets project status = 'live'
```

---

## Config Patcher — Deterministic Intents

```typescript
// lib/revision/config-patcher.ts
// No AI involved — pure data transforms on SiteConfig

function applyIntent(config: SiteConfig, intent: RevisionIntent): SiteConfig {
  switch (intent.type) {
    case 'theme.set_color':
      return set(config, `theme.colors.${intent.token}`, intent.value)
    case 'theme.modernize':
      return { ...config, theme: MODERN_THEME_PRESET }
    case 'section.reorder':
      return reorderSection(config, intent.from_index, intent.to_index)
    case 'section.enable':
      return setSectionEnabled(config, intent.section_type, true)
    case 'section.disable':
      return setSectionEnabled(config, intent.section_type, false)
    case 'section.update_content':
      return set(config, `sections[id=${intent.section_id}].content.${intent.path}`, intent.value)
    // section.add and section.regenerate_copy require AI — handled separately
  }
}
```

---

## Renderer Architecture

`/p/[id]` is a Next.js server component that:
1. Reads the latest `draft` site_config for the project from Supabase
2. Passes config to `ThemeProvider` (writes CSS variables to `:root`)
3. Passes `config.sections` (sorted by `order`, filtered to `enabled`) to `SiteRenderer`
4. `SiteRenderer` maps section type → block component via a registry

```typescript
// components/renderer/SiteRenderer.tsx
const BLOCK_REGISTRY: Record<string, Record<string, ComponentType<any>>> = {
  hero:         { center: HeroCenter, split: HeroSplit, minimal: HeroMinimal },
  features:     { grid: FeaturesGrid, alternating: FeaturesAlternating },
  testimonials: { cards: TestimonialsCards, carousel: TestimonialsCarousel },
  pricing:      { cards: PricingCards, table: PricingTable },
  about:        { text: AboutText, split: AboutSplit },
  cta:          { centered: CTACentered, banner: CTABanner },
  footer:       { minimal: FooterMinimal, columns: FooterColumns },
}
```

For custom domains (live sites): the renderer app is deployed once on Vercel.
A project's custom domain points to this single deployment. Middleware reads
the hostname, resolves the project_id via `projects.domain`, and renders the
published config.

---

## V1 Build Order

### Phase 1 — Foundation (Days 1–2)
1. `npx create-next-app` with TypeScript + Tailwind
2. Supabase project + migrations (001_initial_schema.sql)
3. Zod schemas: `SiteConfig`, `Brief`, `RevisionIntent`
4. Supabase types generated from schema
5. ThemeProvider + CSS variable injection
6. 6 block components (one variant each): HeroCenter, FeaturesGrid, Testimonials, CTA, About, Footer

### Phase 2 — Renderer (Day 3)
7. `SiteRenderer` block registry
8. `/p/[id]` route — reads draft config, renders site
9. Seed one hard-coded test config → verify renderer works end-to-end
10. Navigation component

### Phase 3 — Pipeline (Days 4–5)
11. QStash client setup
12. `/api/pipeline/generate` — Brief + DesignBriefing → SiteConfig (Sonnet, structured output)
13. `/api/projects/[id]/brief` — save brief, enqueue generate
14. Test: submit brief → config in DB → preview renders
15. `/api/pipeline/research` (Sonnet + web_search) — insert between brief + generate

### Phase 4 — Revision Loop (Day 6)
16. Intent classifier (Haiku call → RevisionIntent[])
17. Config patcher (deterministic intents)
18. `/api/projects/[id]/revise` — classify → patch → new draft version
19. RevisionChat component in dashboard

### Phase 5 — Approval + Deploy (Day 7)
20. `/api/projects/[id]/approve` → publish config
21. Vercel API: domain assignment (`lib/vercel/api.ts`)
22. `/api/pipeline/deploy` — assign domain, write deployments row, set status=live
23. Middleware: hostname → project_id → render published config

### Phase 6 — Dashboard (Day 8)
24. Projects list page
25. Project detail: status timeline, PreviewFrame iframe, RevisionChat
26. "Send preview to customer" button (internal QA gate)
27. "Freigeben" button (triggers approve)

---

## Key Invariants

- Every `site_configs.config` write goes through `SiteConfigSchema.parse()` — invalid configs never reach the DB
- Pipeline steps are idempotent: check `project.status` at entry, skip if already past this step
- Revision creates a new `site_configs` row (version++) — never mutates existing rows
- The renderer always reads the latest draft; the custom domain reads published only
- QStash retries on non-2xx; steps log errors and set `project.status = 'failed'` on unrecoverable errors

---

## V2 Scope (Not Now)

- Competitor scraping (flaky, low marginal value over industry heuristics)
- Repo-per-customer (Vercel project per customer vs. shared renderer)
- Codegen escape hatch (for bespoke designs)
- CEO multi-step orchestration (planning call, pipeline variant selection)
- Image generation (DALL-E / Replicate for hero images)
- Customer-facing self-edit (direct config field editing via dashboard)
- Stripe billing integration
