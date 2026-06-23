import { type AboutSection } from "@/lib/schema/site-config"

interface Props {
  content: AboutSection["content"]
}

export function AboutSplit({ content }: Props) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-background)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{
                fontFamily: "var(--site-heading-font)",
                color: "var(--site-text)",
              }}
            >
              {content.headline}
            </h2>

            <p
              className="mt-6 text-base leading-relaxed whitespace-pre-line"
              style={{ color: "var(--site-muted)" }}
            >
              {content.body}
            </p>

            {content.stats && content.stats.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-6">
                {content.stats.map((stat, i) => (
                  <div key={i}>
                    <p
                      className="text-3xl font-bold"
                      style={{
                        fontFamily: "var(--site-heading-font)",
                        color: "var(--site-primary)",
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--site-muted)" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="rounded-2xl overflow-hidden aspect-[4/3]"
            style={{
              backgroundColor: "var(--site-accent)",
              boxShadow: "var(--site-shadow)",
            }}
          >
            {content.image_url ? (
              <img
                src={content.image_url}
                alt="About"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
