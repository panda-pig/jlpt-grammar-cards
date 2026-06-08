import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import {
  PaymentUnauthorizedError,
  PaymentValidationError,
  paymentService,
  type PaymentChannel,
  type PaymentProvider,
  type PaymentType,
} from "@/services/paymentService";
import { PaymentProviderUnavailableError } from "@/services/wechatPayClient";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

// ---------------------------------------------------------------------------
// In-memory IP rate limiter — 5 orders per 10 minutes per IP.
// Works across concurrent requests within the same Fluid Compute container.
// A distributed store (e.g. Redis) would be needed for multi-instance coverage,
// but this provides meaningful protection for the single-tenant use case.
// ---------------------------------------------------------------------------
const orderRateLimiter = new Map<string, number[]>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const hits = (orderRateLimiter.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) return false;
  hits.push(now);
  orderRateLimiter.set(ip, hits);
  return true;
}

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return errorResponse(
        "rate_limit_exceeded",
        "Too many order requests. Please try again in a few minutes.",
        429
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const payment = await paymentService.createPaymentOrder({
      type: body.type as PaymentType,
      provider: (body.provider ?? "wechat") as PaymentProvider,
      channel: (body.channel ?? "native") as PaymentChannel,
      userId: user?.id ?? null,
      amountCents: body.amountCents,
      nickname: body.nickname,
      message: body.message,
      metadata: body.metadata,
    });

    return NextResponse.json(payment);
  } catch (error) {
    if (error instanceof PaymentUnauthorizedError) {
      return errorResponse(error.code, error.message, 401);
    }
    if (error instanceof PaymentValidationError) {
      return errorResponse(error.code, error.message, 400);
    }
    if (error instanceof PaymentProviderUnavailableError) {
      return errorResponse(error.code, error.message, 503);
    }

    const message = error instanceof Error ? error.message : "Unexpected payment error.";
    return errorResponse("payment_order_create_failed", message, 500);
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse("payment_login_required", "Log in to view payment history.", 401);
    }

    const payments = await paymentService.listUserPayments(user.id);
    return NextResponse.json({ payments });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected payment list error.";
    return errorResponse("payment_order_list_failed", message, 500);
  }
}
