import { type NextRequest, NextResponse } from "next/server"

const LOCATIONIQ_API_KEY = "pk.ff32370c2e4fb2e2851ba7107e229e96"
const BASE_URL = "https://maps.locationiq.com/v3"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const center = searchParams.get("center")
    const zoom = searchParams.get("zoom") || "14"
    const width = searchParams.get("width") || "600"
    const height = searchParams.get("height") || "400"
    const markers = searchParams.get("markers")

    if (!center) {
      return NextResponse.json({ error: "Center parameter is required" }, { status: 400 })
    }

    let url = `${BASE_URL}/staticmap?key=${LOCATIONIQ_API_KEY}&center=${encodeURIComponent(center)}&zoom=${zoom}&size=${width}x${height}&format=png`

    if (markers) {
      url += `&markers=${encodeURIComponent(markers)}`
    }

    // Proxy the image to avoid exposing the API key to the client
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LocationIQ API error: ${response.status}`)
    }

    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Static map error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate static map" },
      { status: 500 },
    )
  }
}
