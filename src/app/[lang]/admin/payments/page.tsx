"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { formatDate } from "@/lib/date";
import { CreditCard, RefreshCcw, ShieldCheck } from "lucide-react";

type AdminPayment = {
  paymentId: string;
  userId: string | null;
  type: "tip" | "pro_lifetime";
  provider: "wechat" | "alipay";
  channel: string;
  amountCents: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "closed" | "refunded";
  outTradeNo: string;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string | null;
  nickname?: string | null;
  message?: string | null;
};

type AdminPaymentsResponse = {
  payments: AdminPayment[];
  summary: {
    total: number;
    amountCents: number;
    status: Record<string, number>;
    type: Record<string, number>;
  };
};

function amountText(cents: number) {
  return `¥${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default function AdminPaymentsPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.admin;
  const [data, setData] = useState<AdminPaymentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/payments", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? t.paymentLoadFailed);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.paymentLoadFailed);
    } finally {
      setLoading(false);
    }
  }, [t.paymentLoadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const payments = useMemo(() => data?.payments ?? [], [data?.payments]);
  const paidProCount = useMemo(
    () => payments.filter((payment) => payment.type === "pro_lifetime" && payment.status === "paid").length,
    [payments]
  );

  const statusLabel = (status: AdminPayment["status"]) => {
    const labels = t.paymentStatus as Record<AdminPayment["status"], string>;
    return labels[status] ?? status;
  };

  const typeLabel = (type: AdminPayment["type"]) => {
    return type === "pro_lifetime" ? t.paymentPro : t.paymentTip;
  };

  const statusClass = (status: AdminPayment["status"]) => {
    if (status === "paid") return "bg-[#dcebd8] text-[#315b3b]";
    if (status === "pending") return "bg-[#fff6df] text-[#8a6a20]";
    return "bg-[#f4b4a8]/25 text-[#7a3a30]";
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-[clamp(24px,3vw,36px)] font-bold tracking-[-0.02em] text-[#242424]">
            {t.payments}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#797776]">{t.paymentsDesc}</p>
        </div>
        <Button variant="outline" className="rounded-full font-mono" onClick={load} disabled={loading}>
          <RefreshCcw className="mr-1 h-4 w-4" />{t.refresh}
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
          <CardContent className="p-5">
            <CreditCard className="mb-2 h-4 w-4 text-[#797776]" />
            <p className="font-mono text-2xl text-[#242424]">{data?.summary.total ?? 0}</p>
            <p className="font-mono text-xs text-[#797776]">{t.paymentTotal}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
          <CardContent className="p-5">
            <ShieldCheck className="mb-2 h-4 w-4 text-[#315b3b]" />
            <p className="font-mono text-2xl text-[#242424]">{amountText(data?.summary.amountCents ?? 0)}</p>
            <p className="font-mono text-xs text-[#797776]">{t.paymentPaidAmount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
          <CardContent className="p-5">
            <ShieldCheck className="mb-2 h-4 w-4 text-[#8a6a20]" />
            <p className="font-mono text-2xl text-[#242424]">{paidProCount}</p>
            <p className="font-mono text-xs text-[#797776]">{t.paymentPaidPro}</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="mb-4 rounded-[14px] border border-[#c47a6a]/30 bg-[#f4b4a8]/20 px-4 py-3 text-sm text-[#7a3a30]">
          {error}
        </div>
      )}

      {loading ? (
        <p className="font-mono text-sm text-[#797776]">{dict.common.loading}</p>
      ) : payments.length === 0 ? (
        <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
          <CardContent className="p-8 text-center text-sm text-[#797776]">{t.paymentEmpty}</CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8]">
          <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_1.4fr] gap-3 border-b border-[#ded8d0] px-4 py-3 font-mono text-xs text-[#797776] md:grid">
            <span>{t.paymentOrder}</span>
            <span>{t.paymentUser}</span>
            <span>{t.paymentAmount}</span>
            <span>{t.paymentStatusTitle}</span>
            <span>{t.paymentCreatedAt}</span>
          </div>
          {payments.map((payment) => (
            <Link key={payment.paymentId} href={`/${locale}/admin/payments/${payment.paymentId}`} className="grid gap-2 border-b border-[#ded8d0] px-4 py-3 text-sm last:border-b-0 transition-colors hover:bg-[#cfdaf5]/30 md:grid-cols-[1.2fr_1fr_1fr_1fr_1.4fr] md:items-center md:gap-3">
              <div className="min-w-0">
                <p className="font-mono text-xs font-medium text-[#242424]">{typeLabel(payment.type)}</p>
                <p className="mt-1 truncate font-mono text-[11px] text-[#797776]" title={payment.outTradeNo}>
                  {payment.outTradeNo}
                </p>
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-xs text-[#242424]" title={payment.userId ?? ""}>
                  {payment.userId ?? t.paymentAnonymous}
                </p>
                {payment.nickname && <p className="mt-1 truncate text-xs text-[#797776]">{payment.nickname}</p>}
              </div>
              <div>
                <p className="font-mono text-sm text-[#242424]">{amountText(payment.amountCents)}</p>
                <p className="mt-1 font-mono text-[11px] text-[#797776]">{payment.provider} · {payment.channel}</p>
              </div>
              <div>
                <Badge className={`rounded-full font-mono text-[10px] ${statusClass(payment.status)}`}>
                  {statusLabel(payment.status)}
                </Badge>
              </div>
              <div>
                <p className="font-mono text-xs text-[#242424]">
                  {payment.createdAt ? formatDate(payment.createdAt, locale) : "-"}
                </p>
                {payment.paidAt && (
                  <p className="mt-1 font-mono text-[11px] text-[#797776]">
                    {t.paymentPaidAt}: {formatDate(payment.paidAt, locale)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
