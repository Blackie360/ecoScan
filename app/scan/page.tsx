"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import CameraView from "@/components/camera-view"
import WasteResult from "@/components/waste-result"
import { classifyWaste } from "@/lib/waste-classifier"

type WasteType = "plastic" | "paper" | "glass" | "metal" | "organic" | "electronic" | "hazardous" | "unknown"

interface ClassificationResult {
  type: WasteType
  confidence: number
  recyclable: boolean
  disposalInstructions: string
  environmentalImpact: string
}

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState<string>("camera")
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleCapture = async (imageSrc: string) => {
    setCapturedImage(imageSrc)
    setIsScanning(true)

    try {
      // Classify the waste using our API (which uses Gemini)
      const result = await classifyWaste(imageSrc)
      setClassificationResult(result)
      setIsScanning(false)
    } catch (error) {
      console.error("Classification error:", error)
      setIsScanning(false)

      toast({
        title: "Classification Failed",
        description: "Unable to classify the waste item. Please try again or check your connection.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageSrc = e.target?.result as string
      handleCapture(imageSrc)
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const resetScan = () => {
    setCapturedImage(null)
    setClassificationResult(null)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Waste Scanner</h1>

      {!capturedImage ? (
        <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera">Camera</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="camera" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Camera Scanner</CardTitle>
                <CardDescription>Point your camera at a waste item to classify it</CardDescription>
              </CardHeader>
              <CardContent>
                <CameraView onCapture={handleCapture} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upload" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>Upload an image of a waste item from your device</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Click the button below to select an image from your device
                </p>
                <Button onClick={triggerFileInput}>Select Image</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isScanning ? "Analyzing Waste Item..." : "Classification Result"}</CardTitle>
              <CardDescription>
                {isScanning
                  ? "Our AI is analyzing your waste item"
                  : classificationResult
                    ? `Identified as ${classificationResult.type} with ${Math.round(classificationResult.confidence * 100)}% confidence`
                    : "Analysis complete"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured waste item"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  {isScanning ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                      <RefreshCw className="h-12 w-12 text-green-600 animate-spin" />
                      <Progress value={45} className="w-full" />
                      <p className="text-sm text-muted-foreground">Analyzing image and identifying waste type...</p>
                    </div>
                  ) : (
                    classificationResult && <WasteResult result={classificationResult} />
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetScan}>
                Scan Another Item
              </Button>
              {classificationResult && (
                <Button className="bg-green-600 hover:bg-green-700" onClick={resetScan}>
                  New Scan
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
