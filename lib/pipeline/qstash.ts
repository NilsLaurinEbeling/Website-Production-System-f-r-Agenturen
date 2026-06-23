import { Client } from "@upstash/qstash"

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
})

type PipelineStep = "validate-brief" | "research" | "generate" | "deploy"

export async function enqueuePipelineStep(
  step: PipelineStep,
  payload: Record<string, unknown>
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const url = `${baseUrl}/api/pipeline/${step}`

  return qstash.publishJSON({
    url,
    body: payload,
    retries: 3,
  })
}
