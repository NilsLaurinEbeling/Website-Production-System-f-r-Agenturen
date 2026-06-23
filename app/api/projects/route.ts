import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { getAgencyContext, canManage } from "@/lib/agency/queries"

const BodySchema = z.object({
  client_name: z.string().trim().min(1).max(120),
  client_email: z.string().trim().email().max(200).optional().or(z.literal("")),
})

/**
 * POST /api/projects — create a client project within the user's agency.
 *
 * Only owners/admins may create projects (mirrors the agency RLS). The project
 * starts in `intake`; the brief is submitted separately via
 * /api/projects/[id]/brief, which kicks off the pipeline.
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
  if (!ctx) {
    return NextResponse.json({ error: "No agency" }, { status: 401 })
  }
  if (!canManage(ctx.role)) {
    return NextResponse.json(
      { error: "Only owners and admins can create projects" },
      { status: 403 }
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      agency_id: ctx.agency.id,
      created_by: user.id,
      client_name: parsed.data.client_name,
      client_email: parsed.data.client_email || null,
      status: "intake",
    })
    .select("id")
    .single()

  if (error || !project) {
    return NextResponse.json(
      { error: `Could not create project: ${error?.message ?? "unknown"}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, id: project.id })
}

export const runtime = "nodejs"
