import { NextResponse } from "next/server";
import { PaymentProviderUnavailableError, wechatPayClient } from "@/services/wechatPayClient";
import { paymentService } from "@/services/paymentService";
import type { Json } from "@/lib/database.types";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  try {
    const result = await wechatPayClient.verifyNotify(request);

    if (result.eventType === "TRANSACTION.SUCCESS") {
      await paymentService.markPaymentPaid({
        outTradeNo: result.outTradeNo,
        provider: "wechat",
        providerTransactionId: result.transactionId,
        payerOpenid: result.openid,
        eventId: result.notificationId,
        rawPayload: result.raw as Record<string, Json | undefined>,
      });
    }

    // WeChat requires exactly this response shape on success
    return NextResponse.json({ code: "SUCCESS", message: "成功" });
  } catch (error) {
    if (error instanceof PaymentProviderUnavailableError) {
      return errorResponse(error.code, error.message, 501);
    }
    const message = error instanceof Error ? error.message : "Unexpected WeChat notify error.";
    return errorResponse("wechat_notify_failed", message, 500);
  }
}
