import Anthropic from "@anthropic-ai/sdk"
import { anthropic } from "./client"

/**
 * Forces the model to call a single tool and returns the raw tool input.
 * The caller is responsible for Zod-validating the result — this only
 * steers the model toward the desired shape, it does not guarantee it.
 */
export async function callToolForOutput(args: {
  model: string
  system: string
  messages: Anthropic.MessageParam[]
  toolName: string
  toolDescription: string
  inputSchema: Record<string, unknown>
  maxTokens?: number
}): Promise<unknown> {
  const response = await anthropic.messages.create({
    model: args.model,
    max_tokens: args.maxTokens ?? 8000,
    system: args.system,
    messages: args.messages,
    tools: [
      {
        name: args.toolName,
        description: args.toolDescription,
        input_schema: args.inputSchema as Anthropic.Tool.InputSchema,
      },
    ],
    tool_choice: { type: "tool", name: args.toolName },
  })

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock =>
      block.type === "tool_use" && block.name === args.toolName
  )

  if (!toolUse) {
    throw new Error(`Model did not call tool "${args.toolName}"`)
  }

  return toolUse.input
}
