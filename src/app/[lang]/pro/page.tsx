"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, Crown, Library, LineChart, QrCode, ShieldCheck, Smartphone } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";

type EntitlementResponse = {
  authenticated: boolean;
  plan: "free" | "pro";
  isPro: boolean;
  lifetime: boolean;
};

type PaymentOrder = {
  paymentId: string;
  outTradeNo: string;
  amountCents: number;
  status: string;
  qrCodeUrl: string | null;
  expiresAt: string | null;
};

const featureIcons = [Library, LineChart, ShieldCheck, Smartphone];

export default function ProPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const t = dict.commerce;

  const [entitlement, setEntitlement] = useState<EntitlementResponse | null>(null);
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [status, setStatus] = useState<"idle" | "creating" | "unavailable" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/me/entitlements", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setEntitlement(data))
      .catch(() => setEntitlement(null));
  }, []);

  const handleBuyPro = async () => {
    setOrder(null);
    setErrorMessage("");

    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }

    setStatus("creating");
    try {
      const response = await fetch("/api/payments/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pro_lifetime",
          provider: "wechat",
          channel: "native",
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

  const isPro = Boolean(entitlement?.isPro);

  return (
    <MainLayout>
      <div className="mx-auto max-w-[1120px] px-6 py-10 md:py-14">
        <section className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(36,36,36,0.06)] px-3 py-1">
              <Crown className="h-3.5 w-3.5 text-[#242424]" />
              <span className="font-mono text-[11px] text-[#242424]">{t.lifetime}</span>
            </div>
            <h1 className="mt-4 font-serif text-[clamp(34px,6vw,64px)] leading-[1.05] tracking-[-0.02em] text-[#000000]">
              {t.proTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#797776] md:text-base">
              {t.proSubtitle}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {t.proFeatures.map((feature, index) => {
                const Icon = featureIcons[index] ?? ShieldCheck;
                return (
                  <div
                    key={feature.title}
                    className="rounded-[22px] border border-[rgba(36,36,36,0.12)] bg-[#fbfaf8] p-5"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#cfdaf5] text-[#242424]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h2 className="font-mono text-sm font-medium text-[#242424]">{feature.title}</h2>
                    <p className="mt-2 text-xs leading-relaxed text-[#797776]">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[28px] border border-[rgba(36,36,36,0.14)] bg-[#fbfaf8] p-5 shadow-[0_16px_40px_rgba(36,36,36,0.05)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-[#797776]">{t.currentPlan}</p>
                <p className="mt-1 font-mono text-sm font-medium text-[#242424]">
                  {isPro ? t.proPlan : t.freePlan}
                </p>
              </div>
              <div className="rounded-full bg-[#242424] px-3 py-1 font-mono text-xs text-[#f6f3f1]">
                {t.price}
              </div>
            </div>

            <div className="mt-6 rounded-[20px] bg-[#f6f3f1] p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl leading-none text-[#000000]">{t.price}</span>
                <span className="font-mono text-xs text-[#797776]">{t.lifetime}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {t.freeFeatures.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#242424]">
                    <CheckCircle className="h-4 w-4 shrink-0 text-[#6a8a5a]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {isPro ? (
              <div className="mt-4 flex items-center gap-2 rounded-[18px] bg-[#dcebd8] px-4 py-3 text-sm text-[#315b3b]">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{t.activePro}</span>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {!isLoading && !user && (
                  <p className="text-xs leading-relaxed text-[#797776]">{t.loginRequired}</p>
                )}
                <Button
                  className="h-11 w-full rounded-full bg-[#242424] font-mono text-[#f6f3f1] hover:bg-black"
                  onClick={handleBuyPro}
                  disabled={status === "creating" || isLoading}
                >
                  {status === "creating" ? t.creatingOrder : user ? t.buyPro : t.loginToBuy}
                </Button>
              </div>
            )}

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

            <Link
              href={`/${locale}/support`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[rgba(36,36,36,0.16)] px-4 py-2.5 font-mono text-sm text-[#242424] transition-colors hover:bg-[rgba(36,36,36,0.04)]"
            >
              {dict.settings.supportAuthor}
            </Link>
          </aside>
        </section>
      </div>
    </MainLayout>
  );
}
