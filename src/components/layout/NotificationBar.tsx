"use client";

import { useDictionary } from "./LocaleProvider";

export function NotificationBar() {
  const dict = useDictionary();

  return (
    <div className="bg-black text-[#f6f3f1] h-10 flex items-center justify-center font-mono text-sm">
      <span className="px-4 text-center">
        {dict.common.siteName} - {dict.common.siteTagline}
      </span>
    </div>
  );
}
