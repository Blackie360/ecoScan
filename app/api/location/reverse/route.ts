import { type NextRequest, NextResponse } from "next/server"

const LOCATIONIQ_API_KEY = "pk.ff32370c2e4fb2e2851ba7107e229e96"
const BASE_URL = "https://us1.locationiq.com/v1"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    if (!lat || !lon) {
      return NextResponse.json({ error: "Latitude and longitude parameters are required" }, { status: 400 })
    }

    const response = await fetch(
      `${BASE_URL}/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`,
      { headers: { Accept: "application/json" } },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`LocationIQ API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Reverse geocoding error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to reverse geocode location" },
      { status: 500 },
    )
  }
}
