"use client"

import { useState, useRef, useCallback } from "react"
import Webcam from "react-webcam"
import { Camera, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

interface CameraViewProps {
  onCapture: (imageSrc: string) => void
}

export default function CameraView({ onCapture }: CameraViewProps) {
  const webcamRef = useRef<Webcam>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const isMobile = useMobile()

  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true)
    setCameraError(null)
  }, [])

  const handleError = useCallback((error: string | DOMException) => {
    console.error("Camera error:", error)
    setCameraError("Unable to access camera. Please check permissions and try again.")
    setIsCameraReady(false)
  }, [])

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        onCapture(imageSrc)
      }
    }
  }, [onCapture])

  const switchCamera = useCallback(() => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"))
  }, [])

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode,
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-muted">
        {cameraError ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-[300px]">
            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">{cameraError}</p>
            <Button onClick={() => setIsCameraReady(false)}>Try Again</Button>
          </div>
        ) : (
          <div className="relative aspect-[4/3] w-full">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleError}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        {isMobile && (
          <Button variant="outline" onClick={switchCamera} disabled={!isCameraReady}>
            Switch Camera
          </Button>
        )}
        <Button onClick={capture} disabled={!isCameraReady} className="bg-green-600 hover:bg-green-700">
          Capture Image
        </Button>
      </div>
    </div>
  )
}
