import { createClient } from "@/lib/supabase/server"
import type { Agency, AgencyRole, WhiteLabelConfig } from "@/types"

/**
 * The current user's agency context, as seen by the dashboard.
 *
 * A user belongs to exactly one agency in V1 (their own, or one they were
 * invited to). `role` is their role within it; `whiteLabel` is the agency's
 * branding config if configured.
 */
export interface AgencyContext {
  agency: Agency
  role: AgencyRole
  whiteLabel: WhiteLabelConfig | null
}

/** The authenticated user, or null. */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Resolve the current user's agency context via RLS. Returns null if the user
 * is not signed in or has no agency yet (→ onboarding).
 *
 * When the user belongs to multiple agencies the most recently created one
 * wins; V1 keeps one agency per user so this is rarely exercised.
 */
export async function getAgencyContext(): Promise<AgencyContext | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: membership } = await supabase
    .from("agency_members")
    .select("role, agencies(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!membership || !membership.agencies) return null

  const agency = membership.agencies as unknown as Agency

  const { data: whiteLabel } = await supabase
    .from("white_label_configs")
    .select("*")
    .eq("agency_id", agency.id)
    .maybeSingle()

  return {
    agency,
    role: membership.role as AgencyRole,
    whiteLabel: (whiteLabel as WhiteLabelConfig | null) ?? null,
  }
}

/** Owners and admins can create/delete projects and manage the agency. */
export function canManage(role: AgencyRole): boolean {
  return role === "owner" || role === "admin"
}
