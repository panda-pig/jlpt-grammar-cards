/**
 * Which payment provider the client should request.
 *
 * Switching providers is a config change, not a code change: set
 * NEXT_PUBLIC_PAYMENT_PROVIDER=stripe once Stripe keys are live, and the
 * order routes + checkout UI follow automatically.
 *
 * - wechat: Native scan → server returns qr_code_url, page polls for `paid`
 * - stripe: hosted Checkout → server returns checkout_url, page redirects
 */
export type ClientPaymentProvider = "wechat" | "stripe";

export const PAYMENT_PROVIDER: ClientPaymentProvider =
  process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "stripe" ? "stripe" : "wechat";

export const PAYMENT_CHANNEL = PAYMENT_PROVIDER === "stripe" ? "checkout" : "native";

export const isRedirectCheckout = PAYMENT_PROVIDER === "stripe";

/** Order payload shared by the Pro and tip flows. */
export function paymentRequestBase() {
  return { provider: PAYMENT_PROVIDER, channel: PAYMENT_CHANNEL };
}
