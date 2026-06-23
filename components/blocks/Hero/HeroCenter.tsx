import { type HeroSection } from "@/lib/schema/site-config"

interface Props {
  content: HeroSection["content"]
}

export function HeroCenter({ content }: Props) {
  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ backgroundColor: "var(--site-background)" }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {content.badge && (
          <div className="mb-6 inline-flex">
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
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
          style={{
            fontFamily: "var(--site-heading-font)",
            color: "var(--site-text)",
          }}
        >
          {content.headline}
        </h1>

        <p
          className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
          style={{ color: "var(--site-muted)" }}
        >
          {content.subheadline}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
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

        {content.image_url && (
          <div className="mt-16 rounded-xl overflow-hidden" style={{ boxShadow: "var(--site-shadow)" }}>
            <img
              src={content.image_url}
              alt="Hero"
              className="w-full object-cover max-h-96"
            />
          </div>
        )}
      </div>
    </section>
  )
}
