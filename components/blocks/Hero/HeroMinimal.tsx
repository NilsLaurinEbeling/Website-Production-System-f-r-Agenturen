import { type HeroSection } from "@/lib/schema/site-config"

interface Props {
  content: HeroSection["content"]
}

export function HeroMinimal({ content }: Props) {
  return (
    <section
      className="py-20 sm:py-28 border-b"
      style={{
        backgroundColor: "var(--site-background)",
        borderColor: "var(--site-muted)",
      }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          style={{
            fontFamily: "var(--site-heading-font)",
            color: "var(--site-text)",
          }}
        >
          {content.headline}
        </h1>

        <p
          className="mt-6 text-xl leading-relaxed"
          style={{ color: "var(--site-muted)" }}
        >
          {content.subheadline}
        </p>

        <div className="mt-8">
          <a
            href={content.cta_primary.href}
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--site-primary)",
              color: "var(--site-background)",
              borderRadius: "var(--site-radius)",
            }}
          >
            {content.cta_primary.label}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
