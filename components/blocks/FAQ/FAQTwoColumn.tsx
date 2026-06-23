import { type FAQSection } from "@/lib/schema/site-config"

interface Props {
  content: FAQSection["content"]
}

export function FAQTwoColumn({ content }: Props) {
  const half = Math.ceil(content.items.length / 2)
  const left  = content.items.slice(0, half)
  const right = content.items.slice(half)

  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-background)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {content.headline && (
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-12 text-center"
            style={{
              fontFamily: "var(--site-heading-font)",
              color: "var(--site-text)",
            }}
          >
            {content.headline}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {[left, right].map((col, ci) => (
            <div key={ci} className="space-y-8">
              {col.map((item, i) => (
                <div key={i}>
                  <h3
                    className="font-semibold mb-2"
                    style={{
                      fontFamily: "var(--site-heading-font)",
                      color: "var(--site-text)",
                    }}
                  >
                    {item.question}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--site-muted)" }}
                  >
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
