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

export function Header({ title, action }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
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
