import { type StatsSection } from "@/lib/schema/site-config"

interface Props {
  content: StatsSection["content"]
}

export function StatsCentered({ content }: Props) {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "var(--site-background)" }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {content.headline && (
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12"
            style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
            {content.headline}
          </h2>
        )}
        <div className={`grid grid-cols-2 ${content.items.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3"} gap-8`}>
          {content.items.map((stat, i) => (
            <div key={i}>
              <p className="text-5xl sm:text-6xl font-bold"
                style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-primary)" }}>
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium" style={{ color: "var(--site-text)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
