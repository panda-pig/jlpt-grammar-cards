"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "后台首页" },
  { href: "/admin/grammar", label: "管理语法" },
  { href: "/admin/grammar/new", label: "新增语法" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border/40 bg-card lg:block">
      <div className="flex h-14 items-center border-b border-border/40 px-4">
        <Link href="/admin" className="font-semibold text-sm tracking-tight">
          管理后台
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={buttonVariants({
              variant: pathname === link.href ? "secondary" : "ghost",
              size: "sm",
              className: cn(
                "justify-start text-sm font-medium",
                pathname === link.href && "bg-secondary"
              ),
            })}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
