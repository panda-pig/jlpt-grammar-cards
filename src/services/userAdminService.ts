import { createServiceRoleClient } from "@/lib/supabase-admin";

export interface AdminUserRow {
  userId: string;
  email: string | null;
  displayName: string | null;
  createdAt: string | null;
  isPro: boolean;
  proSince: string | null;
}

export interface AdminUsersResult {
  users: AdminUserRow[];
  summary: { total: number; pro: number };
}

export interface AdminRoleRow {
  userId: string;
  email: string | null;
}

export const userAdminService = {
  /**
   * Read-only roster for the owner: profiles joined with their Pro entitlement.
   * Service-role only; never exposed to normal clients.
   */
  async listUsers(limit = 200): Promise<AdminUsersResult> {
    const supabase = createServiceRoleClient();

    const { data: profiles, error } = await (supabase.from("profiles") as any)
      .select("id, email, display_name, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;

    const { data: entitlements, error: entError } = await (supabase.from("user_entitlements") as any)
      .select("user_id, plan, lifetime, starts_at, expires_at")
      .eq("plan", "pro");
    if (entError) throw entError;

    const now = Date.now();
    const proByUser = new Map<string, { startsAt: string | null }>();
    for (const e of entitlements ?? []) {
      const active = e.lifetime || (e.expires_at && new Date(e.expires_at).getTime() > now);
      if (active) proByUser.set(e.user_id, { startsAt: e.starts_at ?? null });
    }

    const users: AdminUserRow[] = (profiles ?? []).map((p: any) => {
      const pro = proByUser.get(p.id);
      return {
        userId: p.id,
        email: p.email ?? null,
        displayName: p.display_name ?? null,
        createdAt: p.created_at ?? null,
        isPro: Boolean(pro),
        proSince: pro?.startsAt ?? null,
      };
    });

    return {
      users,
      summary: { total: users.length, pro: users.filter((u) => u.isPro).length },
    };
  },

  async listAdmins(): Promise<AdminRoleRow[]> {
    const supabase = createServiceRoleClient();

    const { data: roles, error } = await (supabase.from("user_roles") as any)
      .select("user_id")
      .eq("role", "admin");
    if (error) throw error;

    const ids: string[] = (roles ?? []).map((r: any) => r.user_id);
    if (!ids.length) return [];

    const { data: profiles, error: profileError } = await (supabase.from("profiles") as any)
      .select("id, email")
      .in("id", ids);
    if (profileError) throw profileError;

    const emailById = new Map<string, string | null>(
      (profiles ?? []).map((p: any) => [p.id, p.email ?? null])
    );
    return ids.map((id) => ({ userId: id, email: emailById.get(id) ?? null }));
  },

  async grantAdminByEmail(email: string): Promise<AdminRoleRow | null> {
    const supabase = createServiceRoleClient();

    const { data: profile, error } = await (supabase.from("profiles") as any)
      .select("id, email")
      .eq("email", email)
      .maybeSingle();
    if (error) throw error;
    if (!profile) return null;

    const { error: upsertError } = await (supabase.from("user_roles") as any)
      .upsert({ user_id: profile.id, role: "admin" }, { onConflict: "user_id" });
    if (upsertError) throw upsertError;

    return { userId: profile.id, email: profile.email ?? email };
  },

  async revokeAdmin(userId: string): Promise<void> {
    const supabase = createServiceRoleClient();
    const { error } = await (supabase.from("user_roles") as any).delete().eq("user_id", userId);
    if (error) throw error;
  },
};
