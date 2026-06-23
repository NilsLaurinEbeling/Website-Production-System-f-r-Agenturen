"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function OnboardingForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    const res = await fetch("/api/agency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(data.error ?? "Etwas ist schiefgelaufen.")
      setBusy(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Willkommen 👋</CardTitle>
        <CardDescription>
          Lege deine Agentur an, um Kundenprojekte zu erstellen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name der Agentur</Label>
            <Input
              id="name"
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z. B. Schmidt Digital"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy || name.trim().length < 2}>
            {busy ? "…" : "Agentur erstellen"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
