import { type Navigation } from "@/lib/schema/site-config"

interface NavigationBarProps {
  nav: Navigation
}

export function NavigationBar({ nav }: NavigationBarProps) {
  return (
    <header
      style={{
        backgroundColor: "var(--site-background)",
        borderBottom: "1px solid var(--site-muted)",
      }}
      className="sticky top-0 z-50 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div
            className="text-lg font-bold tracking-tight"
            style={{
              fontFamily: "var(--site-heading-font)",
              color: "var(--site-primary)",
            }}
          >
            {nav.logo_text ?? "Brand"}
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--site-text)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {nav.cta && (
            <a
              href={nav.cta.href}
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--site-primary)",
                color: "var(--site-background)",
                borderRadius: "var(--site-radius)",
              }}
            >
              {nav.cta.label}
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
