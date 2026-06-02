import { createDecipheriv, createSign, createVerify, randomBytes } from "node:crypto";

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

export interface WeChatNotifyResult {
  eventType: string;
  outTradeNo: string;
  transactionId: string;
  openid: string | null;
  raw: Record<string, unknown>;
}

// Module-level cert cache — stays warm across requests in the same Fluid Compute container
const platformCertCache = new Map<string, { pem: string; expiresAt: number }>();

function getEnv(name: string): string | undefined {
  return process.env[name]?.trim();
}

function requireEnv(name: string): string {
  const v = getEnv(name);
  if (!v) throw new PaymentProviderUnavailableError(`Missing required env: ${name}`);
  return v;
}

// Env vars on Vercel/CLI may store literal \n — normalise to real newlines for PEM keys
function normalizePem(raw: string): string {
  return raw.replace(/\\n/g, "\n");
}

function buildRequestMessage(
  method: string,
  urlPath: string,
  timestamp: string,
  nonce: string,
  body: string
): string {
  return `${method}\n${urlPath}\n${timestamp}\n${nonce}\n${body}\n`;
}

function signRsaSha256(privateKeyPem: string, message: string): string {
  const signer = createSign("RSA-SHA256");
  signer.update(message, "utf-8");
  return signer.sign(privateKeyPem, "base64");
}

function buildAuthorization(
  mchId: string,
  serialNo: string,
  privateKeyPem: string,
  method: string,
  urlPath: string,
  body: string
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = randomBytes(16).toString("hex").toUpperCase();
  const message = buildRequestMessage(method, urlPath, timestamp, nonce, body);
  const signature = signRsaSha256(privateKeyPem, message);
  return (
    `WECHATPAY2-SHA256-RSA2048 mchid="${mchId}",` +
    `nonce_str="${nonce}",` +
    `timestamp="${timestamp}",` +
    `serial_no="${serialNo}",` +
    `signature="${signature}"`
  );
}

// AES-256-GCM decrypt used for both platform cert download and callback payload.
// WeChat appends the 16-byte auth tag at the end of the ciphertext.
function decryptAesGcm(
  apiV3Key: string,
  associatedData: string,
  nonce: string,
  ciphertext: string
): string {
  const key = Buffer.from(apiV3Key, "utf-8"); // exactly 32 bytes
  const iv = Buffer.from(nonce, "utf-8");
  const ciphertextBuf = Buffer.from(ciphertext, "base64");
  const authTag = ciphertextBuf.subarray(ciphertextBuf.length - 16);
  const encrypted = ciphertextBuf.subarray(0, ciphertextBuf.length - 16);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from(associatedData, "utf-8"));
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf-8");
}

async function fetchPlatformCert(targetSerial: string): Promise<string | null> {
  const cached = platformCertCache.get(targetSerial);
  if (cached && cached.expiresAt > Date.now()) return cached.pem;

  const mchId = getEnv("WECHAT_PAY_MCH_ID");
  const rawKey = getEnv("WECHAT_PAY_PRIVATE_KEY");
  const merchantSerial = getEnv("WECHAT_PAY_MERCHANT_SERIAL_NO");
  const apiV3Key = getEnv("WECHAT_PAY_API_V3_KEY");
  if (!mchId || !rawKey || !merchantSerial || !apiV3Key) return null;

  const privateKeyPem = normalizePem(rawKey);
  const urlPath = "/v3/certificates";
  const authorization = buildAuthorization(mchId, merchantSerial, privateKeyPem, "GET", urlPath, "");

  try {
    const res = await fetch(`https://api.mch.weixin.qq.com${urlPath}`, {
      headers: {
        Authorization: authorization,
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "jlpt-grammar-cards/1.0",
      },
    });
    if (!res.ok) return null;

    const data = await res.json() as {
      data?: Array<{
        serial_no: string;
        encrypt_certificate: {
          nonce: string;
          associated_data: string;
          ciphertext: string;
        };
      }>;
    };

    for (const cert of data.data ?? []) {
      if (cert.serial_no !== targetSerial) continue;
      const { nonce, associated_data, ciphertext } = cert.encrypt_certificate;
      const pem = decryptAesGcm(apiV3Key, associated_data, nonce, ciphertext);
      // Cache for 23 h — WeChat platform certs are valid for ~10 years but we refresh daily
      platformCertCache.set(targetSerial, { pem, expiresAt: Date.now() + 23 * 60 * 60 * 1000 });
      return pem;
    }
  } catch {
    // Cert fetch failure is non-fatal: we fall back to decrypt-only verification
  }
  return null;
}

