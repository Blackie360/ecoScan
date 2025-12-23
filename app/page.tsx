import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GradientBackground } from "@/components/GradientBackground";
import { ChatWidget } from "@/components/ChatWidget";
import Link from "next/link";
import {
  MapPin,
  Sparkles,
  Clock,
  Shield,
  Heart,
  ArrowRight,
  Trees,
  Mountain,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Section id="features" className="bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Everything You Need to{" "}
              <span className="text-primary">Touch Grass</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the perfect outdoor spaces with AI-powered recommendations
              that understand your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Sparkles}
              title="AI-Powered Recommendations"
              description="Get personalized suggestions based on your mood, preferences, and current location. Our AI understands what you need."
            />
            <FeatureCard
              icon={Clock}
              title="Time-Based Suggestions"
              description="Find places that fit your schedule. Whether you have 15 minutes or a whole day, we'll find the perfect spot."
            />
            <FeatureCard
              icon={Shield}
              title="Safe & Accessible"
              description="All recommendations include safety information and accessibility details. Your peace of mind is our priority."
            />
            <FeatureCard
              icon={MapPin}
              title="Nearby Discovery"
              description="Explore hidden gems in your neighborhood. Find parks, trails, and green spaces you never knew existed."
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
              Three simple steps to find your perfect outdoor escape
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
                <h3 className="text-xl font-semibold mb-3">Share Your Mood</h3>
                <p className="text-muted-foreground">
                  Tell us how you're feeling and how much time you have. Are you
                  stressed? Need a quick break? Planning a long hike?
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-lg border-0 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  AI Finds Matches
                </h3>
                <p className="text-muted-foreground">
                  Our AI analyzes thousands of locations to find the perfect
                  match for your mood, time, and location preferences.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-lg border-0 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Discover & Explore
                </h3>
                <p className="text-muted-foreground">
                  Get detailed information, directions, and tips. Then head out
                  and enjoy your time in nature!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Benefits/Value Proposition Section */}
      <Section id="benefits" className="bg-background">
        <GradientBackground variant="nature" className="rounded-3xl p-12 md:p-16">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
              Reconnect with Nature, Recharge Your Mind
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Spending time outdoors isn't just nice—it's essential. Studies show
              that even 20 minutes in nature can reduce stress, improve mood, and
              boost creativity. Let us help you make it a habit.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="flex items-center gap-2 text-white/90">
                <Trees className="w-5 h-5" />
                <span>Reduce Stress</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Heart className="w-5 h-5" />
                <span>Improve Mood</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Mountain className="w-5 h-5" />
                <span>Boost Energy</span>
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
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of people discovering new outdoor spaces every day.
                Your next favorite spot is just a click away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link href="/chat">
                    Start Exploring
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2"
                  asChild
                >
                  <a href="#features">Learn More</a>
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
                Helping you discover the perfect green spaces to reconnect with
                nature.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-foreground transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#benefits"
                    className="hover:text-foreground transition-colors"
                  >
                    Benefits
                  </a>
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

      {/* Floating Chat Widget */}
      <ChatWidget />
    </main>
  );
}
