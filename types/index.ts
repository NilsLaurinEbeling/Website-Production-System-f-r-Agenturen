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
  agency_id:     string | null
  created_by:    string | null
  customer_id:   string | null
  client_name:   string | null
  client_email:  string | null
  status:        ProjectStatus
  domain:        string | null
  error_message: string | null
  created_at:    string
  updated_at:    string
}

export type AgencyPlan = "free" | "growth" | "agency"
export type AgencyRole = "owner" | "admin" | "member"

export interface Agency {
  id:         string
  name:       string
  slug:       string
  logo_url:   string | null
  plan:       AgencyPlan
  owner_id:   string | null
  created_at: string
}

export interface AgencyMember {
  id:         string
  agency_id:  string
  user_id:    string
  role:       AgencyRole
  created_at: string
}

export interface WhiteLabelConfig {
  id:             string
  agency_id:      string
  agency_name:    string
  logo_url:       string | null
  custom_domain:  string | null
  from_email:     string | null
  reply_to_email: string | null
  created_at:     string
}
