import Link from "next/link"
import { redirect } from "next/navigation"
import { getAgencyContext, getCurrentUser } from "@/lib/agency/queries"

/**
 * Dashboard shell: requires an authenticated user with an agency. Renders the
 * agency's branding (white-label name/logo when configured) in a top nav.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const ctx = await getAgencyContext()
  if (!ctx) redirect("/onboarding")

  const brandName = ctx.whiteLabel?.agency_name ?? ctx.agency.name
  const logoUrl = ctx.whiteLabel?.logo_url ?? ctx.agency.logo_url

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--muted))]">
      <header className="border-b bg-[hsl(var(--background))]">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={brandName} className="h-7 w-auto" />
            ) : (
              <span>{brandName}</span>
            )}
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="hover:underline">
              Projekte
            </Link>
            <Link href="/settings" className="hover:underline">
              Einstellungen
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-[hsl(var(--muted-foreground))] hover:underline"
              >
                Abmelden
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  )
}

export const dynamic = "force-dynamic"
