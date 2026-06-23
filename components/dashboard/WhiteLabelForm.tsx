"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface WhiteLabelValues {
  agency_name: string
  logo_url: string
  custom_domain: string
  from_email: string
  reply_to_email: string
}

export function WhiteLabelForm({
  initial,
  disabled = false,
}: {
  initial: WhiteLabelValues
  disabled?: boolean
}) {
  const router = useRouter()
  const [values, setValues] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function update<K extends keyof WhiteLabelValues>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }))
    setSaved(false)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setSaved(false)

    const res = await fetch("/api/agency/white-label", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error ?? "Speichern fehlgeschlagen.")
      setBusy(false)
      return
    }
    setSaved(true)
    setBusy(false)
    router.refresh()
  }

  const fields: Array<{ key: keyof WhiteLabelValues; label: string; placeholder?: string; type?: string }> = [
    { key: "agency_name", label: "Agenturname" },
    { key: "logo_url", label: "Logo-URL", placeholder: "https://…/logo.svg" },
    { key: "custom_domain", label: "Portal-Domain", placeholder: "portal.agentur.de" },
    { key: "from_email", label: "Absender-E-Mail", placeholder: "no-reply@agentur.de", type: "email" },
    { key: "reply_to_email", label: "Antwort-E-Mail", placeholder: "kontakt@agentur.de", type: "email" },
  ]

  return (
    <form onSubmit={submit} className="space-y-4">
      {fields.map((f) => (
        <div key={f.key} className="space-y-1.5">
          <Label htmlFor={f.key}>{f.label}</Label>
          <Input
            id={f.key}
            type={f.type ?? "text"}
            value={values[f.key]}
            placeholder={f.placeholder}
            disabled={disabled}
            onChange={(e) => update(f.key, e.target.value)}
          />
        </div>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-emerald-700">Gespeichert.</p>}

      {!disabled && (
        <Button type="submit" disabled={busy}>
          {busy ? "Speichert …" : "Speichern"}
        </Button>
      )}
    </form>
  )
}
