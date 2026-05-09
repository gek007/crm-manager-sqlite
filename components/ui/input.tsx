import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg border px-3 py-2 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-40 input-amber",
        className
      )}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.9)",
      }}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
