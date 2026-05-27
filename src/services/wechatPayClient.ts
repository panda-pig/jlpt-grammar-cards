export class PaymentProviderUnavailableError extends Error {
  code = "payment_provider_unavailable" as const;

  constructor(message = "WeChat Pay is not configured yet.") {
    super(message);
    this.name = "PaymentProviderUnavailableError";
  }
}

export interface WeChatNativeOrderInput {
  outTradeNo: string;
  amountCents: number;
  description: string;
  notifyUrl: string;
}

export interface WeChatNativeOrderResult {
  providerPrepayId?: string | null;
  qrCodeUrl: string;
  raw: Record<string, unknown>;
}

function requiredEnv(name: string) {
  return process.env[name]?.trim();
}

export const wechatPayClient = {
  isConfigured() {
    return Boolean(
      requiredEnv("WECHAT_PAY_MCH_ID") &&
      requiredEnv("WECHAT_PAY_APP_ID") &&
      requiredEnv("WECHAT_PAY_API_V3_KEY") &&
      requiredEnv("WECHAT_PAY_MERCHANT_SERIAL_NO") &&
      requiredEnv("WECHAT_PAY_PRIVATE_KEY") &&
      requiredEnv("WECHAT_PAY_NOTIFY_URL")
    );
  },

  async createNativeOrder(input: WeChatNativeOrderInput): Promise<WeChatNativeOrderResult> {
    void input;

    if (!this.isConfigured()) {
      throw new PaymentProviderUnavailableError(
        "WeChat Pay environment variables are not configured."
      );
    }

    throw new PaymentProviderUnavailableError(
      "WeChat Native payment signing is reserved for the next implementation phase."
    );
  },

  async verifyNotify(request: Request) {
    void request;

    throw new PaymentProviderUnavailableError(
      "WeChat Pay notify verification is reserved for the next implementation phase."
    );
  },
};
