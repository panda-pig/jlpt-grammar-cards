/**
 * paymentService unit tests
 *
 * Coverage:
 *  1. createPaymentOrder — input validation (amount range, type, Pro requires login)
 *  2. createPaymentOrder — anonymous tips allowed, pro_lifetime requires userId
 *  3. markPaymentPaid    — idempotency (already-paid orders skip UPDATE)
 *  4. getPaymentStatus   — access control (owner OK, other user → 403, anon tip → OK)
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  PaymentForbiddenError,
  PaymentIntegrityError,
  PaymentNotFoundError,
  PaymentStateError,
  PaymentUnauthorizedError,
  PaymentValidationError,
  paymentService,
} from "../paymentService";

// ── Module mocks ─────────────────────────────────────────────────────────────

vi.mock("@/lib/supabase-admin", () => ({
  createServiceRoleClient: vi.fn(),
}));

// Keep the real PaymentProviderUnavailableError class so instanceof checks inside
// paymentService still work; mock only createNativeOrder.
vi.mock("@/services/wechatPayClient", async (importOriginal) => {
  const real = await importOriginal<typeof import("../wechatPayClient")>();
  return {
    PaymentProviderUnavailableError: real.PaymentProviderUnavailableError,
    wechatPayClient: {
      createNativeOrder: vi.fn().mockResolvedValue({
        qrCodeUrl: "weixin://wxpay/bizpayurl?pr=TESTQR",
        providerPrepayId: null,
        raw: {},
      }),
      isConfigured: vi.fn().mockReturnValue(true),
    },
  };
});

vi.mock("@/services/entitlementService", () => ({
  entitlementService: {
    grantLifetimePro: vi.fn().mockResolvedValue({
      plan: "pro",
      isPro: true,
      lifetime: true,
      startsAt: "2026-01-01T00:00:00Z",
      expiresAt: null,
      sourcePaymentId: "pay-abc",
    }),
    getCurrentPlan: vi.fn().mockResolvedValue({
      plan: "pro",
      isPro: true,
      lifetime: true,
      startsAt: null,
      expiresAt: null,
      sourcePaymentId: null,
    }),
    freeState: vi.fn().mockReturnValue({
      plan: "free",
      isPro: false,
      lifetime: false,
      startsAt: null,
      expiresAt: null,
      sourcePaymentId: null,
    }),
  },
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

import { createServiceRoleClient } from "@/lib/supabase-admin";
import { entitlementService } from "@/services/entitlementService";

const mockCreateClient = vi.mocked(createServiceRoleClient);
const mockEntitlementService = vi.mocked(entitlementService);

/**
 * Build a chainable Supabase query mock.
 *
 * All builder methods (select, eq, update, upsert, insert) return the chain
 * itself so call patterns like `.insert({}).select("*").single()` work.
 *
 * The chain is also a thenable so `await chain` (e.g. `await …insert(…)`)
 * resolves directly without needing a terminal like .single().
 */
function makeChain(result: { data: unknown; error?: unknown }) {
  const res = { data: result.data, error: result.error ?? null };
  const chain: Record<string, unknown> = {};

  chain.select      = vi.fn(() => chain);
  chain.eq          = vi.fn(() => chain);
  chain.neq         = vi.fn(() => chain);
  chain.order       = vi.fn(() => chain);
  chain.update      = vi.fn(() => chain);
  chain.upsert      = vi.fn(() => chain);
  chain.insert      = vi.fn(() => chain);   // chainable — see thenable below
  chain.single      = vi.fn().mockResolvedValue(res);
  chain.maybeSingle = vi.fn().mockResolvedValue(res);

  // Make the chain itself awaitable for call sites that do `await …insert(…)`
  // without a subsequent .single() terminal.
  (chain as any).then = (
    resolve: (v: typeof res) => void,
    reject:  (e: unknown)    => void,
  ) => { Promise.resolve(res).then(resolve, reject); };

  return chain;
}

/**
 * Build a mock Supabase client that dispatches to per-table result data.
 * Returns the chain for each table so tests can assert on specific calls.
 */
