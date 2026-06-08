import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { userAdminService } from "@/services/userAdminService";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET(request: Request) {
  try {
    if (!(await getAdminUser())) {
      return errorResponse("admin_required", "Admin permission is required.", 403);
    }

    const url = new URL(request.url);
    const limitParam = Number(url.searchParams.get("limit") ?? 200);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(Math.round(limitParam), 1), 500) : 200;

    const result = await userAdminService.listUsers(limit);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected admin user list error.";
    return errorResponse("admin_user_list_failed", message, 500);
  }
}
