"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useDictionary, useLocale } from "./LocaleProvider";
import { useAuth } from "@/hooks/useAuth";
import { supabaseBrowser } from "@/lib/supabase-browser";

export function Header() {
  const pathname = usePathname();
  const dict = useDictionary();
  const locale = useLocale();
  const { user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    (supabaseBrowser.from("profiles") as any)
      .select("display_name")
      .eq("id", user.id)
      .single()
      .then(({ data }: any) => {
        setDisplayName(data?.display_name ?? null);
      });
  }, [user?.id]);

  const navItems = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/grammar`, label: dict.nav.grammar },
    { href: `/${locale}/study`, label: dict.nav.study },
    { href: `/${locale}/review`, label: dict.nav.review },
    { href: `/${locale}/favorites`, label: dict.nav.favorites },
    { href: `/${locale}/my-grammar`, label: dict.nav.myGrammar },
    { href: `/${locale}/pro`, label: dict.nav.pro },
    { href: `/${locale}/dashboard`, label: dict.nav.dashboard },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-[rgba(36,36,36,0.16)]">
      <div className="mx-auto max-w-[1432px] px-6 h-[72px] flex items-center justify-between">
        <Link href={`/${locale}`} className="font-mono text-sm font-medium tracking-tight text-foreground">
          {dict.common.siteName}
        </Link>

        <nav className="hidden xl:flex items-center gap-6">
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

        <div className="hidden xl:flex items-center gap-3">
          <LocaleSwitcher />
          {user ? (
            <>
              <Link
                href={`/${locale}/settings`}
                className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors max-w-[120px] truncate"
                title={displayName || user.email || ""}
              >
                {displayName || user.email}
              </Link>
              <button
                onClick={signOut}
                className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {dict.common.logout}
              </button>
            </>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {dict.common.login}
            </Link>
          )}
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
