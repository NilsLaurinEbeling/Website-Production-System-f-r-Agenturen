# Website Production System für Agenturen

Ein KI-gestütztes Website-Produktionssystem, mit dem Agenturen in Minuten
fertige, individuelle Kundenwebsites erstellen, überarbeiten und live schalten —
vom Briefing bis zur eigenen Domain.

> **Kurzfassung:** Briefing rein → KI recherchiert, designt und textet →
> Vorschau → per Chat überarbeiten → freigeben → live auf eigener Domain.

---

## Was es kann

- **Briefing zu fertiger Website** – Aus einem strukturierten Kunden-Briefing
  erzeugt eine KI-Pipeline eine vollständige, mehrteilige Website inklusive
  Branchenrecherche, Design-Wahl und Texten.
- **Überarbeitung per Chat** – Änderungswünsche werden in natürlicher Sprache
  formuliert („mach die Buttons blau", „verschieb die Preise nach oben") und in
  konkrete, validierte Config-Änderungen übersetzt.
- **Ein-Klick-Deploy** – Freigegebene Sites werden über die Vercel-API auf eine
  eigene Custom-Domain geschaltet.
- **Agenturmodus / White-Label** – Mehrere Agenturen mit eigenen Teams, Rollen,
  Branding (Logo, Portal-Domain, Absender-E-Mail) auf einer Codebasis.
- **Self-Serve-Intake** – Öffentliche, white-gelabelte Landingpage pro Agentur
  (`/start/[slug]`), über die Endkunden ihr Briefing selbst einreichen — ganz
  ohne eigenen Account.
- **Lokales SEO out-of-the-box** – Schema.org-JSON-LD (LocalBusiness),
  Open-Graph-Tags und `sitemap.xml` werden automatisch aus der Config erzeugt.
- **20+ Sektionstypen** – Hero, Features, Testimonials, Pricing, About, CTA,
  Footer, FAQ, Team, Gallery, Contact-Form, Case-Studies, Logos, Timeline,
  Process, Services, Blog-Preview, Map, Stats, Lead-Magnet — mit mehreren
  Varianten je Typ.
- **10 Theme-Presets** – luxury, startup, craft, medical, legal, restaurant,
  tech, minimal, bold, modern. Jedes Preset liefert ein komplettes Set an
  Farb-, Typografie- und Stil-Tokens; einzelne Tokens lassen sich überschreiben.

---

## Architektur-Idee: Config-Driven

Das Kernprinzip ist eine **einzige, feste Next.js-Renderer-Engine**. Die KI
generiert oder patcht ausschließlich **JSON-Configs — niemals Code**. Diese
`site_config` ist die einzige Quelle der Wahrheit, wird per Zod validiert und in
Supabase versioniert.

Warum das für Agentur-Volumen gewinnt:

- **Das Template kann nie brechen** – kein Codegen, keine fehlschlagenden Builds.
- **Theme-Änderung = Token-Patch** – deterministisch und sofort.
- **Sektion umsortieren = Array-Mutation** – kein Code-Rewrite.
- **Mandantenfähig** – eine Codebasis, viele Configs, viele Agenturen.
- **Keine Build-Sandbox nötig.**

---

## Tech-Stack

| Layer        | Technologie                | Rolle |
|--------------|----------------------------|-------|
| Framework    | Next.js 16 (App Router)    | SSR, API-Routes & Middleware in einem |
| Sprache      | TypeScript                 | End-to-End-Typsicherheit über Zod |
| Styling      | Tailwind CSS v4 + CSS-Variablen | Theme-Tokens → CSS-Vars → Utilities |
| UI           | shadcn/ui (Radix)          | barrierefreie Primitive |
| Datenbank    | Supabase (Postgres)        | Auth, RLS, typisierter Client |
| Queue        | Upstash QStash             | durable, retriable, idempotente Pipeline-Schritte |
| KI           | Anthropic SDK (Claude)     | Sonnet für Generierung, Haiku für Orchestrierung |
| Deployment   | Vercel                     | programmatische Domain-Verwaltung via REST-API |
| Validierung  | Zod                        | Runtime-Schema-Enforcement auf allen Config-Writes |

---

## So funktioniert die Pipeline

