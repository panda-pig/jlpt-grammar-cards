"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useDictionary, useLocale } from "./LocaleProvider";

export function Header() {
  const pathname = usePathname();
  const dict = useDictionary();
  const locale = useLocale();

  const navItems = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/grammar`, label: dict.nav.grammar },
    { href: `/${locale}/study`, label: dict.nav.study },
    { href: `/${locale}/review`, label: dict.nav.review },
    { href: `/${locale}/favorites`, label: dict.nav.favorites },
    { href: `/${locale}/dashboard`, label: dict.nav.dashboard },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-[rgba(36,36,36,0.16)]">
      <div className="mx-auto max-w-[1432px] px-6 h-[72px] flex items-center justify-between">
        <Link href={`/${locale}`} className="font-mono text-sm font-medium tracking-tight text-foreground">
          {dict.common.siteName}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== `/${locale}` && pathname.startsWith(item.href));
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
          <LocaleSwitcher />
          <Link
            href={`/${locale}/login`}
            className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {dict.common.login}
          </Link>
          <Link
            href={`/${locale}/study`}
            className="font-mono text-sm bg-[#242424] text-[#f6f3f1] rounded-full px-5 py-2.5 hover:bg-black transition-colors"
          >
            {dict.common.startLearning}
          </Link>
        </div>
      </div>
    </header>
  );
}
