import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { aiFeatures } from "@/types/ai-features"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, feature = "chat", userId } = await req.json()

    const featureConfig = aiFeatures[feature]
    if (!featureConfig) {
      throw new Error("Invalid feature selected")
    }

    // Use a fallback API key if environment variable is not set
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "YOUR_FALLBACK_API_KEY"

    const result = streamText({
      model: google("gemini-1.5-flash"),
      system: featureConfig.systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
