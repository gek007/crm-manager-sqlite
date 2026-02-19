"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Wrench,
  Users,
  DollarSign,
  Receipt,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: Building2 },
  { href: "/cities", label: "Cities", icon: MapPin },
  { href: "/service-types", label: "Service Types", icon: Wrench },
  { href: "/employee-types", label: "Employee Types", icon: Users },
  { href: "/cost-types", label: "Cost Types", icon: DollarSign },
  { href: "/general-costs", label: "General Costs", icon: Receipt },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 h-screen">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-black/5 px-6">
          <h1 className="text-xl font-bold text-black">
            CRM Manager
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:bg-black/[0.04] hover:text-black"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
