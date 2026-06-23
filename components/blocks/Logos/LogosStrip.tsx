import { type LogosSection } from "@/lib/schema/site-config"

interface Props {
  content: LogosSection["content"]
}

export function LogosStrip({ content }: Props) {
  return (
    <section className="py-12 sm:py-16 border-y" style={{ backgroundColor: "var(--site-background)", borderColor: "var(--site-muted)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {content.headline && (
          <p className="text-center text-sm font-semibold uppercase tracking-widest mb-8" style={{ color: "var(--site-muted)" }}>
            {content.headline}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {content.logos.map((logo, i) => {
            const img = (
              <img
                src={logo.image_url}
                alt={logo.name}
                className="h-8 w-auto object-contain opacity-50 hover:opacity-80 transition-opacity grayscale"
              />
            )
            return logo.url ? (
              <a key={i} href={logo.url} target="_blank" rel="noopener noreferrer">{img}</a>
            ) : (
              <div key={i}>{img}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
