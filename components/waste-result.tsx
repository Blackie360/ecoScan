import { X, Recycle, AlertTriangle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface WasteResultProps {
  result: {
    type: string
    confidence: number
    recyclable: boolean
    disposalInstructions: string
    environmentalImpact: string
  }
}

export default function WasteResult({ result }: WasteResultProps) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      plastic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      paper: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      glass: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      metal: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      organic: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      electronic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      hazardous: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      unknown: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    }

    return colors[type] || colors.unknown
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={getTypeColor(result.type)}>
            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
          </Badge>
          <Badge variant={result.recyclable ? "outline" : "destructive"}>
            {result.recyclable ? (
              <span className="flex items-center gap-1">
                <Recycle className="h-3 w-3" /> Recyclable
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <X className="h-3 w-3" /> Non-Recyclable
              </span>
            )}
          </Badge>
        </div>
        <Badge variant="outline">{Math.round(result.confidence * 100)}% Confidence</Badge>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium">Disposal Instructions</h4>
            <p className="text-sm text-muted-foreground">{result.disposalInstructions}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium">Environmental Impact</h4>
            <p className="text-sm text-muted-foreground">{result.environmentalImpact}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
