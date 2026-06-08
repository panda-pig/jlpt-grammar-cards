import { randomBytes } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase-admin";
import { entitlementService, type EntitlementState } from "@/services/entitlementService";
import { wechatPayClient } from "@/services/wechatPayClient";
import type { Json } from "@/lib/database.types";

export type PaymentType = "tip" | "pro_lifetime";
export type PaymentProvider = "wechat" | "alipay";
export type PaymentChannel = "native" | "h5" | "jsapi" | "mini_program";
export type PaymentStatus = "pending" | "paid" | "failed" | "closed" | "refunded";

export interface CreatePaymentOrderInput {
  type: PaymentType;
  provider: PaymentProvider;
  channel: PaymentChannel;
  userId?: string | null;
  amountCents?: number;
  nickname?: string | null;
  message?: string | null;
  metadata?: Record<string, Json | undefined>;
}

export interface PaymentOrderView {
  paymentId: string;
  userId?: string | null;
  type: PaymentType;
  provider: PaymentProvider;
  channel: PaymentChannel;
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  outTradeNo: string;
  qrCodeUrl: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string | null;
  nickname?: string | null;
  message?: string | null;
  entitlement?: EntitlementState;
}

export class PaymentValidationError extends Error {
  code = "payment_validation_error" as const;
}

export class PaymentUnauthorizedError extends Error {
  code = "payment_unauthorized" as const;
}

export class PaymentForbiddenError extends Error {
  code = "payment_forbidden" as const;
}

export class PaymentIntegrityError extends Error {
  code = "payment_integrity_error" as const;
}

const TIP_MIN_AMOUNT_CENTS = 100;
const TIP_MAX_AMOUNT_CENTS = 500000;
const DEFAULT_ORDER_EXPIRE_MINUTES = 30;

function proLifetimePriceCents() {
  const value = Number(process.env.PRO_LIFETIME_PRICE_CENTS ?? 590);
  return Number.isFinite(value) && value > 0 ? Math.round(value) : 590;
}

function orderExpireMinutes() {
  const value = Number(process.env.PAYMENT_ORDER_EXPIRE_MINUTES ?? DEFAULT_ORDER_EXPIRE_MINUTES);
  return Number.isFinite(value) && value > 0 ? Math.round(value) : DEFAULT_ORDER_EXPIRE_MINUTES;
}

function generateOutTradeNo() {
  const random = randomBytes(3).toString("hex").toUpperCase();
  return `JLPT${Date.now()}${random}`;
}

function expiresAt() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + orderExpireMinutes());
  return date.toISOString();
}

function normalizeOptionalText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function assertSupportedProvider(provider: PaymentProvider, channel: PaymentChannel) {
  if (provider !== "wechat") {
    throw new PaymentValidationError("Only WeChat Pay is planned for the first payment phase.");
  }
  if (channel !== "native") {
    throw new PaymentValidationError("Only WeChat Native scan payment is planned for the first web phase.");
  }
}

function resolveAmount(input: CreatePaymentOrderInput) {
  if (input.type === "pro_lifetime") return proLifetimePriceCents();

  const amount = Math.round(Number(input.amountCents));
  if (!Number.isFinite(amount)) {
    throw new PaymentValidationError("Tip amount is required.");
  }
  if (amount < TIP_MIN_AMOUNT_CENTS || amount > TIP_MAX_AMOUNT_CENTS) {
    throw new PaymentValidationError("Tip amount is outside the allowed range.");
  }
  return amount;
}

function assertCreateInput(input: CreatePaymentOrderInput) {
  if (input.type !== "tip" && input.type !== "pro_lifetime") {
    throw new PaymentValidationError("Unsupported payment type.");
  }
  if (input.provider !== "wechat" && input.provider !== "alipay") {
    throw new PaymentValidationError("Unsupported payment provider.");
  }
  if (!["native", "h5", "jsapi", "mini_program"].includes(input.channel)) {
    throw new PaymentValidationError("Unsupported payment channel.");
  }
  if (input.type === "pro_lifetime" && !input.userId) {
    throw new PaymentUnauthorizedError("Log in before purchasing Pro.");
  }
  assertSupportedProvider(input.provider, input.channel);
}

function descriptionFor(type: PaymentType) {
  return type === "pro_lifetime"
    ? "JLPT Grammar Deck Pro 永久版"
    : "支持 JLPT Grammar Deck 作者";
}

function toPaymentOrderView(row: any, entitlement?: EntitlementState): PaymentOrderView {
  return {
    paymentId: row.id,
    userId: row.user_id ?? null,
    type: row.type,
    provider: row.provider,
    channel: row.channel,
    amountCents: row.amount_cents,
    currency: row.currency,
    status: row.status,
    outTradeNo: row.out_trade_no,
    qrCodeUrl: row.qr_code_url ?? null,
    paidAt: row.paid_at ?? null,
    expiresAt: row.expires_at ?? null,
    createdAt: row.created_at ?? null,
    nickname: row.nickname ?? null,
    message: row.message ?? null,
    entitlement,
  };
}