Jeder Schritt ist eine per QStash-Signatur geschützte `POST /api/pipeline/{step}`-
Route, idempotent (prüft `project.status` beim Eintritt und überspringt, wenn
bereits weiter) und wird bei Fehlern automatisch erneut versucht.

```
Briefing eingereicht
        │
        ▼
/api/pipeline/validate-brief   (Haiku)   → Brief validieren        → status: research
        │
        ▼
/api/pipeline/research         (Sonnet)  → DesignBriefing erzeugen → status: generating
        │
        ▼
/api/pipeline/generate         (Sonnet)  → komplette SiteConfig    → status: review
        │                                   (Zod-validiert, self-correcting retry)
        ▼
[interne QA] → "Vorschau an Kunden senden"                         → status: preview
        │
        ▼
[Revisions-Loop]  Chat-Nachricht → Haiku klassifiziert Intents
        │         deterministische Intents → Config-Patcher (ohne KI)
        │         KI-Intents (Sektion hinzufügen / Text neu) → Sonnet
        │         → neue site_configs-Version (version++)        → preview
        ▼
[Freigeben] → published-Config gesetzt                            → status: approved
        │
        ▼
/api/pipeline/deploy           → Vercel-Domain zuweisen          → status: live
```

### State Machine

```
intake → planning → research → generating → review
       → preview ⇄ revising → approved → deploying → live
                                                    ↘ failed
```

---

## Wie es gebaut wurde

Das System wurde in klar abgegrenzten Phasen entwickelt (Details in
[`PLAN.md`](./PLAN.md)):

1. **Foundation** – Next.js + TypeScript + Tailwind + shadcn/ui, Zod-Schemas
   (SiteConfig, Brief, RevisionIntent), ThemeProvider mit CSS-Variablen-Injektion,
   Renderer-Engine, Supabase-Migrationen, QStash-Client.
2. **Block-Library & Themes** – 20 Sektionstypen mit Varianten, 10 Theme-Presets,
   SEO-Renderer (JSON-LD, OG-Tags, Sitemap).
3. **Pipeline** – validate-brief / research / generate, QStash-Signatur-
   Verifizierung, Idempotenz-Guards, Service-Role-Admin-Client.
4. **Revisions-Loop** – Intent-Classifier (Haiku), deterministischer Config-
   Patcher, KI-Intents (Sonnet), Apply-Orchestrator, Revision-Chat-UI.
5. **Approval & Deploy** – Freigabe-Flow, Vercel-API-Integration, Hostname-
   Routing via Middleware, Live-Renderer für Custom-Domains.
6. **Dashboard** – Supabase-Auth, Projektliste, Projekt-Detailansicht mit
   Live-Vorschau (Desktop/Mobile) und Revision-Chat, Neu-Projekt-Flow.
7. **Agenturmodus** – Agencies, Team-Mitglieder mit Rollen, RLS-Scoping über
   alle Tabellen, White-Label-Konfiguration.
8. **Self-Serve-Intake** – öffentliche, white-gelabelte Intake-Seite pro Agentur.

### Zentrale Invarianten

- Jeder `site_configs.config`-Write läuft durch `SiteConfigSchema.parse()` —
  ungültige Configs erreichen nie die DB.
- Pipeline-Schritte sind idempotent (Status-Check beim Eintritt).
- Revisionen erzeugen eine **neue** Config-Version, mutieren nie bestehende Zeilen.
- Der Preview-Renderer liest immer die neueste Version; Custom-Domains nur die
  `published`-Config.
- Theme-Preset-Tokens sind Defaults; einzelne Token-Overrides gewinnen immer.

---

## Projektstruktur

