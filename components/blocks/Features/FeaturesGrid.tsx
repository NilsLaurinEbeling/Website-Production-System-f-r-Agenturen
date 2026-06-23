import { type FeaturesSection } from "@/lib/schema/site-config"

interface Props {
  content: FeaturesSection["content"]
}

const ICON_MAP: Record<string, string> = {
  zap: "⚡", star: "⭐", shield: "🛡️", check: "✓", heart: "❤️",
  globe: "🌐", lock: "🔒", chart: "📈", clock: "⏰", users: "👥",
  mail: "✉️", phone: "📞", settings: "⚙️", code: "💻", leaf: "🌿",
}

function Icon({ name }: { name: string }) {
  const emoji = ICON_MAP[name.toLowerCase()]
  return (
    <span
      className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-xl"
      style={{ backgroundColor: "var(--site-accent)" }}
    >
      {emoji ?? "●"}
    </span>
  )
}

export function FeaturesGrid({ content }: Props) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-background)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--site-heading-font)",
              color: "var(--site-text)",
            }}
          >
            {content.headline}
          </h2>
          {content.subheadline && (
            <p
              className="mt-4 text-lg max-w-2xl mx-auto"
              style={{ color: "var(--site-muted)" }}
            >
              {content.subheadline}
            </p>
          )}
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {content.items.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border transition-shadow hover:shadow-md"
              style={{
                borderColor: "var(--site-muted)",
                borderRadius: "var(--site-radius)",
              }}
            >
              <Icon name={item.icon} />
              <h3
                className="mt-4 text-lg font-semibold"
                style={{
                  fontFamily: "var(--site-heading-font)",
                  color: "var(--site-text)",
                }}
              >
                {item.title}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--site-muted)" }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
