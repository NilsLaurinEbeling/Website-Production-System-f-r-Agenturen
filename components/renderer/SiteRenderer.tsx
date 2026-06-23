import { type ComponentType } from "react"
import { type AnySection, type SiteConfig } from "@/lib/schema/site-config"

import { HeroCenter }           from "@/components/blocks/Hero/HeroCenter"
import { HeroSplit }             from "@/components/blocks/Hero/HeroSplit"
import { HeroMinimal }           from "@/components/blocks/Hero/HeroMinimal"
import { FeaturesGrid }          from "@/components/blocks/Features/FeaturesGrid"
import { FeaturesAlternating }   from "@/components/blocks/Features/FeaturesAlternating"
import { TestimonialsCards }     from "@/components/blocks/Testimonials"
import { PricingCards }          from "@/components/blocks/Pricing"
import { AboutSplit }            from "@/components/blocks/About"
import { CTACentered }           from "@/components/blocks/CTA"
import { FooterMinimal }         from "@/components/blocks/Footer"
import { NavigationBar }         from "@/components/blocks/Navigation"
import { FAQAccordion }          from "@/components/blocks/FAQ/FAQAccordion"
import { FAQTwoColumn }          from "@/components/blocks/FAQ/FAQTwoColumn"
import { TeamGrid }              from "@/components/blocks/Team/TeamGrid"
import { TeamList }              from "@/components/blocks/Team/TeamList"
import { GalleryGrid }           from "@/components/blocks/Gallery/GalleryGrid"
import { GalleryMasonry }        from "@/components/blocks/Gallery/GalleryMasonry"
import { ContactFormSimple }     from "@/components/blocks/ContactForm/ContactFormSimple"
import { ContactFormSplit }      from "@/components/blocks/ContactForm/ContactFormSplit"
import { CaseStudiesCards }      from "@/components/blocks/CaseStudies/CaseStudiesCards"
import { LogosStrip }            from "@/components/blocks/Logos/LogosStrip"
import { TimelineVertical }      from "@/components/blocks/Timeline/TimelineVertical"
import { ProcessSteps }          from "@/components/blocks/Process/ProcessSteps"
import { ServicesCards }         from "@/components/blocks/Services/ServicesCards"
import { BlogPreviewCards }      from "@/components/blocks/BlogPreview/BlogPreviewCards"
import { MapEmbedded }           from "@/components/blocks/Map/MapEmbedded"
import { StatsGrid }             from "@/components/blocks/Stats/StatsGrid"
import { StatsCentered }         from "@/components/blocks/Stats/StatsCentered"
import { LeadMagnetCentered }    from "@/components/blocks/LeadMagnet/LeadMagnetCentered"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BLOCK_REGISTRY: Record<string, Record<string, ComponentType<any>>> = {
  hero:            { center: HeroCenter, split: HeroSplit, minimal: HeroMinimal,
                     editorial: HeroCenter, saas: HeroCenter, luxury: HeroCenter,
                     agency: HeroCenter, "local-business": HeroSplit },
  features:        { grid: FeaturesGrid, alternating: FeaturesAlternating,
                     tabs: FeaturesGrid, cards: FeaturesGrid, checklist: FeaturesGrid },
  testimonials:    { cards: TestimonialsCards, carousel: TestimonialsCards,
                     wall: TestimonialsCards, quote: TestimonialsCards },
  pricing:         { cards: PricingCards, table: PricingCards, list: PricingCards },
  about:           { text: AboutSplit, split: AboutSplit },
  cta:             { centered: CTACentered, banner: CTACentered, newsletter: CTACentered },
  footer:          { minimal: FooterMinimal, columns: FooterMinimal, dark: FooterMinimal },
  faq:             { accordion: FAQAccordion, "two-column": FAQTwoColumn },
  team:            { grid: TeamGrid, list: TeamList, carousel: TeamGrid },
  gallery:         { masonry: GalleryMasonry, grid: GalleryGrid, carousel: GalleryGrid },
  "contact-form":  { simple: ContactFormSimple, split: ContactFormSplit },
  "case-studies":  { cards: CaseStudiesCards, featured: CaseStudiesCards },
  logos:           { strip: LogosStrip, grid: LogosStrip },
  timeline:        { vertical: TimelineVertical, horizontal: TimelineVertical },
  process:         { steps: ProcessSteps, numbered: ProcessSteps },
  services:        { cards: ServicesCards, list: ServicesCards, grid: ServicesCards },
  "blog-preview":  { cards: BlogPreviewCards, featured: BlogPreviewCards },
  map:             { embedded: MapEmbedded },
  stats:           { centered: StatsCentered, grid: StatsGrid, banner: StatsGrid },
  "lead-magnet":   { centered: LeadMagnetCentered, split: LeadMagnetCentered },
}

interface SiteRendererProps {
  config: SiteConfig
}

export function SiteRenderer({ config }: SiteRendererProps) {
  const sortedSections = [...config.sections]
    .filter(s => s.enabled)
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
      {sortedSections.map(section => {
        const Block = BLOCK_REGISTRY[section.type]?.[section.variant]
        if (!Block) {
          return (
            <div key={section.id} className="p-8 text-center text-sm opacity-40">
              Unknown block: {section.type}/{section.variant}
            </div>
          )
        }
        return (
          <Block
            key={section.id}
            content={(section as AnySection & { content: unknown }).content}
          />
        )
      })}
    </div>
  )
}
