"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { GradientBackground } from "./GradientBackground";

export function Hero() {
  return (
    <GradientBackground variant="subtle" className="min-h-[90vh] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Discovery</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Find Your Perfect{" "}
            <span className="text-primary">Green Space</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover nearby parks, nature walks, and hiking trails with AI-powered recommendations tailored to your mood and available time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all"
            >
              <MapPin className="mr-2 w-5 h-5" />
              Discover Nearby Places
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2"
              asChild
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
          
          <p className="mt-8 text-sm text-muted-foreground">
            Free to use • No signup required • Privacy-first
          </p>
        </div>
      </div>
    </GradientBackground>
  );
}

