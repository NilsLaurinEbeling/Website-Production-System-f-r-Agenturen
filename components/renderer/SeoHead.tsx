import { type SiteConfig } from "@/lib/schema/site-config"

interface SeoHeadProps {
  config: SiteConfig
}

export function buildJsonLd(config: SiteConfig): object | null {
  const lb = config.seo?.local_business
  if (!lb) return null

  return {
    "@context": "https://schema.org",
    "@type": lb.schema_type,
    name: lb.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: lb.address,
      addressLocality: lb.city,
      postalCode: lb.zip,
      addressCountry: lb.country,
    },
    ...(lb.phone     && { telephone: lb.phone }),
    ...(lb.email     && { email: lb.email }),
    ...(lb.price_range && { priceRange: lb.price_range }),
    ...(lb.latitude && lb.longitude && {
      geo: {
        "@type": "GeoCoordinates",
        latitude:  lb.latitude,
        longitude: lb.longitude,
      },
    }),
    ...(lb.hours && lb.hours.length > 0 && {
      openingHours: lb.hours.map(h => `${h.days} ${h.open}-${h.close}`),
    }),
    ...(config.seo?.social_profiles && {
      sameAs: config.seo.social_profiles.map(p => p.url),
    }),
  }
}

export function SeoScripts({ config }: SeoHeadProps) {
  const jsonLd = buildJsonLd(config)
  if (!jsonLd) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
