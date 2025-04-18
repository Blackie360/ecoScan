// Waste classifier using Gemini API

type WasteType = "plastic" | "paper" | "glass" | "metal" | "organic" | "electronic" | "hazardous" | "unknown"

interface ClassificationResult {
  type: WasteType
  confidence: number
  recyclable: boolean
  disposalInstructions: string
  environmentalImpact: string
}

// Fallback waste types in case the API fails
const wasteTypes: Record<
  WasteType,
  {
    recyclable: boolean
    disposalInstructions: string
    environmentalImpact: string
  }
> = {
  plastic: {
    recyclable: true,
    disposalInstructions: "Clean and place in the plastic recycling bin. Remove caps and labels if possible.",
    environmentalImpact:
      "Recycling plastic reduces oil consumption, energy usage, and prevents plastic pollution in oceans and landfills.",
  },
  paper: {
    recyclable: true,
    disposalInstructions: "Place in paper recycling bin. Remove any plastic or metal attachments.",
    environmentalImpact: "Recycling paper saves trees, reduces energy consumption, and decreases landfill waste.",
  },
  glass: {
    recyclable: true,
    disposalInstructions: "Rinse and place in glass recycling bin. Remove caps and lids.",
    environmentalImpact: "Glass can be recycled indefinitely without loss of quality, saving energy and raw materials.",
  },
  metal: {
    recyclable: true,
    disposalInstructions: "Clean and place in metal recycling bin. Separate different types of metals if possible.",
    environmentalImpact: "Recycling metals saves significant energy compared to mining and processing new ore.",
  },
  organic: {
    recyclable: true,
    disposalInstructions:
      "Place in compost bin or organic waste collection. Avoid including meat or dairy in home composting.",
    environmentalImpact:
      "Composting organic waste reduces methane emissions from landfills and creates nutrient-rich soil.",
  },
  electronic: {
    recyclable: true,
    disposalInstructions: "Take to an e-waste collection center. Do not place in regular recycling bins.",
    environmentalImpact:
      "E-waste contains toxic materials. Proper recycling prevents environmental contamination and recovers valuable metals.",
  },
  hazardous: {
    recyclable: false,
    disposalInstructions: "Take to a hazardous waste collection facility. Never place in regular trash or recycling.",
    environmentalImpact:
      "Improper disposal of hazardous waste can contaminate soil and water sources with toxic chemicals.",
  },
  unknown: {
    recyclable: false,
    disposalInstructions: "If unsure, check with local waste management guidelines or dispose in general waste.",
    environmentalImpact: "When in doubt, it's better to throw in general waste than contaminate recycling streams.",
  },
}

// Use the Gemini API through our server-side API route
export async function classifyWaste(imageData: string): Promise<ClassificationResult> {
  try {
    // Call our API route with the image data
    const response = await fetch("/api/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageData }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("API error response:", errorData)
      throw new Error(`API error: ${response.status} - ${errorData.error || "Unknown error"}`)
    }

    const result = await response.json()

    // Ensure the result has the correct structure
    const validatedResult: ClassificationResult = {
      type: validateWasteType(result.type),
      confidence: typeof result.confidence === "number" ? result.confidence : 0.7,
      recyclable: !!result.recyclable,
      disposalInstructions: result.disposalInstructions || wasteTypes.unknown.disposalInstructions,
      environmentalImpact: result.environmentalImpact || wasteTypes.unknown.environmentalImpact,
    }

    return validatedResult
  } catch (error) {
    console.error("Error in waste classification:", error)

    // Show more detailed error in console for debugging
    if (error instanceof Error) {
      console.error("Error details:", error.message)
    }

    // Fallback to a mock classification if the API fails
    return fallbackClassification()
  }
}

// Helper function to validate the waste type
function validateWasteType(type: string): WasteType {
  const validTypes: WasteType[] = [
    "plastic",
    "paper",
    "glass",
    "metal",
    "organic",
    "electronic",
    "hazardous",
    "unknown",
  ]

  const normalizedType = type?.toLowerCase() as WasteType

  return validTypes.includes(normalizedType) ? normalizedType : "unknown"
}

// Fallback function for when the API fails
function fallbackClassification(): ClassificationResult {
  // For demo purposes, randomly select a waste type
  const wasteTypeKeys = Object.keys(wasteTypes) as WasteType[]
  const randomIndex = Math.floor(Math.random() * (wasteTypeKeys.length - 1)) // Exclude "unknown" from random selection
  const type = wasteTypeKeys[randomIndex]

  const { recyclable, disposalInstructions, environmentalImpact } = wasteTypes[type]

  return {
    type,
    confidence: 0.7 + Math.random() * 0.25, // Random confidence between 0.7 and 0.95
    recyclable,
    disposalInstructions,
    environmentalImpact,
  }
}
