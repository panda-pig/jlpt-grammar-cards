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
    <header className="sticky top-0 z-40 border-b border-[#ded8d0] bg-[rgba(246,243,241,0.88)] backdrop-blur-[18px]">
      <div className="mx-auto max-w-[1432px] px-6 h-[68px] flex items-center justify-between gap-4">

        {/* Brand mark */}
        <Link href={`/${locale}`} className="flex items-center gap-3 shrink-0">
          <div
            className="w-[38px] h-[38px] rounded-full border border-[#242424] flex items-center justify-center shrink-0"
            style={{
              background: "#fff6df",
              boxShadow: "3px 3px 0 #cfdaf5",
              fontFamily: "var(--font-serif)",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            文
          </div>
          <div className="hidden sm:block">
            <div className="font-serif text-[15px] font-bold leading-tight text-[#242424]">
              {dict.common.siteName}
            </div>
            <div className="font-mono text-[10px] text-[#797776] tracking-wide">
              日语语法词卡
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-5">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== `/${locale}` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-mono text-[13px] transition-colors hover:text-[#242424]",
                  active
                    ? "text-[#242424] underline underline-offset-[6px] decoration-1"
                    : "text-[#797776]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile/tablet actions — locale switch + login (header nav is xl-only) */}
        <div className="flex xl:hidden items-center gap-2">
          <LocaleSwitcher />
          {!user && (
            <Link
              href={`/${locale}/login`}
              className="font-mono text-xs rounded-full border border-[#ded8d0] px-3 py-1 text-[#797776] hover:border-[#242424] hover:text-[#242424] transition-colors"
            >
              {dict.common.login}
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="hidden xl:flex items-center gap-3">
          <LocaleSwitcher />
          {user ? (
            <>
              <Link
                href={`/${locale}/settings`}
                className="font-mono text-[13px] text-[#797776] hover:text-[#242424] transition-colors max-w-[120px] truncate"
                title={displayName || user.email || ""}
              >
                {displayName || user.email}
              </Link>
              <button
                onClick={signOut}
                className="font-mono text-[13px] text-[#797776] hover:text-[#242424] transition-colors"
              >
                {dict.common.logout}
              </button>
            </>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="font-mono text-[13px] text-[#797776] hover:text-[#242424] transition-colors"
            >
              {dict.common.login}
            </Link>
          )}
          <Link href={`/${locale}/study`} className="btn-v3-primary text-[13px] px-5 py-2.5">
            {dict.common.startLearning}
          </Link>
        </div>
      </div>
    </header>
  );
}
