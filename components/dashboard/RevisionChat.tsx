"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AppliedIntent {
  intent: { type: string; [k: string]: unknown }
  ok: boolean
  note?: string
}

interface ChatMessage {
  id: string
  role: "user" | "system"
  text: string
  applied?: AppliedIntent[]
  pending?: boolean
  error?: boolean
}

interface RevisionChatProps {
  projectId: string
  /** Called with the new version number after a successful revision. */
  onRevised?: (version: number) => void
  className?: string
}

/** Human-readable label for an intent, for the activity log. */
function describeIntent(intent: AppliedIntent["intent"]): string {
  switch (intent.type) {
    case "theme.set_color":
      return `Farbe „${intent.token}“ → ${intent.value}`
    case "theme.apply_preset":
      return `Design-Stil „${intent.preset}“ angewendet`
    case "theme.set_font":
      return `Schrift (${intent.role}) → ${intent.value}`
    case "theme.set_radius":
      return `Ecken-Radius → ${intent.value}`
    case "section.enable":
      return `Abschnitt „${intent.section_type}“ eingeblendet`
    case "section.disable":
      return `Abschnitt „${intent.section_type}“ ausgeblendet`
    case "section.reorder":
      return `Abschnitt verschoben (${intent.from_index} → ${intent.to_index})`
    case "section.change_variant":
      return `Variante geändert → ${intent.variant}`
    case "section.update_content":
      return `Inhalt aktualisiert (${intent.path})`
    case "section.add":
      return `Abschnitt „${intent.section_type}“ hinzugefügt`
    case "section.regenerate_copy":
      return `Texte neu generiert`
    case "metadata.update":
      return `Metadaten „${intent.field}“ aktualisiert`
    default:
      return intent.type
  }
}

export function RevisionChat({ projectId, onRevised, className }: RevisionChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || busy) return

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text }
    const pendingMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "system",
      text: "Änderung wird angewendet …",
      pending: true,
    }
    setMessages((m) => [...m, userMsg, pendingMsg])
    setInput("")
    setBusy(true)

    try {
      const res = await fetch(`/api/projects/${projectId}/revise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json().catch(() => ({}))

      let reply: ChatMessage
      if (res.ok && data.ok) {
        reply = {
          id: pendingMsg.id,
          role: "system",
          text: `Erledigt – neue Version v${data.version} erstellt.`,
          applied: data.applied,
        }
        onRevised?.(data.version)
      } else if (data.reason === "no_intents") {
        reply = { id: pendingMsg.id, role: "system", text: data.message }
      } else if (data.reason === "validation_failed") {
        reply = {
          id: pendingMsg.id,
          role: "system",
          error: true,
          text:
            "Die Änderung hätte die Konfiguration ungültig gemacht und wurde " +
            "verworfen.",
        }
      } else if (data.reason === "nothing_applied") {
        reply = {
          id: pendingMsg.id,
          role: "system",
          error: true,
          text: "Keine der erkannten Änderungen konnte angewendet werden.",
          applied: data.applied,
        }
      } else {
        reply = {
          id: pendingMsg.id,
          role: "system",
          error: true,
          text: data.error ?? "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
        }
      }

      setMessages((m) => m.map((msg) => (msg.id === pendingMsg.id ? reply : msg)))
    } catch {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === pendingMsg.id
            ? {
                ...msg,
                pending: false,
                error: true,
                text: "Netzwerkfehler. Bitte erneut versuchen.",
              }
            : msg
        )
      )
    } finally {
      setBusy(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className={cn("flex flex-col rounded-lg border bg-white", className)}>
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Änderungen</h3>
        <p className="text-xs text-gray-500">
          Beschreibe deine Wünsche in eigenen Worten – z. B. „Mach die Primärfarbe
          dunkelblau“ oder „Füge einen FAQ-Bereich hinzu“.
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">
            Noch keine Änderungen. Stelle deine erste Anfrage unten.
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                msg.role === "user"
                  ? "bg-gray-900 text-white"
                  : msg.error
                    ? "bg-red-50 text-red-700"
                    : "bg-gray-100 text-gray-800",
                msg.pending && "animate-pulse"
              )}
            >
              <p>{msg.text}</p>
              {msg.applied && msg.applied.length > 0 && (
                <ul className="mt-2 space-y-1 border-t border-black/5 pt-2 text-xs">
                  {msg.applied.map((a, i) => (
                    <li
                      key={i}
                      className={cn(
                        "flex items-start gap-1.5",
                        !a.ok && "text-gray-400 line-through"
                      )}
                    >
                      <span>{a.ok ? "✓" : "✗"}</span>
                      <span>{describeIntent(a.intent)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy}
            rows={2}
            placeholder="Änderung beschreiben …"
            className="flex-1 resize-none rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50"
          />
          <Button onClick={send} disabled={busy || !input.trim()}>
            {busy ? "…" : "Senden"}
          </Button>
        </div>
      </div>
    </div>
  )
}
