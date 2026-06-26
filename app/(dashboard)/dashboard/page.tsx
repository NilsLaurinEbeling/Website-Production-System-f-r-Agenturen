import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getAgencyContext, canManage } from "@/lib/agency/queries"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { STATUS_LABELS, statusTone } from "@/lib/dashboard/status"
import type { Project } from "@/types"

export default async function ProjectsPage() {
  const ctx = await getAgencyContext()
  const supabase = await createClient()

  // RLS scopes this to the user's agency.
  const { data: projects } = await supabase
    .from("projects")
    .select("id, client_name, status, domain, created_at")
    .order("created_at", { ascending: false })

  const rows = (projects ?? []) as Pick<
    Project,
    "id" | "client_name" | "status" | "domain" | "created_at"
  >[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projekte</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Alle Kundenwebsites deiner Agentur.
          </p>
        </div>
        {ctx && canManage(ctx.role) && (
          <Button asChild>
            <Link href="/projects/new">Neues Projekt</Link>
          </Button>
        )}
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Noch keine Projekte.{" "}
            {ctx && canManage(ctx.role) ? (
              <Link href="/projects/new" className="font-medium text-[hsl(var(--foreground))] underline">
                Erstelle dein erstes Projekt.
              </Link>
            ) : (
              "Ein Administrator kann ein Projekt anlegen."
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {rows.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`}>
              <Card className="transition-colors hover:bg-[hsl(var(--accent))]">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{p.client_name ?? "Unbenanntes Projekt"}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {p.domain ?? "Keine Domain"} ·{" "}
                      {new Date(p.created_at).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                  <Badge variant={statusTone(p.status)}>{STATUS_LABELS[p.status]}</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export const dynamic = "force-dynamic"
