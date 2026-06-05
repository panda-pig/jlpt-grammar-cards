"use client";

import { useLocale } from "./LocaleProvider";
import { useRouter, usePathname } from "next/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "zh" ? "en" : "zh";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLocale}
      className="font-mono text-xs border border-[#ded8d0] rounded-full px-3 py-1 text-[#797776] hover:text-[#242424] hover:border-[#242424] hover:bg-[#cfdaf5]/40 transition-colors"
      aria-label={`Switch language to ${locale === "zh" ? "English" : "中文"}`}
    >
      {locale === "zh" ? "EN" : "中"}
    </button>
  );
}
