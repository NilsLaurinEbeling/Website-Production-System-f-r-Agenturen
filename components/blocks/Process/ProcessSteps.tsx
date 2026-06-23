import { type ProcessSection } from "@/lib/schema/site-config"

interface Props {
  content: ProcessSection["content"]
}

export function ProcessSteps({ content }: Props) {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "var(--site-accent)" }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
            {content.headline}
          </h2>
          {content.subheadline && (
            <p className="mt-4 text-lg" style={{ color: "var(--site-muted)" }}>{content.subheadline}</p>
          )}
        </div>
        <div className="relative">
          {/* connector line for desktop */}
          <div className="hidden md:block absolute top-7 left-0 right-0 h-px" style={{ backgroundColor: "var(--site-muted)" }} />
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(content.items.length, 4)} gap-8`}>
            {content.items.map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div
                  className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-sm font-bold"
                  style={{
                    backgroundColor: "var(--site-primary)",
                    color: "var(--site-background)",
                  }}
                >
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2"
                  style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--site-muted)" }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
