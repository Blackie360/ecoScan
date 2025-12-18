"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLocation } from "@/hooks/use-location"
import { reverseGeocode } from "@/lib/location-service"

interface LocationDisplayProps {
  showMap?: boolean
  showAddress?: boolean
  showCoordinates?: boolean
  className?: string
}

export default function LocationDisplay({
  showMap = false,
  showAddress = true,
  showCoordinates = true,
  className = "",
}: LocationDisplayProps) {
  const { latitude, longitude, accuracy, error, isLoading } = useLocation()
  const [address, setAddress] = useState<string | null>(null)
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false)

  useEffect(() => {
    if (latitude && longitude && showAddress) {
      fetchAddress(latitude, longitude)
    }
  }, [latitude, longitude, showAddress])

  const fetchAddress = async (lat: number, lng: number) => {
    setIsLoadingAddress(true)
    try {
      const result = await reverseGeocode(lat, lng)
      setAddress(result.display_name)
    } catch (error) {
      console.error("Error fetching address:", error)
      setAddress(null)
    } finally {
      setIsLoadingAddress(false)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center">
            <Spinner className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Getting your location...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <MapPin className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!latitude || !longitude) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">Location not available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Your Location
        </CardTitle>
        {accuracy && <CardDescription>Accuracy: {Math.round(accuracy)} meters</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-2">
        {showCoordinates && (
          <div className="text-sm">
            <p>
              <span className="font-medium">Latitude:</span> {latitude.toFixed(6)}
            </p>
            <p>
              <span className="font-medium">Longitude:</span> {longitude.toFixed(6)}
            </p>
          </div>
        )}

        {showAddress && (
          <div className="text-sm">
            <p className="font-medium">Address:</p>
            {isLoadingAddress ? (
              <div className="flex items-center mt-1">
                <Spinner className="h-3 w-3 mr-2" />
                <span className="text-muted-foreground">Loading address...</span>
              </div>
            ) : address ? (
              <p className="text-muted-foreground break-words">{address}</p>
            ) : (
              <p className="text-muted-foreground">Address not available</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
