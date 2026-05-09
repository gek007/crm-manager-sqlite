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
  { href: "/",               label: "Dashboard",     icon: LayoutDashboard },
  { href: "/projects",       label: "Projects",      icon: Building2 },
  { href: "/cities",         label: "Cities",        icon: MapPin },
  { href: "/service-types",  label: "Service Types", icon: Wrench },
  { href: "/employee-types", label: "Employee Types",icon: Users },
  { href: "/cost-types",     label: "Cost Types",    icon: DollarSign },
  { href: "/general-costs",  label: "General Costs", icon: Receipt },
  { href: "/settings",       label: "Settings",      icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-56 flex-shrink-0 sticky top-0 h-screen flex flex-col"
      style={{
        background: "#09090d",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-10 items-center px-4 gap-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="h-5 w-5 rounded flex items-center justify-center text-[10px] font-black flex-shrink-0"
          style={{ background: "#d4a547", color: "#09090d" }}
        >
          C
        </div>
        <span className="text-sm font-bold tracking-wide" style={{ color: "#e8dfc8", fontFamily: "'Syne', sans-serif" }}>
          CRM Manager
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        <p
          className="px-3 mb-1 text-[10px] font-semibold tracking-[0.14em] uppercase"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-item flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm font-medium", isActive ? "nav-active" : "")}
              style={{ color: isActive ? "#d4a547" : "rgba(255,255,255,0.72)" }}
            >
              <Icon
                className="h-4 w-4 flex-shrink-0"
                style={{ color: isActive ? "#d4a547" : "rgba(255,255,255,0.55)" }}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer hint */}
      <div
        className="px-4 py-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          v1.0 · Construction CRM
        </p>
      </div>
    </aside>
  );
}
