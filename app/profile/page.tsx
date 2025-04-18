"use client"

import { useState, useEffect } from "react"
import { User, Award, BarChart2, Clock, Leaf, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface WasteLog {
  id: string
  type: string
  recyclable: boolean
  timestamp: string
}

interface BadgeType {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  progress: number
}

export default function ProfilePage() {
  const [ecoPoints, setEcoPoints] = useState<number>(0)
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([])
  const [badges, setBadges] = useState<BadgeType[]>([
    {
      id: "badge1",
      name: "Recycling Rookie",
      description: "Scan 10 recyclable items",
      icon: "🌱",
      earned: false,
      progress: 0,
    },
    {
      id: "badge2",
      name: "Waste Warrior",
      description: "Scan 50 items in total",
      icon: "🛡️",
      earned: false,
      progress: 0,
    },
    {
      id: "badge3",
      name: "EcoHero",
      description: "Earn 500 EcoPoints",
      icon: "🏆",
      earned: false,
      progress: 0,
    },
    {
      id: "badge4",
      name: "Knowledge Seeker",
      description: "Read 20 articles in the Learn section",
      icon: "📚",
      earned: false,
      progress: 0,
    },
  ])

  // Load user data from localStorage (in a real app, this would come from a database)
  useEffect(() => {
    // Load EcoPoints
    const storedPoints = localStorage.getItem("ecoPoints")
    if (storedPoints) {
      setEcoPoints(Number.parseInt(storedPoints))
    }

    // Load waste logs
    const storedLogs = localStorage.getItem("scannedItems")
    if (storedLogs) {
      const logs = JSON.parse(storedLogs)
      setWasteLogs(
        logs.map((log: any, index: number) => ({
          id: `log${index}`,
          type: log.type,
          recyclable: log.recyclable,
          timestamp: log.timestamp,
        })),
      )
    }

    // Update badge progress based on data
    updateBadgeProgress()
  }, [])

  const updateBadgeProgress = () => {
    const storedLogs = localStorage.getItem("scannedItems")
    const logs = storedLogs ? JSON.parse(storedLogs) : []
    const points = Number.parseInt(localStorage.getItem("ecoPoints") || "0")

    const recyclableCount = logs.filter((log: any) => log.recyclable).length
    const totalScans = logs.length

    setBadges((prev) =>
      prev.map((badge) => {
        if (badge.id === "badge1") {
          const progress = Math.min(recyclableCount / 10, 1)
          return {
            ...badge,
            earned: recyclableCount >= 10,
            progress: progress * 100,
          }
        } else if (badge.id === "badge2") {
          const progress = Math.min(totalScans / 50, 1)
          return {
            ...badge,
            earned: totalScans >= 50,
            progress: progress * 100,
          }
        } else if (badge.id === "badge3") {
          const progress = Math.min(points / 500, 1)
          return {
            ...badge,
            earned: points >= 500,
            progress: progress * 100,
          }
        } else if (badge.id === "badge4") {
          // In a real app, we'd track article reads
          const readCount = 5 // Mock value
          const progress = Math.min(readCount / 20, 1)
          return {
            ...badge,
            earned: readCount >= 20,
            progress: progress * 100,
          }
        }
        return badge
      }),
    )
  }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  // Calculate statistics
  const recyclableCount = wasteLogs.filter((log) => log.recyclable).length
  const nonRecyclableCount = wasteLogs.length - recyclableCount
  const recyclingRate = wasteLogs.length > 0 ? (recyclableCount / wasteLogs.length) * 100 : 0

  // Calculate environmental impact (simplified estimates)
  const co2Saved = recyclableCount * 1.5 // kg of CO2
  const waterSaved = recyclableCount * 20 // liters of water
  const energySaved = recyclableCount * 5 // kWh of energy

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="text-2xl">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle>EcoScan User</CardTitle>
                <CardDescription>Joined April 2025</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">EcoPoints</p>
                  <p className="text-3xl font-bold text-green-600">{ecoPoints}</p>
                </div>

                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level 2: Eco Enthusiast</span>
                    <span>500 pts to Level 3</span>
                  </div>
                  <Progress value={Math.min((ecoPoints / 500) * 100, 100)} className="h-2" />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-medium">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Items Scanned</p>
                    <p className="text-xl font-bold">{wasteLogs.length}</p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Recycled</p>
                    <p className="text-xl font-bold">{recyclableCount}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="stats">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="stats">
                <BarChart2 className="h-4 w-4 mr-2" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="logs">
                <Clock className="h-4 w-4 mr-2" />
                Waste Logs
              </TabsTrigger>
              <TabsTrigger value="badges">
                <Award className="h-4 w-4 mr-2" />
                Badges
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Your Environmental Impact</CardTitle>
                  <CardDescription>See the positive difference you're making</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">CO₂ Saved</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold">{co2Saved.toFixed(1)}</div>
                          <div className="ml-2 text-sm text-muted-foreground">kg</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Water Saved</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold">{waterSaved.toFixed(0)}</div>
                          <div className="ml-2 text-sm text-muted-foreground">liters</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Energy Saved</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold">{energySaved.toFixed(1)}</div>
                          <div className="ml-2 text-sm text-muted-foreground">kWh</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Recycling Rate</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Your recycling rate</span>
                          <span>{recyclingRate.toFixed(0)}%</span>
                        </div>
                        <Progress value={recyclingRate} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Waste Breakdown</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center p-3 bg-muted rounded-lg">
                          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                          <div className="flex-1">
                            <p className="text-sm">Recyclable</p>
                          </div>
                          <p className="font-medium">{recyclableCount}</p>
                        </div>
                        <div className="flex items-center p-3 bg-muted rounded-lg">
                          <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                          <div className="flex-1">
                            <p className="text-sm">Non-Recyclable</p>
                          </div>
                          <p className="font-medium">{nonRecyclableCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>Waste Scanning History</CardTitle>
                  <CardDescription>A record of all items you've scanned</CardDescription>
                </CardHeader>
                <CardContent>
                  {wasteLogs.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {wasteLogs.map((log) => (
                        <div key={log.id} className="flex items-center p-3 bg-muted rounded-lg">
                          <UIBadge className={getTypeColor(log.type)}>
                            {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                          </UIBadge>
                          <div className="ml-3 flex-1">
                            <p className="text-sm">{log.recyclable ? "Recyclable" : "Non-Recyclable"}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</p>
                          </div>
                          {log.recyclable ? <Leaf className="h-4 w-4 text-green-600" /> : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No items scanned yet</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start scanning waste items to build your history
                      </p>
                      <Button
                        className="mt-4 bg-green-600 hover:bg-green-700"
                        onClick={() => (window.location.href = "/scan")}
                      >
                        Scan Your First Item
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges">
              <Card>
                <CardHeader>
                  <CardTitle>Achievement Badges</CardTitle>
                  <CardDescription>Earn badges by completing eco-friendly activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {badges.map((badge) => (
                      <Card key={badge.id} className={badge.earned ? "border-green-500" : ""}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-2xl mr-2">{badge.icon}</div>
                              <CardTitle className="text-base">{badge.name}</CardTitle>
                            </div>
                            {badge.earned && (
                              <UIBadge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Earned
                              </UIBadge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{badge.progress.toFixed(0)}%</span>
                            </div>
                            <Progress value={badge.progress} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
