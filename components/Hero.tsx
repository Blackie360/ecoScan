"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  const router = useRouter();
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleDiscoverNearby = async () => {
    setIsLocating(true);
    setLocationError(null);

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      // Fall back to chat without location
      router.push("/chat");
      return;
    }

    // Request location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Try to get city name from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          
          const city = data.address?.city || 
                       data.address?.town || 
                       data.address?.village ||
                       data.address?.county ||
                       "your area";
          
          // Navigate to chat with location info
          const locationQuery = encodeURIComponent(
            `Find me outdoor places near ${city}, Kenya (coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
          );
          router.push(`/chat?autoMessage=${locationQuery}`);
        } catch {
          // If reverse geocoding fails, just use coordinates
          const locationQuery = encodeURIComponent(
            `Find me outdoor places near my location (coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}) in Kenya`
          );
          router.push(`/chat?autoMessage=${locationQuery}`);
        }
        
        setIsLocating(false);
      },
      (error) => {
        // Handle location errors
        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable. Please try again.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
        setLocationError(errorMessage);
        setIsLocating(false);
        
        // Fall back to chat without location after a delay
        setTimeout(() => {
          router.push("/chat");
        }, 2000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  };

  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden bg-background grain-overlay">
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Section */}
          <div className="order-2 lg:order-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Discovery</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              Find Your Perfect{" "}
              <span className="text-primary">Green Space</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Discover nearby parks, nature walks, and hiking trails with AI-powered recommendations tailored to your mood and available time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all"
                onClick={handleDiscoverNearby}
                disabled={isLocating}
              >
                {isLocating ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 w-5 h-5" />
                    Discover Nearby Places
                  </>
                )}
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
            
            {/* Location error message */}
            {locationError && (
              <p className="text-sm text-destructive animate-in fade-in">
                {locationError}
              </p>
            )}
            
            <p className="text-sm text-muted-foreground">
              Free to use • No signup required • Privacy-first
            </p>
          </div>

          {/* Image Section - Creative Layout */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-square max-w-lg mx-auto lg:max-w-none">
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent/30 rounded-full blur-3xl -z-10" />
              
              {/* Main Image Container with Creative Border */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20 bg-card p-2 transform hover:scale-[1.02] transition-transform duration-500">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src="/Hiker in Vast Landscape.png"
                    alt="Hiker in Vast Landscape"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                  />
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
                </div>
                
                {/* Floating badge */}
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-foreground">Live Discovery</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative corner accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-2xl rotate-12 -z-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
