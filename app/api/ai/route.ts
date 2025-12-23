import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { weatherTool } from "@/lib/tools/weather";

// Edge Runtime: ~30 seconds default, but streaming can continue longer
// For longer processing time, switch to Node.js runtime and use maxDuration
export const runtime = "edge";

// Note: maxDuration is only available for Node.js runtime
// If you need longer timeouts, switch to: export const runtime = "nodejs";
// Then add: export const maxDuration = 300; // 5 minutes max

const SYSTEM_PROMPT = `You are an outdoor guide AI called EcoScan.
You recommend nearby green spaces, parks, walking paths, and hiking trails based on user mood, time, fitness level, transport, and current weather.

IMPORTANT: Always use the weather tool to get current conditions before making recommendations.

When providing recommendations, ALWAYS respond with a brief friendly intro followed by JSON in this EXACT format:

\`\`\`json
{
  "recommendations": [
    {
      "name": "Place Name",
      "type": "Park/Trail/Forest/Garden",
      "distance": "X km from city center",
      "why": "Why this place is perfect for the user's needs",
      "best_time": "Best time to visit",
      "duration": "Suggested visit duration",
      "difficulty": "Easy/Moderate/Challenging",
      "weather": {
        "condition": "Current weather",
        "temperature": "Temperature",
        "advice": "Weather-specific advice"
      },
      "transport": ["How to get there option 1", "Option 2"],
      "what_to_carry": ["Item 1", "Item 2"],
      "safety_notes": ["Safety tip 1", "Safety tip 2"]
    }
  ]
}
\`\`\`

Rules:
- Focus on real places in Kenya
- Provide 2-4 recommendations
- Include practical, actionable advice
- Be calm, friendly, and helpful
- NEVER use "parks" key, ALWAYS use "recommendations" key`;

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
    // stopWhen: stepCountIs(5) allows multi-step agent behavior
    // The agent will continue generating after tool calls until 5 steps or final response
    const result = streamText({
      model: gateway("openai/gpt-4o-mini"), // Use gateway provider with model string
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools: {
        weather: weatherTool,
      },
      stopWhen: stepCountIs(5), // Allow up to 5 steps for multi-step reasoning
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

