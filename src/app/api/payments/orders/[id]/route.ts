import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { PaymentForbiddenError, paymentService } from "@/services/paymentService";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    // TODO: For anonymous tip orders (user_id IS NULL), any caller with the UUID can
    // query status — this is intentional because the UUID acts as a secret token.
    // Document this assumption if the access model ever changes.
    const payment = await paymentService.getPaymentStatus(id, user?.id ?? null);

    if (!payment) {
      return errorResponse("payment_not_found", "Payment order was not found.", 404);
    }

    return NextResponse.json(payment);
  } catch (error) {
    if (error instanceof PaymentForbiddenError) {
      return errorResponse(error.code, error.message, 403);
    }

    const message = error instanceof Error ? error.message : "Unexpected payment lookup error.";
    return errorResponse("payment_order_lookup_failed", message, 500);
  }
}
