"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertTriangle } from "lucide-react"
import { reverseGeocode, calculateDistance } from "@/lib/location-service"
import dynamic from "next/dynamic"

// Dynamically import the InteractiveMap component with no SSR
const DynamicMap = dynamic(() => import("@/components/interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center bg-muted rounded-md">
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  ),
})

interface RecyclingLocation {
  id: string
  name: string
  type: string[]
  address: string
  distance: number
  coordinates: {
    lat: number
    lng: number
  }
}

export default function LocationPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [locationAccuracy, setLocationAccuracy] = useState<number>(0)
  const [recyclingLocations, setRecyclingLocations] = useState<RecyclingLocation[]>([])
  const [locationError, setLocationError] = useState<string | null>(null)

  // Handle location updates from the map
  const handleLocationUpdate = async (lat: number, lng: number, accuracy: number) => {
    setUserLocation({ lat, lng })
    setLocationAccuracy(accuracy)

    try {
      // Get address from coordinates
      const result = await reverseGeocode(lat, lng)
      setUserAddress(result.display_name)

      // Update recycling locations based on new position
      fetchRecyclingLocations(lat, lng)
    } catch (error) {
      console.error("Error handling location update:", error)
      setLocationError("Failed to update location information")
    }
  }

  const fetchRecyclingLocations = async (lat: number, lng: number) => {
    try {
      // In a real app, this would fetch from an API based on user location
      // For demo purposes, we'll use mock data but with real distances

      // Nairobi area coordinates (slightly varied to simulate different locations)
      const mockLocations: RecyclingLocation[] = [
        {
          id: "1",
          name: "Ngong Road Recycling Center",
          type: ["plastic", "paper", "glass"],
          address: "123 Ngong Road, Nairobi",
          distance: 0, // Will be calculated
          coordinates: { lat: lat + 0.01, lng: lng + 0.01 },
        },
        {
          id: "2",
          name: "Westlands E-Waste Collection",
          type: ["electronic"],
          address: "45 Westlands Avenue, Nairobi",
          distance: 0, // Will be calculated
          coordinates: { lat: lat - 0.008, lng: lng + 0.005 },
        },
        {
          id: "3",
          name: "Karen Organic Waste Center",
          type: ["organic"],
          address: "78 Karen Road, Nairobi",
          distance: 0, // Will be calculated
          coordinates: { lat: lat + 0.005, lng: lng - 0.015 },
        },
        {
          id: "4",
          name: "Kilimani Metal Recycling",
          type: ["metal"],
          address: "32 Kilimani Street, Nairobi",
          distance: 0, // Will be calculated
          coordinates: { lat: lat - 0.003, lng: lng - 0.007 },
        },
        {
          id: "5",
          name: "Lavington Green Recyclers",
          type: ["plastic", "paper", "glass", "metal"],
          address: "90 Lavington Green, Nairobi",
          distance: 0, // Will be calculated
          coordinates: { lat: lat + 0.007, lng: lng - 0.003 },
        },
      ]

      // Calculate real distances based on user location
      const locationsWithDistances = mockLocations.map((location) => {
        const distance = calculateDistance(lat, lng, location.coordinates.lat, location.coordinates.lng)

        return {
          ...location,
          distance,
        }
      })

      // Sort by distance
      locationsWithDistances.sort((a, b) => a.distance - b.distance)

      setRecyclingLocations(locationsWithDistances)
    } catch (error) {
      console.error("Error fetching recycling locations:", error)
      setLocationError("Failed to load recycling locations")
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Your Location</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Real-Time Location</CardTitle>
              <CardDescription>Your current location is being tracked in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicMap
                height="500px"
                locations={recyclingLocations}
                onLocationUpdate={handleLocationUpdate}
                zoom={14}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
                <CardDescription>Information about your current position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userLocation ? (
                  <>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Coordinates</h3>
                      <p className="text-sm text-muted-foreground">Latitude: {userLocation.lat.toFixed(6)}</p>
                      <p className="text-sm text-muted-foreground">Longitude: {userLocation.lng.toFixed(6)}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-1">Accuracy</h3>
                      <p className="text-sm text-muted-foreground">{locationAccuracy.toFixed(0)} meters</p>
                    </div>

                    {userAddress && (
                      <div>
                        <h3 className="text-sm font-medium mb-1">Address</h3>
                        <p className="text-sm text-muted-foreground break-words">{userAddress}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Waiting for location data...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {locationError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Location Error</AlertTitle>
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Nearby Recycling Centers</CardTitle>
                <CardDescription>{recyclingLocations.length} locations found near you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {recyclingLocations.length > 0 ? (
                    recyclingLocations.map((location) => (
                      <div key={location.id} className="flex items-center p-2 bg-muted rounded-lg">
                        <MapPin className="h-4 w-4 text-green-600 mr-2 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{location.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{location.address}</p>
                        </div>
                        <Badge variant="outline" className="ml-2 shrink-0">
                          {location.distance} km
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No recycling centers found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
