import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { entitlementService } from "@/services/entitlementService";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        ...entitlementService.freeState(),
      });
    }

    const entitlement = await entitlementService.getCurrentPlan(user.id);
    return NextResponse.json({
      authenticated: true,
      ...entitlement,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected entitlement lookup error.";
    return errorResponse("entitlement_lookup_failed", message, 500);
  }
}
