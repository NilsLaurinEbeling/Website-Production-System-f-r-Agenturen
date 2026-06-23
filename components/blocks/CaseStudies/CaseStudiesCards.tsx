import { type CaseStudiesSection } from "@/lib/schema/site-config"

interface Props {
  content: CaseStudiesSection["content"]
}

export function CaseStudiesCards({ content }: Props) {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "var(--site-background)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {content.headline && (
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12"
            style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
            {content.headline}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.items.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col overflow-hidden border transition-shadow hover:shadow-lg"
              style={{ borderColor: "var(--site-muted)", borderRadius: "var(--site-radius)" }}
            >
              {item.image_url && (
                <div className="overflow-hidden aspect-[16/9]">
                  <img src={item.image_url} alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag, j) => (
                      <span key={j} className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "var(--site-accent)", color: "var(--site-primary)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="font-bold text-lg mb-1"
                  style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
                  {item.title}
                </h3>
                {item.client && (
                  <p className="text-xs mb-2 font-medium" style={{ color: "var(--site-primary)" }}>
                    {item.client}
                  </p>
                )}
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--site-muted)" }}>
                  {item.description}
                </p>
                {item.url && (
                  <a href={item.url} className="mt-4 text-sm font-semibold transition-opacity hover:opacity-70"
                    style={{ color: "var(--site-primary)" }}>
                    Mehr erfahren →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