function buildClient(tables: Record<string, { data: unknown; error?: unknown }>) {
  const chains: Record<string, ReturnType<typeof makeChain>> = {};
  return {
    client: {
      from: vi.fn().mockImplementation((table: string) => {
        chains[table] = makeChain(tables[table] ?? { data: null });
        return chains[table];
      }),
    } as unknown as ReturnType<typeof createServiceRoleClient>,
    chains,
  };
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

const pendingPayment = {
  id: "pay-pending-123",
  user_id: "user-abc",
  type: "pro_lifetime",
  provider: "wechat",
  channel: "native",
  amount_cents: 590,
  currency: "CNY",
  status: "pending",
  out_trade_no: "JLPT123ABC",
  qr_code_url: "weixin://wxpay/bizpayurl?pr=QR1",
  paid_at: null,
  expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  provider_transaction_id: null,
  payer_openid: null,
};

const paidPayment = {
  ...pendingPayment,
  status: "paid",
  paid_at: "2026-05-30T10:00:00Z",
  provider_transaction_id: "wx-tx-999",
};

const anonTipPayment = {
  ...pendingPayment,
  id: "pay-tip-456",
  user_id: null,
  type: "tip",
  amount_cents: 500,
};

// ── Test suites ───────────────────────────────────────────────────────────────

describe("createPaymentOrder — input validation", () => {
  beforeEach(() => {
    // These tests throw before reaching the DB; provide a no-op client
    const { client } = buildClient({});
    mockCreateClient.mockReturnValue(client);
  });

  it("throws PaymentValidationError for an unknown payment type", async () => {
    await expect(
      paymentService.createPaymentOrder({
        type: "subscription" as never,
        provider: "wechat",
        channel: "native",
      }),
    ).rejects.toThrow(PaymentValidationError);
  });

  it("throws PaymentValidationError for tip amount below minimum (< 100 fen)", async () => {
    await expect(
      paymentService.createPaymentOrder({
        type: "tip",
        provider: "wechat",
        channel: "native",
        amountCents: 99,
      }),
    ).rejects.toThrow(PaymentValidationError);
  });

  it("throws PaymentValidationError for tip amount above maximum (> 500 000 fen)", async () => {
    await expect(
      paymentService.createPaymentOrder({
        type: "tip",
        provider: "wechat",
        channel: "native",
        amountCents: 500_001,
      }),
    ).rejects.toThrow(PaymentValidationError);
  });

  it("throws PaymentValidationError when tip amountCents is missing", async () => {
    await expect(
      paymentService.createPaymentOrder({
        type: "tip",
        provider: "wechat",
        channel: "native",
        // amountCents deliberately omitted
      }),
    ).rejects.toThrow(PaymentValidationError);
  });

  it("throws PaymentValidationError for unsupported channel (h5)", async () => {
    await expect(
      paymentService.createPaymentOrder({
        type: "tip",
        provider: "wechat",
        channel: "h5" as never,
        amountCents: 100,
      }),
    ).rejects.toThrow(PaymentValidationError);
  });

  it("throws PaymentValidationError for unsupported provider (alipay)", async () => {
    await expect(
      paymentService.createPaymentOrder({
        type: "tip",
        provider: "alipay",
        channel: "native",
        amountCents: 100,
      }),
    ).rejects.toThrow(PaymentValidationError);
  });
});

describe("createPaymentOrder — auth gating", () => {
  it("throws PaymentUnauthorizedError for pro_lifetime without userId", async () => {
    await expect(
      paymentService.createPaymentOrder({
        type: "pro_lifetime",
        provider: "wechat",
        channel: "native",
        userId: null,
      }),
    ).rejects.toThrow(PaymentUnauthorizedError);
  });

  it("allows pro_lifetime when userId is provided", async () => {
    const { client } = buildClient({
      payments: { data: { ...pendingPayment, status: "pending" } },
    });
    mockCreateClient.mockReturnValue(client);

    const result = await paymentService.createPaymentOrder({
      type: "pro_lifetime",
      provider: "wechat",
      channel: "native",
      userId: "user-abc",
    });

    // qrCodeUrl is persisted in DB then read back — matches the fixture value
    expect(result.qrCodeUrl).toBe(pendingPayment.qr_code_url);
    expect(result.type).toBe("pro_lifetime");
  });

  it("allows anonymous tip (userId null)", async () => {
    const { client } = buildClient({
      payments: { data: { ...anonTipPayment, status: "pending" } },
    });
    mockCreateClient.mockReturnValue(client);

    const result = await paymentService.createPaymentOrder({
      type: "tip",
      provider: "wechat",
      channel: "native",
      userId: null,
      amountCents: 500,
    });

    expect(result.type).toBe("tip");
    expect(result.qrCodeUrl).toBe(anonTipPayment.qr_code_url);
  });
});

describe("markPaymentPaid — idempotency", () => {
  it("skips the status UPDATE when payment is already paid", async () => {
    // Supabase must handle two calls to "payments":
    // 1. SELECT (find by out_trade_no) → paidPayment
    // 2. UPDATE must NOT be called because status === "paid"
    const paymentsChain = makeChain({ data: paidPayment });
    const eventsChain = makeChain({ data: {} });

    mockCreateClient.mockReturnValue({
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "payments") return paymentsChain;
        if (table === "payment_events") return eventsChain;
        return makeChain({ data: null });
      }),
    } as unknown as ReturnType<typeof createServiceRoleClient>);

    await paymentService.markPaymentPaid({
      outTradeNo: paidPayment.out_trade_no,
      provider: "wechat",
      providerTransactionId: "wx-tx-dup",
    });

    // UPDATE should never have been called
    expect(paymentsChain.update).not.toHaveBeenCalled();
  });

  it("still grants Pro entitlement on duplicate callback (grantLifetimePro is an upsert)", async () => {
    const paymentsChain = makeChain({ data: paidPayment });
    const eventsChain = makeChain({ data: {} });

    mockCreateClient.mockReturnValue({
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "payments") return paymentsChain;
        if (table === "payment_events") return eventsChain;
        return makeChain({ data: null });
      }),
    } as unknown as ReturnType<typeof createServiceRoleClient>);

    await paymentService.markPaymentPaid({
      outTradeNo: paidPayment.out_trade_no,
      provider: "wechat",
      providerTransactionId: "wx-tx-dup",
    });

    // grantLifetimePro must still be called — it uses UPSERT so it is safe to repeat
    expect(mockEntitlementService.grantLifetimePro).toHaveBeenCalledWith(
      paidPayment.user_id,
      paidPayment.id,
    );
  });

  it("does not call grantLifetimePro for an already-paid anonymous tip", async () => {
    const paidTip = { ...anonTipPayment, status: "paid", paid_at: "2026-05-30T10:00:00Z" };
    const paymentsChain = makeChain({ data: paidTip });
    const eventsChain = makeChain({ data: {} });

    mockEntitlementService.grantLifetimePro.mockClear();

    mockCreateClient.mockReturnValue({
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "payments") return paymentsChain;
        if (table === "payment_events") return eventsChain;
        return makeChain({ data: null });
      }),
    } as unknown as ReturnType<typeof createServiceRoleClient>);

    await paymentService.markPaymentPaid({
      outTradeNo: paidTip.out_trade_no,
      provider: "wechat",
    });

    // user_id is null for a tip → no entitlement grant
    expect(mockEntitlementService.grantLifetimePro).not.toHaveBeenCalled();
  });

  it("returns a valid PaymentOrderView regardless of duplicate callbacks", async () => {
    const paymentsChain = makeChain({ data: paidPayment });
    const eventsChain = makeChain({ data: {} });

    mockCreateClient.mockReturnValue({
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "payments") return paymentsChain;
        if (table === "payment_events") return eventsChain;
        return makeChain({ data: null });
      }),
    } as unknown as ReturnType<typeof createServiceRoleClient>);

    const view = await paymentService.markPaymentPaid({
      outTradeNo: paidPayment.out_trade_no,
      provider: "wechat",
    });

    expect(view.status).toBe("paid");
    expect(view.paymentId).toBe(paidPayment.id);
    expect(view.type).toBe("pro_lifetime");
  });

  it("throws PaymentIntegrityError when callback amount does not match the order", async () => {
    const paymentsChain = makeChain({ data: pendingPayment });
    const eventsChain = makeChain({ data: {} });
    mockEntitlementService.grantLifetimePro.mockClear();

    mockCreateClient.mockReturnValue({
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "payments") return paymentsChain;
        if (table === "payment_events") return eventsChain;
        return makeChain({ data: null });
      }),
    } as unknown as ReturnType<typeof createServiceRoleClient>);

    await expect(
      paymentService.markPaymentPaid({
        outTradeNo: pendingPayment.out_trade_no,
        provider: "wechat",
        amountCents: 1,
      }),
    ).rejects.toThrow(PaymentIntegrityError);

    expect(eventsChain.insert).not.toHaveBeenCalled();
    expect(paymentsChain.update).not.toHaveBeenCalled();
    expect(mockEntitlementService.grantLifetimePro).not.toHaveBeenCalled();
  });

  it("throws PaymentIntegrityError when callback provider does not match the order", async () => {
    const paymentsChain = makeChain({ data: pendingPayment });
    const eventsChain = makeChain({ data: {} });
    mockEntitlementService.grantLifetimePro.mockClear();

    mockCreateClient.mockReturnValue({
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "payments") return paymentsChain;
        if (table === "payment_events") return eventsChain;
        return makeChain({ data: null });
      }),
    } as unknown as ReturnType<typeof createServiceRoleClient>);

    await expect(
      paymentService.markPaymentPaid({
        outTradeNo: pendingPayment.out_trade_no,
        provider: "alipay",
        amountCents: pendingPayment.amount_cents,
      }),
    ).rejects.toThrow(PaymentIntegrityError);

    expect(eventsChain.insert).not.toHaveBeenCalled();
    expect(paymentsChain.update).not.toHaveBeenCalled();
    expect(mockEntitlementService.grantLifetimePro).not.toHaveBeenCalled();
  });
});