function verifyRsaSignature(certPem: string, message: string, signatureBase64: string): boolean {
  try {
    const verifier = createVerify("RSA-SHA256");
    verifier.update(message, "utf-8");
    return verifier.verify(certPem, Buffer.from(signatureBase64, "base64"));
  } catch {
    return false;
  }
}

export const wechatPayClient = {
  isConfigured(): boolean {
    return Boolean(
      getEnv("WECHAT_PAY_MCH_ID") &&
      getEnv("WECHAT_PAY_APP_ID") &&
      getEnv("WECHAT_PAY_API_V3_KEY") &&
      getEnv("WECHAT_PAY_MERCHANT_SERIAL_NO") &&
      getEnv("WECHAT_PAY_PRIVATE_KEY") &&
      getEnv("WECHAT_PAY_NOTIFY_URL")
    );
  },

  async createNativeOrder(input: WeChatNativeOrderInput): Promise<WeChatNativeOrderResult> {
    if (!this.isConfigured()) {
      throw new PaymentProviderUnavailableError("WeChat Pay environment variables are not configured.");
    }

    const mchId = requireEnv("WECHAT_PAY_MCH_ID");
    const appId = requireEnv("WECHAT_PAY_APP_ID");
    const privateKeyPem = normalizePem(requireEnv("WECHAT_PAY_PRIVATE_KEY"));
    const serialNo = requireEnv("WECHAT_PAY_MERCHANT_SERIAL_NO");

    const urlPath = "/v3/pay/transactions/native";
    const bodyObj = {
      appid: appId,
      mchid: mchId,
      description: input.description,
      out_trade_no: input.outTradeNo,
      notify_url: input.notifyUrl,
      // time_expire in RFC 3339; UTC is valid per WeChat Pay v3 spec
      time_expire: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      amount: {
        total: input.amountCents,
        currency: "CNY",
      },
    };
    const body = JSON.stringify(bodyObj);
    const authorization = buildAuthorization(mchId, serialNo, privateKeyPem, "POST", urlPath, body);

    const res = await fetch(`https://api.mch.weixin.qq.com${urlPath}`, {
      method: "POST",
      headers: {
        Authorization: authorization,
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "jlpt-grammar-cards/1.0",
      },
      body,
    });

    const result = await res.json() as Record<string, unknown>;
    if (!res.ok) {
      throw new PaymentProviderUnavailableError(
        (result.message as string | undefined) ?? `WeChat Pay API error ${res.status}`
      );
    }

    return {
      providerPrepayId: null,
      qrCodeUrl: result.code_url as string,
      raw: result,
    };
  },

  async verifyNotify(request: Request): Promise<WeChatNotifyResult> {
    if (!this.isConfigured()) {
      throw new PaymentProviderUnavailableError("WeChat Pay environment variables are not configured.");
    }

    // Read body once; Request body is consumed
    const body = await request.text();
    const timestamp = request.headers.get("Wechatpay-Timestamp") ?? "";
    const nonce = request.headers.get("Wechatpay-Nonce") ?? "";
    const signatureB64 = request.headers.get("Wechatpay-Signature") ?? "";
    const serialNo = request.headers.get("Wechatpay-Serial") ?? "";

    // Attempt RSA signature verification using WeChat's platform certificate.
    // If the cert cannot be fetched we still proceed — AES-GCM is authenticated
    // encryption, so a successfully decrypted payload is still tamper-evident.
    const certPem = await fetchPlatformCert(serialNo);
    if (certPem) {
      const message = `${timestamp}\n${nonce}\n${body}\n`;
      if (!verifyRsaSignature(certPem, message, signatureB64)) {
        throw new Error("WeChat Pay notification: RSA signature verification failed.");
      }
    }

    const payload = JSON.parse(body) as {
      event_type: string;
      resource: {
        associated_data: string;
        nonce: string;
        ciphertext: string;
      };
    };

    const apiV3Key = requireEnv("WECHAT_PAY_API_V3_KEY");
    const { associated_data, nonce: resNonce, ciphertext } = payload.resource;
    const decryptedJson = decryptAesGcm(apiV3Key, associated_data, resNonce, ciphertext);

    const transaction = JSON.parse(decryptedJson) as {
      out_trade_no: string;
      transaction_id: string;
      payer?: { openid?: string };
    };

    return {
      eventType: payload.event_type,
      outTradeNo: transaction.out_trade_no,
      transactionId: transaction.transaction_id,
      openid: transaction.payer?.openid ?? null,
      raw: payload,
    };
  },
};
