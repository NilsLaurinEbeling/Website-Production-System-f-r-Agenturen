"use client"

import { useState } from "react"
import { PreviewFrame } from "@/components/dashboard/PreviewFrame"
import { RevisionChat } from "@/components/dashboard/RevisionChat"

interface ProjectWorkspaceProps {
  projectId: string
  /** Whether the revision chat is available (reviewable statuses only). */
  revisable: boolean
}

/**
 * Side-by-side live preview + revision chat. A successful revision bumps the
 * preview's refresh key so the iframe reloads the new version.
 */
export function ProjectWorkspace({ projectId, revisable }: ProjectWorkspaceProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <PreviewFrame projectId={projectId} refreshKey={refreshKey} />
      {revisable ? (
        <RevisionChat
          projectId={projectId}
          onRevised={() => setRefreshKey((k) => k + 1)}
          className="h-[696px]"
        />
      ) : (
        <div className="flex items-center justify-center rounded-lg border bg-[hsl(var(--background))] p-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
          Änderungen sind erst möglich, sobald ein Entwurf generiert wurde.
        </div>
      )}
    </div>
  )
}
