import { type ServicesSection } from "@/lib/schema/site-config"

interface Props {
  content: ServicesSection["content"]
}

const ICON_MAP: Record<string, string> = {
  zap: "⚡", star: "⭐", shield: "🛡️", check: "✓", heart: "❤️",
  globe: "🌐", lock: "🔒", chart: "📈", clock: "⏰", users: "👥",
  wrench: "🔧", paint: "🎨", code: "💻", leaf: "🌿", home: "🏠",
}

export function ServicesCards({ content }: Props) {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "var(--site-background)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
            {content.headline}
          </h2>
          {content.subheadline && (
            <p className="mt-4 text-lg" style={{ color: "var(--site-muted)" }}>{content.subheadline}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((item, i) => (
            <div
              key={i}
              className="p-6 border flex flex-col"
              style={{ borderColor: "var(--site-muted)", borderRadius: "var(--site-radius)" }}
            >
              {item.icon && (
                <span className="text-2xl mb-4">{ICON_MAP[item.icon] ?? "●"}</span>
              )}
              <h3 className="font-semibold text-lg mb-2"
                style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--site-muted)" }}>
                {item.description}
              </p>
              {item.price && (
                <p className="mt-3 font-bold text-base" style={{ color: "var(--site-primary)" }}>
                  {item.price}
                </p>
              )}
              {item.cta && (
                <a
                  href={item.cta.href}
                  className="mt-4 inline-flex items-center text-sm font-semibold transition-opacity hover:opacity-70"
                  style={{ color: "var(--site-primary)" }}
                >
                  {item.cta.label} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
