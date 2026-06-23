import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { getAgencyContext, canManage } from "@/lib/agency/queries"

const AddSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(["admin", "member"]).default("member"),
})

/** Find an existing auth user by email (paginated admin listing). */
async function findUserByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string
): Promise<string | null> {
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error || !data) return null
    const match = data.users.find((u) => u.email?.toLowerCase() === email)
    if (match) return match.id
    if (data.users.length < 200) break
  }
  return null
}

/**
 * POST /api/agency/members — add an existing user to the agency by email.
 *
 * Owners/admins only. The invitee must already have an account (V1 has no
 * email-invite delivery). Membership is written with the service role since the
 * roster RLS policy guards by existing membership.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = AddSchema.safeParse(body)
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

  const admin = createAdminClient()
  const userId = await findUserByEmail(admin, parsed.data.email)
  if (!userId) {
    return NextResponse.json(
      { error: "Es existiert kein Konto mit dieser E-Mail. Bitte zuerst registrieren lassen." },
      { status: 404 }
    )
  }

  const { error } = await admin.from("agency_members").insert({
    agency_id: ctx.agency.id,
    user_id: userId,
    role: parsed.data.role,
  })
  if (error) {
    const dup = error.message.toLowerCase().includes("duplicate")
    return NextResponse.json(
      { error: dup ? "Diese Person ist bereits Mitglied." : error.message },
      { status: dup ? 409 : 500 }
    )
  }

  return NextResponse.json({ ok: true })
}

/**
 * DELETE /api/agency/members?id=<member_id> — remove a member.
 * Owners/admins only; the owner cannot be removed.
 */
export async function DELETE(request: NextRequest) {
  const memberId = request.nextUrl.searchParams.get("id")
  if (!memberId) {
    return NextResponse.json({ error: "Missing member id" }, { status: 400 })
  }

  const ctx = await getAgencyContext()
  if (!ctx) return NextResponse.json({ error: "No agency" }, { status: 401 })
  if (!canManage(ctx.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const admin = createAdminClient()
  const { data: member } = await admin
    .from("agency_members")
    .select("id, role, agency_id")
    .eq("id", memberId)
    .single()

  if (!member || member.agency_id !== ctx.agency.id) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 })
  }
  if (member.role === "owner") {
    return NextResponse.json({ error: "Der Inhaber kann nicht entfernt werden." }, { status: 409 })
  }

  const { error } = await admin.from("agency_members").delete().eq("id", memberId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export const runtime = "nodejs"
