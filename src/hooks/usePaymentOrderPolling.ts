"use client";

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import type { ClientPaymentOrder } from "@/components/shared/PaymentQrPanel";

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 200; // ~10 minutes

export function usePaymentOrderPolling({
  order,
  setOrder,
  onPaid,
}: {
  order: ClientPaymentOrder | null;
  setOrder: Dispatch<SetStateAction<ClientPaymentOrder | null>>;
  onPaid?: () => void | Promise<void>;
}) {
  const pollAttemptsRef = useRef(0);
  const onPaidRef = useRef(onPaid);
  const orderPaymentId = order?.paymentId ?? null;
  const orderStatus = order?.status ?? null;

  useEffect(() => {
    onPaidRef.current = onPaid;
  }, [onPaid]);

  useEffect(() => {
    if (!orderPaymentId || orderStatus !== "pending") return;

    let stopped = false;
    let timer: ReturnType<typeof setInterval> | null = null;
    pollAttemptsRef.current = 0;

    const stopPolling = () => {
      stopped = true;
      if (timer) clearInterval(timer);
    };

    const poll = async () => {
      if (stopped) return;
      pollAttemptsRef.current += 1;
      if (pollAttemptsRef.current > POLL_MAX_ATTEMPTS) {
        stopPolling();
        return;
      }

      try {
        const res = await fetch(`/api/payments/orders/${orderPaymentId}`, { cache: "no-store" });
        if (!res.ok || stopped) return;
        const data: ClientPaymentOrder = await res.json();

        setOrder((prev) => (prev?.paymentId === data.paymentId ? data : prev));

        if (data.status === "paid") {
          stopPolling();
          await onPaidRef.current?.();
        } else if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
          stopPolling();
        }
      } catch {
        // Ignore transient network errors; the next interval can recover.
      }
    };

    timer = setInterval(poll, POLL_INTERVAL_MS);
    void poll();

    return () => {
      stopPolling();
    };
  }, [orderPaymentId, orderStatus, setOrder]);
}
