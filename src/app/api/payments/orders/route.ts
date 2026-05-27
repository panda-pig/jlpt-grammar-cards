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

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
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
