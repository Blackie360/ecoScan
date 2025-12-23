"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SmoothLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SmoothLink({ href, children, className, onClick }: SmoothLinkProps) {
  const pathname = usePathname();
  const isAnchorLink = href.startsWith("#");
  const isSamePage = pathname === "/" || pathname === "";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isAnchorLink && isSamePage) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
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
    onClick?.();
  };

  if (isAnchorLink && isSamePage) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={cn("hover:text-foreground transition-colors", className)}
      >
        {children}
      </a>
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

