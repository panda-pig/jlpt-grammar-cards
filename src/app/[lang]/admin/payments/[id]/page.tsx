"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { formatDate } from "@/lib/date";
import { CheckCircle, Loader2, RotateCcw, XCircle } from "lucide-react";

type PaymentStatus = "pending" | "paid" | "failed" | "closed" | "refunded";

type Order = {
  paymentId: string;
  userId: string | null;
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
  nickname?: string | null;
  message?: string | null;
  entitlement?: { isPro: boolean } | null;
};

type EventRow = {
  id: string;
  provider: string;
  eventType: string;
  eventId: string | null;
  payload: Record<string, unknown>;
  createdAt: string | null;
};

type Detail = { order: Order; events: EventRow[] };

function amountText(cents: number) {
  return `¥${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default function AdminPaymentDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const dict = useDictionary();
  const t = dict.admin;
  const paymentId = params.id as string;

  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [working, setWorking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? t.paymentLoadFailed);
      setDetail(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.paymentLoadFailed);
    } finally {
      setLoading(false);
    }
  }, [paymentId, t.paymentLoadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (action: "mark_paid" | "close", confirmText: string) => {
    if (!window.confirm(confirmText)) return;
    setWorking(true);
    setActionMsg("");
    setError("");
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? t.actionFailed);
      setDetail(json);
      setActionMsg(t.actionDone);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.actionFailed);
    } finally {
      setWorking(false);
    }
  };

  const statusClass = (status: PaymentStatus) => {
    if (status === "paid") return "bg-[#dcebd8] text-[#315b3b]";
    if (status === "pending") return "bg-[#fff6df] text-[#8a6a20]";
    return "bg-[#f4b4a8]/25 text-[#7a3a30]";
  };

  const statusLabel = (status: PaymentStatus) => {
    const labels = t.paymentStatus as Record<PaymentStatus, string>;
    return labels[status] ?? status;
  };

  const eventLabel = (type: string) => {
    const labels = t.eventTypes as Record<string, string>;
    return labels[type] ?? type;
  };

  const order = detail?.order;
  const events = detail?.events ?? [];

  const field = (label: string, value: React.ReactNode) => (
    <div className="rounded-[12px] border border-[#ded8d0] bg-[#f6f3f1] px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[.06em] text-[#797776]">{label}</p>
      <p className="mt-1 break-all font-mono text-sm text-[#242424]">{value}</p>
    </div>
  );

  return (
    <div className="max-w-4xl">
      <Link href={`/${locale}/admin/payments`} className="font-mono text-xs text-[#797776] hover:text-[#242424] transition-colors">
        {t.backToPayments}
      </Link>
      <h1 className="mt-3 font-serif text-[clamp(24px,3vw,36px)] font-bold tracking-[-0.02em] text-[#242424]">
        {t.orderDetail}
      </h1>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#797776]">{t.orderDetailDesc}</p>

      {error && (
        <div className="mt-4 rounded-[14px] border border-[#c47a6a]/30 bg-[#f4b4a8]/20 px-4 py-3 text-sm text-[#7a3a30]">
          {error}
        </div>
      )}
      {actionMsg && (
        <div className="mt-4 rounded-[14px] border border-[#6a8a5a]/40 bg-[#dcebd8]/50 px-4 py-3 text-sm text-[#315b3b]">
          {actionMsg}
        </div>
      )}

      {loading ? (
        <p className="mt-6 flex items-center gap-2 font-mono text-sm text-[#797776]">
          <Loader2 className="h-4 w-4 animate-spin" />{dict.common.loading}
        </p>
      ) : !order ? null : (
        <div className="mt-6 space-y-6">
          {/* Summary */}
          <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-[#797776]">
                    {order.type === "pro_lifetime" ? t.paymentPro : t.paymentTip}
                  </p>
                  <p className="mt-1 font-serif text-4xl text-[#242424]">{amountText(order.amountCents)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`rounded-full px-3 py-1 font-mono text-xs ${statusClass(order.status)}`}>
                    {statusLabel(order.status)}
                  </Badge>
                  {order.userId && (
                    <span className="font-mono text-[11px] text-[#797776]">
                      {t.orderEntitlement}: {order.entitlement?.isPro ? t.entitlementPro : t.entitlementFree}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {field(t.orderType, order.type === "pro_lifetime" ? t.paymentPro : t.paymentTip)}
                {field(t.orderChannel, `${order.provider} · ${order.channel}`)}
                {field(t.orderOutTradeNo, order.outTradeNo)}
                {field(t.orderUserId, order.userId ?? t.paymentAnonymous)}
                {field(t.paymentCreatedAt, order.createdAt ? formatDate(order.createdAt, locale) : "-")}
                {field(order.paidAt ? t.paymentPaidAt : t.orderExpiresAt,
                  order.paidAt
                    ? formatDate(order.paidAt, locale)
                    : order.expiresAt ? formatDate(order.expiresAt, locale) : "-")}
                {order.nickname ? field(t.orderNickname, order.nickname) : null}
                {order.message ? field(t.orderMessage, order.message) : null}
              </div>
            </CardContent>
          </Card>

          {/* Manual actions */}
          <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
            <CardContent className="p-5 sm:p-6">
              <h2 className="mb-3 font-mono text-sm font-bold text-[#242424]">{t.orderActions}</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  className="rounded-full font-mono"
                  disabled={working || order.status === "paid" || order.status === "refunded"}
                  onClick={() => runAction("mark_paid", t.markPaidConfirm)}
                >
                  {working ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-1 h-4 w-4" />}
                  {t.markPaid}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full font-mono text-[#7a3a30] border-[#c47a6a]/40 hover:bg-[#f4b4a8]/15"
                  disabled={working || order.status === "paid" || order.status === "closed" || order.status === "refunded"}
                  onClick={() => runAction("close", t.closeConfirm)}
                >
                  <XCircle className="mr-1 h-4 w-4" />{t.closeOrder}
                </Button>
                <Button variant="outline" className="rounded-full font-mono" disabled={working || loading} onClick={load}>
                  <RotateCcw className="mr-1 h-4 w-4" />{t.refresh}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Event timeline */}
          <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
            <CardContent className="p-5 sm:p-6">
              <h2 className="mb-3 font-mono text-sm font-bold text-[#242424]">{t.eventsTitle}</h2>
              {events.length === 0 ? (
                <p className="text-sm text-[#797776]">{t.eventsEmpty}</p>
              ) : (
                <div className="space-y-2">
                  {events.map((ev) => (
                    <div key={ev.id} className="rounded-[12px] border border-[#ded8d0] bg-[#f6f3f1] px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs font-medium text-[#242424]">{eventLabel(ev.eventType)}</span>
                        <span className="font-mono text-[11px] text-[#797776]">
                          {ev.createdAt ? formatDate(ev.createdAt, locale) : "-"}
                        </span>
                      </div>
                      {typeof ev.payload?.operator === "string" && (
                        <p className="mt-1 break-all font-mono text-[11px] text-[#797776]">
                          operator: {ev.payload.operator as string}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
