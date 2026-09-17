import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { userAdminService } from "@/services/userAdminService";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET() {
  try {
    if (!(await getAdminUser())) {
      return errorResponse("admin_required", "Admin permission is required.", 403);
    }

    return NextResponse.json({ admins: await userAdminService.listAdmins() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected admin role list error.";
    return errorResponse("admin_role_list_failed", message, 500);
  }
}

export async function POST(request: Request) {
  try {
    if (!(await getAdminUser())) {
      return errorResponse("admin_required", "Admin permission is required.", 403);
    }

    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email) {
      return errorResponse("invalid_email", "An email address is required.", 400);
    }

    const admin = await userAdminService.grantAdminByEmail(email);
    if (!admin) {
      return errorResponse("user_not_found", "No account with that email has signed in yet.", 404);
    }

    return NextResponse.json({ admin });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected admin role grant error.";
    return errorResponse("admin_role_grant_failed", message, 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const caller = await getAdminUser();
    if (!caller) {
      return errorResponse("admin_required", "Admin permission is required.", 403);
    }

    const userId = new URL(request.url).searchParams.get("userId")?.trim();
    if (!userId) {
      return errorResponse("invalid_user_id", "A userId is required.", 400);
    }
    if (userId === caller.id) {
      return errorResponse("cannot_revoke_self", "You cannot revoke your own admin role.", 400);
    }

    await userAdminService.revokeAdmin(userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected admin role revoke error.";
    return errorResponse("admin_role_revoke_failed", message, 500);
  }
}
