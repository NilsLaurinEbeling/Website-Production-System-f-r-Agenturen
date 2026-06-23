import { type HeroSection } from "@/lib/schema/site-config"

interface Props {
  content: HeroSection["content"]
}

export function HeroSplit({ content }: Props) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-background)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {content.badge && (
              <div className="mb-4 inline-flex">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase"
                  style={{
                    backgroundColor: "var(--site-accent)",
                    color: "var(--site-primary)",
                  }}
                >
                  {content.badge}
                </span>
              </div>
            )}

            <h1
              className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]"
              style={{
                fontFamily: "var(--site-heading-font)",
                color: "var(--site-text)",
              }}
            >
              {content.headline}
            </h1>

            <p
              className="mt-6 text-lg leading-relaxed"
              style={{ color: "var(--site-muted)" }}
            >
              {content.subheadline}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href={content.cta_primary.href}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--site-primary)",
                  color: "var(--site-background)",
                  borderRadius: "var(--site-radius)",
                  boxShadow: "var(--site-shadow)",
                }}
              >
                {content.cta_primary.label}
              </a>
              {content.cta_secondary && (
                <a
                  href={content.cta_secondary.href}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold border transition-opacity hover:opacity-70"
                  style={{
                    borderColor: "var(--site-muted)",
                    color: "var(--site-text)",
                    borderRadius: "var(--site-radius)",
                  }}
                >
                  {content.cta_secondary.label}
                </a>
              )}
            </div>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ boxShadow: "var(--site-shadow)" }}
          >
            {content.image_url ? (
              <img
                src={content.image_url}
                alt="Hero"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            ) : (
              <div
                className="aspect-[4/3] flex items-center justify-center"
                style={{ backgroundColor: "var(--site-accent)" }}
              >
                <span
                  className="text-4xl font-bold opacity-20"
                  style={{ fontFamily: "var(--site-heading-font)" }}
                >
                  Image
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
