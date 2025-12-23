"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Camera, Info, BookOpen, Home, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

const routes = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Scan",
    path: "/scan",
    icon: Camera,
  },
  {
    name: "Points",
    path: "/points",
    icon: Award,
  },
  {
    name: "About",
    path: "/about",
    icon: Info,
  },
  {
    name: "Guide",
    path: "/guide",
    icon: BookOpen,
  },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold text-gradient-eco group-hover:opacity-80 transition-opacity">
            EcoScan
          </span>
        </Link>

        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-2 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      pathname === route.path 
                        ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary" 
                        : "hover:bg-accent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                    {route.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="hidden md:flex items-center gap-1">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative",
                  pathname === route.path 
                    ? "text-primary font-semibold bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                <route.icon className="h-4 w-4" />
                <span>{route.name}</span>
                {pathname === route.path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>
                )}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
