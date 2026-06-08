import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { paymentService } from "@/services/paymentService";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const admin = createServiceRoleClient();
  const { data, error } = await (admin.from("user_roles") as any)
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error) return false;
  return data?.role === "admin";
}

export async function GET(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return errorResponse("admin_required", "Admin permission is required.", 403);
    }

    const url = new URL(request.url);
    const limitParam = Number(url.searchParams.get("limit") ?? 100);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(Math.round(limitParam), 1), 200) : 100;
    const payments = await paymentService.listAdminPayments(limit);

    const summary = payments.reduce(
      (acc, payment) => {
        acc.total += 1;
        acc.amountCents += payment.status === "paid" ? payment.amountCents : 0;
        acc.status[payment.status] = (acc.status[payment.status] ?? 0) + 1;
        acc.type[payment.type] = (acc.type[payment.type] ?? 0) + 1;
        return acc;
      },
      {
        total: 0,
        amountCents: 0,
        status: {} as Record<string, number>,
        type: {} as Record<string, number>,
      }
    );

    return NextResponse.json({ payments, summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected admin payment list error.";
    return errorResponse("admin_payment_list_failed", message, 500);
  }
}
