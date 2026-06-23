"use client"

import { useState } from "react"
import { type LeadMagnetSection } from "@/lib/schema/site-config"

interface Props {
  content: LeadMagnetSection["content"]
}

export function LeadMagnetCentered({ content }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [email, setEmail] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "Lead Magnet Subscriber", message: `Lead magnet request: ${content.offer_text}`, to: content.submit_to_email }),
      })
      setStatus(res.ok ? "success" : "error")
    } catch { setStatus("error") }
  }

  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "var(--site-accent)" }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
          style={{ backgroundColor: "var(--site-primary)", color: "var(--site-background)" }}
        >
          {content.offer_text}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
          {content.headline}
        </h2>
        <p className="mt-4 text-lg" style={{ color: "var(--site-muted)" }}>
          {content.description}
        </p>

        {status === "success" ? (
          <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: "var(--site-background)" }}>
            <p className="font-medium" style={{ color: "var(--site-text)" }}>
              ✓ Vielen Dank! Schau in dein Postfach.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={content.email_placeholder}
              className="flex-1 px-4 py-3 text-sm border"
              style={{
                borderColor: "var(--site-muted)",
                borderRadius: "var(--site-radius)",
                backgroundColor: "var(--site-background)",
                color: "var(--site-text)",
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
              style={{
                backgroundColor: "var(--site-primary)",
                color: "var(--site-background)",
                borderRadius: "var(--site-radius)",
              }}
            >
              {status === "loading" ? "…" : content.cta_label}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
