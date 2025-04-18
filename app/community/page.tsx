"use client"

import { useState } from "react"
import { MessageSquare, PlusCircle, Search, ThumbsUp, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Post {
  id: string
  author: {
    name: string
    avatar: string
    initials: string
  }
  title: string
  content: string
  category: string
  timestamp: string
  likes: number
  comments: number
  liked: boolean
}

const initialPosts: Post[] = [
  {
    id: "post1",
    author: {
      name: "Jane Doe",
      avatar: "",
      initials: "JD",
    },
    title: "DIY Plastic Bottle Planters",
    content:
      "I've been reusing plastic bottles as planters for my herbs. Cut the bottle in half, poke some drainage holes in the bottom, add soil and seeds, and you've got a mini greenhouse! Has anyone tried this with other containers?",
    category: "upcycling",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 7,
    liked: false,
  },
  {
    id: "post2",
    author: {
      name: "John Smith",
      avatar: "",
      initials: "JS",
    },
    title: "Question about e-waste disposal",
    content:
      "I have some old electronics (broken laptop, old phone, etc.) that I need to dispose of properly. Does anyone know where I can take them in Nairobi? Are there any e-waste collection events coming up?",
    category: "question",
    timestamp: "1 day ago",
    likes: 8,
    comments: 12,
    liked: false,
  },
  {
    id: "post3",
    author: {
      name: "Maria Garcia",
      avatar: "",
      initials: "MG",
    },
    title: "Composting success story!",
    content:
      "After 3 months of composting my kitchen scraps, I finally have rich, dark compost for my garden! It's amazing to see food waste transform into something so valuable. If anyone wants tips on starting their own compost bin, I'm happy to share my experience.",
    category: "success",
    timestamp: "3 days ago",
    likes: 42,
    comments: 15,
    liked: true,
  },
]

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [newPostTitle, setNewPostTitle] = useState<string>("")
  const [newPostContent, setNewPostContent] = useState<string>("")
  const [newPostCategory, setNewPostCategory] = useState<string>("question")
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const { toast } = useToast()

  const filteredPosts = posts.filter((post) => {
    // Filter by category
    if (activeTab !== "all" && post.category !== activeTab) {
      return false
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      return (
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your post.",
        variant: "destructive",
      })
      return
    }

    const newPost: Post = {
      id: `post${Date.now()}`,
      author: {
        name: "You",
        avatar: "",
        initials: "YO",
      },
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      liked: false,
    }

    setPosts([newPost, ...posts])
    setNewPostTitle("")
    setNewPostContent("")
    setIsDialogOpen(false)

    toast({
      title: "Post Created",
      description: "Your post has been published to the community.",
    })
  }

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
          }
        }
        return post
      }),
    )
  }

  const getCategoryBadge = (category: string) => {
    const categories: Record<string, { label: string; className: string }> = {
      question: {
        label: "Question",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      },
      upcycling: {
        label: "Upcycling Idea",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      success: {
        label: "Success Story",
        className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      },
      event: {
        label: "Event",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      },
    }

    const categoryInfo = categories[category] || {
      label: category.charAt(0).toUpperCase() + category.slice(1),
      className: "",
    }

    return <Badge className={categoryInfo.className}>{categoryInfo.label}</Badge>
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Community Forum</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create a New Post</DialogTitle>
              <DialogDescription>Share your questions, ideas, or success stories with the community</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="post-title" className="text-right text-sm font-medium">
                  Title
                </label>
                <Input
                  id="post-title"
                  placeholder="Enter a title for your post"
                  className="col-span-3"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="post-category" className="text-right text-sm font-medium">
                  Category
                </label>
                <select
                  id="post-category"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                >
                  <option value="question">Question</option>
                  <option value="upcycling">Upcycling Idea</option>
                  <option value="success">Success Story</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="post-content" className="text-right text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="post-content"
                  placeholder="Share your thoughts, questions, or ideas..."
                  className="col-span-3"
                  rows={5}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} className="bg-green-600 hover:bg-green-700">
                Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filter Posts</CardTitle>
              <CardDescription>Find discussions that interest you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Categories:</h3>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-2">
                    <TabsTrigger value="all">All Posts</TabsTrigger>
                    <TabsTrigger value="question">Questions</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="upcycling">Upcycling</TabsTrigger>
                    <TabsTrigger value="success">Success Stories</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Members</span>
                  <span className="font-medium">1,245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Posts</span>
                  <span className="font-medium">328</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Today</span>
                  <span className="font-medium">42</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                          <AvatarFallback>{post.author.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{post.author.name}</p>
                          <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                        </div>
                      </div>
                      {getCategoryBadge(post.category)}
                    </div>
                    <CardTitle className="mt-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={post.liked ? "text-green-600" : ""}
                        onClick={() => handleLikePost(post.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {post.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No posts found</h3>
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
