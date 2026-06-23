import { type CTASection } from "@/lib/schema/site-config"

interface Props {
  content: CTASection["content"]
}

export function CTACentered({ content }: Props) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-primary)" }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{
            fontFamily: "var(--site-heading-font)",
            color: "var(--site-background)",
          }}
        >
          {content.headline}
        </h2>

        {content.subheadline && (
          <p
            className="mt-4 text-lg opacity-80"
            style={{ color: "var(--site-background)" }}
          >
            {content.subheadline}
          </p>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={content.cta_primary.href}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--site-background)",
              color: "var(--site-primary)",
              borderRadius: "var(--site-radius)",
            }}
          >
            {content.cta_primary.label}
          </a>
          {content.cta_secondary && (
            <a
              href={content.cta_secondary.href}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold border transition-opacity hover:opacity-80"
              style={{
                borderColor: "var(--site-background)",
                color: "var(--site-background)",
                borderRadius: "var(--site-radius)",
              }}
            >
              {content.cta_secondary.label}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
