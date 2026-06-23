import { type TestimonialsSection } from "@/lib/schema/site-config"

interface Props {
  content: TestimonialsSection["content"]
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{ color: i < rating ? "var(--site-accent)" : "var(--site-muted)" }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export function TestimonialsCards({ content }: Props) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-accent)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {content.headline && (
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12"
            style={{
              fontFamily: "var(--site-heading-font)",
              color: "var(--site-text)",
            }}
          >
            {content.headline}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((item, i) => (
            <div
              key={i}
              className="p-6 flex flex-col gap-4"
              style={{
                backgroundColor: "var(--site-background)",
                borderRadius: "var(--site-radius)",
                boxShadow: "var(--site-shadow)",
              }}
            >
              {item.rating !== undefined && <Stars rating={item.rating} />}

              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: "var(--site-text)" }}
              >
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "var(--site-muted)" }}>
                {item.avatar_url ? (
                  <img
                    src={item.avatar_url}
                    alt={item.author}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: "var(--site-primary)",
                      color: "var(--site-background)",
                    }}
                  >
                    {item.author[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--site-text)" }}>
                    {item.author}
                  </p>
                  {item.role && (
                    <p className="text-xs" style={{ color: "var(--site-muted)" }}>
                      {item.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
