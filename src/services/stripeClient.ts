import Stripe from "stripe";
import { PaymentProviderUnavailableError } from "@/services/wechatPayClient";

/**
 * Stripe provider adapter — parallel to wechatPayClient. Uses Stripe Checkout
 * (hosted redirect) so Stripe renders the WeChat Pay / Alipay / card UI, handles
 * the QR + SCA, and the existing order/poll/webhook flow stays provider-agnostic.
 *
 * Throws PaymentProviderUnavailableError (shared with WeChat) when env is missing,
 * so the order/webhook routes keep one uniform `instanceof` check.
 */

export interface StripeCheckoutInput {
  outTradeNo: string;
  paymentId: string;
  amountCents: number;
  description: string;
  /** "tip" | "pro_lifetime" — drives which payment methods to offer. */
  type: "tip" | "pro_lifetime";
}

export interface StripeCheckoutResult {
  sessionId: string;
  checkoutUrl: string;
}

function getEnv(name: string): string | undefined {
  return process.env[name]?.trim();
}

function siteBaseUrl(): string {
  return (getEnv("NEXT_PUBLIC_SITE_URL") ?? "https://jlpt-grammar-cards.com").replace(/\/$/, "");
}

let cachedClient: Stripe | null = null;
function client(): Stripe {
  if (cachedClient) return cachedClient;
  const key = getEnv("STRIPE_SECRET_KEY");
  if (!key) throw new PaymentProviderUnavailableError("Stripe is not configured yet (STRIPE_SECRET_KEY).");
  cachedClient = new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
  return cachedClient;
}

export const stripeClient = {
  isConfigured(): boolean {
    return Boolean(getEnv("STRIPE_SECRET_KEY"));
  },

  /**
   * Create a Checkout Session in CNY. WeChat Pay / Alipay are async redirect
   * methods, so payment confirmation arrives via the webhook
   * (`checkout.session.async_payment_succeeded`), not synchronously here.
   */
  async createCheckoutSession(input: StripeCheckoutInput): Promise<StripeCheckoutResult> {
    const base = siteBaseUrl();
    const session = await client().checkout.sessions.create({
      mode: "payment",
      // Charge in CNY (Stripe smallest unit for CNY is the cent / 分 = amountCents).
      currency: "cny",
      payment_method_types: ["wechat_pay", "alipay", "card"],
      payment_method_options: {
        wechat_pay: { client: "web" },
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "cny",
            unit_amount: input.amountCents,
            product_data: { name: input.description },
          },
        },
      ],
      client_reference_id: input.outTradeNo,
      metadata: { out_trade_no: input.outTradeNo, payment_id: input.paymentId, type: input.type },
      success_url: `${base}/zh/payments/${input.paymentId}?paid=1`,
      cancel_url: `${base}/zh/payments/${input.paymentId}?canceled=1`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }
    return { sessionId: session.id, checkoutUrl: session.url };
  },

  /** Verify the webhook signature and return the parsed event. */
  constructWebhookEvent(rawBody: string, signature: string): Stripe.Event {
    const secret = getEnv("STRIPE_WEBHOOK_SECRET");
    if (!secret) throw new PaymentProviderUnavailableError("Stripe webhook secret is not configured.");
    return client().webhooks.constructEvent(rawBody, signature, secret);
  },
};
