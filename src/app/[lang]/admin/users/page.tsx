"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { formatDate } from "@/lib/date";
import { Crown, RefreshCcw, Search, Users } from "lucide-react";

type AdminUserRow = {
  userId: string;
  email: string | null;
  displayName: string | null;
  createdAt: string | null;
  isPro: boolean;
  proSince: string | null;
};

type AdminUsersResponse = {
  users: AdminUserRow[];
  summary: { total: number; pro: number };
};

export default function AdminUsersPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.admin;
  const [data, setData] = useState<AdminUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? t.userLoadFailed);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.userLoadFailed);
    } finally {
      setLoading(false);
    }
  }, [t.userLoadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const users = useMemo(() => {
    const all = data?.users ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (u) =>
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.displayName ?? "").toLowerCase().includes(q)
    );
  }, [data?.users, query]);

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-[clamp(24px,3vw,36px)] font-bold tracking-[-0.02em] text-[#242424]">
            {t.users}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#797776]">{t.usersDesc}</p>
        </div>
        <Button variant="outline" className="rounded-full font-mono" onClick={load} disabled={loading}>
          <RefreshCcw className="mr-1 h-4 w-4" />{t.refresh}
        </Button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
          <CardContent className="p-5">
            <Users className="mb-2 h-4 w-4 text-[#797776]" />
            <p className="font-mono text-2xl text-[#242424]">{data?.summary.total ?? 0}</p>
            <p className="font-mono text-xs text-[#797776]">{t.userTotal}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
          <CardContent className="p-5">
            <Crown className="mb-2 h-4 w-4 text-[#8a6a20]" />
            <p className="font-mono text-2xl text-[#242424]">{data?.summary.pro ?? 0}</p>
            <p className="font-mono text-xs text-[#797776]">{t.userProTotal}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#797776]" />
        <Input
          className="rounded-full border-[#ded8d0] pl-9"
          placeholder={t.userSearchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-[14px] border border-[#c47a6a]/30 bg-[#f4b4a8]/20 px-4 py-3 text-sm text-[#7a3a30]">
          {error}
        </div>
      )}

      {loading ? (
        <p className="font-mono text-sm text-[#797776]">{dict.common.loading}</p>
      ) : users.length === 0 ? (
        <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
          <CardContent className="p-8 text-center text-sm text-[#797776]">{t.userEmpty}</CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8]">
          <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr] gap-3 border-b border-[#ded8d0] px-4 py-3 font-mono text-xs text-[#797776] md:grid">
            <span>{t.userEmail}</span>
            <span>{t.userRegistered}</span>
            <span>{t.userPlan}</span>
            <span>{t.userProSince}</span>
          </div>
          {users.map((u) => (
            <div
              key={u.userId}
              className="grid gap-2 border-b border-[#ded8d0] px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1.6fr_1fr_1fr_1fr] md:items-center md:gap-3"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-xs text-[#242424]" title={u.email ?? ""}>
                  {u.email ?? u.userId}
                </p>
                {u.displayName && <p className="mt-0.5 truncate text-xs text-[#797776]">{u.displayName}</p>}
              </div>
              <p className="font-mono text-xs text-[#242424]">
                {u.createdAt ? formatDate(u.createdAt, locale) : "-"}
              </p>
              <div>
                <Badge
                  className={`rounded-full font-mono text-[10px] ${
                    u.isPro ? "bg-[#dcebd8] text-[#315b3b]" : "bg-[rgba(36,36,36,0.06)] text-[#797776]"
                  }`}
                >
                  {u.isPro ? t.entitlementPro : t.entitlementFree}
                </Badge>
              </div>
              <p className="font-mono text-xs text-[#797776]">
                {u.proSince ? formatDate(u.proSince, locale) : "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
