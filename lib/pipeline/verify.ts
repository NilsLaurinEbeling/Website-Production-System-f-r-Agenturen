import { Receiver } from "@upstash/qstash"
import { NextRequest, NextResponse } from "next/server"

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey:    process.env.QSTASH_NEXT_SIGNING_KEY!,
})

/**
 * Wraps a pipeline route handler with QStash signature verification.
 *
 * The handler receives the already-parsed JSON body. Throwing inside the
 * handler returns 500, which signals QStash to retry. Returning a response
 * with a non-2xx status also triggers a retry.
 */
export function withQStashVerification<T>(
  handler: (body: T) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const signature = request.headers.get("upstash-signature")
    const rawBody = await request.text()

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    let valid = false
    try {
      valid = await receiver.verify({ signature, body: rawBody })
    } catch {
      valid = false
    }

    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    let body: T
    try {
      body = JSON.parse(rawBody) as T
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    return handler(body)
  }
}
