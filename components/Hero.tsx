"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const router = useRouter();

  const handleStartScan = () => {
    router.push("/chat");
  };

  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden bg-background grain-overlay">
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
            Dispose Responsibly{" "}
            <span className="text-primary">in Kenya</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Take a photo or upload an image of any item to get instant, personalized disposal recommendations tailored for Kenya. Make sustainable choices with AI-powered guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all"
              onClick={handleStartScan}
            >
              <Camera className="mr-2 w-5 h-5" />
              Scan Your Item
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
          
          <p className="text-sm text-muted-foreground">
            Free to use • No signup required • Privacy-first • Kenya-focused
          </p>
        </div>
      </div>
    </div>
  );
}
