import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteConfigSchema } from "@/lib/schema/site-config"
import { ThemeProvider } from "@/components/renderer/ThemeProvider"
import { SiteRenderer } from "@/components/renderer/SiteRenderer"
import { SeoScripts } from "@/components/renderer/SeoHead"
import { SEED_CONFIG } from "@/lib/seed-config"

interface Props {
  params: Promise<{ id: string }>
}

async function getSiteConfig(id: string) {
  if (id === "seed") return SEED_CONFIG

  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("site_configs")
    .select("config")
    .eq("project_id", id)
    .eq("status", "draft")
    .order("version", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null

  const parsed = SiteConfigSchema.safeParse(data.config)
  return parsed.success ? parsed.data : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const config = await getSiteConfig(id)
  if (!config) return {}

  const { title, description, og_image_url, favicon_emoji } = config.metadata
  return {
    title,
    description,
    ...(favicon_emoji && { icons: { icon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${favicon_emoji}</text></svg>` } }),
    openGraph: {
      title,
      description,
      ...(og_image_url && { images: [{ url: og_image_url }] }),
    },
    ...(config.seo?.noindex && { robots: { index: false, follow: false } }),
  }
}

export default async function PreviewPage({ params }: Props) {
  const { id } = await params
  const config = await getSiteConfig(id)

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
