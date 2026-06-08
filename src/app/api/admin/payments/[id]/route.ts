import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import {
  PaymentNotFoundError,
  PaymentStateError,
  paymentService,
} from "@/services/paymentService";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function handleError(error: unknown) {
  if (error instanceof PaymentNotFoundError) {
    return errorResponse(error.code, error.message, 404);
  }
  if (error instanceof PaymentStateError) {
    return errorResponse(error.code, error.message, 409);
  }
  const message = error instanceof Error ? error.message : "Unexpected admin payment error.";
  return errorResponse("admin_payment_failed", message, 500);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await getAdminUser())) {
      return errorResponse("admin_required", "Admin permission is required.", 403);
    }
    const { id } = await params;
    const detail = await paymentService.getAdminPaymentDetail(id);
    return NextResponse.json(detail);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return errorResponse("admin_required", "Admin permission is required.", 403);
    }
    const { id } = await params;

    let body: { action?: string } = {};
    try {
      body = await request.json();
    } catch {
      return errorResponse("invalid_body", "Request body must be valid JSON.", 400);
    }

    if (body.action === "mark_paid") {
      const detail = await paymentService.adminMarkPaid({ paymentId: id, operatorId: admin.id });
      return NextResponse.json(detail);
    }
    if (body.action === "close") {
      const detail = await paymentService.adminCloseOrder({ paymentId: id, operatorId: admin.id });
      return NextResponse.json(detail);
    }

    return errorResponse("unsupported_action", "Supported actions are 'mark_paid' and 'close'.", 400);
  } catch (error) {
    return handleError(error);
  }
}
