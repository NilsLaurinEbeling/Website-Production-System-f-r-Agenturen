import { cn } from "@/lib/utils"
import {
  STATUS_STEPS,
  STATUS_LABELS,
  statusStepIndex,
} from "@/lib/dashboard/status"
import type { ProjectStatus } from "@/types"

/** Horizontal status timeline for a project's pipeline progress. */
export function ProjectStatus({ status }: { status: ProjectStatus }) {
  const current = statusStepIndex(status)
  const failed = status === "failed"

  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {STATUS_STEPS.map((step, i) => {
        const done = current > i
        const active = current === i && !failed
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                done && "border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]",
                active && "border-[hsl(var(--primary))] font-semibold text-[hsl(var(--primary))]",
                !done && !active && "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
              )}
            >
              {done ? "✓" : i + 1}
            </span>
            <span
              className={cn(
                "text-xs",
                active ? "font-medium text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]"
              )}
            >
              {STATUS_LABELS[step]}
            </span>
            {i < STATUS_STEPS.length - 1 && (
              <span className="mx-1 hidden h-px w-4 bg-[hsl(var(--border))] sm:inline-block" />
            )}
          </li>
        )
      })}
      {failed && (
        <li className="ml-2 text-xs font-medium text-red-600">· Fehler</li>
      )}
    </ol>
  )
}
