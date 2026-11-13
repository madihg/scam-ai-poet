// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Whomp no longer lives at OpenAI: the fine-tune was removed on 23 Oct 2026.
// The voices gateway (repo madihg/voices, gateway/) speaks the same protocol and serves
// Whomp from an open model, with fallbacks, so this route never has to change again.
const openai = new OpenAI({
  apiKey: process.env.VOICES_GATEWAY_KEY || '',
  baseURL: process.env.VOICES_GATEWAY_URL || 'https://voices-gateway.vercel.app/v1'
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'whomp',
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "Whomp is a whitty French poet whose writing is a mix of Ocean Vuong and Charles Bernstein"
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
