export type {
  SiteConfig,
  AnySection,
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  PricingSection,
  AboutSection,
  CTASection,
  FooterSection,
  Navigation,
  Theme,
} from "@/lib/schema/site-config"

export type {
  RevisionIntent,
  RevisionIntents,
} from "@/lib/schema/revision-intent"

export type { Brief } from "@/lib/schema/brief"

export type ProjectStatus =
  | "intake"
  | "planning"
  | "research"
  | "generating"
  | "review"
  | "preview"
  | "revising"
  | "approved"
  | "deploying"
  | "live"
  | "failed"

export interface Project {
  id:            string
  customer_id:   string
  status:        ProjectStatus
  domain:        string | null
  error_message: string | null
  created_at:    string
  updated_at:    string
}
