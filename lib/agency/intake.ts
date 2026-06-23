import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Public branding for an agency's client intake landing page.
 *
 * The intake page (`/start/[slug]`) is served to the agency's *clients* — people
 * who are not signed in — so it can't use RLS-scoped queries. Branding is
 * resolved with the service-role key (agencies + white_label_configs are not
 * anon-readable) and exposes only the public-facing fields.
 */
export interface IntakeAgency {
  id:       string
  slug:     string
  /** White-label name if configured, otherwise the agency name. */
  name:     string
  /** White-label logo if configured, otherwise the agency logo. */
  logoUrl:  string | null
}

/**
 * Resolve an agency by its public `slug` for the client intake flow, or null if
 * no such agency exists. Applies the same white-label name/logo precedence as
 * the dashboard shell.
 */
export async function getIntakeAgency(slug: string): Promise<IntakeAgency | null> {
  const normalized = slug.trim().toLowerCase()
  if (!normalized) return null

  const admin = createAdminClient()

  const { data: agency } = await admin
    .from("agencies")
    .select("id, name, slug, logo_url")
    .eq("slug", normalized)
    .maybeSingle()

  if (!agency) return null

  const { data: whiteLabel } = await admin
    .from("white_label_configs")
    .select("agency_name, logo_url")
    .eq("agency_id", agency.id)
    .maybeSingle()

  return {
    id: agency.id,
    slug: agency.slug,
    name: whiteLabel?.agency_name ?? agency.name,
    logoUrl: whiteLabel?.logo_url ?? agency.logo_url ?? null,
  }
}

/**
 * The shareable intake link an agency hands to its clients, e.g.
 * `https://app.example.com/start/agency-slug`. Falls back to a relative path
 * when the base URL isn't configured (dev).
 */
export function intakeUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "")
  return base ? `${base}/start/${slug}` : `/start/${slug}`
}
