import { type StatsSection } from "@/lib/schema/site-config"

interface Props {
  content: StatsSection["content"]
}

export function StatsGrid({ content }: Props) {
  return (
    <section className="py-16 sm:py-20" style={{ backgroundColor: "var(--site-primary)" }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {content.headline && (
          <h2 className="text-2xl font-bold tracking-tight text-center mb-10"
            style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-background)" }}>
            {content.headline}
          </h2>
        )}
        <div className={`grid grid-cols-2 ${content.items.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3"} gap-8`}>
          {content.items.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl sm:text-5xl font-bold"
                style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-background)" }}>
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium opacity-80" style={{ color: "var(--site-background)" }}>
                {stat.label}
              </p>
              {stat.description && (
                <p className="mt-1 text-xs opacity-60" style={{ color: "var(--site-background)" }}>
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
