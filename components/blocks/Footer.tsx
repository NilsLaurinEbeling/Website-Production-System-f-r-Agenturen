import { type FooterSection } from "@/lib/schema/site-config"

interface Props {
  content: FooterSection["content"]
}

const SOCIAL_ICONS: Record<string, string> = {
  twitter:   "𝕏",
  linkedin:  "in",
  instagram: "IG",
  facebook:  "FB",
  youtube:   "YT",
  tiktok:    "TK",
}

export function FooterMinimal({ content }: Props) {
  return (
    <footer
      className="py-10 border-t"
      style={{
        backgroundColor: "var(--site-background)",
        borderColor: "var(--site-muted)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {content.links && content.links.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {content.links.map((group, i) => (
              <div key={i}>
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-3"
                  style={{ color: "var(--site-muted)" }}
                >
                  {group.group}
                </p>
                <ul className="space-y-2">
                  {group.items.map((item, j) => (
                    <li key={j}>
                      <a
                        href={item.href}
                        className="text-sm transition-opacity hover:opacity-70"
                        style={{ color: "var(--site-text)" }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t" style={{ borderColor: "var(--site-muted)" }}>
          <div>
            {content.logo_text && (
              <p
                className="text-sm font-bold mb-1"
                style={{ color: "var(--site-text)" }}
              >
                {content.logo_text}
              </p>
            )}
            <p className="text-xs" style={{ color: "var(--site-muted)" }}>
              {content.copyright}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {content.legal_links?.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-xs transition-opacity hover:opacity-70"
                style={{ color: "var(--site-muted)" }}
              >
                {link.label}
              </a>
            ))}
            {content.social_links?.map((link, i) => (
              <a
                key={i}
                href={link.href}
                aria-label={link.platform}
                className="text-xs font-bold transition-opacity hover:opacity-70"
                style={{ color: "var(--site-text)" }}
              >
                {SOCIAL_ICONS[link.platform] ?? link.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
