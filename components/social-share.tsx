"use client"

import { useState } from "react"
import { Share2, Copy, Check, Twitter, Facebook, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

interface SocialShareProps {
  url?: string
  title?: string
  description?: string
  className?: string
}

export default function SocialShare({
  url = typeof window !== "undefined" ? window.location.href : "https://ecoscanv1.vercel.app",
  title = "EcoScan - Waste Classification with AI",
  description = "Identify waste items, learn recycling information, and earn points for sustainable choices",
  className = "",
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Share via</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4 text-green-600"
            >
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
              <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
              <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
            </svg>
            WhatsApp
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center cursor-pointer"
          >
            <Twitter className="mr-2 h-4 w-4 text-blue-500" />
            Twitter
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center cursor-pointer"
          >
            <Facebook className="mr-2 h-4 w-4 text-blue-600" />
            Facebook
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center cursor-pointer"
          >
            <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
            LinkedIn
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy link
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
