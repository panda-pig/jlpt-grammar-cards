"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Heart, MessageCircle, QrCode, Sparkles } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { cn } from "@/lib/utils";

type PaymentOrder = {
  paymentId: string;
  outTradeNo: string;
  amountCents: number;
  status: string;
  qrCodeUrl: string | null;
};

const presetAmounts = [300, 590, 1200, 3000];

export default function SupportPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.commerce;

  const [amountCents, setAmountCents] = useState(590);
  const [customYuan, setCustomYuan] = useState("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [status, setStatus] = useState<"idle" | "creating" | "unavailable" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedAmount = customYuan
    ? Math.max(100, Math.round(Number(customYuan) * 100))
    : amountCents;

  const handleCreateTip = async () => {
    setOrder(null);
    setErrorMessage("");

    if (!Number.isFinite(selectedAmount) || selectedAmount < 100) {
      setErrorMessage(t.paymentFailed);
      setStatus("error");
      return;
    }

    setStatus("creating");
    try {
      const response = await fetch("/api/payments/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "tip",
          provider: "wechat",
          channel: "native",
          amountCents: selectedAmount,
          nickname,
          message,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data?.error?.code === "payment_provider_unavailable") {
          setStatus("unavailable");
          return;
        }
        setErrorMessage(data?.error?.message ?? t.paymentFailed);
        setStatus("error");
        return;
      }

      setOrder(data);
      setStatus("idle");
    } catch {
      setErrorMessage(t.paymentFailed);
      setStatus("error");
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-[1040px] px-6 py-10 md:py-14">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff6df] px-3 py-1 text-[#8a6a20]">
              <Heart className="h-3.5 w-3.5" />
              <span className="font-mono text-[11px]">{t.supportAnonymous}</span>
            </div>
            <h1 className="mt-4 font-serif text-[clamp(34px,6vw,64px)] leading-[1.05] tracking-[-0.02em] text-[#000000]">
              {t.supportTitle}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#797776] md:text-base">
              {t.supportSubtitle}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-[rgba(36,36,36,0.12)] bg-[#fbfaf8] p-5">
                <Sparkles className="mb-4 h-5 w-5 text-[#8a6a20]" />
                <p className="font-mono text-sm font-medium text-[#242424]">{dict.settings.supportAuthor}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#797776]">{t.paymentUnavailableDesc}</p>
              </div>
              <div className="rounded-[22px] border border-[rgba(36,36,36,0.12)] bg-[#fbfaf8] p-5">
                <MessageCircle className="mb-4 h-5 w-5 text-[#315b3b]" />
                <p className="font-mono text-sm font-medium text-[#242424]">{dict.nav.pro}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#797776]">{t.proSubtitle}</p>
                <Link href={`/${locale}/pro`} className="mt-4 inline-flex font-mono text-xs text-[#242424] underline underline-offset-4">
                  {dict.settings.upgradePro}
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[rgba(36,36,36,0.14)] bg-[#fbfaf8] p-5 shadow-[0_16px_40px_rgba(36,36,36,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-[#797776]">{t.amount}</p>
                <p className="mt-1 font-serif text-3xl text-[#000000]">¥{(selectedAmount / 100).toFixed(selectedAmount % 100 === 0 ? 0 : 2)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#242424] text-[#f6f3f1]">
                <Heart className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setAmountCents(amount);
                    setCustomYuan("");
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2.5 font-mono text-sm transition-colors",
                    !customYuan && amountCents === amount
                      ? "border-[#242424] bg-[#242424] text-[#f6f3f1]"
                      : "border-[rgba(36,36,36,0.16)] text-[#242424] hover:bg-[rgba(36,36,36,0.04)]"
                  )}
                >
                  ¥{(amount / 100).toFixed(amount % 100 === 0 ? 0 : 2)}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input
                type="number"
                min="1"
                step="0.01"
                placeholder={t.customAmount}
                value={customYuan}
                onChange={(event) => setCustomYuan(event.target.value)}
                className="rounded-full"
              />
              <Input
                placeholder={t.nickname}
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                className="rounded-full"
                maxLength={40}
              />
            </div>

            <Input
              placeholder={t.message}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-3 rounded-full"
              maxLength={200}
            />

            <Button
              className="mt-5 h-11 w-full rounded-full bg-[#242424] font-mono text-[#f6f3f1] hover:bg-black"
              onClick={handleCreateTip}
              disabled={status === "creating"}
            >
              {status === "creating" ? t.creatingOrder : t.tipButton}
            </Button>

            {status === "unavailable" && (
              <div className="mt-4 rounded-[18px] border border-[#d8b15a]/30 bg-[#fff6df] p-4 text-sm">
                <div className="flex items-center gap-2 font-mono font-medium text-[#8a6a20]">
                  <AlertCircle className="h-4 w-4" />
                  {t.paymentUnavailableTitle}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#8a6a20]/80">{t.paymentUnavailableDesc}</p>
              </div>
            )}

            {status === "error" && (
              <div className="mt-4 rounded-[18px] border border-[#c47a6a]/30 bg-[#f4b4a8]/20 p-4 text-sm text-[#7a3a30]">
                {errorMessage || t.paymentFailed}
              </div>
            )}

            {order && (
              <div className="mt-4 rounded-[18px] border border-[#6a8a5a]/25 bg-[#dcebd8] p-4 text-sm text-[#315b3b]">
                <div className="flex items-center gap-2 font-mono font-medium">
                  <QrCode className="h-4 w-4" />
                  {t.orderCreated}
                </div>
                <p className="mt-2 text-xs leading-relaxed">{t.orderPendingDesc}</p>
                {order.qrCodeUrl && (
                  <p className="mt-3 break-all rounded-xl bg-white/50 p-3 font-mono text-[11px]">
                    {t.qrCodeUrl}: {order.qrCodeUrl}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