describe("getPaymentStatus — access control", () => {
  it("returns payment view when viewer is the owner", async () => {
    const { client } = buildClient({ payments: { data: pendingPayment } });
    mockCreateClient.mockReturnValue(client);

    const result = await paymentService.getPaymentStatus("pay-pending-123", "user-abc");

    expect(result).not.toBeNull();
    expect(result!.paymentId).toBe(pendingPayment.id);
  });

  it("throws PaymentForbiddenError when a different user queries an owner-bound payment", async () => {
    const { client } = buildClient({ payments: { data: pendingPayment } });
    mockCreateClient.mockReturnValue(client);

    await expect(
      paymentService.getPaymentStatus("pay-pending-123", "user-other"),
    ).rejects.toThrow(PaymentForbiddenError);
  });

  it("returns null when payment is not found", async () => {
    const { client } = buildClient({ payments: { data: null } });
    mockCreateClient.mockReturnValue(client);

    const result = await paymentService.getPaymentStatus("pay-missing", "user-abc");

    expect(result).toBeNull();
  });

  it("allows any caller to query an anonymous tip (user_id is null)", async () => {
    const { client } = buildClient({ payments: { data: anonTipPayment } });
    mockCreateClient.mockReturnValue(client);

    // Queried with a random userId — should NOT throw
    const result = await paymentService.getPaymentStatus("pay-tip-456", "user-stranger");

    expect(result).not.toBeNull();
    expect(result!.type).toBe("tip");
  });

  it("allows unauthenticated access to an anonymous tip", async () => {
    const { client } = buildClient({ payments: { data: anonTipPayment } });
    mockCreateClient.mockReturnValue(client);

    const result = await paymentService.getPaymentStatus("pay-tip-456", null);

    expect(result).not.toBeNull();
    expect(result!.type).toBe("tip");
  });
});

