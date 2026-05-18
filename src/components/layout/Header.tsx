"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, Bell, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              K
            </span>
            <span className="font-bold text-foreground">Komorebi</span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search grammar, keywords..."
              className="pl-9 bg-muted/50 border-0 focus-visible:border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden lg:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors">
            <Globe className="h-4 w-4" />
            <span className="text-xs font-medium">JP</span>
          </button>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted transition-colors">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
            U
          </div>
        </div>
      </div>
    </header>
  );
}