import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

export function buttonVariants({
  className,
  variant = "primary",
  size = "md",
}: {
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}) {
  return cn(
    "inline-flex items-center justify-center rounded-lg font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a547]/40 disabled:pointer-events-none disabled:opacity-40",
    {
      "bg-[#d4a547] text-[#09090d] hover:bg-[#e0b55a] shadow-[0_0_16px_rgba(212,165,71,0.25)] hover:shadow-[0_0_24px_rgba(212,165,71,0.35)]":
        variant === "primary",
      "bg-white/5 text-white/70 hover:bg-white/8 hover:text-white border border-white/8":
        variant === "secondary",
      "border border-white/10 bg-transparent hover:bg-white/5 text-white/60 hover:text-white/90":
        variant === "outline",
      "hover:bg-white/5 text-white/50 hover:text-white/80": variant === "ghost",
      "bg-red-500/80 text-white hover:bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.2)]":
        variant === "destructive",
    },
    {
      "h-7 px-3 text-xs": size === "sm",
      "h-9 px-4 text-sm": size === "md",
      "h-11 px-6 text-sm": size === "lg",
    },
    className
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & { asChild?: boolean }>(
  ({ className, variant = "primary", size = "md", asChild: _, ...props }, ref) => (
    <button className={buttonVariants({ className, variant, size })} ref={ref} {...props} />
  )
);
Button.displayName = "Button";

export { Button };
