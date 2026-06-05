"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDictionary, useLocale } from "./LocaleProvider";

function useAdminLinks() {
  const locale = useLocale();
  const dict = useDictionary();
  return [
    { href: `/${locale}/admin`, label: dict.admin.title },
    { href: `/${locale}/admin/grammar`, label: dict.admin.grammarList },
    { href: `/${locale}/admin/grammar/new`, label: dict.admin.addGrammar },
  ];
}

export function AdminSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const dict = useDictionary();
  const adminLinks = useAdminLinks();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-[#ded8d0] bg-[#fbfaf8] lg:block">
      <div className="flex h-16 items-center justify-between border-b border-[#ded8d0] px-4">
        <Link href={`/${locale}/admin`} className="font-serif text-sm font-bold tracking-tight text-[#242424]">
          {dict.admin.title}
        </Link>
        <Link href={`/${locale}`} className="font-mono text-xs text-[#797776] hover:text-[#242424] transition-colors">
          {dict.admin.backHome}
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {adminLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center rounded-[10px] px-3 py-2 font-mono text-sm transition-colors",
                active
                  ? "bg-[#cfdaf5] text-[#242424] font-medium"
                  : "text-[#797776] hover:bg-[rgba(36,36,36,0.05)] hover:text-[#242424]"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// Horizontal scrollable nav shown on mobile/tablet, below the header
export function AdminMobileNav() {
  const pathname = usePathname();
  const adminLinks = useAdminLinks();

  return (
    <div className="lg:hidden sticky top-[68px] z-30 border-b border-[#ded8d0] bg-[rgba(251,250,247,0.92)] backdrop-blur-[12px]">
      <nav className="flex items-center gap-2 overflow-x-auto px-4 py-2.5 no-scrollbar">
        {adminLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors",
                active
                  ? "border-[#242424] bg-[#cfdaf5] text-[#242424] font-medium"
                  : "border-[#ded8d0] bg-[#fbfaf8] text-[#797776] hover:border-[#242424] hover:text-[#242424]"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
