"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Search, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import RecyclingLocationCard from "@/components/recycling-location-card"
import { geocodeAddress, reverseGeocode, getStaticMapUrl, calculateDistance } from "@/lib/location-service"

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

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeWasteType, setActiveWasteType] = useState<string>("all")
  const [recyclingLocations, setRecyclingLocations] = useState<RecyclingLocation[]>([])
  const [filteredLocations, setFilteredLocations] = useState<RecyclingLocation[]>([])
  const [mapUrl, setMapUrl] = useState<string | null>(null)
  const [isLoadingMap, setIsLoadingMap] = useState<boolean>(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch recycling locations when user location changes
    if (userLocation) {
      fetchRecyclingLocations(userLocation.lat, userLocation.lng)
      updateMap(userLocation.lat, userLocation.lng)
      fetchUserAddress(userLocation.lat, userLocation.lng)
    }
  }, [userLocation])

  useEffect(() => {
    // Filter locations based on active waste type and search query
    filterLocations()
  }, [activeWasteType, searchQuery, recyclingLocations])

  const fetchUserAddress = async (lat: number, lng: number) => {
    try {
      const result = await reverseGeocode(lat, lng)
      setUserAddress(result.display_name)
    } catch (error) {
      console.error("Error fetching address:", error)
      setUserAddress("Unknown location")
    }
  }

  const updateMap = (lat: number, lng: number) => {
    setIsLoadingMap(true)

    try {
      // Create markers for all visible recycling locations
      let markers = `icon:default|${lat},${lng}`

      filteredLocations.slice(0, 5).forEach((location) => {
        markers += `|icon:recycling|${location.coordinates.lat},${location.coordinates.lng}`
      })

      const mapImageUrl = getStaticMapUrl(`${lat},${lng}`, 13, 600, 400, markers)
      setMapUrl(mapImageUrl)
    } catch (error) {
      console.error("Error updating map:", error)
    } finally {
      setIsLoadingMap(false)
    }
  }

  const fetchRecyclingLocations = async (lat: number, lng: number) => {
    setLocationError(null)

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
          coordinates: { lat: -1.2921, lng: 36.8219 },
        },
        {
          id: "2",
          name: "Westlands E-Waste Collection",
          type: ["electronic"],
          address: "45 Westlands Avenue, Nairobi",
          distance: 0, // Will be calculated
          coordinates: { lat: -1.2673, lng: 36.8035 },
        },
        {
          id: "3",
          name: "Karen Organic Waste Center",
          type: ["organic"],
          address: "78 Karen Road, Nairobi",
          distance: 0, // Will be calculated
          coordinates: { lat: -1.3193, lng: 36.7062 },
        },
        {
          id: "4",
          name: "Kilimani Metal Recycling",
          type: ["metal"],
          address: "32 Kilimani Street, Nairobi",
          distance: 0, // Will be calculated
          coordinates: { lat: -1.2864, lng: 36.7831 },
        },
        {
          id: "5",
          name: "Lavington Green Recyclers",
          type: ["plastic", "paper", "glass", "metal"],
          address: "90 Lavington Green, Nairobi",
          distance: 0, // Will be calculated
          coordinates: { lat: -1.2762, lng: 36.7667 },
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

      setRecyclingLocations(locationsWithDistances)
    } catch (error) {
      console.error("Error fetching recycling locations:", error)
      setLocationError("Failed to load recycling locations. Please try again.")
    }
  }

  const filterLocations = () => {
    let filtered = [...recyclingLocations]

    // Filter by waste type
    if (activeWasteType !== "all") {
      filtered = filtered.filter((location) => location.type.includes(activeWasteType))
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (location) => location.name.toLowerCase().includes(query) || location.address.toLowerCase().includes(query),
      )
    }

    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance)

    setFilteredLocations(filtered)

    // Update map if we have user location and filtered locations
    if (userLocation && filtered.length > 0) {
      updateMap(userLocation.lat, userLocation.lng)
    }
  }

  const searchLocation = async () => {
    if (!searchQuery.trim()) return

    setIsLoadingLocation(true)
    setLocationError(null)

    try {
      const results = await geocodeAddress(searchQuery)

      if (results && results.length > 0) {
        const location = results[0]
        const lat = Number.parseFloat(location.lat)
        const lng = Number.parseFloat(location.lon)

        setUserLocation({ lat, lng })

        toast({
          title: "Location Found",
          description: `Showing recycling centers near ${location.display_name}`,
        })
      } else {
        toast({
          title: "Location Not Found",
          description: "Could not find the location you searched for. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error searching location:", error)
      toast({
        title: "Search Error",
        description: "Failed to search for the location. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const getUserLocation = () => {
    setIsLoadingLocation(true)
    setLocationError(null)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setIsLoadingLocation(false)

          toast({
            title: "Location Updated",
            description: "We've updated your location to find nearby recycling centers.",
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoadingLocation(false)
          setLocationError("Unable to get your location. Please check your browser permissions.")

          toast({
            title: "Location Error",
            description: "Unable to get your location. Please try again or enter it manually.",
            variant: "destructive",
          })
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      )
    } else {
      setIsLoadingLocation(false)
      setLocationError("Geolocation is not supported by your browser.")

      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation. Please enter your location manually.",
        variant: "destructive",
      })
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchLocation()
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Recycling Locations</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Locations</CardTitle>
              <CardDescription>Discover recycling and waste collection points near you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="flex-1"
                />
                <Button size="icon" onClick={searchLocation} disabled={isLoadingLocation || !searchQuery.trim()}>
                  {isLoadingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              <div>
                <Button onClick={getUserLocation} disabled={isLoadingLocation} variant="outline" className="w-full">
                  {isLoadingLocation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <Navigation className="mr-2 h-4 w-4" />
                      Use my location
                    </>
                  )}
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Filter by waste type:</h3>
                <Tabs defaultValue="all" value={activeWasteType} onValueChange={setActiveWasteType}>
                  <TabsList className="grid grid-cols-4 mb-2">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="plastic">Plastic</TabsTrigger>
                    <TabsTrigger value="paper">Paper</TabsTrigger>
                    <TabsTrigger value="glass">Glass</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="metal">Metal</TabsTrigger>
                    <TabsTrigger value="electronic">E-Waste</TabsTrigger>
                    <TabsTrigger value="organic">Organic</TabsTrigger>
                    <TabsTrigger value="hazardous">Hazardous</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {userLocation && userAddress && (
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertTitle>Location Active</AlertTitle>
              <AlertDescription className="break-words">
                Showing recycling locations near {userAddress}
              </AlertDescription>
            </Alert>
          )}

          {locationError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Location Error</AlertTitle>
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Map View</CardTitle>
              <CardDescription>
                {userLocation
                  ? "Showing recycling locations near you"
                  : "Use the search or location button to find recycling centers"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px] bg-muted rounded-md overflow-hidden relative">
                {isLoadingMap && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}

                {mapUrl ? (
                  <img
                    src={mapUrl || "/placeholder.svg"}
                    alt="Map showing recycling locations"
                    className="w-full h-full object-cover"
                    onLoad={() => setIsLoadingMap(false)}
                    onError={() => {
                      setIsLoadingMap(false)
                      setLocationError("Failed to load map. Please try again.")
                    }}
                  />
                ) : userLocation ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No location selected</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Search for a location or use your current location to see recycling centers
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nearby Locations</CardTitle>
              <CardDescription>
                {filteredLocations.length} recycling locations found
                {activeWasteType !== "all" && ` for ${activeWasteType} waste`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => <RecyclingLocationCard key={location.id} location={location} />)
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No locations found</h3>
                    <p className="text-sm text-muted-foreground mt-1">Try changing your filters or search query</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
