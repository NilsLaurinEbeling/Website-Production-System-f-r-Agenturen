import { SiteConfigSchema, type SiteConfig } from "@/lib/schema/site-config"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Resolve the published SiteConfig for a live custom domain.
 *
 * Projects are owner-scoped under RLS, so domain resolution uses the service
 * role. Only `published` configs are returned — drafts never reach a live host.
 * Hostnames are matched case-insensitively and `www.` is treated as equivalent
 * to the apex so a project registered as `kunde.de` also answers `www.kunde.de`.
 */
export async function getPublishedConfigByDomain(
  host: string
): Promise<SiteConfig | null> {
  const normalized = host.toLowerCase().split(":")[0]
  const candidates = normalized.startsWith("www.")
    ? [normalized, normalized.slice(4)]
    : [normalized, `www.${normalized}`]

  const admin = createAdminClient()

  const { data: project } = await admin
    .from("projects")
    .select("id")
    .in("domain", candidates)
    .limit(1)
    .single()

  if (!project) return null

  const { data: configRow } = await admin
    .from("site_configs")
    .select("config")
    .eq("project_id", project.id)
    .eq("status", "published")
    .order("version", { ascending: false })
    .limit(1)
    .single()

  if (!configRow) return null

  const parsed = SiteConfigSchema.safeParse(configRow.config)
  return parsed.success ? parsed.data : null
}
