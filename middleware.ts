import { NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import { resolvePortalAgency } from "@/lib/agency/portal"

/**
 * Hostname-based routing + dashboard auth.
 *
 * Three kinds of host:
 *   1. App hosts (NEXT_PUBLIC_BASE_URL host, localhost, *.vercel.app, APP_HOSTS)
 *      → the dashboard. Auth session is refreshed and dashboard routes are gated.
 *   2. White-label portal domains (white_label_configs.custom_domain)
 *      → also the dashboard, branded for that agency. Same auth handling.
 *   3. Any other custom domain → a client's live site, rewritten to /site/[host],
 *      which renders the project's published SiteConfig.
 */
function appHosts(): string[] {
  const hosts = new Set<string>(["localhost", "127.0.0.1"])

  const base = process.env.NEXT_PUBLIC_BASE_URL
  if (base) {
    try {
      hosts.add(new URL(base).hostname.toLowerCase())
    } catch {
      // ignore malformed base URL
    }
  }

  for (const h of (process.env.APP_HOSTS ?? "").split(",")) {
    const trimmed = h.trim().toLowerCase()
    if (trimmed) hosts.add(trimmed)
  }

  return [...hosts]
}

function isAppHost(host: string): boolean {
  const h = host.toLowerCase().split(":")[0]
  if (h.endsWith(".vercel.app")) return true
  return appHosts().includes(h)
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? ""

  // App host → dashboard with auth.
  if (!host || isAppHost(host)) {
    return updateSession(request)
  }

  // White-label portal domain → branded dashboard, with auth.
  const portalAgencyId = await resolvePortalAgency(host)
  if (portalAgencyId) {
    return updateSession(request)
  }

  // Otherwise a client's custom domain → render its live site.
  const url = request.nextUrl.clone()
  url.pathname = `/site/${encodeURIComponent(host.split(":")[0])}`
  return NextResponse.rewrite(url)
}

/**
 * Run on page requests only. Excludes API routes (pipeline/QStash callbacks,
 * project actions), Next internals, and static assets — those must resolve on
 * the app host regardless of the incoming hostname.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|site).*)"],
}
