"use client";

import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GradientBackground } from "@/components/GradientBackground";
import { SmoothLink, useAnchorScroll } from "@/components/SmoothLink";
import Link from "next/link";
import {
  Camera,
  Sparkles,
  Recycle,
  Shield,
  MapPin,
  ArrowRight,
  Leaf,
  Zap,
  Globe,
} from "lucide-react";

export default function Home() {
  useAnchorScroll();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Section id="features" className="bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Everything You Need for{" "}
              <span className="text-primary">Responsible Disposal</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant, AI-powered disposal recommendations tailored specifically for Kenya. Make sustainable choices with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Camera}
              title="Instant Image Analysis"
              description="Simply take a photo or upload an image. Our AI instantly identifies the item and provides disposal guidance."
            />
            <FeatureCard
              icon={Recycle}
              title="Kenya-Specific Guidance"
              description="Get recommendations based on local regulations, available facilities, and recycling programs in Kenya."
            />
            <FeatureCard
              icon={Shield}
              title="Safety First"
              description="Learn about potential hazards and safety precautions before disposing of any item."
            />
            <FeatureCard
              icon={MapPin}
              title="Location Information"
              description="Find specific disposal locations, recycling centers, and facilities near you in Kenya."
            />
          </div>
        </div>
      </Section>

      {/* How It Works Section */}
      <Section id="how-it-works" className="bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to responsible disposal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-primary/20 -z-10" />

            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-lg border-0 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Capture or Upload</h3>
                <p className="text-muted-foreground">
                  Take a photo with your camera or upload an image of the item you need to dispose of. Our AI works with any clear image.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-lg border-0 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  AI Analysis
                </h3>
                <p className="text-muted-foreground">
                  Our AI identifies the item, its materials, and category. Then it provides personalized disposal recommendations for Kenya.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-lg border-0 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Get Guidance & Dispose
                </h3>
                <p className="text-muted-foreground">
                  Receive step-by-step disposal instructions, safety notes, recycling options, and location information. Then dispose responsibly!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Benefits/Value Proposition Section */}
      <Section id="benefits" className="bg-background">
        <GradientBackground variant="rusty" className="rounded-3xl p-12 md:p-16">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
              Make a Difference, One Item at a Time
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Proper waste disposal protects our environment, supports recycling efforts, and keeps our communities safe. With EcoScan, making the right choice is easier than ever.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="flex items-center gap-2 text-white/90">
                <Recycle className="w-5 h-5" />
                <span>Reduce Waste</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Globe className="w-5 h-5" />
                <span>Protect Environment</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Zap className="w-5 h-5" />
                <span>Instant Guidance</span>
              </div>
            </div>
          </div>
        </GradientBackground>
      </Section>

      {/* Call-to-Action Section */}
      <Section id="cta" className="bg-background">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 shadow-xl bg-card">
            <CardContent className="p-12 md:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Ready to Dispose Responsibly?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of Kenyans making sustainable disposal choices every day. Your first scan is just a click away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link href="/chat">
                    Start Scanning
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 text-black hover:text-accent-foreground dark:text-foreground"
                  asChild
                >
                  <Link href="/learn">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Link href="/">
                <h3 className="font-semibold text-lg mb-4 text-foreground hover:text-primary transition-colors cursor-pointer">
                  EcoScan
                </h3>
              </Link>
              <p className="text-muted-foreground">
                AI-powered disposal recommendations for Kenya. Make sustainable choices with confidence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <SmoothLink href="#features">
                    Features
                  </SmoothLink>
                </li>
                <li>
                  <SmoothLink href="#how-it-works">
                    How It Works
                  </SmoothLink>
                </li>
                <li>
                  <SmoothLink href="#benefits">
                    Benefits
                  </SmoothLink>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">About</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EcoScan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
