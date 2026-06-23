import { createAdminClient } from "@/lib/supabase/admin"

export type ProjectStatus =
  | "intake" | "planning" | "research" | "generating"
  | "review" | "preview" | "revising" | "approved"
  | "deploying" | "live" | "failed"

export interface ProjectRow {
  id: string
  status: ProjectStatus
  domain: string | null
  error_message: string | null
}

/** Statuses that are at or beyond the given step's expected entry status. */
const STATUS_ORDER: ProjectStatus[] = [
  "intake", "planning", "research", "generating",
  "review", "preview", "revising", "approved",
  "deploying", "live",
]

export function isAtOrPast(status: ProjectStatus, target: ProjectStatus): boolean {
  if (status === "failed") return false
  return STATUS_ORDER.indexOf(status) >= STATUS_ORDER.indexOf(target)
}

export async function loadProject(projectId: string): Promise<ProjectRow | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("projects")
    .select("id, status, domain, error_message")
    .eq("id", projectId)
    .single()

  if (error || !data) return null
  return data as ProjectRow
}

export async function setProjectStatus(
  projectId: string,
  status: ProjectStatus,
  errorMessage?: string
): Promise<void> {
  const supabase = createAdminClient()
  await supabase
    .from("projects")
    .update({ status, error_message: errorMessage ?? null })
    .eq("id", projectId)
}

export async function failProject(projectId: string, message: string): Promise<void> {
  await setProjectStatus(projectId, "failed", message)
}
