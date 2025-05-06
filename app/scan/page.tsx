"use client"

import { useState } from "react"
import { Upload, RefreshCw, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import CameraView from "@/components/camera-view"
import WasteResult from "@/components/waste-result"
import PointsDisplay from "@/components/points-display"
import PointsInfo from "@/components/points-info"
import { classifyWaste } from "@/lib/waste-classifier"
import { addPoints, isFirstScanOfDay, POINTS_VALUES } from "@/lib/points-service"
import FileUpload from "@/components/file-upload"

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
  const [pointsEarned, setPointsEarned] = useState<number | null>(null)
  const { toast } = useToast()

  const handleCapture = async (imageSrc: string) => {
    setCapturedImage(imageSrc)
    setIsScanning(true)
    setPointsEarned(null)

    try {
      // Classify the waste using our API (which uses Gemini)
      const result = await classifyWaste(imageSrc)
      setClassificationResult(result)
      setIsScanning(false)

      // Award points for the scan
      let totalPoints = POINTS_VALUES.SCAN_ITEM
      let pointsMessage = `Scanning an item: +${POINTS_VALUES.SCAN_ITEM}`

      // Bonus for recyclable items
      if (result.recyclable) {
        totalPoints += POINTS_VALUES.SCAN_RECYCLABLE
        pointsMessage += `\nRecyclable item bonus: +${POINTS_VALUES.SCAN_RECYCLABLE}`
      }

      // First scan of the day bonus
      if (isFirstScanOfDay()) {
        totalPoints += POINTS_VALUES.DAILY_FIRST_SCAN
        pointsMessage += `\nFirst scan today bonus: +${POINTS_VALUES.DAILY_FIRST_SCAN}`
      }

      // Add the points
      addPoints(totalPoints, `Scanned ${result.type} waste`)

      // Set points earned for display
      setPointsEarned(totalPoints)

      // Dispatch event to update points display
      window.dispatchEvent(new Event("points-updated"))

      // Show toast notification
      toast({
        title: `+${totalPoints} EcoPoints Earned!`,
        description: pointsMessage,
      })
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

  const resetScan = () => {
    setCapturedImage(null)
    setClassificationResult(null)
    setPointsEarned(null)
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">Waste Scanner</h1>
          <p className="text-muted-foreground">Scan waste items to identify them and earn EcoPoints</p>
        </div>
        <div className="md:col-span-1">
          <PointsDisplay />
        </div>
      </div>

      {!capturedImage ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
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

                    <div className="mt-6 pt-6 border-t text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Having trouble with camera access? You can also upload an image instead.
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab("upload")} className="text-darkGreen-600">
                        <Upload className="h-4 w-4 mr-2" />
                        Switch to Upload
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="upload" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Image</CardTitle>
                    <CardDescription>Upload an image of a waste item from your device</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload
                      onFileSelected={(file) => {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          const imageSrc = e.target?.result as string
                          handleCapture(imageSrc)
                        }
                        reader.readAsDataURL(file)
                      }}
                      maxSizeMB={10}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div className="md:col-span-1">
            <PointsInfo />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
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
                        <RefreshCw className="h-12 w-12 text-darkGreen-600 animate-spin" />
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
                  <Button className="bg-darkGreen-600 hover:bg-darkGreen-700" onClick={resetScan}>
                    New Scan
                  </Button>
                )}
              </CardFooter>
            </Card>

            {pointsEarned && (
              <Card className="mt-6 border-darkGreen-200 bg-darkGreen-50 dark:bg-darkGreen-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center flex-col text-center">
                    <Award className="h-12 w-12 text-darkGreen-600 mb-2" />
                    <h3 className="text-xl font-bold mb-1">Points Earned!</h3>
                    <p className="text-3xl font-bold text-darkGreen-600 mb-2">+{pointsEarned}</p>
                    <p className="text-sm text-muted-foreground">
                      {classificationResult?.recyclable
                        ? "You earned bonus points for identifying a recyclable item!"
                        : "Keep scanning to earn more points and level up!"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-1">
            <PointsDisplay showProgress={true} showRecent={true} />

            {classificationResult && (
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Environmental Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    By properly identifying waste, you're helping reduce landfill waste and promoting recycling.
                    {classificationResult.recyclable
                      ? " This item can be recycled, saving resources and energy!"
                      : " Even non-recyclable items need proper disposal to minimize environmental harm."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