// ── Admin manual settlement / close ────────────────────────────────────────────

/**
 * Wire persistent payments + payment_events chains so a single test can assert
 * on insert/update across the multiple `from(table)` calls an admin method makes
 * (fetch → event insert → status update → getAdminPaymentDetail).
 */
function buildAdminClient(paymentData: unknown) {
  const paymentsChain = makeChain({ data: paymentData });
  const eventsChain = makeChain({ data: [] });
  mockCreateClient.mockReturnValue({
    from: vi.fn().mockImplementation((table: string) => {
      if (table === "payments") return paymentsChain;
      if (table === "payment_events") return eventsChain;
      return makeChain({ data: null });
    }),
  } as unknown as ReturnType<typeof createServiceRoleClient>);
  return { paymentsChain, eventsChain };
}

describe("adminMarkPaid — manual settlement", () => {
  beforeEach(() => {
    mockEntitlementService.grantLifetimePro.mockClear();
  });

  it("settles a pending Pro order: records a manual_paid event, updates status, grants Pro", async () => {
    const { paymentsChain, eventsChain } = buildAdminClient(pendingPayment);

    await paymentService.adminMarkPaid({ paymentId: pendingPayment.id, operatorId: "admin-1" });

    // event records the operator and the source
    expect(eventsChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "payment.manual_paid",
        payload: expect.objectContaining({ source: "admin_manual", operator: "admin-1" }),
      }),
    );
    // pending → paid update happened
    expect(paymentsChain.update).toHaveBeenCalled();
    // Pro granted for the order's user
    expect(mockEntitlementService.grantLifetimePro).toHaveBeenCalledWith(
      pendingPayment.user_id,
      pendingPayment.id,
    );
  });

  it("is idempotent for an already-paid order: skips the status UPDATE", async () => {
    const { paymentsChain } = buildAdminClient(paidPayment);

    await paymentService.adminMarkPaid({ paymentId: paidPayment.id, operatorId: "admin-1" });

    expect(paymentsChain.update).not.toHaveBeenCalled();
  });

  it("does not grant Pro for an anonymous tip", async () => {
    const paidTip = { ...anonTipPayment, status: "pending" };
    buildAdminClient(paidTip);

    await paymentService.adminMarkPaid({ paymentId: paidTip.id, operatorId: "admin-1" });

    expect(mockEntitlementService.grantLifetimePro).not.toHaveBeenCalled();
  });

  it("refuses to settle a refunded order", async () => {
    const { eventsChain } = buildAdminClient({ ...pendingPayment, status: "refunded" });

    await expect(
      paymentService.adminMarkPaid({ paymentId: pendingPayment.id, operatorId: "admin-1" }),
    ).rejects.toThrow(PaymentStateError);

    expect(eventsChain.insert).not.toHaveBeenCalled();
  });

  it("throws PaymentNotFoundError when the order does not exist", async () => {
    buildAdminClient(null);

    await expect(
      paymentService.adminMarkPaid({ paymentId: "missing", operatorId: "admin-1" }),
    ).rejects.toThrow(PaymentNotFoundError);
  });
});

