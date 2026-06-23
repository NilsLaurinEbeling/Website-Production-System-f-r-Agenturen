import { notFound } from "next/navigation"
import { SiteConfigSchema } from "@/lib/schema/site-config"
import { ThemeProvider } from "@/components/renderer/ThemeProvider"
import { SiteRenderer } from "@/components/renderer/SiteRenderer"
import { SEED_CONFIG } from "@/lib/seed-config"

interface Props {
  params: Promise<{ id: string }>
}

async function getSiteConfig(id: string) {
  // Seed: project id "seed" renders the test config without a DB
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
  if (!parsed.success) return null

  return parsed.data
}

export default async function PreviewPage({ params }: Props) {
  const { id } = await params
  const config = await getSiteConfig(id)

  if (!config) notFound()

  return (
    <ThemeProvider theme={config.theme}>
      <SiteRenderer config={config} />
    </ThemeProvider>
  )
}

export const dynamic = "force-dynamic"
