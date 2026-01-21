"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface SmoothLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Helper function to scroll to anchor
function scrollToAnchor(anchorId: string) {
  const element = document.getElementById(anchorId);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

// Hook to handle anchor scrolling on page load
export function useAnchorScroll() {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        // Small delay to ensure page is fully rendered
        setTimeout(() => {
          scrollToAnchor(hash.substring(1));
        }, 100);
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
}

export function SmoothLink({ href, children, className, onClick }: SmoothLinkProps) {
  const pathname = usePathname();
  const isAnchorLink = href.startsWith("#");
  const isSamePage = pathname === "/" || pathname === "";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isAnchorLink && isSamePage) {
      // Same page: prevent default and scroll smoothly
      e.preventDefault();
      scrollToAnchor(href.substring(1));
    }
    // For different pages, let Link handle navigation naturally
    // The useAnchorScroll hook will handle scrolling after page loads
    onClick?.();
  };

  if (isAnchorLink) {
    // For anchor links, use Link with proper href
    // If on different page, navigate to home with anchor
    const linkHref = isSamePage ? href : `/${href}`;
    
    return (
      <Link
        href={linkHref}
        onClick={handleClick}
        className={cn("hover:text-foreground transition-colors", className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("hover:text-foreground transition-colors", className)}
    >
      {children}
    </Link>
  );
}




