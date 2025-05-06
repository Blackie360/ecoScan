"use client"

import { useState, useEffect } from "react"
import { Award, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getPointsState, getRecentTransactions, type PointsTransaction } from "@/lib/points-service"

interface PointsDisplayProps {
  showRecent?: boolean
  showProgress?: boolean
  className?: string
}

export default function PointsDisplay({ showRecent = true, showProgress = true, className = "" }: PointsDisplayProps) {
  const [points, setPoints] = useState(0)
  const [transactions, setTransactions] = useState<PointsTransaction[]>([])

  // Update points when component mounts and after any scan
  useEffect(() => {
    const updatePoints = () => {
      const state = getPointsState()
      setPoints(state.balance)
      setTransactions(getRecentTransactions(5))
    }

    updatePoints()

    // Listen for points updates
    window.addEventListener("points-updated", updatePoints)

    return () => {
      window.removeEventListener("points-updated", updatePoints)
    }
  }, [])

  // Format the timestamp to a readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate progress to next level (every 100 points)
  const currentLevel = Math.floor(points / 100)
  const nextLevelPoints = (currentLevel + 1) * 100
  const progress = ((points % 100) / 100) * 100

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Award className="h-5 w-5 mr-2 text-darkGreen-500" />
            EcoPoints
          </CardTitle>
          <Badge variant="outline" className="text-lg font-bold px-3 py-1 bg-darkGreen-50 text-darkGreen-700">
            {points}
          </Badge>
        </div>
        <CardDescription>Earn points by scanning and identifying waste items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {currentLevel}</span>
              <span>
                {points} / {nextLevelPoints} points
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {100 - (points % 100)} more points to reach Level {currentLevel + 1}
            </p>
          </div>
        )}

        {showRecent && transactions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Recent Activity
            </h4>
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded-md"
                >
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-2 text-darkGreen-500" />
                    <span className="text-xs">{transaction.reason}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{formatTime(transaction.timestamp)}</span>
                    <Badge variant="outline" className="text-xs bg-darkGreen-50 text-darkGreen-700">
                      +{transaction.amount}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
