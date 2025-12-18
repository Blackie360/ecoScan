"use client"

import { useState, useEffect } from "react"
import { Award, TrendingUp, Calendar, BarChart2, Recycle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import PointsInfo from "@/components/points-info"
import { getPointsState, type PointsTransaction } from "@/lib/points-service"

export default function PointsPage() {
  const [points, setPoints] = useState(0)
  const [transactions, setTransactions] = useState<PointsTransaction[]>([])
  const [stats, setStats] = useState({
    totalScans: 0,
    recyclableItems: 0,
    dailyBonuses: 0,
  })

  useEffect(() => {
    const updateData = () => {
      const state = getPointsState()
      setPoints(state.balance)
      setTransactions(state.transactions)

      // Calculate stats
      const totalScans = state.transactions.length
      const recyclableItems = state.transactions.filter((t) => t.reason.toLowerCase().includes("recyclable")).length
      const dailyBonuses = state.transactions.filter((t) => t.reason.toLowerCase().includes("first scan")).length

      setStats({
        totalScans,
        recyclableItems,
        dailyBonuses,
      })
    }

    updateData()

    // Listen for points updates
    window.addEventListener("points-updated", updateData)

    return () => {
      window.removeEventListener("points-updated", updateData)
    }
  }, [])

  // Format the timestamp to a readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate level information
  const currentLevel = Math.floor(points / 100)
  const nextLevelPoints = (currentLevel + 1) * 100
  const progress = ((points % 100) / 100) * 100

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">EcoPoints Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <Card className="bg-darkGreen-50 dark:bg-darkGreen-900/20 border-darkGreen-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-darkGreen-600" />
                Your EcoPoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4">
                <div className="text-5xl font-bold text-darkGreen-600 mb-2">{points}</div>
                <div className="text-sm text-muted-foreground">Total points earned</div>

                <div className="w-full mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level {currentLevel}</span>
                    <span>
                      {points} / {nextLevelPoints} points
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {100 - (points % 100)} more points to reach Level {currentLevel + 1}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Points Statistics</CardTitle>
              <CardDescription>Overview of your EcoPoints activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <Calendar className="h-8 w-8 mb-2 text-darkGreen-500" />
                  <div className="text-2xl font-bold">{stats.totalScans}</div>
                  <div className="text-sm text-muted-foreground text-center">Total Scans</div>
                </div>

                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <Recycle className="h-8 w-8 mb-2 text-darkGreen-500" />
                  <div className="text-2xl font-bold">{stats.recyclableItems}</div>
                  <div className="text-sm text-muted-foreground text-center">Recyclable Items</div>
                </div>

                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <BarChart2 className="h-8 w-8 mb-2 text-darkGreen-500" />
                  <div className="text-2xl font-bold">{stats.dailyBonuses}</div>
                  <div className="text-sm text-muted-foreground text-center">Daily Bonuses</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <PointsInfo />
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Complete record of your EcoPoints activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between text-sm bg-muted/50 p-3 rounded-md"
                        >
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-darkGreen-500" />
                            <span>{transaction.reason}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">{formatTime(transaction.timestamp)}</span>
                            <Badge variant="outline" className="bg-darkGreen-50 text-darkGreen-700">
                              +{transaction.amount}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Award className="h-6 w-6" />
                        </EmptyMedia>
                        <EmptyTitle>No transactions yet</EmptyTitle>
                        <EmptyDescription>
                          Start scanning waste items to earn points and build your history
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your most recent EcoPoints transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="space-y-3">
                      {transactions.slice(0, 10).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between text-sm bg-muted/50 p-3 rounded-md"
                        >
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-darkGreen-500" />
                            <span>{transaction.reason}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">{formatTime(transaction.timestamp)}</span>
                            <Badge variant="outline" className="bg-darkGreen-50 text-darkGreen-700">
                              +{transaction.amount}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Award className="h-6 w-6" />
                        </EmptyMedia>
                        <EmptyTitle>No recent activity</EmptyTitle>
                        <EmptyDescription>Start scanning waste items to earn points</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
