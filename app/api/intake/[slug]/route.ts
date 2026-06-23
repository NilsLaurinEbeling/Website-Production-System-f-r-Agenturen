import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { BriefSchema } from "@/lib/schema/brief"
import { getIntakeAgency } from "@/lib/agency/intake"
import { createAdminClient } from "@/lib/supabase/admin"
import { enqueuePipelineStep } from "@/lib/pipeline/qstash"

/**
 * POST /api/intake/[slug] — public client intake.
 *
 * The agency's *client* (not signed in) submits a request through the branded
 * landing page at `/start/[slug]`. We resolve the agency by slug, create a
 * self-serve project inside it (no `created_by` — there is no agency user),
 * store the brief, and kick off the pipeline. The agency then sees the new
 * project appear in its dashboard.
 *
 * This route bypasses RLS via the service role and must therefore validate
 * everything itself; the only writes it performs are scoped to the resolved
 * agency.
 */
const BodySchema = z
  .object({
    client_name: z.string().trim().min(1).max(120),
    client_email: z.string().trim().email().max(200).optional().or(z.literal("")),
  })
  .and(BriefSchema)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const agency = await getIntakeAgency(slug)
  if (!agency) {
    return NextResponse.json({ error: "Unbekannte Agentur" }, { status: 404 })
  }

  const body = await request.json().catch(() => null)
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ungültige Eingabe", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const { client_name, client_email, ...brief } = parsed.data
  const admin = createAdminClient()

  // 1. Create the project shell inside the agency. Self-serve intake has no
  //    agency user, so created_by stays null.
  const { data: project, error: projectError } = await admin
    .from("projects")
    .insert({
      agency_id: agency.id,
      created_by: null,
      client_name,
      client_email: client_email || null,
      status: "intake",
    })
    .select("id")
    .single()

  if (projectError || !project) {
    return NextResponse.json(
      { error: "Anfrage konnte nicht angelegt werden." },
      { status: 500 }
    )
  }

  // 2. Store the brief and start the pipeline (mirrors /api/projects/[id]/brief).
  const { error: briefError } = await admin
    .from("briefs")
    .insert({ project_id: project.id, data: brief })

  if (briefError) {
    return NextResponse.json(
      { error: "Steckbrief konnte nicht gespeichert werden." },
      { status: 500 }
    )
  }

  await admin
    .from("projects")
    .update({ status: "planning", error_message: null })
    .eq("id", project.id)

  await enqueuePipelineStep("validate-brief", { projectId: project.id })

  return NextResponse.json({ ok: true })
}

export const runtime = "nodejs"
