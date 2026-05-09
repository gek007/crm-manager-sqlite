"use client";

import { AlertCircle } from "lucide-react";

interface FormMessageProps {
  message?: string;
}

export function FormMessage({ message }: FormMessageProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(184,112,112,0.1)", border: "1px solid rgba(184,112,112,0.25)", color: "#c98080" }}>
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
