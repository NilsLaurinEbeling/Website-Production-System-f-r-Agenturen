import { type PricingSection } from "@/lib/schema/site-config"

interface Props {
  content: PricingSection["content"]
}

export function PricingCards({ content }: Props) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-background)" }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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

        <div className={`grid gap-8 ${content.plans.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {content.plans.map((plan, i) => (
            <div
              key={i}
              className="relative flex flex-col p-6"
              style={{
                backgroundColor: plan.highlighted ? "var(--site-primary)" : "var(--site-background)",
                color: plan.highlighted ? "var(--site-background)" : "var(--site-text)",
                borderRadius: "var(--site-radius)",
                boxShadow: plan.highlighted ? "var(--site-shadow)" : undefined,
                border: plan.highlighted ? "none" : "1px solid var(--site-muted)",
              }}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full"
                  style={{
                    backgroundColor: "var(--site-accent)",
                    color: "var(--site-primary)",
                  }}
                >
                  Most popular
                </div>
              )}

              <h3
                className="text-lg font-bold"
                style={{ fontFamily: "var(--site-heading-font)" }}
              >
                {plan.name}
              </h3>

              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span
                      className="mt-0.5 font-bold"
                      style={{ color: plan.highlighted ? "var(--site-accent)" : "var(--site-primary)" }}
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={plan.cta_href}
                className="block text-center py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: plan.highlighted ? "var(--site-background)" : "var(--site-primary)",
                  color: plan.highlighted ? "var(--site-primary)" : "var(--site-background)",
                  borderRadius: "var(--site-radius)",
                }}
              >
                {plan.cta_label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
