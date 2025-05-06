import { Award, Camera, Recycle, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { POINTS_VALUES } from "@/lib/points-service"

export default function PointsInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-darkGreen-500" />
          How to Earn EcoPoints
        </CardTitle>
        <CardDescription>Earn points by scanning and identifying waste items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
            <Camera className="h-8 w-8 mb-2 text-darkGreen-500" />
            <h3 className="font-medium mb-1">Scan Any Item</h3>
            <p className="text-sm text-muted-foreground">
              +{POINTS_VALUES.SCAN_ITEM} points for each waste item you scan
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
            <Recycle className="h-8 w-8 mb-2 text-darkGreen-500" />
            <h3 className="font-medium mb-1">Recyclable Bonus</h3>
            <p className="text-sm text-muted-foreground">
              +{POINTS_VALUES.SCAN_RECYCLABLE} extra points for recyclable items
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
            <Calendar className="h-8 w-8 mb-2 text-darkGreen-500" />
            <h3 className="font-medium mb-1">Daily Bonus</h3>
            <p className="text-sm text-muted-foreground">
              +{POINTS_VALUES.DAILY_FIRST_SCAN} bonus points for your first scan each day
            </p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Points are stored locally on your device. Earn points to level up and track your environmental impact!</p>
        </div>
      </CardContent>
    </Card>
  )
}
