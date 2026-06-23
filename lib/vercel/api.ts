/**
 * Minimal Vercel REST API client for programmatic custom-domain assignment.
 *
 * The live customer site is served by this one Next.js app (shared renderer):
 * a domain is attached to the Vercel *project*, and middleware resolves the
 * incoming hostname to the right published SiteConfig. We never create a
 * Vercel deployment per customer — only attach/verify domains.
 *
 * Docs: https://vercel.com/docs/rest-api/reference/endpoints/projects
 */

const API = "https://api.vercel.com"

export interface VercelDomain {
  name: string
  verified: boolean
  /** DNS records the customer must set when the domain isn't verified yet. */
  verification?: Array<{
    type: string
    domain: string
    value: string
    reason: string
  }>
}

export class VercelError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = "VercelError"
  }
}

export function isVercelConfigured(): boolean {
  return Boolean(process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID)
}

function config() {
  const token = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  if (!token || !projectId) {
    throw new VercelError("Vercel is not configured (VERCEL_TOKEN / VERCEL_PROJECT_ID)", 500)
  }
  const teamQuery = process.env.VERCEL_TEAM_ID
    ? `?teamId=${encodeURIComponent(process.env.VERCEL_TEAM_ID)}`
    : ""
  return { token, projectId, teamQuery }
}

async function vercelFetch(
  path: string,
  init: RequestInit & { teamQuery: string; token: string }
): Promise<Response> {
  const { teamQuery, token, ...rest } = init
  return fetch(`${API}${path}${teamQuery}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...rest.headers,
    },
  })
}

/**
 * Attach a domain to the Vercel project and report its verification state.
 *
 * Idempotent: a domain that is already attached (409 `domain_already_in_use`
 * on this project) is treated as success, then re-read for its current state.
 */
export async function assignDomain(domain: string): Promise<VercelDomain> {
  const { token, projectId, teamQuery } = config()

  const res = await vercelFetch(`/v10/projects/${projectId}/domains`, {
    method: "POST",
    body: JSON.stringify({ name: domain }),
    token,
    teamQuery,
  })

  if (res.ok) {
    const data = (await res.json()) as VercelDomain
    return {
      name: data.name,
      verified: data.verified ?? false,
      verification: data.verification,
    }
  }

  // Already attached to this project → reconcile by reading current state.
  if (res.status === 409) {
    return getDomain(domain)
  }

  const body = await res.text()
  throw new VercelError(
    `Vercel domain assignment failed (${res.status}): ${body}`,
    res.status
  )
}

/** Read a domain's current verification state from the project. */
export async function getDomain(domain: string): Promise<VercelDomain> {
  const { token, projectId, teamQuery } = config()

  const res = await vercelFetch(
    `/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}`,
    { method: "GET", token, teamQuery }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new VercelError(`Vercel domain lookup failed (${res.status}): ${body}`, res.status)
  }

  const data = (await res.json()) as VercelDomain
  return {
    name: data.name,
    verified: data.verified ?? false,
    verification: data.verification,
  }
}
