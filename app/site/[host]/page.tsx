import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/renderer/ThemeProvider"
import { SiteRenderer } from "@/components/renderer/SiteRenderer"
import { SeoScripts } from "@/components/renderer/SeoHead"
import { getPublishedConfigByDomain } from "@/lib/pipeline/published"

interface Props {
  params: Promise<{ host: string }>
}

/**
 * Live customer site. Middleware rewrites custom-domain requests to
 * `/site/[host]`; this renders the project's *published* config (never a
 * draft). Same renderer as the preview at `/p/[id]`, different config status.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { host } = await params
  const config = await getPublishedConfigByDomain(decodeURIComponent(host))
  if (!config) return {}

  const { title, description, og_image_url, favicon_emoji } = config.metadata
  return {
    title,
    description,
    ...(favicon_emoji && {
      icons: {
        icon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${favicon_emoji}</text></svg>`,
      },
    }),
    openGraph: {
      title,
      description,
      ...(og_image_url && { images: [{ url: og_image_url }] }),
    },
    ...(config.seo?.noindex && { robots: { index: false, follow: false } }),
  }
}

export default async function LiveSitePage({ params }: Props) {
  const { host } = await params
  const config = await getPublishedConfigByDomain(decodeURIComponent(host))

  if (!config) notFound()

  return (
    <>
      <SeoScripts config={config} />
      <ThemeProvider theme={config.theme}>
        <SiteRenderer config={config} />
      </ThemeProvider>
    </>
  )
}

export const dynamic = "force-dynamic"
