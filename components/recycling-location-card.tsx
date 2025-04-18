"use client"

import { MapPin, ExternalLink, Navigation } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface RecyclingLocationProps {
  location: {
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
}

export default function RecyclingLocationCard({ location }: RecyclingLocationProps) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      plastic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      paper: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      glass: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      metal: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      organic: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      electronic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      hazardous: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }

    return colors[type] || ""
  }

  const openDirections = () => {
    const { lat, lng } = location.coordinates
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank")
  }

  const openLocationDetails = () => {
    // In a real app, this would open a detailed view of the location
    // For now, we'll just open the coordinates in OpenStreetMap
    const { lat, lng } = location.coordinates
    window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`, "_blank")
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{location.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {location.address}
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {location.distance} km
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2">
          {location.type.map((type) => (
            <Badge key={type} className={getTypeColor(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={openDirections}>
          <Navigation className="h-4 w-4 mr-2" />
          Directions
        </Button>
        <Button variant="ghost" size="sm" onClick={openLocationDetails}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Details
        </Button>
      </CardFooter>
    </Card>
  )
}
