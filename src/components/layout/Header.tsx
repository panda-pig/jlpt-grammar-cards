"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const desktopLinks = [
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
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            J
          </span>
          <span className="hidden sm:inline">JLPT 语法卡片</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {desktopLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={buttonVariants({
                variant: pathname === link.href ? "secondary" : "ghost",
                size: "sm",
                className: cn(
                  "text-sm font-medium",
                  pathname === link.href && "bg-secondary"
                ),
              })}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
            登录
          </Link>
        </div>
      </div>
    </header>
  );
}
