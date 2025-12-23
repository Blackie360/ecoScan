import { tool } from "ai";
import { z } from "zod";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

interface PlacePhoto {
  photoReference: string;
  width: number;
  height: number;
}

interface PlaceResult {
  name: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  photos: PlacePhoto[];
  rating?: number;
  userRatingsTotal?: number;
  types: string[];
  mapsUrl: string;
  photoUrl: string | null;
}

async function searchPlace(query: string): Promise<PlaceResult | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn("Google Places API key not configured");
    return null;
  }

  try {
    // Use Text Search to find the place
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + " Kenya")}&key=${GOOGLE_PLACES_API_KEY}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== "OK" || !searchData.results?.length) {
      console.log("Place not found:", query);
      return null;
    }

    const place = searchData.results[0];
    
    // Get photo URL if available
    let photoUrl: string | null = null;
    if (place.photos && place.photos.length > 0) {
      const photoReference = place.photos[0].photo_reference;
      photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
    }

    // Construct Google Maps URL
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`;

    return {
      name: place.name,
      formattedAddress: place.formatted_address,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      photos: place.photos?.map((p: { photo_reference: string; width: number; height: number }) => ({
        photoReference: p.photo_reference,
        width: p.width,
        height: p.height,
      })) || [],
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      types: place.types || [],
      mapsUrl,
      photoUrl,
    };
  } catch (error) {
    console.error("Error fetching place:", error);
    return null;
  }
}

export const locationTool = tool({
  description: `Get real location data for a place in Kenya including:
- Real photos from Google Places
- Google Maps link with exact pin
- Address and coordinates
- User ratings

Use this tool after making recommendations to enrich them with real data.`,
  inputSchema: z.object({
    placeName: z.string().describe("The name of the place to look up (e.g., 'Karura Forest', 'Lake Nakuru')"),
    placeType: z.string().optional().describe("Type of place (e.g., 'Park', 'Forest', 'Trail')"),
  }),
  execute: async ({ placeName, placeType }) => {
    try {
      // Build search query
      const searchQuery = placeType 
        ? `${placeName} ${placeType}` 
        : placeName;

      const result = await searchPlace(searchQuery);

      if (!result) {
        // Return fallback with just a Google Maps search URL
        const fallbackMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + ", Kenya")}`;
        return {
          success: false,
          placeName,
          mapsUrl: fallbackMapsUrl,
          photoUrl: null,
          message: "Could not find exact location, but here's a search link",
        };
      }

      return {
        success: true,
        placeName: result.name,
        address: result.formattedAddress,
        coordinates: result.location,
        mapsUrl: result.mapsUrl,
        photoUrl: result.photoUrl,
        rating: result.rating,
        totalReviews: result.userRatingsTotal,
        placeTypes: result.types,
      };
    } catch (error) {
      const fallbackMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + ", Kenya")}`;
      return {
        success: false,
        placeName,
        mapsUrl: fallbackMapsUrl,
        photoUrl: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

