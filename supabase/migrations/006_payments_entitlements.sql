-- Payment orders, provider events, and Pro entitlement support.
-- All writes are performed by trusted server routes using the service role.

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('tip', 'pro_lifetime')),
  provider TEXT NOT NULL CHECK (provider IN ('wechat', 'alipay')),
  channel TEXT NOT NULL CHECK (channel IN ('native', 'h5', 'jsapi', 'mini_program')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'CNY',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'closed', 'refunded')),
  out_trade_no TEXT NOT NULL UNIQUE,
  provider_transaction_id TEXT,
  provider_prepay_id TEXT,
  qr_code_url TEXT,
  payer_openid TEXT,
  nickname TEXT,
  message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro')),
  source_payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  lifetime BOOLEAN NOT NULL DEFAULT false,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, plan)
);

CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_created
ON payments(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_out_trade_no
ON payments(out_trade_no);

CREATE INDEX IF NOT EXISTS idx_payments_status_expires
ON payments(status, expires_at);

CREATE INDEX IF NOT EXISTS idx_entitlements_user_plan
ON user_entitlements(user_id, plan);

CREATE INDEX IF NOT EXISTS idx_payment_events_payment_created
ON payment_events(payment_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_payments_updated_at ON payments;
CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_user_entitlements_updated_at ON user_entitlements;
CREATE TRIGGER set_user_entitlements_updated_at
  BEFORE UPDATE ON user_entitlements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Payments readable by owner" ON payments;
CREATE POLICY "Payments readable by owner"
ON payments FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Entitlements readable by owner" ON user_entitlements;
CREATE POLICY "Entitlements readable by owner"
ON user_entitlements FOR SELECT
USING (auth.uid() = user_id);

-- No direct anon/authenticated insert/update policies are defined here.
-- API routes use the service role to create orders, process provider
-- callbacks, and grant entitlements after verified payment.