function isExpiredPending(row: any) {
  return row?.status === "pending" && row.expires_at && new Date(row.expires_at).getTime() < Date.now();
}

export const paymentService = {
  getProLifetimePriceCents: proLifetimePriceCents,

  async createPaymentOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderView> {
    assertCreateInput(input);

    const amountCents = resolveAmount(input);
    const outTradeNo = generateOutTradeNo();
    const expires = expiresAt();
    const notifyUrl = process.env.WECHAT_PAY_NOTIFY_URL ?? "";

    const providerOrder = await wechatPayClient.createNativeOrder({
      outTradeNo,
      amountCents,
      description: descriptionFor(input.type),
      notifyUrl,
    });

    const supabase = createServiceRoleClient();
    const { data, error } = await (supabase.from("payments") as any)
      .insert({
        user_id: input.userId ?? null,
        type: input.type,
        provider: input.provider,
        channel: input.channel,
        amount_cents: amountCents,
        currency: "CNY",
        status: "pending",
        out_trade_no: outTradeNo,
        provider_prepay_id: providerOrder.providerPrepayId ?? null,
        qr_code_url: providerOrder.qrCodeUrl,
        nickname: normalizeOptionalText(input.nickname, 40),
        message: normalizeOptionalText(input.message, 200),
        metadata: input.metadata ?? {},
        expires_at: expires,
      })
      .select("*")
      .single();

    if (error) throw error;
    return toPaymentOrderView(data);
  },

  async getPaymentStatus(paymentId: string, viewerUserId?: string | null): Promise<PaymentOrderView | null> {
    const supabase = createServiceRoleClient();
    const { data, error } = await (supabase.from("payments") as any)
      .select("*")
      .eq("id", paymentId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    if (data.user_id && data.user_id !== viewerUserId) {
      throw new PaymentForbiddenError("This payment belongs to another user.");
    }

    let row = data;
    if (isExpiredPending(data)) {
      const { data: closed, error: closeError } = await (supabase.from("payments") as any)
        .update({ status: "closed" })
        .eq("id", data.id)
        .eq("status", "pending")
        .select("*")
        .single();
      if (closeError) throw closeError;
      row = closed;
    }

    const entitlement = row.user_id ? await entitlementService.getCurrentPlan(row.user_id) : undefined;
    return toPaymentOrderView(row, entitlement);
  },

  async listUserPayments(userId: string, limit = 20): Promise<PaymentOrderView[]> {
    const supabase = createServiceRoleClient();
    const { data, error } = await (supabase.from("payments") as any)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const rows = [];
    for (const row of data ?? []) {
      if (!isExpiredPending(row)) {
        rows.push(row);
        continue;
      }
      const { data: closed, error: closeError } = await (supabase.from("payments") as any)
        .update({ status: "closed" })
        .eq("id", row.id)
        .eq("status", "pending")
        .select("*")
        .single();
      if (closeError) throw closeError;
      rows.push(closed);
    }

    return rows.map((row) => toPaymentOrderView(row));
  },

  async listAdminPayments(limit = 100): Promise<PaymentOrderView[]> {
    const supabase = createServiceRoleClient();
    const { data, error } = await (supabase.from("payments") as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map((row: any) => toPaymentOrderView(row));
  },

  async markPaymentPaid(input: {
    outTradeNo: string;
    provider: PaymentProvider;
    providerTransactionId?: string | null;
    amountCents?: number | null;
    payerOpenid?: string | null;
    eventId?: string | null;
    rawPayload?: Record<string, Json | undefined>;
  }): Promise<PaymentOrderView> {
    const supabase = createServiceRoleClient();
    const { data: payment, error: findError } = await (supabase.from("payments") as any)
      .select("*")
      .eq("out_trade_no", input.outTradeNo)
      .single();

    if (findError) throw findError;
    if (payment.provider !== input.provider) {
      throw new PaymentIntegrityError("Payment provider does not match the original order.");
    }
    if (typeof input.amountCents === "number" && payment.amount_cents !== input.amountCents) {
      throw new PaymentIntegrityError("Paid amount does not match the original order.");
    }

    await (supabase.from("payment_events") as any).insert({
      payment_id: payment.id,
      provider: input.provider,
      event_type: "payment.paid",
      event_id: input.eventId ?? null,
      payload: input.rawPayload ?? {},
    });

    let updated = payment;
    if (payment.status !== "paid") {
      const { data, error } = await (supabase.from("payments") as any)
        .update({
          status: "paid",
          provider_transaction_id: input.providerTransactionId ?? payment.provider_transaction_id,
          payer_openid: input.payerOpenid ?? payment.payer_openid,
          paid_at: new Date().toISOString(),
        })
        .eq("id", payment.id)
        .select("*")
        .single();

      if (error) throw error;
      updated = data;
    }

    let entitlement: EntitlementState | undefined;
    if (updated.type === "pro_lifetime" && updated.user_id) {
      entitlement = await entitlementService.grantLifetimePro(updated.user_id, updated.id);
    }

    return toPaymentOrderView(updated, entitlement);
  },
};
