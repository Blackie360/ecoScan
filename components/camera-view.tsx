"use client"

import { useState, useRef, useCallback } from "react"
import Webcam from "react-webcam"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useMobile } from "@/hooks/use-mobile"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CameraViewProps {
  onCapture: (imageSrc: string) => void
}

export default function CameraView({ onCapture }: CameraViewProps) {
  const webcamRef = useRef<Webcam>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const isMobile = useMobile()

  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true)
    setCameraError(null)
    setPermissionDenied(false)
  }, [])

  const handleError = useCallback((error: string | DOMException) => {
    console.error("Camera error:", error)

    // Check for specific permission errors
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      setPermissionDenied(true)
      setCameraError("Camera access was denied. You need to allow camera access to use this feature.")
    } else if (error instanceof DOMException && error.name === "NotFoundError") {
      setCameraError("No camera device was found. Please ensure your device has a working camera.")
    } else if (error instanceof DOMException && error.name === "NotReadableError") {
      setCameraError("Your camera is in use by another application. Please close other applications using your camera.")
    } else {
      setCameraError(`Unable to access camera: ${error instanceof Error ? error.message : String(error)}`)
    }

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

  const retryCamera = useCallback(() => {
    setCameraError(null)
    setPermissionDenied(false)
    setIsCameraReady(false)
    // Small timeout to ensure the webcam component is fully reset
    setTimeout(() => {
      setIsCameraReady(false)
    }, 100)
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
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Camera Access Error</h3>
            <p className="text-sm text-muted-foreground mb-6">{cameraError}</p>

            {permissionDenied && (
              <Alert className="mb-4 max-w-sm">
                <AlertTitle>How to enable camera access:</AlertTitle>
                <AlertDescription className="text-xs text-left">
                  <ol className="list-decimal pl-4 space-y-1 mt-2">
                    <li>Click the camera/lock icon in your browser's address bar</li>
                    <li>Select "Allow" for camera access</li>
                    <li>Refresh the page or click the retry button below</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={retryCamera}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Camera Access
            </Button>
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
                <Spinner className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        {isMobile && isCameraReady && (
          <Button variant="outline" onClick={switchCamera}>
            Switch Camera
          </Button>
        )}
        {isCameraReady && (
          <Button onClick={capture} className="bg-darkGreen-600 hover:bg-darkGreen-700">
            Capture Image
          </Button>
        )}
      </div>
    </div>
  )
}
