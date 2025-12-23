import { generateText } from "ai";
import { createGateway } from "@ai-sdk/gateway";

export const runtime = "edge";

// Create gateway provider instance
function getGateway() {
  const apiKey = process.env.VERCEL_AI_GATEWAY_API_KEY || process.env.AI_GATEWAY_API_KEY;
  
  if (!apiKey) {
    throw new Error("Vercel AI Gateway API key not configured");
  }

  return createGateway({
    apiKey,
    baseURL: "https://ai-gateway.vercel.sh/v1/ai",
  });
}

// Variations for unique images
const timeOfDay = ["sunrise", "golden hour", "midday", "afternoon", "sunset", "dusk"];
const perspectives = ["wide panoramic", "eye-level", "slightly elevated", "intimate close-up"];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { placeName, placeType } = body;

    if (!placeName) {
      return new Response(
        JSON.stringify({ error: "placeName is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const gateway = getGateway();

    // Random variations
    const time = getRandomElement(timeOfDay);
    const perspective = getRandomElement(perspectives);

    // Simple, direct prompt - let the AI know the landmark
    const prompt = `Create a stunning photograph of ${placeName}, Kenya. 

This is a real ${placeType || "place"} in Kenya. Show what ${placeName} actually looks like - its real landscape, terrain, and distinctive features.

Time of day: ${time}
Perspective: ${perspective}
Style: Professional travel photography, National Geographic quality, photorealistic`;

    // Use Gemini Flash Image model through gateway
    const result = await generateText({
      model: gateway("google/gemini-2.5-flash-image-preview"),
      prompt,
    });

    // Extract image from the result files
    if (result.files && result.files.length > 0) {
      const imageFile = result.files.find(file => 
        file.mediaType?.startsWith("image/")
      );

      if (imageFile) {
        const base64 = imageFile.base64;
        const mediaType = imageFile.mediaType || "image/png";
        const dataUrl = `data:${mediaType};base64,${base64}`;

        return new Response(
          JSON.stringify({ 
            success: true, 
            imageUrl: dataUrl,
            placeName,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "No image was generated" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Image generation error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate image",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
