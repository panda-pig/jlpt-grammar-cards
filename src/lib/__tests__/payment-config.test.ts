import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * PAYMENT_PROVIDER is read at module load, so each case re-imports the module
 * with a fresh env via vi.resetModules().
 */
async function loadWith(provider: string | undefined) {
  vi.resetModules();
  if (provider === undefined) {
    delete process.env.NEXT_PUBLIC_PAYMENT_PROVIDER;
  } else {
    process.env.NEXT_PUBLIC_PAYMENT_PROVIDER = provider;
  }
  return import("@/lib/payment-config");
}

const original = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER;
beforeEach(() => vi.resetModules());
afterEach(() => {
  if (original === undefined) delete process.env.NEXT_PUBLIC_PAYMENT_PROVIDER;
  else process.env.NEXT_PUBLIC_PAYMENT_PROVIDER = original;
});

describe("payment-config", () => {
  it("defaults to WeChat Native when the env is unset", async () => {
    const m = await loadWith(undefined);
    expect(m.PAYMENT_PROVIDER).toBe("wechat");
    expect(m.PAYMENT_CHANNEL).toBe("native");
    expect(m.isRedirectCheckout).toBe(false);
    expect(m.paymentRequestBase()).toEqual({ provider: "wechat", channel: "native" });
  });

  it("switches to Stripe hosted checkout when the env says stripe", async () => {
    const m = await loadWith("stripe");
    expect(m.PAYMENT_PROVIDER).toBe("stripe");
    expect(m.PAYMENT_CHANNEL).toBe("checkout");
    expect(m.isRedirectCheckout).toBe(true);
    expect(m.paymentRequestBase()).toEqual({ provider: "stripe", channel: "checkout" });
  });

  it("falls back to WeChat for an unknown provider value", async () => {
    const m = await loadWith("paypal");
    expect(m.PAYMENT_PROVIDER).toBe("wechat");
    expect(m.isRedirectCheckout).toBe(false);
  });
});