describe("adminCloseOrder — close abnormal order", () => {
  it("closes a pending order: records a manual_closed event and updates status", async () => {
    const { paymentsChain, eventsChain } = buildAdminClient(pendingPayment);

    await paymentService.adminCloseOrder({ paymentId: pendingPayment.id, operatorId: "admin-1" });

    expect(eventsChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "payment.manual_closed",
        payload: expect.objectContaining({ source: "admin_manual", operator: "admin-1" }),
      }),
    );
    expect(paymentsChain.update).toHaveBeenCalled();
  });

  it("refuses to close a paid order (refund flow required)", async () => {
    const { eventsChain, paymentsChain } = buildAdminClient(paidPayment);

    await expect(
      paymentService.adminCloseOrder({ paymentId: paidPayment.id, operatorId: "admin-1" }),
    ).rejects.toThrow(PaymentStateError);

    expect(eventsChain.insert).not.toHaveBeenCalled();
    expect(paymentsChain.update).not.toHaveBeenCalled();
  });

  it("is a no-op for an already-closed order: records no new event", async () => {
    const { eventsChain, paymentsChain } = buildAdminClient({ ...pendingPayment, status: "closed" });

    await paymentService.adminCloseOrder({ paymentId: pendingPayment.id, operatorId: "admin-1" });

    expect(eventsChain.insert).not.toHaveBeenCalled();
    expect(paymentsChain.update).not.toHaveBeenCalled();
  });

  it("throws PaymentNotFoundError when the order does not exist", async () => {
    buildAdminClient(null);

    await expect(
      paymentService.adminCloseOrder({ paymentId: "missing", operatorId: "admin-1" }),
    ).rejects.toThrow(PaymentNotFoundError);
  });
});
