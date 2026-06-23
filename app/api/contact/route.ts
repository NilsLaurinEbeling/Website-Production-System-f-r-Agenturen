import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const ContactSchema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email(),
  phone:   z.string().max(30).optional(),
  message: z.string().min(1).max(2000),
  to:      z.string().email(),
})

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = ContactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { name, email, phone, message, to } = parsed.data

  // V1: log to console + forward via mailto href in the UI
  // Production: swap with Resend / Postmark / SES
  console.log("[contact-form]", { to, name, email, phone, message })

  // If RESEND_API_KEY is set, send via Resend
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:    process.env.RESEND_FROM_EMAIL ?? "noreply@autowebsitebuilder.de",
          to:      [to],
          subject: `Neue Anfrage von ${name}`,
          text:    `Name: ${name}\nE-Mail: ${email}${phone ? `\nTelefon: ${phone}` : ""}\n\n${message}`,
        }),
      })
    } catch (err) {
      console.error("[contact-form] Resend error:", err)
      return NextResponse.json({ error: "Mail delivery failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
