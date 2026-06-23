import { type TimelineSection } from "@/lib/schema/site-config"

interface Props {
  content: TimelineSection["content"]
}

export function TimelineVertical({ content }: Props) {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "var(--site-background)" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {content.headline && (
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12"
            style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
            {content.headline}
          </h2>
        )}
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-16 top-0 bottom-0 w-px" style={{ backgroundColor: "var(--site-muted)" }} />
          <div className="space-y-10">
            {content.items.map((item, i) => (
              <div key={i} className="relative flex gap-8 items-start">
                <div
                  className="flex-shrink-0 w-32 text-right text-sm font-bold pt-0.5"
                  style={{ color: "var(--site-primary)" }}
                >
                  {item.year}
                </div>
                {/* dot */}
                <div
                  className="absolute left-[60px] top-1.5 w-3 h-3 rounded-full border-2"
                  style={{
                    backgroundColor: "var(--site-background)",
                    borderColor: "var(--site-primary)",
                  }}
                />
                <div className="flex-1 pb-2">
                  <h3 className="font-semibold mb-1"
                    style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--site-muted)" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
