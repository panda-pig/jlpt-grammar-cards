"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle, Clock, Loader2, RotateCcw, XCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/date";

type PaymentStatus = "pending" | "paid" | "failed" | "closed" | "refunded";

type PaymentOrder = {
  paymentId: string;
  type: "tip" | "pro_lifetime";
  provider: string;
  channel: string;
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  outTradeNo: string;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string | null;
};

function amountText(cents: number) {
  return `¥${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default function PaymentDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const dict = useDictionary();
  const t = dict.commerce;
  const settings = dict.settings;
  const paymentId = params.id as string;
  const [payment, setPayment] = useState<PaymentOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch(`/api/payments/orders/${paymentId}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? t.paymentNotFound);
      setPayment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.paymentNotFound);
    } finally {
      setLoading(false);
    }
  }, [paymentId, t.paymentNotFound]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (payment?.status !== "pending") return;
    const timer = window.setInterval(() => void load(), 3000);
    return () => window.clearInterval(timer);
  }, [load, payment?.status]);

  const statusLabel = useMemo(() => {
    if (!payment) return "";
    const labels = settings.paymentStatus as Record<PaymentStatus, string>;
    return labels[payment.status] ?? payment.status;
  }, [payment, settings.paymentStatus]);

  const statusStyle = payment?.status === "paid"
    ? "bg-[#dcebd8] text-[#315b3b]"
    : payment?.status === "pending"
      ? "bg-[#fff6df] text-[#8a6a20]"
      : "bg-[#f4b4a8]/25 text-[#7a3a30]";

  const Icon = payment?.status === "paid"
    ? CheckCircle
    : payment?.status === "pending"
      ? Clock
      : XCircle;

  const retryHref = `/${locale}/support`;
  const retryLabel = t.paymentBackToSupport;

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776]">
            <div className="h-px w-8 bg-[#242424]" />
            WeChat Pay
          </div>
          <h1 className="font-serif text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.08] tracking-[-0.022em] text-black">
            {t.paymentDetailTitle}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#797776]">{t.paymentDetailDesc}</p>
        </div>

        <Card className="card-soft rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
          <CardContent className="p-5 sm:p-6">
            {loading ? (
              <div className="flex items-center gap-2 font-mono text-sm text-[#797776]">
                <Loader2 className="h-4 w-4 animate-spin" />
                {dict.common.loading}
              </div>
            ) : error || !payment ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-[#7a3a30]">
                  <XCircle className="h-4 w-4" />
                  {error || t.paymentNotFound}
                </div>
                <Link href={`/${locale}/support`} className={buttonVariants({ className: "rounded-full font-mono" })}>
                  {t.paymentBackToSupport}
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-[#797776]">{t.supportTitle}</p>
                    <p className="mt-1 font-serif text-4xl text-[#242424]">{amountText(payment.amountCents)}</p>
                  </div>
                  <Badge className={`rounded-full px-3 py-1 font-mono text-xs ${statusStyle}`}>
                    <Icon className="mr-1 h-3.5 w-3.5" />
                    {statusLabel}
                  </Badge>
                </div>

                <div className="grid gap-3 text-sm">
                  <div className="rounded-[14px] border border-[#ded8d0] bg-[#f6f3f1] px-4 py-3">
                    <p className="font-mono text-xs text-[#797776]">{t.paymentOrderNo}</p>
                    <p className="mt-1 break-all font-mono text-xs text-[#242424]">{payment.outTradeNo}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[14px] border border-[#ded8d0] bg-[#f6f3f1] px-4 py-3">
                      <p className="font-mono text-xs text-[#797776]">{t.paymentCurrentStatus}</p>
                      <p className="mt-1 font-mono text-sm text-[#242424]">{statusLabel}</p>
                    </div>
                    <div className="rounded-[14px] border border-[#ded8d0] bg-[#f6f3f1] px-4 py-3">
                      <p className="font-mono text-xs text-[#797776]">{t.paymentChannel}</p>
                      <p className="mt-1 font-mono text-sm text-[#242424]">{payment.provider} · {payment.channel}</p>
                    </div>
                    <div className="rounded-[14px] border border-[#ded8d0] bg-[#f6f3f1] px-4 py-3">
                      <p className="font-mono text-xs text-[#797776]">{t.paymentCreatedAt}</p>
                      <p className="mt-1 font-mono text-sm text-[#242424]">{payment.createdAt ? formatDate(payment.createdAt, locale) : "-"}</p>
                    </div>
                    <div className="rounded-[14px] border border-[#ded8d0] bg-[#f6f3f1] px-4 py-3">
                      <p className="font-mono text-xs text-[#797776]">{payment.paidAt ? t.paymentPaidAt : t.paymentExpiresAt}</p>
                      <p className="mt-1 font-mono text-sm text-[#242424]">
                        {payment.paidAt ? formatDate(payment.paidAt, locale) : payment.expiresAt ? formatDate(payment.expiresAt, locale) : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {payment.status === "pending" && (
                    <Button variant="outline" className="rounded-full font-mono" onClick={load}>
                      <RotateCcw className="mr-1 h-4 w-4" />
                      {dict.admin.refresh}
                    </Button>
                  )}
                  {(payment.status === "closed" || payment.status === "failed") && (
                    <Link href={retryHref} className={buttonVariants({ className: "rounded-full font-mono" })}>
                      {t.retryPayment}
                    </Link>
                  )}
                  <Link href={retryHref} className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>
                    {retryLabel}
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
