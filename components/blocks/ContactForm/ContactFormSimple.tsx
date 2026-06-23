"use client"

import { useState } from "react"
import { type ContactFormSection } from "@/lib/schema/site-config"

interface Props {
  content: ContactFormSection["content"]
}

export function ContactFormSimple({ content }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    const form = e.currentTarget
    const data = {
      name:    (form.elements.namedItem("name") as HTMLInputElement).value,
      email:   (form.elements.namedItem("email") as HTMLInputElement).value,
      phone:   content.show_phone ? (form.elements.namedItem("phone") as HTMLInputElement)?.value : undefined,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      to:      content.submit_to_email,
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? "success" : "error")
    } catch {
      setStatus("error")
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.625rem 0.875rem",
    border: "1px solid var(--site-muted)",
    borderRadius: "var(--site-radius)",
    backgroundColor: "var(--site-background)",
    color: "var(--site-text)",
    fontSize: "0.875rem",
    outline: "none",
  }

  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-accent)" }}
    >
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
          style={{
            fontFamily: "var(--site-heading-font)",
            color: "var(--site-text)",
          }}
        >
          {content.headline}
        </h2>
        {content.subheadline && (
          <p className="mb-8 text-base" style={{ color: "var(--site-muted)" }}>
            {content.subheadline}
          </p>
        )}

        {status === "success" ? (
          <div
            className="p-6 text-center"
            style={{
              backgroundColor: "var(--site-background)",
              borderRadius: "var(--site-radius)",
            }}
          >
            <p className="text-lg font-medium" style={{ color: "var(--site-text)" }}>
              ✓ {content.success_message}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            style={{
              backgroundColor: "var(--site-background)",
              padding: "2rem",
              borderRadius: "var(--site-radius)",
              boxShadow: "var(--site-shadow)",
            }}
          >
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--site-text)" }}>
                Name *
              </label>
              <input name="name" type="text" required style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--site-text)" }}>
                E-Mail *
              </label>
              <input name="email" type="email" required style={inputStyle} />
            </div>
            {content.show_phone && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--site-text)" }}>
                  Telefon
                </label>
                <input name="phone" type="tel" style={inputStyle} />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--site-text)" }}>
                Nachricht *
              </label>
              <textarea
                name="message"
                required
                rows={5}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            {status === "error" && (
              <p className="text-sm" style={{ color: "#dc2626" }}>
                Fehler beim Senden. Bitte versuche es erneut.
              </p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{
                backgroundColor: "var(--site-primary)",
                color: "var(--site-background)",
                borderRadius: "var(--site-radius)",
              }}
            >
              {status === "loading" ? "Wird gesendet…" : content.submit_label}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
