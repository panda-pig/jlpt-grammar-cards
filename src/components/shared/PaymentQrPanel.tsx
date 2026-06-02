"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Copy, Loader2, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

export type ClientPaymentOrder = {
  paymentId: string;
  outTradeNo: string;
  amountCents: number;
  status: string;
  qrCodeUrl: string | null;
  expiresAt: string | null;
};

export type PaymentQrPanelText = {
  orderCreated: string;
  orderPendingDesc: string;
  scanWithWechat: string;
  copyLink: string;
  copied: string;
  orderPolling: string;
  orderPaid: string;
  orderExpired: string;
};

export function isPaymentOrderExpired(order: Pick<ClientPaymentOrder, "expiresAt" | "status"> | null) {
  return Boolean(order?.expiresAt && new Date(order.expiresAt) < new Date() && order.status === "pending");
}

export function PaymentQrPanel({
  order,
  text,
  className,
}: {
  order: ClientPaymentOrder | null;
  text: PaymentQrPanelText;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const expired = isPaymentOrderExpired(order);

  const handleCopyQrLink = async () => {
    if (!order?.qrCodeUrl) return;
    try {
      await navigator.clipboard.writeText(order.qrCodeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable in older browsers or insecure contexts.
    }
  };

  if (!order) return null;

  if (order.status === "paid") {
    return (
      <div className={cn("flex items-center gap-2 rounded-[18px] bg-[#dcebd8] px-4 py-3 text-sm text-[#315b3b]", className)}>
        <CheckCircle className="h-4 w-4 shrink-0" />
        <span>{text.orderPaid}</span>
      </div>
    );
  }

  if (expired) {
    return (
      <div className={cn("flex items-center gap-2 rounded-[18px] border border-[#d8b15a]/30 bg-[#fff6df] px-4 py-3 text-sm text-[#8a6a20]", className)}>
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{text.orderExpired}</span>
      </div>
    );
  }

  if (order.status !== "pending" || !order.qrCodeUrl) return null;

  return (
    <div className={cn("rounded-[18px] border border-[rgba(36,36,36,0.10)] bg-white p-4", className)}>
      <div className="flex items-center gap-2 font-mono text-sm font-medium text-[#242424]">
        <QrCode className="h-4 w-4" />
        {text.orderCreated}
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-[#797776]">{text.orderPendingDesc}</p>

      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="rounded-xl border border-[rgba(36,36,36,0.08)] bg-white p-3">
          <QRCodeSVG
            value={order.qrCodeUrl}
            size={192}
            bgColor="#ffffff"
            fgColor="#242424"
            level="M"
          />
        </div>
        <p className="font-mono text-[11px] text-[#797776]">{text.scanWithWechat}</p>
      </div>

      <button
        onClick={handleCopyQrLink}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[14px] border border-[rgba(36,36,36,0.12)] py-2 font-mono text-[11px] text-[#797776] transition-colors hover:bg-[rgba(36,36,36,0.04)]"
      >
        <Copy className="h-3 w-3" />
        {copied ? text.copied : text.copyLink}
      </button>

      <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-[#797776]">
        <Loader2 className="h-3 w-3 animate-spin" />
        {text.orderPolling}
      </div>
    </div>
  );
}
