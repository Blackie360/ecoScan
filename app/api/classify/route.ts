import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    // Get the image data from the request
    const { imageData } = await request.json()

    if (!imageData) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 })
    }

    // Remove the data URL prefix to get just the base64 data
    const base64Data = imageData.split(",")[1]

    // Configure the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Prepare the image data for the API
    const imageBase64 = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    }

    // Create a structured prompt for waste classification
    const prompt = `
      Analyze this image and classify the waste item shown. 
      Determine the following:
      1. Type of waste (plastic, paper, glass, metal, organic, electronic, hazardous, or unknown)
      2. Is it recyclable? (yes/no)
      3. Disposal instructions (brief)
      4. Environmental impact (brief)
      
      Format your response as a JSON object with the following structure:
      {
        "type": "waste_type",
        "recyclable": boolean,
        "disposalInstructions": "instructions",
        "environmentalImpact": "impact"
      }
      
      Only return the JSON object, no other text.
    `

    // Generate content using the model
    const result = await model.generateContent([prompt, imageBase64])
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    try {
      // Extract JSON from the response (in case there's any extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : text
      const parsedResponse = JSON.parse(jsonString)

      // Add confidence score (Gemini doesn't provide this directly, so we'll use a placeholder)
      const classificationResult = {
        ...parsedResponse,
        confidence: 0.92, // High confidence placeholder
      }

      return NextResponse.json(classificationResult)
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError)
      console.log("Raw response:", text)

      // Fallback to a default response if parsing fails
      return NextResponse.json({
        type: "unknown",
        confidence: 0.7,
        recyclable: false,
        disposalInstructions: "If unsure, check with local waste management guidelines or dispose in general waste.",
        environmentalImpact: "When in doubt, it's better to throw in general waste than contaminate recycling streams.",
      })
    }
  } catch (error) {
    console.error("Error classifying waste:", error)

    // Provide more detailed error information
    let errorMessage = "Failed to classify waste"
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message

      // Check for specific error types
      if (errorMessage.includes("deprecated")) {
        errorMessage = "The AI model being used is deprecated. Please contact the administrator."
        statusCode = 503 // Service Unavailable
      } else if (errorMessage.includes("rate limit")) {
        errorMessage = "Rate limit exceeded. Please try again later."
        statusCode = 429 // Too Many Requests
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.toString() : "Unknown error",
      },
      { status: statusCode },
    )
  }
}
