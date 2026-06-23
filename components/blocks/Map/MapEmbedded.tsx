import { type MapSection } from "@/lib/schema/site-config"

interface Props {
  content: MapSection["content"]
}

export function MapEmbedded({ content }: Props) {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "var(--site-background)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {content.headline && (
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10"
            style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
            {content.headline}
          </h2>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="space-y-4">
            {content.business_name && (
              <h3 className="font-semibold text-lg"
                style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
                {content.business_name}
              </h3>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--site-muted)" }}>Adresse</p>
              <p className="text-sm" style={{ color: "var(--site-text)" }}>{content.address}</p>
            </div>
            {content.phone && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--site-muted)" }}>Telefon</p>
                <a href={`tel:${content.phone}`} className="text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--site-primary)" }}>
                  {content.phone}
                </a>
              </div>
            )}
            {content.hours && content.hours.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--site-muted)" }}>Öffnungszeiten</p>
                <div className="space-y-1">
                  {content.hours.map((h, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span style={{ color: "var(--site-text)" }}>{h.days}</span>
                      <span style={{ color: "var(--site-muted)" }}>{h.open} – {h.close}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 overflow-hidden" style={{ borderRadius: "var(--site-radius)", boxShadow: "var(--site-shadow)" }}>
            <iframe
              src={content.embed_url}
              width="100%"
              height="380"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={content.business_name ?? "Standort"}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
