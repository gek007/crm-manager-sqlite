"use client";

import { AlertCircle } from "lucide-react";

interface FormMessageProps {
  message?: string;
}

export function FormMessage({ message }: FormMessageProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
