"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Spinner } from "@/components/ui/spinner"

// Fix Leaflet marker icon issues in Next.js
const fixLeafletIcons = () => {
  // Only run on client side
  if (typeof window !== "undefined") {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })
  }
}

// Custom marker icons
const createCustomIcon = (iconUrl: string, iconSize: [number, number]) => {
  return L.icon({
    iconUrl,
    iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1]],
    popupAnchor: [0, -iconSize[1]],
  })
}

// Component to recenter map when location changes
function LocationMarker({
  position,
  accuracy,
  onLocationFound,
}: {
  position: [number, number] | null
  accuracy: number
  onLocationFound?: (lat: number, lng: number, accuracy: number) => void
}) {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom())
      if (onLocationFound) {
        onLocationFound(position[0], position[1], accuracy)
      }
    }
  }, [position, map, accuracy, onLocationFound])

  if (!position) return null

  return (
    <>
      <Circle center={position} radius={accuracy} pathOptions={{ color: "blue", fillColor: "blue", weight: 1 }} />
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    </>
  )
}

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

interface InteractiveMapProps {
  height?: string
  locations?: RecyclingLocation[]
  onLocationUpdate?: (lat: number, lng: number, accuracy: number) => void
  initialPosition?: [number, number]
  zoom?: number
}

export default function InteractiveMap({
  height = "500px",
  locations = [],
  onLocationUpdate,
  initialPosition = [0, 0],
  zoom = 13,
}: InteractiveMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [accuracy, setAccuracy] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)

  // Fix Leaflet icons
  useEffect(() => {
    fixLeafletIcons()
  }, [])

  // Get and watch user location
  useEffect(() => {
    setIsLoading(true)
    setError(null)

    // Get initial position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords
          setPosition([latitude, longitude])
          setAccuracy(accuracy)
          setIsLoading(false)
        },
        (err) => {
          console.error("Error getting location:", err)
          setError(`Location error: ${err.message}`)
          setIsLoading(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )

      // Watch position for changes
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords
          setPosition([latitude, longitude])
          setAccuracy(accuracy)
          if (onLocationUpdate) {
            onLocationUpdate(latitude, longitude, accuracy)
          }
        },
        (err) => {
          console.error("Error watching location:", err)
          setError(`Location watch error: ${err.message}`)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      setError("Geolocation is not supported by your browser")
      setIsLoading(false)
    }

    // Cleanup
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [onLocationUpdate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-muted rounded-md" style={{ height }}>
        <div className="flex flex-col items-center">
          <Spinner className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-muted rounded-md" style={{ height }}>
        <div className="flex flex-col items-center text-center p-4">
          <p className="text-sm text-destructive">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Please enable location services in your browser settings to use this feature.
          </p>
        </div>
      </div>
    )
  }

  // Use position if available, otherwise use initialPosition
  const mapCenter = position || initialPosition

  return (
    <div style={{ height }} className="rounded-md overflow-hidden">
      <MapContainer center={mapCenter} zoom={zoom} style={{ height: "100%", width: "100%" }} className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://tile.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=pk.ff32370c2e4fb2e2851ba7107e229e96`}
        />
        <LocationMarker position={position} accuracy={accuracy} onLocationFound={onLocationUpdate} />

        {/* Render recycling locations */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.coordinates.lat, location.coordinates.lng]}
            icon={createCustomIcon("/recycling-marker.svg", [32, 32])}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-medium text-sm">{location.name}</h3>
                <p className="text-xs text-muted-foreground">{location.address}</p>
                <p className="text-xs mt-1">
                  <span className="font-medium">Distance:</span> {location.distance} km
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
