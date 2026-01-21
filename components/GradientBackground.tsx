import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "rusty" | "subtle";
}

export function GradientBackground({
  children,
  className,
  variant = "subtle",
}: GradientBackgroundProps) {
  return (
    <div
      className={cn(
        variant === "rusty" ? "gradient-nature" : "gradient-nature-subtle",
        className
      )}
    >
      {children}
    </div>
  );
}




