import { NextRequest, NextResponse } from "next/server"
import { BriefSchema } from "@/lib/schema/brief"
import { createClient } from "@/lib/supabase/server"
import { enqueuePipelineStep } from "@/lib/pipeline/qstash"

/**
 * POST /api/projects/[id]/brief
 *
 * The customer submits their intake brief for an existing project.
 * Saves the brief (RLS enforces project ownership), moves the project to
 * `planning`, and kicks off the pipeline via QStash.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const body = await request.json().catch(() => null)
  const parsed = BriefSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid brief", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  // RLS scopes this to the authenticated owner; missing/foreign project → null.
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, status")
    .eq("id", projectId)
    .single()

  if (projectError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  if (!["intake", "planning", "failed"].includes(project.status)) {
    return NextResponse.json(
      { error: `Brief cannot be submitted in status "${project.status}"` },
      { status: 409 }
    )
  }

  const { error: insertError } = await supabase
    .from("briefs")
    .insert({ project_id: projectId, data: parsed.data })
  if (insertError) {
    return NextResponse.json({ error: "Could not save brief" }, { status: 500 })
  }

  await supabase
    .from("projects")
    .update({ status: "planning", error_message: null })
    .eq("id", projectId)

  await enqueuePipelineStep("validate-brief", { projectId })

  return NextResponse.json({ ok: true, status: "planning" })
}
