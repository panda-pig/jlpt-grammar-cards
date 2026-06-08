import { createServiceRoleClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";

export interface AdminUser {
  id: string;
}

/**
 * Resolve the currently authenticated admin user, or null when the caller is
 * not logged in or does not hold the `admin` role. Returning the user id lets
 * routes record who performed a manual operation (e.g. a manual settlement).
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createServiceRoleClient();
  const { data, error } = await (admin.from("user_roles") as any)
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error || data?.role !== "admin") return null;
  return { id: user.id };
}
