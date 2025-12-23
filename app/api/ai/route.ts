import { streamText, convertToModelMessages } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { weatherTool } from "@/lib/tools/weather";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are an outdoor guide AI.
You recommend nearby green spaces, parks, walking paths,
and hiking trails based on user mood, time, fitness level,
transport, and current weather.
Use tools when necessary.
Focus on safe, accessible nature spots in Kenya.
Respond with structured JSON suitable for UI rendering.
Be calm, friendly, and practical.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify AI Gateway API key is configured
    const apiKey = process.env.VERCEL_AI_GATEWAY_API_KEY || process.env.AI_GATEWAY_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Vercel AI Gateway API key not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create gateway provider instance with explicit API key configuration
    // This ensures we use API key authentication instead of OIDC token
    const gateway = createGateway({
      apiKey: apiKey,
      baseURL: "https://ai-gateway.vercel.sh/v1/ai",
    });

    // Convert UI messages to model messages
    const modelMessages = await convertToModelMessages(messages);

    // Use gateway provider with explicit API key configuration
    const result = streamText({
      model: gateway("openai/gpt-4o-mini"), // Use gateway provider with model string
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools: {
        weather: weatherTool,
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("API route error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

