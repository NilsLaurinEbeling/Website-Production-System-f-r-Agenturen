"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * Shows the agency's shareable client-intake link (`/start/[slug]`) with a copy
 * button. Clients who open it can request a website without an account; the
 * resulting project appears in the agency's dashboard.
 */
export function IntakeLinkCard({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable — the input is selectable as a fallback.
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Kunden-Einstiegslink</CardTitle>
        <CardDescription>
          Teile diesen Link mit deinen Kunden. Sie füllen einen kurzen Steckbrief
          aus, und das Projekt erscheint automatisch in deiner Projektliste.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input readOnly value={url} onFocus={(e) => e.currentTarget.select()} />
          <Button type="button" variant="outline" onClick={copy}>
            {copied ? "Kopiert ✓" : "Kopieren"}
          </Button>
          <Button asChild type="button" variant="ghost">
            <a href={url} target="_blank" rel="noopener noreferrer">
              Öffnen
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
