import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { getAgencyContext, canManage } from "@/lib/agency/queries"

const emptyToUndef = (v: unknown) => (v === "" ? undefined : v)

const BodySchema = z.object({
  agency_name: z.string().trim().min(2).max(80),
  logo_url: z.preprocess(emptyToUndef, z.string().url().max(500).optional()),
  custom_domain: z.preprocess(
    emptyToUndef,
    z.string().trim().toLowerCase().regex(/^([a-z0-9-]+\.)+[a-z]{2,}$/, "Invalid domain").max(253).optional()
  ),
  from_email: z.preprocess(emptyToUndef, z.string().email().max(200).optional()),
  reply_to_email: z.preprocess(emptyToUndef, z.string().email().max(200).optional()),
})

/**
 * POST /api/agency/white-label — upsert the agency's white-label branding.
 *
 * Owners/admins only. The custom_domain is the agency's dashboard portal domain;
 * middleware resolves it to this agency and serves the branded dashboard.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const ctx = await getAgencyContext()
  if (!ctx) return NextResponse.json({ error: "No agency" }, { status: 401 })
  if (!canManage(ctx.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("white_label_configs")
    .upsert(
      {
        agency_id: ctx.agency.id,
        agency_name: parsed.data.agency_name,
        logo_url: parsed.data.logo_url ?? null,
        custom_domain: parsed.data.custom_domain ?? null,
        from_email: parsed.data.from_email ?? null,
        reply_to_email: parsed.data.reply_to_email ?? null,
      },
      { onConflict: "agency_id" }
    )

  if (error) {
    // A taken custom_domain trips the UNIQUE constraint.
    const taken = error.message.toLowerCase().includes("duplicate")
    return NextResponse.json(
      { error: taken ? "Diese Domain ist bereits vergeben." : error.message },
      { status: taken ? 409 : 500 }
    )
  }

  return NextResponse.json({ ok: true })
}

export const runtime = "nodejs"
