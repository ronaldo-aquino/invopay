# Supabase Migration Guide - Subscriptions

## Overview

This migration creates the necessary tables for the subscription feature in Invopay.

## Step-by-Step Instructions

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Log in to your account
3. Select your project

### Step 2: Open SQL Editor

1. In the left sidebar, click on **"SQL Editor"** (database icon)
2. You'll see a text area where you can write SQL queries

### Step 3: Copy and Paste the SQL Code

Open the file `backend/supabase/supabase-migration-subscriptions.sql` and copy its entire contents, then paste into the SQL Editor.

Alternatively, you can copy the SQL directly from below:

```sql
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
```

### Step 4: Run the SQL

1. Paste the SQL code into the SQL Editor text area
2. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
3. You should see a success message

### Step 5: Verify It Worked (Optional)

To verify the tables were created, run this query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'subscription_payments', 'subscription_cancellations');
```

You should see three rows showing:
- `subscriptions`
- `subscription_payments`
- `subscription_cancellations`

## What This Creates

### Tables

1. **subscriptions**: Main table storing subscription information
   - `subscription_id_bytes32`: The bytes32 ID from the smart contract (generated by contract)
   - `payer_wallet_address`: The wallet address of the payer (who will pay)
   - `paused_at`: Timestamp when subscription was paused (for time compensation)
   - `status`: Can be 'active', 'cancelled_by_creator', 'cancelled_by_payer', or 'paused'

2. **subscription_payments**: Tracks each payment made for a subscription
   - Links to subscription via `subscription_id`
   - Tracks `renewal_fee` (0.05% fee per payment)
   - Stores `gas_cost` for each payment

3. **subscription_cancellations**: Tracks cancellation events
   - Records who cancelled (creator or payer)
   - Tracks notification status for cancellations

## Important Notes

- The `subscription_id_bytes32` is now generated by the smart contract (not provided externally)
- The `payer_wallet_address` field is required and identifies who will pay the subscription
- The `paused_at` field is used to compensate for paused time when resuming
- All tables have Row Level Security enabled with appropriate policies
- The `update_updated_at_column()` function must already exist (from invoices migration)

## Next Steps

After running this migration, your backend services will be able to:
- Create subscriptions in the database
- Track subscription payments
- Handle subscription cancellations
- Query subscriptions by creator, payer, or receiver





