import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "nature" | "subtle";
}

export function GradientBackground({
  children,
  className,
  variant = "subtle",
}: GradientBackgroundProps) {
  return (
    <div
      className={cn(
        variant === "nature" ? "gradient-nature" : "gradient-nature-subtle",
        className
      )}
    >
      {children}
    </div>
  );
}

