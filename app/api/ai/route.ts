import { streamText, convertToModelMessages } from "ai";
import { createGateway } from "@ai-sdk/gateway";

// Use Node.js runtime for longer processing time with image analysis
export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds for image analysis

const SYSTEM_PROMPT = `You are EcoScan, an AI assistant that helps people in Kenya properly dispose of waste items by analyzing images.

Your role:
- Analyze uploaded images to identify waste items and materials
- Provide Kenya-specific disposal recommendations
- Consider local regulations, facilities, and environmental impact
- Be practical, clear, and helpful

When analyzing an image, identify:
1. What the item is (be specific)
2. What materials it's made of
3. The waste category (Plastic, Electronic, Organic, Hazardous, General Waste, etc.)
4. The best disposal method for Kenya
5. Step-by-step disposal instructions
6. Whether recycling is available
7. Any hazards or safety concerns
8. Kenya-specific information (locations, regulations, facilities)

ALWAYS respond with a brief friendly intro followed by JSON in this EXACT format:

\`\`\`json
{
  "item": "Description of the item",
  "material": "Primary material(s)",
  "category": "Waste category",
  "disposal_method": "Recommended method (Recycle/Compost/Landfill/Special Collection/Reuse)",
  "disposal_steps": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ],
  "recycling_available": true/false,
  "hazards": ["Hazard 1", "Hazard 2"] or null,
  "local_notes": "Kenya-specific information, locations, or regulations",
  "location_info": "Specific disposal locations or facilities in Kenya",
  "environmental_impact": "Brief note on environmental impact"
}
\`\`\`

Rules:
- Focus on Kenya-specific disposal options and regulations
- Be practical and actionable
- Include specific locations or facilities when relevant
- Consider environmental impact
- Mention any recycling programs available in Kenya
- If the item can be reused or repurposed, mention that
- Be friendly and encouraging about proper waste disposal`;

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

    // Use AI Gateway API key (from .env lines 6-7)
    const gatewayApiKey = process.env.VERCEL_AI_GATEWAY_API_KEY || process.env.AI_GATEWAY_API_KEY;
    
    if (!gatewayApiKey) {
      return new Response(
        JSON.stringify({ error: "Vercel AI Gateway API key not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create gateway provider instance
    const gateway = createGateway({
      apiKey: gatewayApiKey,
      baseURL: "https://ai-gateway.vercel.sh/v1/ai",
    });

    // Convert UI messages to model messages (handles multimodal content including images)
    const modelMessages = await convertToModelMessages(messages);

    // Use vision-capable model for image analysis via Gateway
    const result = streamText({
      model: gateway("openai/gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
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
