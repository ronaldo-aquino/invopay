# Migration Guide - Subscriptions Tables

## Quick Migration Steps

### 1. Acesse o Supabase Dashboard
- URL: https://supabase.com/dashboard/project/xlkwhnncrhijzitzcsfq
- Ou: https://supabase.com/dashboard → Selecione o projeto

### 2. Abra o SQL Editor
- No menu lateral esquerdo, clique em **"SQL Editor"**

### 3. Execute a Migration
- Clique em **"New Query"** ou use o editor existente
- Cole todo o SQL abaixo
- Clique em **"Run"** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)

### 4. Verifique se funcionou
Execute no terminal:
```bash
npm run migrate:subscriptions:check
```

---

## SQL Migration

Copie e cole o SQL completo abaixo no SQL Editor:

```sql
-- Function to update updated_at timestamp (create if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id_bytes32 TEXT NOT NULL UNIQUE,
  creator_wallet_address TEXT NOT NULL,
  payer_wallet_address TEXT NOT NULL,
  receiver_wallet_address TEXT NOT NULL,
  amount NUMERIC(18, 6) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('USDC', 'EURC')),
  period_seconds BIGINT NOT NULL,
  next_payment_due TIMESTAMP WITH TIME ZONE NOT NULL,
  paused_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled_by_creator', 'cancelled_by_payer', 'paused')),
  description TEXT,
  total_payments INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator ON subscriptions(creator_wallet_address);
CREATE INDEX IF NOT EXISTS idx_subscriptions_payer ON subscriptions(payer_wallet_address);
CREATE INDEX IF NOT EXISTS idx_subscriptions_receiver ON subscriptions(receiver_wallet_address);
CREATE INDEX IF NOT EXISTS idx_subscriptions_bytes32 ON subscriptions(subscription_id_bytes32);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_payment ON subscriptions(next_payment_due);

-- Create subscription_payments table
CREATE TABLE IF NOT EXISTS subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  payer_wallet_address TEXT NOT NULL,
  amount NUMERIC(18, 6) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('USDC', 'EURC')),
  transaction_hash TEXT,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  renewal_fee NUMERIC(18, 6) NOT NULL DEFAULT 0,
  gas_cost NUMERIC(18, 6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for subscription_payments
CREATE INDEX IF NOT EXISTS idx_subscription_payments_subscription ON subscription_payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_payer ON subscription_payments(payer_wallet_address);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_date ON subscription_payments(payment_date);

-- Create subscription_cancellations table
CREATE TABLE IF NOT EXISTS subscription_cancellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  cancelled_by TEXT NOT NULL CHECK (cancelled_by IN ('creator', 'payer')),
  cancelled_by_wallet_address TEXT NOT NULL,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  notified_at TIMESTAMP WITH TIME ZONE,
  notification_sent BOOLEAN NOT NULL DEFAULT false
);

-- Create indexes for subscription_cancellations
CREATE INDEX IF NOT EXISTS idx_subscription_cancellations_subscription ON subscription_cancellations(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_cancellations_notified ON subscription_cancellations(notification_sent);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_cancellations ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions table
CREATE POLICY "Anyone can view subscriptions"
  ON subscriptions
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create subscriptions"
  ON subscriptions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update subscriptions"
  ON subscriptions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policies for subscription_payments table
CREATE POLICY "Anyone can view subscription payments"
  ON subscription_payments
  FOR SELECT
  USING (true);

CREATE POLICY "System can create subscription payments"
  ON subscription_payments
  FOR INSERT
  WITH CHECK (true);

-- Policies for subscription_cancellations table
CREATE POLICY "Anyone can view subscription cancellations"
  ON subscription_cancellations
  FOR SELECT
  USING (true);

CREATE POLICY "System can create subscription cancellations"
  ON subscription_cancellations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update subscription cancellations"
  ON subscription_cancellations
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Trigger to automatically update updated_at for subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE subscriptions IS 'Stores subscription information from smart contract';
COMMENT ON COLUMN subscriptions.subscription_id_bytes32 IS 'The bytes32 subscription ID from the smart contract';
COMMENT ON COLUMN subscriptions.payer_wallet_address IS 'The wallet address of the payer (who will pay the subscription)';
COMMENT ON COLUMN subscriptions.period_seconds IS 'Subscription period in seconds';
COMMENT ON COLUMN subscriptions.next_payment_due IS 'Next payment due date and time';
COMMENT ON COLUMN subscriptions.paused_at IS 'Timestamp when subscription was paused (for time compensation on resume)';
COMMENT ON COLUMN subscriptions.total_payments IS 'Total number of payments made for this subscription';
```

---

## Alternative: View SQL via Command

Para ver o SQL no terminal:
```bash
npm run migrate:subscriptions:show
```

---

## Project Reference
- **Project Ref:** `xlkwhnncrhijzitzcsfq`
- **Direct Link:** https://supabase.com/dashboard/project/xlkwhnncrhijzitzcsfq

