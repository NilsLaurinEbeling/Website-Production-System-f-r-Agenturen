import { NextRequest, NextResponse } from "next/server"

/**
 * Hostname-based routing for live customer sites.
 *
 * The dashboard/app is served on its own host(s); every other hostname is a
 * customer's custom domain. Those requests are rewritten to `/site/[host]`,
 * which renders the project's published SiteConfig (resolved by domain).
 *
 * App hosts: the host of NEXT_PUBLIC_BASE_URL, localhost, and any *.vercel.app
 * (preview + production aliases). Override/extend via APP_HOSTS (comma-sep).
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

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? ""

  if (!host || isAppHost(host)) {
    return NextResponse.next()
  }

  // Custom domain → render the live site for this hostname.
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
