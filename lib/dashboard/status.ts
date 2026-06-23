import type { ProjectStatus } from "@/types"

/** Ordered pipeline stages shown in the status timeline (excludes `failed`). */
export const STATUS_STEPS: ProjectStatus[] = [
  "intake",
  "planning",
  "research",
  "generating",
  "review",
  "preview",
  "approved",
  "deploying",
  "live",
]

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  intake: "Intake",
  planning: "Planung",
  research: "Recherche",
  generating: "Generierung",
  review: "Interne Prüfung",
  preview: "Kundenvorschau",
  revising: "Überarbeitung",
  approved: "Freigegeben",
  deploying: "Wird veröffentlicht",
  live: "Live",
  failed: "Fehler",
}

type Tone = "default" | "secondary" | "outline" | "destructive"

export function statusTone(status: ProjectStatus): Tone {
  if (status === "failed") return "destructive"
  if (status === "live") return "default"
  if (status === "preview" || status === "review") return "secondary"
  return "outline"
}

/** Index of a status in the timeline; -1 for `revising`/`failed`. */
export function statusStepIndex(status: ProjectStatus): number {
  if (status === "revising") return STATUS_STEPS.indexOf("preview")
  return STATUS_STEPS.indexOf(status)
}
