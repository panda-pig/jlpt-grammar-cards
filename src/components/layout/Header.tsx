"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/grammar", label: "语法库" },
  { href: "/study", label: "学习" },
  { href: "/review", label: "今日复习" },
  { href: "/favorites", label: "收藏夹" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-[rgba(36,36,36,0.16)]">
      <div className="mx-auto max-w-[1432px] px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight text-foreground">
          JLPT Grammar Deck
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-mono text-sm transition-colors hover:text-foreground",
                  active
                    ? "text-foreground underline underline-offset-[6px] decoration-1"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            登录
          </Link>
          <Link
            href="/study"
            className="font-mono text-sm bg-[#242424] text-[#f6f3f1] rounded-full px-5 py-2.5 hover:bg-black transition-colors"
          >
            开始学习
          </Link>
        </div>
      </div>
    </header>
  );
}
