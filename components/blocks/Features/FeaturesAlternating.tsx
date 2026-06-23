import { type FeaturesSection } from "@/lib/schema/site-config"

interface Props {
  content: FeaturesSection["content"]
}

export function FeaturesAlternating({ content }: Props) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-background)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
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
            <p className="mt-4 text-lg" style={{ color: "var(--site-muted)" }}>
              {content.subheadline}
            </p>
          )}
        </div>

        <div className="space-y-20">
          {content.items.map((item, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
              style={{ direction: i % 2 === 1 ? "rtl" : "ltr" }}
            >
              <div style={{ direction: "ltr" }}>
                <h3
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--site-heading-font)",
                    color: "var(--site-text)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-4 text-base leading-relaxed"
                  style={{ color: "var(--site-muted)" }}
                >
                  {item.description}
                </p>
              </div>

              <div
                className="rounded-2xl overflow-hidden aspect-[4/3]"
                style={{
                  direction: "ltr",
                  backgroundColor: "var(--site-accent)",
                  boxShadow: "var(--site-shadow)",
                }}
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl opacity-20">
                      {i + 1}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
