import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * POST /api/projects/[id]/send-preview
 *
 * The internal QA gate ("Vorschau an Kunden senden"): once the agency has
 * reviewed the generated draft, this releases it to the client for preview by
 * advancing `review` → `preview`. RLS scopes the update to the agency.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const supabase = await createClient()
  const { data: project, error } = await supabase
    .from("projects")
    .select("id, status")
    .eq("id", projectId)
    .single()

  if (error || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }
  if (project.status !== "review") {
    return NextResponse.json(
      { error: `Preview can only be sent from "review" (current: "${project.status}")` },
      { status: 409 }
    )
  }

  const { error: updateError } = await supabase
    .from("projects")
    .update({ status: "preview", error_message: null })
    .eq("id", projectId)

  if (updateError) {
    return NextResponse.json({ error: "Could not update project" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, status: "preview" })
}

export const runtime = "nodejs"
