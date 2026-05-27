import { NextResponse } from "next/server";
import { PaymentProviderUnavailableError, wechatPayClient } from "@/services/wechatPayClient";

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  try {
    await wechatPayClient.verifyNotify(request);
    return NextResponse.json({ code: "SUCCESS", message: "成功" });
  } catch (error) {
    if (error instanceof PaymentProviderUnavailableError) {
      return errorResponse(error.code, error.message, 501);
    }

    const message = error instanceof Error ? error.message : "Unexpected WeChat notify error.";
    return errorResponse("wechat_notify_failed", message, 500);
  }
}
