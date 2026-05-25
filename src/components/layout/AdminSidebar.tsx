"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDictionary, useLocale } from "./LocaleProvider";

export function AdminSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const dict = useDictionary();
  const adminLinks = [
    { href: `/${locale}/admin`, label: dict.admin.title },
    { href: `/${locale}/admin/grammar`, label: dict.admin.grammarList },
    { href: `/${locale}/admin/grammar/new`, label: dict.admin.addGrammar },
  ];

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-white lg:block">
      <div className="flex h-16 items-center border-b border-border px-4 justify-between">
        <Link href={`/${locale}/admin`} className="font-semibold text-sm tracking-tight">
          {dict.admin.title}
        </Link>
        <Link
          href={`/${locale}`}
          className="text-xs text-primary hover:underline"
        >
          {dict.admin.backHome}
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
