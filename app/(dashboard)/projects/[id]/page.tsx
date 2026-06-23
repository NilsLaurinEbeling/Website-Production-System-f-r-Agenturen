import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectStatus } from "@/components/dashboard/ProjectStatus"
import { ProjectActions } from "@/components/dashboard/ProjectActions"
import { ProjectWorkspace } from "@/components/dashboard/ProjectWorkspace"
import { STATUS_LABELS, statusTone } from "@/lib/dashboard/status"
import type { Project } from "@/types"

interface Props {
  params: Promise<{ id: string }>
}

const REVISABLE = ["review", "preview", "revising"]

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // RLS scopes this to the user's agency; foreign/missing → null.
  const { data, error } = await supabase
    .from("projects")
    .select("id, client_name, client_email, status, domain, error_message, created_at")
    .eq("id", id)
    .single()

  if (error || !data) notFound()
  const project = data as Pick<
    Project,
    "id" | "client_name" | "client_email" | "status" | "domain" | "error_message" | "created_at"
  >

  // Is there a generated config yet? Drives whether we show the live preview.
  const { count } = await supabase
    .from("site_configs")
    .select("id", { count: "exact", head: true })
    .eq("project_id", id)

  const hasConfig = (count ?? 0) > 0
  const revisable = REVISABLE.includes(project.status)

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-[hsl(var(--muted-foreground))] hover:underline">
          ← Projekte
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              {project.client_name ?? "Unbenanntes Projekt"}
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {project.client_email ?? "Keine E-Mail"}
              {project.domain && (
                <>
                  {" · "}
                  <a
                    href={`https://${project.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {project.domain}
                  </a>
                </>
              )}
            </p>
          </div>
          <Badge variant={statusTone(project.status)}>
            {STATUS_LABELS[project.status]}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProjectStatus status={project.status} />
          {project.status === "failed" && project.error_message && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {project.error_message}
            </p>
          )}
          <ProjectActions projectId={project.id} status={project.status} />
        </CardContent>
      </Card>

      {hasConfig ? (
        <ProjectWorkspace projectId={project.id} revisable={revisable} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-sm text-[hsl(var(--muted-foreground))]">
            {project.status === "failed"
              ? "Die Generierung ist fehlgeschlagen. Bitte den Steckbrief prüfen."
              : "Die KI generiert gerade die Website. Diese Seite aktualisiert sich, sobald ein Entwurf bereit ist."}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export const dynamic = "force-dynamic"
