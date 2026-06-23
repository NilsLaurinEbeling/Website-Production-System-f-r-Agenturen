import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { enqueuePipelineStep } from "@/lib/pipeline/qstash"

const BodySchema = z.object({
  // Optional custom domain to attach on deploy, e.g. "kunde.de" or "www.kunde.de".
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^([a-z0-9-]+\.)+[a-z]{2,}$/, "Invalid domain")
    .max(253)
    .optional(),
})

/** Approval is only meaningful from a reviewable state. */
const APPROVABLE_STATUSES = ["review", "preview", "revising"]

/**
 * POST /api/projects/[id]/approve  ("Freigeben")
 *
 * Publishes the latest draft SiteConfig: the highest-version draft becomes the
 * single `published` config (any prior published rows are demoted), the project
 * moves to `approved`, and the deploy pipeline step is enqueued. Deploy attaches
 * the custom domain (if any) and flips the project to `live`.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params

  const body = await request.json().catch(() => ({}))
  const parsedBody = BodySchema.safeParse(body ?? {})
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsedBody.error.issues },
      { status: 400 }
    )
  }
  const { domain } = parsedBody.data

  // Authorize via RLS: only returns the project if it belongs to the user.
  const supabase = await createClient()
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, status")
    .eq("id", projectId)
    .single()

  if (projectError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }
  if (!APPROVABLE_STATUSES.includes(project.status)) {
    return NextResponse.json(
      { error: `Approval is not allowed in status "${project.status}"` },
      { status: 409 }
    )
  }

  // Privileged work: publishing flips site_configs.status, which owners can't write.
  const admin = createAdminClient()

  const { data: latest, error: latestError } = await admin
    .from("site_configs")
    .select("id, version")
    .eq("project_id", projectId)
    .eq("status", "draft")
    .order("version", { ascending: false })
    .limit(1)
    .single()

  if (latestError || !latest) {
    return NextResponse.json({ error: "No draft config to approve" }, { status: 404 })
  }

  // Exactly one published config per project: demote any prior published rows,
  // then promote the latest draft.
  await admin
    .from("site_configs")
    .update({ status: "draft" })
    .eq("project_id", projectId)
    .eq("status", "published")

  const { error: publishError } = await admin
    .from("site_configs")
    .update({ status: "published" })
    .eq("id", latest.id)
  if (publishError) {
    return NextResponse.json(
      { error: `Could not publish config: ${publishError.message}` },
      { status: 500 }
    )
  }

  // Reserve the domain on the project up front so deploy is a pure side effect.
  if (domain) {
    const { error: domainError } = await admin
      .from("projects")
      .update({ domain })
      .eq("id", projectId)
    if (domainError) {
      // Most likely a UNIQUE violation: the domain is taken by another project.
      return NextResponse.json(
        { error: "Domain is already in use" },
        { status: 409 }
      )
    }
  }

  await admin
    .from("projects")
    .update({ status: "approved", error_message: null })
    .eq("id", projectId)

  await enqueuePipelineStep("deploy", { projectId })

  return NextResponse.json({
    ok: true,
    status: "approved",
    published_version: latest.version,
    domain: domain ?? null,
  })
}

export const runtime = "nodejs"
