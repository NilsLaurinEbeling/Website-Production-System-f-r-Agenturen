import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Refresh the Supabase auth session on every app-host request and gate the
 * dashboard. Returns a response with refreshed auth cookies; callers should
 * return it (or copy its cookies) so the browser stays signed in.
 *
 * Unauthenticated requests to dashboard routes are redirected to /login.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isPublic =
    path.startsWith("/login") ||
    path.startsWith("/auth") ||
    path.startsWith("/p/") ||
    path.startsWith("/start/") ||
    path.startsWith("/site/")

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", path)
    return NextResponse.redirect(url)
  }

  return response
}
