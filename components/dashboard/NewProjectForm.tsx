"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TONES = [
  { value: "professional", label: "Professionell" },
  { value: "friendly", label: "Freundlich" },
  { value: "bold", label: "Mutig" },
] as const

export function NewProjectForm() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Project
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")

  // Brief
  const [businessName, setBusinessName] = useState("")
  const [industry, setIndustry] = useState("")
  const [tagline, setTagline] = useState("")
  const [description, setDescription] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [tone, setTone] = useState<(typeof TONES)[number]["value"]>("professional")
  const [colorHint, setColorHint] = useState("")
  const [websiteGoal, setWebsiteGoal] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [address, setAddress] = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    try {
      // 1. Create the project shell.
      const createRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: clientName,
          client_email: clientEmail || undefined,
        }),
      })
      const created = await createRes.json().catch(() => ({}))
      if (!createRes.ok) {
        setError(created.error ?? "Projekt konnte nicht erstellt werden.")
        setBusy(false)
        return
      }

      // 2. Submit the brief → starts the pipeline.
      const brief = {
        business_name: businessName,
        industry,
        tagline: tagline || undefined,
        description,
        target_audience: targetAudience || undefined,
        tone,
        primary_color_hint: colorHint || undefined,
        website_goal: websiteGoal || undefined,
        contact_email: contactEmail || undefined,
        contact_phone: contactPhone || undefined,
        address: address || undefined,
      }
      const briefRes = await fetch(`/api/projects/${created.id}/brief`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      })
      const briefData = await briefRes.json().catch(() => ({}))
      if (!briefRes.ok) {
        setError(
          briefData.error
            ? `Steckbrief ungültig: ${briefData.error}`
            : "Steckbrief konnte nicht gespeichert werden."
        )
        // The project exists; let the user fix and view it.
        router.push(`/projects/${created.id}`)
        return
      }

      router.push(`/projects/${created.id}`)
      router.refresh()
    } catch {
      setError("Netzwerkfehler. Bitte erneut versuchen.")
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kunde</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="client_name">Kundenname *</Label>
            <Input
              id="client_name"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client_email">Kunden-E-Mail</Label>
            <Input
              id="client_email"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Steckbrief</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="business_name">Firmenname *</Label>
            <Input
              id="business_name"
              required
              maxLength={80}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="industry">Branche *</Label>
            <Input
              id="industry"
              required
              maxLength={80}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="z. B. Zahnarztpraxis"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="tagline">Slogan</Label>
            <Input
              id="tagline"
              maxLength={120}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Beschreibung * (mind. 20 Zeichen)</Label>
            <Textarea
              id="description"
              required
              minLength={20}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Was bietet das Unternehmen an? Was macht es besonders?"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="target_audience">Zielgruppe</Label>
            <Input
              id="target_audience"
              maxLength={200}
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tone">Tonalität *</Label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value as typeof tone)}
              className="flex h-9 w-full rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--ring))]"
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="color_hint">Farbwunsch</Label>
            <Input
              id="color_hint"
              maxLength={50}
              value={colorHint}
              onChange={(e) => setColorHint(e.target.value)}
              placeholder="z. B. dunkelblau, elegant"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="website_goal">Ziel der Website</Label>
            <Input
              id="website_goal"
              maxLength={300}
              value={websiteGoal}
              onChange={(e) => setWebsiteGoal(e.target.value)}
              placeholder="z. B. mehr Terminanfragen"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact_email">Kontakt-E-Mail</Label>
            <Input
              id="contact_email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact_phone">Telefon</Label>
            <Input
              id="contact_phone"
              maxLength={30}
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              maxLength={200}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? "Wird erstellt …" : "Projekt erstellen & Pipeline starten"}
        </Button>
      </div>
    </form>
  )
}
