"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  RotateCcw,
  Heart,
  BarChart3,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/grammar", label: "Grammar Library", icon: BookOpen },
  { href: "/study", label: "Study Mode", icon: GraduationCap },
  { href: "/review", label: "Daily Review", icon: RotateCcw },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-border h-screen sticky top-0">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold">
          K
        </div>
        <div>
          <h1 className="font-bold text-foreground text-sm leading-tight">Komorebi</h1>
          <p className="text-[11px] text-muted-foreground leading-tight">JLPT Master</p>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
            U
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Student</p>
            <p className="text-[11px] text-muted-foreground">N3 Level</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-primary">42%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: "42%" }} />
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-border">
        <Link
          href="/review"
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Start Daily Review
        </Link>
      </div>

      <div className="px-3 pb-3 space-y-0.5">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="h-[18px] w-[18px]" />
          Settings
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <HelpCircle className="h-[18px] w-[18px]" />
          Support
        </Link>
      </div>
    </aside>
  );
}