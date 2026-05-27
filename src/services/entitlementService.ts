import { createServiceRoleClient } from "@/lib/supabase-admin";

export type UserPlan = "free" | "pro";

export interface EntitlementState {
  plan: UserPlan;
  isPro: boolean;
  lifetime: boolean;
  expiresAt: string | null;
  sourcePaymentId: string | null;
}

const FREE_ENTITLEMENT: EntitlementState = {
  plan: "free",
  isPro: false,
  lifetime: false,
  expiresAt: null,
  sourcePaymentId: null,
};

function isActivePro(row: any, now = new Date()) {
  if (!row) return false;
  if (row.plan !== "pro") return false;
  if (row.lifetime) return true;
  if (!row.expires_at) return false;
  return new Date(row.expires_at).getTime() > now.getTime();
}

function toEntitlementState(row: any | null): EntitlementState {
  if (!isActivePro(row)) return FREE_ENTITLEMENT;

  return {
    plan: "pro",
    isPro: true,
    lifetime: Boolean(row.lifetime),
    expiresAt: row.expires_at ?? null,
    sourcePaymentId: row.source_payment_id ?? null,
  };
}

export const entitlementService = {
  async getCurrentPlan(userId: string): Promise<EntitlementState> {
    const supabase = createServiceRoleClient();
    const { data, error } = await (supabase.from("user_entitlements") as any)
      .select("*")
      .eq("user_id", userId)
      .eq("plan", "pro")
      .maybeSingle();

    if (error) throw error;
    return toEntitlementState(data);
  },

  async isPro(userId: string): Promise<boolean> {
    return (await this.getCurrentPlan(userId)).isPro;
  },

  async grantLifetimePro(userId: string, paymentId: string): Promise<EntitlementState> {
    const supabase = createServiceRoleClient();
    const { data, error } = await (supabase.from("user_entitlements") as any)
      .upsert(
        {
          user_id: userId,
          plan: "pro",
          source_payment_id: paymentId,
          lifetime: true,
          starts_at: new Date().toISOString(),
          expires_at: null,
        },
        { onConflict: "user_id,plan" }
      )
      .select("*")
      .single();

    if (error) throw error;
    return toEntitlementState(data);
  },

  freeState(): EntitlementState {
    return FREE_ENTITLEMENT;
  },
};
