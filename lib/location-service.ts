interface GeocodingResult {
  place_id: string
  licence: string
  osm_type: string
  osm_id: string
  boundingbox: string[]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
}

interface ReverseGeocodingResult {
  place_id: string
  licence: string
  osm_type: string
  osm_id: string
  lat: string
  lon: string
  display_name: string
  address: {
    road?: string
    suburb?: string
    city?: string
    state?: string
    postcode?: string
    country?: string
    country_code?: string
  }
}

export async function geocodeAddress(query: string): Promise<GeocodingResult[]> {
  try {
    const response = await fetch(`/api/location/geocode?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to geocode address")
    }

    return await response.json()
  } catch (error) {
    console.error("Geocoding error:", error)
    throw error
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodingResult> {
  try {
    const response = await fetch(`/api/location/reverse?lat=${lat}&lon=${lon}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to reverse geocode location")
    }

    return await response.json()
  } catch (error) {
    console.error("Reverse geocoding error:", error)
    throw error
  }
}

export function getStaticMapUrl(center: string, zoom = 14, width = 600, height = 400, markers?: string): string {
  let url = `/api/location/staticmap?center=${encodeURIComponent(center)}&zoom=${zoom}&width=${width}&height=${height}`

  if (markers) {
    url += `&markers=${encodeURIComponent(markers)}`
  }

  return url
}

// Calculate distance between two points using the Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return Number.parseFloat(distance.toFixed(1))
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}
