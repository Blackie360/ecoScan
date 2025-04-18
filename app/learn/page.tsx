"use client"

import type React from "react"

import { useState } from "react"
import { Search, BookOpen, Lightbulb, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface LearnItem {
  id: string
  title: string
  description: string
  category: "fact" | "myth" | "law"
  content: string
  tags: string[]
}

const learnItems: LearnItem[] = [
  {
    id: "fact1",
    title: "Plastic Decomposition Time",
    description: "How long it takes for plastic to decompose in nature",
    category: "fact",
    content:
      "Plastic bottles can take up to 450 years to decompose in the environment. During this time, they break down into microplastics that can harm wildlife and enter the food chain. Recycling plastic bottles reduces this environmental impact significantly.",
    tags: ["plastic", "decomposition", "environment"],
  },
  {
    id: "myth1",
    title: "All Plastic is Recyclable",
    description: "Common misconception about plastic recycling",
    category: "myth",
    content:
      "Not all plastics can be recycled. Plastics are labeled with numbers 1-7 that indicate their resin type. While plastics 1 (PET) and 2 (HDPE) are commonly recycled, others like 3 (PVC), 6 (polystyrene), and 7 (other) are often not accepted by recycling programs due to processing difficulties or lack of market demand.",
    tags: ["plastic", "recycling", "misconception"],
  },
  {
    id: "law1",
    title: "Nairobi Waste Management Regulations",
    description: "Key regulations for waste disposal in Nairobi",
    category: "law",
    content:
      "In Nairobi, the Environmental Management and Coordination Act requires proper segregation of waste at source. Households and businesses must separate recyclable materials from general waste. Improper disposal of waste, especially hazardous materials, can result in fines up to KES 350,000 or imprisonment for up to 18 months, or both.",
    tags: ["nairobi", "regulations", "waste management"],
  },
  {
    id: "fact2",
    title: "E-Waste Hazards",
    description: "The dangers of electronic waste",
    category: "fact",
    content:
      "Electronic waste contains toxic materials like lead, mercury, and cadmium that can leach into soil and water if improperly disposed of. One computer monitor can contain up to 8 pounds of lead. Proper e-waste recycling recovers valuable materials and prevents environmental contamination.",
    tags: ["e-waste", "hazardous", "electronic"],
  },
  {
    id: "myth2",
    title: "Paper Can Be Recycled Infinitely",
    description: "Limits of paper recycling",
    category: "myth",
    content:
      "Paper cannot be recycled indefinitely. Each time paper is recycled, the fibers become shorter and weaker. Typically, paper can be recycled 5-7 times before the fibers become too short to be useful. After that, virgin paper fibers need to be added to maintain quality.",
    tags: ["paper", "recycling", "limitations"],
  },
  {
    id: "law2",
    title: "Plastic Bag Ban in Kenya",
    description: "Kenya's plastic bag legislation",
    category: "law",
    content:
      "Since August 2017, Kenya has implemented one of the world's strictest plastic bag bans. The manufacture, sale, and use of plastic carrier bags is prohibited, with penalties including fines up to KES 4 million or imprisonment up to 4 years. This law has significantly reduced plastic pollution in the country.",
    tags: ["kenya", "plastic bags", "ban"],
  },
]

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [filteredItems, setFilteredItems] = useState<LearnItem[]>(learnItems)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterItems()
  }

  const filterItems = () => {
    let filtered = [...learnItems]

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((item) => item.category === activeCategory)
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    setFilteredItems(filtered)
  }

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value)
    setTimeout(filterItems, 0)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fact":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />
      case "myth":
        return <BookOpen className="h-5 w-5 text-purple-500" />
      case "law":
        return <FileText className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Learn About Waste & Recycling</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find information about waste management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch}>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              <div>
                <h3 className="text-sm font-medium mb-2">Filter by category:</h3>
                <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryChange}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="fact">Facts</TabsTrigger>
                    <TabsTrigger value="myth">Myths</TabsTrigger>
                    <TabsTrigger value="law">Laws</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Did You Know?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Recycling one aluminum can saves enough energy to run a TV for three hours or a 100-watt bulb for 20
                hours.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <div className="grid grid-cols-1 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-2">
                      {getCategoryIcon(item.category)}
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{item.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No results found</h3>
                  <p className="text-sm text-muted-foreground mt-1">Try changing your search query or filters</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
