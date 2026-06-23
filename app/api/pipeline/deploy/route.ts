import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { withQStashVerification } from "@/lib/pipeline/verify"
import {
  failProject,
  isAtOrPast,
  loadProject,
  setProjectStatus,
} from "@/lib/pipeline/project"
import { assignDomain, isVercelConfigured, VercelError } from "@/lib/vercel/api"

interface Payload {
  projectId: string
}

/**
 * Step 4 — deploy.
 *
 * The config is already `published`; the live site is served by the shared
 * renderer via middleware. This step's job is the custom domain: attach it to
 * the Vercel project and record the deployment. Idempotent — skipped once the
 * project is `live`.
 *
 * Reaching `live` does not require domain verification: DNS propagation is the
 * customer's side and happens asynchronously. We record the verification state
 * on the deployment so the dashboard can surface pending DNS records.
 */
export const POST = withQStashVerification<Payload>(async ({ projectId }) => {
  const project = await loadProject(projectId)
  if (!project) return NextResponse.json({ skipped: "project not found" })
  if (isAtOrPast(project.status, "live")) {
    return NextResponse.json({ skipped: project.status })
  }

  await setProjectStatus(projectId, "deploying")
  const supabase = createAdminClient()

  // No custom domain → nothing to attach. The site is live on the shared host.
  if (!project.domain) {
    await supabase.from("deployments").insert({
      project_id: projectId,
      domain: null,
      status: "ready",
    })
    await setProjectStatus(projectId, "live")
    return NextResponse.json({ ok: true, status: "live", domain: null })
  }

  // A domain is set but Vercel isn't configured: don't fail the deploy — the
  // config is published and reachable. Record the gap for visibility.
  if (!isVercelConfigured()) {
    await supabase.from("deployments").insert({
      project_id: projectId,
      domain: project.domain,
      status: "ready",
    })
    await setProjectStatus(projectId, "live")
    return NextResponse.json({
      ok: true,
      status: "live",
      domain: project.domain,
      warning: "Vercel not configured; domain not attached",
    })
  }

  try {
    const result = await assignDomain(project.domain)

    await supabase.from("deployments").insert({
      project_id: projectId,
      vercel_project_id: process.env.VERCEL_PROJECT_ID,
      domain: result.name,
      status: "ready",
    })

    await setProjectStatus(projectId, "live")

    return NextResponse.json({
      ok: true,
      status: "live",
      domain: result.name,
      verified: result.verified,
      verification: result.verification ?? null,
    })
  } catch (err) {
    const message =
      err instanceof VercelError
        ? err.message
        : err instanceof Error
          ? err.message
          : "deploy failed"

    await supabase.from("deployments").insert({
      project_id: projectId,
      vercel_project_id: process.env.VERCEL_PROJECT_ID,
      domain: project.domain,
      status: "error",
    })

    // 4xx from Vercel (e.g. invalid domain) won't fix on retry — mark failed
    // and return 200 so QStash stops. Other errors throw → QStash retries.
    if (err instanceof VercelError && err.status >= 400 && err.status < 500) {
      await failProject(projectId, message)
      return NextResponse.json({ error: message }, { status: 200 })
    }

    console.error("[deploy]", err)
    throw new Error(message)
  }
})

export const maxDuration = 30
export const runtime = "nodejs"
