"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { AgencyRole } from "@/types"

export interface MemberRow {
  id: string
  email: string
  role: AgencyRole
}

export function MembersManager({
  members,
  canManage,
}: {
  members: MemberRow[]
  canManage: boolean
}) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "member">("member")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await fetch("/api/agency/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error ?? "Hinzufügen fehlgeschlagen.")
      setBusy(false)
      return
    }
    setEmail("")
    setBusy(false)
    router.refresh()
  }

  async function remove(id: string) {
    setError(null)
    const res = await fetch(`/api/agency/members?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error ?? "Entfernen fehlgeschlagen.")
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y rounded-md border">
        {members.map((m) => (
          <li key={m.id} className="flex items-center justify-between px-3 py-2 text-sm">
            <span className="flex items-center gap-2">
              {m.email}
              <Badge variant="outline">{m.role}</Badge>
            </span>
            {canManage && m.role !== "owner" && (
              <Button size="sm" variant="ghost" onClick={() => remove(m.id)}>
                Entfernen
              </Button>
            )}
          </li>
        ))}
      </ul>

      {canManage && (
        <form onSubmit={add} className="flex flex-wrap items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <Input
              type="email"
              required
              placeholder="kollege@agentur.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "member")}
            className="h-9 rounded-md border border-[hsl(var(--input))] bg-transparent px-3 text-sm"
          >
            <option value="member">Mitglied</option>
            <option value="admin">Admin</option>
          </select>
          <Button type="submit" disabled={busy || !email}>
            {busy ? "…" : "Hinzufügen"}
          </Button>
        </form>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
