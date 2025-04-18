import { type NextRequest, NextResponse } from "next/server"

const LOCATIONIQ_API_KEY = "pk.ff32370c2e4fb2e2851ba7107e229e96"
const BASE_URL = "https://us1.locationiq.com/v1"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const response = await fetch(
      `${BASE_URL}/search.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&format=json`,
      { headers: { Accept: "application/json" } },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`LocationIQ API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Geocoding error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to geocode location" },
      { status: 500 },
    )
  }
}
