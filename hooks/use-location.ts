"use client"

import { useState, useEffect, useRef } from "react"

interface LocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  isLoading: boolean
}

export function useLocation(options?: PositionOptions) {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: true,
  })

  const watchIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        isLoading: false,
      }))
      return
    }

    // Default options
    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }

    const positionOptions = { ...defaultOptions, ...options }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          isLoading: false,
        })
      },
      (error) => {
        setLocation({
          latitude: null,
          longitude: null,
          accuracy: null,
          error: `Error getting location: ${error.message}`,
          isLoading: false,
        })
      },
      positionOptions,
    )

    // Watch position for changes
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          isLoading: false,
        })
      },
      (error) => {
        setLocation((prev) => ({
          ...prev,
          error: `Error watching location: ${error.message}`,
        }))
      },
      positionOptions,
    )

    // Cleanup
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [options])

  return location
}
