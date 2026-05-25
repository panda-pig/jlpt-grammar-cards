"use client";

import { useDictionary } from "./LocaleProvider";
import { useAuth } from "@/hooks/useAuth";

export function NotificationBar() {
  const dict = useDictionary();
  const { syncStatus } = useAuth();
  const syncText = syncStatus.status === "syncing"
    ? dict.common.syncingLocalProgress
    : syncStatus.status === "synced"
      ? `${dict.common.syncComplete} ${dict.common.syncedItems
        .replace("{count}", String(syncStatus.importedRows))
        .replace("{history}", String(syncStatus.importedHistory))}`
      : syncStatus.status === "failed"
        ? dict.common.syncFailed
        : null;

  return (
    <div className="bg-black text-[#f6f3f1] h-10 flex items-center justify-center font-mono text-sm">
      <span className="px-4 text-center">
        {syncText ?? `${dict.common.siteName} - ${dict.common.siteTagline}`}
      </span>
    </div>
  );
}
