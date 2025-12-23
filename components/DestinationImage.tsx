"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, AlertCircle } from "lucide-react";

interface DestinationImageProps {
  placeName: string;
  placeType: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide";
}

// Simple in-memory cache for generated images
const imageCache = new Map<string, string>();

export function DestinationImage({
  placeName,
  placeType,
  className,
  aspectRatio = "video",
}: DestinationImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate a cache key
  const cacheKey = `${placeName}-${placeType}`;

  // Check cache on mount
  useEffect(() => {
    const cached = imageCache.get(cacheKey);
    if (cached) {
      setImageUrl(cached);
      setHasAttempted(true);
    }
  }, [cacheKey]);

  // Intersection Observer setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(container);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Fetch image when visible and not already loaded
  const generateImage = useCallback(async () => {
    if (hasAttempted || isLoading || imageUrl) return;

    setIsLoading(true);
    setError(null);
    setHasAttempted(true);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ placeName, placeType }),
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
        // Cache the result
        imageCache.set(cacheKey, data.imageUrl);
      } else {
        setError(data.error || "Failed to generate image");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  }, [placeName, placeType, cacheKey, hasAttempted, isLoading, imageUrl]);

  // Trigger generation when visible
  useEffect(() => {
    if (isVisible && !hasAttempted && !imageUrl) {
      generateImage();
    }
  }, [isVisible, hasAttempted, imageUrl, generateImage]);

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  }[aspectRatio];

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-lg bg-muted",
        aspectRatioClass,
        className
      )}
    >
      {/* Loading state with shimmer */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-muted via-muted/80 to-muted animate-pulse">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs">Generating image...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
            <AlertCircle className="w-6 h-6 text-destructive/50" />
            <span className="text-xs">Could not generate image</span>
            <button
              onClick={() => {
                setHasAttempted(false);
                setError(null);
              }}
              className="text-xs text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Placeholder when not visible yet and not loading */}
      {!isVisible && !imageUrl && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
        </div>
      )}

      {/* The actual image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${placeName} - ${placeType}`}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
      )}

      {/* Gradient overlay for better text readability if needed */}
      {imageUrl && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
}

