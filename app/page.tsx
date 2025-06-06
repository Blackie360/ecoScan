import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Camera, Award } from "lucide-react"
import PointsInfo from "@/components/points-info"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-darkGreen-50 to-white dark:from-darkGreen-950 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Waste Classification with AI
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  EcoScan uses Gemini AI to identify waste items and provide recycling information.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/scan">
                  <Button size="lg" className="bg-darkGreen-600 hover:bg-darkGreen-700">
                    <Camera className="mr-2 h-4 w-4" />
                    Start Scanning
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto">
              <Image
                src="/circular-economy-icons.png"
                alt="EcoScan App"
                width={400}
                height={400}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Points Section */}
      <section className="w-full py-12 md:py-16 bg-darkGreen-50 dark:bg-darkGreen-900/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <Award className="h-12 w-12 text-darkGreen-600" />
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">Earn EcoPoints</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Get rewarded for identifying waste and making sustainable choices
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-3xl">
            <PointsInfo />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Scan waste items in three simple steps
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-darkGreen-100 text-darkGreen-600 mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Take a Photo</h3>
              <p className="text-muted-foreground">Use your camera or upload an image of the waste item</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-darkGreen-100 text-darkGreen-600 mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground">Gemini AI identifies the waste type and recyclability</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-darkGreen-100 text-darkGreen-600 mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Earn Points</h3>
              <p className="text-muted-foreground">Get rewarded with EcoPoints for each scan and recyclable item</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-darkGreen-50 dark:bg-darkGreen-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Identify Your Waste?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start scanning now to learn how to properly dispose of your items and earn points
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/scan">
                <Button size="lg" className="bg-darkGreen-600 hover:bg-darkGreen-700">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Scanning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
