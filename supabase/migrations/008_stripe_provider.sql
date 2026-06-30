-- Add Stripe as a payment provider (Checkout-based) alongside WeChat.
-- Stripe Checkout handles WeChat Pay / Alipay / card via a hosted redirect,
-- so we store the redirect URL instead of a Native QR code.

-- 1) Allow provider = 'stripe' and channel = 'checkout'.
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_provider_check;
ALTER TABLE payments
  ADD CONSTRAINT payments_provider_check
  CHECK (provider IN ('wechat', 'alipay', 'stripe'));

ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_channel_check;
ALTER TABLE payments
  ADD CONSTRAINT payments_channel_check
  CHECK (channel IN ('native', 'h5', 'jsapi', 'mini_program', 'checkout'));

-- 2) Hosted checkout redirect URL (null for QR-based providers).
ALTER TABLE payments ADD COLUMN IF NOT EXISTS checkout_url TEXT;
