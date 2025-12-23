import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Camera, Award } from "lucide-react"
import PointsInfo from "@/components/points-info"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-darkGreen-950 dark:via-darkGreen-900 dark:to-background relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-6 animate-in fade-in slide-in-from-left duration-700">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none text-gradient-eco leading-tight">
                  Waste Classification with AI
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                  EcoScan uses Gemini AI to identify waste items and provide recycling information. Make sustainable choices and earn rewards.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/scan">
                  <Button size="lg" className="gradient-eco-primary hover:opacity-90 shadow-eco-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-eco">
                    <Camera className="mr-2 h-5 w-5" />
                    Start Scanning
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto animate-in fade-in slide-in-from-right duration-700 delay-150">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-2xl blur-2xl transform rotate-6"></div>
                <Image
                  src="/circular-economy-icons.png"
                  alt="EcoScan App"
                  width={500}
                  height={500}
                  className="relative rounded-2xl object-cover shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Points Section */}
      <section className="w-full py-16 md:py-20 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-darkGreen-900/30 dark:via-darkGreen-800/20 dark:to-darkGreen-900/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              <Award className="h-14 w-14 text-primary relative z-10 animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Earn EcoPoints</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-lg leading-relaxed">
                Get rewarded for identifying waste and making sustainable choices
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-4xl">
            <PointsInfo />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg leading-relaxed">
                Scan waste items in three simple steps and start your sustainability journey
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-eco-primary text-white shadow-eco relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Take a Photo</h3>
              <p className="text-muted-foreground leading-relaxed">Use your camera or upload an image of the waste item</p>
            </div>
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-eco-primary text-white shadow-eco relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">AI Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">Gemini AI identifies the waste type and recyclability</p>
            </div>
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-eco-primary text-white shadow-eco relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Earn Points</h3>
              <p className="text-muted-foreground leading-relaxed">Get rewarded with EcoPoints for each scan and recyclable item</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 gradient-eco-accent dark:gradient-eco-dark relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-300/10 dark:bg-emerald-800/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-300/10 dark:bg-teal-800/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-3xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to Identify Your Waste?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg leading-relaxed mx-auto">
                Start scanning now to learn how to properly dispose of your items and earn points
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Link href="/scan">
                <Button size="lg" className="gradient-eco-primary hover:opacity-90 shadow-eco-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-eco px-8">
                  <Camera className="mr-2 h-5 w-5" />
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
