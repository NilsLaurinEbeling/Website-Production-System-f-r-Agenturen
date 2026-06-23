/**
 * Resolve a hostname to a white-label agency portal.
 *
 * Agency portal domains (white_label_configs.custom_domain) must serve the
 * dashboard, not a client's live site. Middleware uses this to tell the two
 * kinds of custom domain apart. Results are cached briefly in-process to keep
 * the per-request cost down.
 *
 * Uses the Supabase REST endpoint with the service-role key (white_label_configs
 * is not anon-readable). Returns the agency_id, or null if the host is not a
 * registered portal domain (or lookups aren't configured).
 */
const TTL_MS = 60_000
const cache = new Map<string, { agencyId: string | null; at: number }>()

export async function resolvePortalAgency(host: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null

  const h = host.toLowerCase().split(":")[0]
  const hit = cache.get(h)
  if (hit && Date.now() - hit.at < TTL_MS) return hit.agencyId

  try {
    const res = await fetch(
      `${url}/rest/v1/white_label_configs?custom_domain=eq.${encodeURIComponent(h)}&select=agency_id`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      }
    )
    if (!res.ok) {
      cache.set(h, { agencyId: null, at: Date.now() })
      return null
    }
    const rows = (await res.json()) as Array<{ agency_id: string }>
    const agencyId = rows[0]?.agency_id ?? null
    cache.set(h, { agencyId, at: Date.now() })
    return agencyId
  } catch {
    return null
  }
}
