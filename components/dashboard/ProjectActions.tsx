"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProjectStatus } from "@/types"

interface ProjectActionsProps {
  projectId: string
  status: ProjectStatus
}

/**
 * Workflow buttons for a project: release the draft to the client (internal QA
 * gate) and approve it for deployment ("Freigeben", with an optional custom
 * domain).
 */
export function ProjectActions({ projectId, status }: ProjectActionsProps) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [domain, setDomain] = useState("")
  const [showApprove, setShowApprove] = useState(false)

  const canSendPreview = status === "review"
  const canApprove = ["review", "preview", "revising"].includes(status)

  async function call(url: string, body?: Record<string, unknown>) {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? "Aktion fehlgeschlagen.")
        setBusy(false)
        return
      }
      router.refresh()
    } catch {
      setError("Netzwerkfehler. Bitte erneut versuchen.")
      setBusy(false)
    }
  }

  if (!canSendPreview && !canApprove) return null

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {canSendPreview && (
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => call(`/api/projects/${projectId}/send-preview`)}
          >
            Vorschau an Kunden senden
          </Button>
        )}
        {canApprove && (
          <Button disabled={busy} onClick={() => setShowApprove((s) => !s)}>
            Freigeben
          </Button>
        )}
      </div>

      {showApprove && canApprove && (
        <div className="space-y-2 rounded-md border bg-[hsl(var(--background))] p-3">
          <div className="space-y-1.5">
            <Label htmlFor="domain">Custom-Domain (optional)</Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="z. B. kunde.de oder www.kunde.de"
            />
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Wird beim Veröffentlichen automatisch zugewiesen. Leer lassen, um
              vorerst ohne eigene Domain live zu gehen.
            </p>
          </div>
          <Button
            disabled={busy}
            onClick={() =>
              call(
                `/api/projects/${projectId}/approve`,
                domain.trim() ? { domain: domain.trim() } : {}
              )
            }
          >
            {busy ? "Wird freigegeben …" : "Jetzt freigeben & veröffentlichen"}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
