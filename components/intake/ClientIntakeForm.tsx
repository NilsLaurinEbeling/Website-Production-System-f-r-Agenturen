"use client"

import { useState } from "react"
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

interface Props {
  slug: string
  agencyName: string
}

export function ClientIntakeForm({ slug, agencyName }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  // Contact
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
      const res = await fetch(`/api/intake/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: clientName,
          client_email: clientEmail || undefined,
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
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "Anfrage konnte nicht gesendet werden.")
        setBusy(false)
        return
      }

      setDone(true)
    } catch {
      setError("Netzwerkfehler. Bitte erneut versuchen.")
      setBusy(false)
    }
  }

  if (done) {
    return (
      <Card>
        <CardContent className="space-y-3 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">
            ✓
          </div>
          <h2 className="text-xl font-semibold">Vielen Dank!</h2>
          <p className="mx-auto max-w-md text-sm text-[hsl(var(--muted-foreground))]">
            Deine Anfrage ist bei {agencyName} eingegangen. Wir erstellen einen
            ersten Entwurf deiner Website und melden uns
            {clientEmail ? ` per E-Mail an ${clientEmail}` : " in Kürze"}.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deine Kontaktdaten</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="client_name">Dein Name *</Label>
            <Input
              id="client_name"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client_email">Deine E-Mail</Label>
            <Input
              id="client_email"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="für Rückfragen & den Entwurf"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Über dein Unternehmen</CardTitle>
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
              placeholder="kurzer Satz, der euch beschreibt"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">
              Was bietet ihr an? * (mind. 20 Zeichen)
            </Label>
            <Textarea
              id="description"
              required
              minLength={20}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibe euer Angebot und was euch besonders macht."
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
            <Label htmlFor="contact_email">Kontakt-E-Mail (für die Website)</Label>
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

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Wird gesendet …" : "Anfrage absenden"}
        </Button>
      </div>
    </form>
  )
}
