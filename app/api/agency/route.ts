import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const BodySchema = z.object({
  name: z.string().trim().min(2).max(80),
})

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${base || "agency"}-${suffix}`
}

/**
 * POST /api/agency — create the signed-in user's agency.
 *
 * The user becomes the agency owner (a DB trigger enrolls them as the first
 * member). One agency per user in V1: if they already belong to one, this is a
 * no-op that returns the existing agency.
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

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { data: existing } = await supabase
    .from("agency_members")
    .select("agency_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()
  if (existing) {
    return NextResponse.json({ ok: true, agency_id: existing.agency_id })
  }

  const { data: agency, error } = await supabase
    .from("agencies")
    .insert({ name: parsed.data.name, slug: slugify(parsed.data.name), owner_id: user.id })
    .select("id")
    .single()

  if (error || !agency) {
    return NextResponse.json(
      { error: `Could not create agency: ${error?.message ?? "unknown"}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, agency_id: agency.id })
}

export const runtime = "nodejs"
