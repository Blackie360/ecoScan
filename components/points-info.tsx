import { Award, Camera, Recycle, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { POINTS_VALUES } from "@/lib/points-service"

export default function PointsInfo() {
  return (
    <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-2xl">
          <div className="relative mr-3">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
            <Award className="h-6 w-6 text-primary relative z-10" />
          </div>
          How to Earn EcoPoints
        </CardTitle>
        <CardDescription className="text-base">Earn points by scanning and identifying waste items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="group flex flex-col items-center text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 hover:border-primary hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
              <Camera className="h-10 w-10 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-semibold mb-2 text-lg group-hover:text-primary transition-colors">Scan Any Item</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              +{POINTS_VALUES.SCAN_ITEM} points for each waste item you scan
            </p>
          </div>

          <div className="group flex flex-col items-center text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 hover:border-primary hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
              <Recycle className="h-10 w-10 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-semibold mb-2 text-lg group-hover:text-primary transition-colors">Recyclable Bonus</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              +{POINTS_VALUES.SCAN_RECYCLABLE} extra points for recyclable items
            </p>
          </div>

          <div className="group flex flex-col items-center text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 hover:border-primary hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
              <Calendar className="h-10 w-10 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-semibold mb-2 text-lg group-hover:text-primary transition-colors">Daily Bonus</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              +{POINTS_VALUES.DAILY_FIRST_SCAN} bonus points for your first scan each day
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Points are stored locally on your device. Earn points to level up and track your environmental impact!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