```
app/
├── (dashboard)/          # Agentur-Dashboard (Projektliste, Detail, Settings, Neu)
├── api/
│   ├── projects/         # Projekt-CRUD, brief, approve, revise, send-preview
│   ├── pipeline/         # validate-brief, research, generate, deploy
│   ├── agency/           # Agentur, Mitglieder, White-Label
│   ├── intake/[slug]/    # öffentliche Briefing-Annahme
│   └── contact/          # Kontaktformular-Endpunkt
├── p/[id]/               # Vorschau-Renderer (draft-Config)
├── site/[host]/          # Live-Renderer (published-Config, Custom-Domain)
├── start/[slug]/         # öffentliche, white-gelabelte Intake-Landingpage
├── login/ · onboarding/  # Auth & Agentur-Onboarding
└── sitemap.ts            # automatische Sitemap

components/
├── blocks/               # 20+ Sektions-Blöcke mit Varianten
├── renderer/             # SiteRenderer, ThemeProvider, SeoHead
├── dashboard/            # ProjectWorkspace, RevisionChat, PreviewFrame, …
├── intake/               # ClientIntakeForm
└── ui/                   # shadcn/ui-Primitive

lib/
├── schema/               # Zod-Schemas (site-config, brief, revision-intent, …)
├── theme/presets.ts      # 10 Theme-Presets
├── anthropic/            # Claude-Client + structured output
├── pipeline/             # QStash, Verifizierung, published-Config-Auflösung
├── revision/             # Intent-Classifier, Config-Patcher, KI-Intents, apply
├── agency/               # Agentur-Queries, Portal- & Intake-Auflösung
├── vercel/api.ts         # Custom-Domain-Verwaltung
└── supabase/             # Client, Server, Admin (Service-Role), Middleware

supabase/migrations/      # 001 Schema · 002 RLS · 003 Agenturmodus · 004 RLS-Fix
middleware.ts             # Hostname-Routing (App vs. Custom-Domain vs. Portal)
```

---

## Setup

### Voraussetzungen

- Node.js 20+
- Supabase-Projekt
- Anthropic-API-Key
- Upstash-QStash-Account
- Vercel-Account (für Custom-Domain-Deploys, optional)

### Installation

```bash
git clone <repo-url>
cd Website-Production-System-f-r-Agenturen
npm install
```

### Environment-Variablen

Kopiere `.env.example` nach `.env.local` und fülle die Werte aus:

```bash
cp .env.example .env.local
```

| Variable | Zweck |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase-Client |
| `SUPABASE_SERVICE_ROLE_KEY` | Pipeline-Writes (umgeht RLS) |
| `ANTHROPIC_API_KEY` | Claude (Generierung & Orchestrierung) |
| `QSTASH_TOKEN` / `QSTASH_CURRENT_SIGNING_KEY` / `QSTASH_NEXT_SIGNING_KEY` | durable Pipeline-Queue |
| `VERCEL_TOKEN` / `VERCEL_TEAM_ID` / `VERCEL_PROJECT_ID` | Custom-Domain-Zuweisung beim Deploy |
| `NEXT_PUBLIC_BASE_URL` | App-URL für QStash-Callbacks |
| `APP_HOSTS` | zusätzliche App-Hostnamen (komma-separiert) |

### Datenbank

Die Migrationen in `supabase/migrations/` auf das Supabase-Projekt anwenden
(z. B. via Supabase CLI oder SQL-Editor).

### Entwicklung

```bash
npm run dev      # Dev-Server (http://localhost:3000)
npm run build    # Production-Build
npm run start    # Production-Server
npm run lint     # ESLint
```

---

## Datenmodell (Auszug)

| Tabelle | Zweck |
|---------|-------|
| `agencies` / `agency_members` | Agenturen & Teams mit Rollen (owner/admin/member) |
| `white_label_configs` | Branding pro Agentur (Logo, Portal-Domain, E-Mail) |
| `projects` | je eine Kundenwebsite, mit Status-State-Machine |
| `briefs` / `design_briefings` | Kunden-Briefing & KI-Recherche-Ergebnis |
| `site_configs` | versionierte, Zod-validierte Site-Configs (draft/published) |
| `revisions` | Verlauf der Überarbeitungen inkl. Intents & Patches |
| `deployments` | Vercel-Deploy-Status & Domain-Zuordnung |

Alle Tabellen sind über Row-Level-Security agentur-gescoped; der Service-Role-Key
der Pipeline umgeht RLS für Hintergrund-Writes.

---

## Status

Alle Kernphasen (1–8) sind implementiert. Die geplante V2-Roadmap (weitere
Hero-Varianten, Bildgenerierung, Stripe-Billing, Usage-Metering, Blog/CMS,
programmatisches SEO) ist in [`PLAN.md`](./PLAN.md) dokumentiert.
