import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Service-role Supabase client for server-side pipeline steps.
 *
 * Pipeline routes are invoked by QStash — there is no user session/cookie —
 * so they bypass RLS using the service-role key. Never import this into
 * client components.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  )
}
