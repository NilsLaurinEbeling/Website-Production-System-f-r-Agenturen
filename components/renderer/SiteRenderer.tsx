import { type ComponentType } from "react"
import { type AnySection, type SiteConfig } from "@/lib/schema/site-config"

import { HeroCenter }          from "@/components/blocks/Hero/HeroCenter"
import { HeroSplit }            from "@/components/blocks/Hero/HeroSplit"
import { HeroMinimal }          from "@/components/blocks/Hero/HeroMinimal"
import { FeaturesGrid }         from "@/components/blocks/Features/FeaturesGrid"
import { FeaturesAlternating }  from "@/components/blocks/Features/FeaturesAlternating"
import { TestimonialsCards }    from "@/components/blocks/Testimonials"
import { PricingCards }         from "@/components/blocks/Pricing"
import { AboutSplit }           from "@/components/blocks/About"
import { CTACentered }          from "@/components/blocks/CTA"
import { FooterMinimal }        from "@/components/blocks/Footer"
import { NavigationBar }        from "@/components/blocks/Navigation"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BLOCK_REGISTRY: Record<string, Record<string, ComponentType<any>>> = {
  hero:         { center: HeroCenter, split: HeroSplit, minimal: HeroMinimal },
  features:     { grid: FeaturesGrid, alternating: FeaturesAlternating },
  testimonials: { cards: TestimonialsCards, carousel: TestimonialsCards },
  pricing:      { cards: PricingCards, table: PricingCards },
  about:        { text: AboutSplit, split: AboutSplit },
  cta:          { centered: CTACentered, banner: CTACentered },
  footer:       { minimal: FooterMinimal, columns: FooterMinimal },
}

interface SiteRendererProps {
  config: SiteConfig
}

export function SiteRenderer({ config }: SiteRendererProps) {
  const sortedSections = [...config.sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <div
      style={{
        backgroundColor: "var(--site-background)",
        color: "var(--site-text)",
        fontFamily: "var(--site-body-font)",
      }}
    >
      <NavigationBar nav={config.navigation} />
      {sortedSections.map((section) => {
        const Block = BLOCK_REGISTRY[section.type]?.[section.variant]
        if (!Block) {
          return (
            <div key={section.id} className="p-8 text-center text-sm opacity-40">
              Unknown block: {section.type}/{section.variant}
            </div>
          )
        }
        return <Block key={section.id} content={(section as AnySection & { content: unknown }).content} />
      })}
    </div>
  )
}
