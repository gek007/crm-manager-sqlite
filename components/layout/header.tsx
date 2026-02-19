"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  action?: {
    label: string;
    href: string;
  };
}

const rainbowColors = [
  "text-red-500",
  "text-orange-500",
  "text-yellow-500",
  "text-green-500",
  "text-teal-500",
  "text-blue-500",
  "text-indigo-500",
  "text-purple-500",
  "text-pink-500",
];

export function Header({ title, action }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-black/5 bg-gray-200/90 backdrop-blur-xl px-8">
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-[40px] font-semibold tracking-tight title-3d leading-tight">
          {title.split("").map((letter, index) => (
            <span key={index} className={letter === " " ? "text-gray-800" : rainbowColors[index % rainbowColors.length]}>
              {letter}
            </span>
          ))}
        </h1>
        {action && (
          <a href={action.href}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          </a>
        )}
      </div>
    </header>
  );
}
