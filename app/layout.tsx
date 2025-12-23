import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Merriweather, Source_Code_Pro } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-sans"
})

const merriweather = Merriweather({ 
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-serif"
})

const sourceCodePro = Source_Code_Pro({ 
  subsets: ["latin"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: "EcoScan - Waste Classification App",
  description: "Classify waste items using AI, learn proper disposal methods, and earn points for sustainable choices",
  metadataBase: new URL("https://ecoscanv1.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ecoscanv1.vercel.app",
    title: "EcoScan - Waste Classification with AI",
    description: "Identify waste items, learn recycling information, and earn points for sustainable choices",
    siteName: "EcoScan",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "EcoScan - Waste Classification with AI",
      },
      {
        url: "/whatsapp-image",
        width: 800,
        height: 800,
        alt: "EcoScan - Waste Classification with AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoScan - Waste Classification with AI",
    description: "Identify waste items, learn recycling information, and earn points for sustainable choices",
    images: ["/opengraph-image"],
    creator: "@ecoscan",
  },
  // WhatsApp uses OpenGraph tags, but we'll ensure our description is concise
  // and the image is properly sized for mobile viewing
  other: {
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": "EcoScan - Waste Classification with AI",
    // WhatsApp sometimes uses the following for app installs
    "al:android:url": "https://ecoscanv1.vercel.app",
    "al:android:app_name": "EcoScan",
    "al:android:package": "com.ecoscan.app",
    "al:ios:url": "https://ecoscanv1.vercel.app",
    "al:ios:app_name": "EcoScan",
    "al:web:url": "https://ecoscanv1.vercel.app",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${merriweather.variable} ${sourceCodePro.variable} ${montserrat.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="py-8 border-t bg-muted/30">
              <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-sm text-muted-foreground text-center md:text-left">
                  © 2025 EcoScan. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Made with ♻️ for a sustainable future</span>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
