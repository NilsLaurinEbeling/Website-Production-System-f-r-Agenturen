"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Viewport = "desktop" | "mobile"

interface PreviewFrameProps {
  projectId: string
  /** Bump to force the iframe to reload (e.g. after a revision). */
  refreshKey?: number
  className?: string
}

/** Live preview of the project's latest config via the /p/[id] renderer. */
export function PreviewFrame({ projectId, refreshKey = 0, className }: PreviewFrameProps) {
  const [viewport, setViewport] = useState<Viewport>("desktop")
  const [reload, setReload] = useState(0)

  const src = `/p/${projectId}?k=${refreshKey}-${reload}`

  return (
    <div className={cn("flex flex-col rounded-lg border bg-[hsl(var(--background))]", className)}>
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={viewport === "desktop" ? "secondary" : "ghost"}
            onClick={() => setViewport("desktop")}
          >
            Desktop
          </Button>
          <Button
            size="sm"
            variant={viewport === "mobile" ? "secondary" : "ghost"}
            onClick={() => setViewport("mobile")}
          >
            Mobil
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => setReload((r) => r + 1)}>
            Aktualisieren
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <a href={`/p/${projectId}`} target="_blank" rel="noopener noreferrer">
              Öffnen ↗
            </a>
          </Button>
        </div>
      </div>
      <div className="flex justify-center overflow-auto bg-[hsl(var(--muted))] p-3">
        <iframe
          key={src}
          src={src}
          title="Website-Vorschau"
          className={cn(
            "h-[640px] rounded-md border bg-white shadow-sm transition-all",
            viewport === "desktop" ? "w-full" : "w-[390px]"
          )}
        />
      </div>
    </div>
  )
}
