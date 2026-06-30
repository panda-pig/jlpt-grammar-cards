import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { PaymentProviderUnavailableError } from "@/services/wechatPayClient";
import { stripeClient } from "@/services/stripeClient";
import { paymentService } from "@/services/paymentService";
import type { Json } from "@/lib/database.types";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

async function settleFromSession(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const outTradeNo = session.metadata?.out_trade_no;
  if (!outTradeNo) return;

  await paymentService.markPaymentPaid({
    outTradeNo,
    provider: "stripe",
    providerTransactionId: typeof session.payment_intent === "string" ? session.payment_intent : null,
    amountCents: typeof session.amount_total === "number" ? session.amount_total : null,
    eventId: event.id,
    rawPayload: (event as unknown as Record<string, Json | undefined>),
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return errorResponse("missing_signature", "Missing stripe-signature header.", 400);
  }

  let event: Stripe.Event;
  try {
    // Raw body is required for signature verification — do not parse first.
    const rawBody = await request.text();
    event = stripeClient.constructWebhookEvent(rawBody, signature);
  } catch (error) {
    if (error instanceof PaymentProviderUnavailableError) {
      return errorResponse(error.code, error.message, 501);
    }
    return errorResponse("invalid_signature", "Stripe signature verification failed.", 400);
  }

  try {
    // card = completed; WeChat Pay / Alipay are async → async_payment_succeeded.
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      await settleFromSession(event);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected Stripe webhook error.";
    return errorResponse("stripe_webhook_failed", message, 500);
  }
}
