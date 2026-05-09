"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  action?: {
    label: string;
    href: string;
  };
}

export function Header({ title, action }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 flex h-10 items-center gap-4 px-5"
      style={{
        background: "rgba(9, 9, 13, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex flex-1 items-center justify-between">
        <h1
          className="text-base font-bold tracking-wide"
          style={{ color: "#e8dfc8", fontFamily: "'Syne', sans-serif" }}
        >
          {title}
        </h1>
        {action && (
          <Link href={action.href} className={buttonVariants({})}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            {action.label}
          </Link>
        )}
      </div>
    </header>
  );
}
