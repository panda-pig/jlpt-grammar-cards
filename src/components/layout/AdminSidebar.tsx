"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "后台首页" },
  { href: "/admin/grammar", label: "管理语法" },
  { href: "/admin/grammar/new", label: "新增语法" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-white lg:block">
      <div className="flex h-16 items-center border-b border-border px-4 justify-between">
        <Link href="/admin" className="font-semibold text-sm tracking-tight">
          管理后台
        </Link>
        <Link
          href="/"
          className="text-xs text-primary hover:underline"
        >
          返回主页
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}