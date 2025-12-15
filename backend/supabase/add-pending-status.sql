-- Migration: Add 'pending' status to subscriptions
-- This allows subscriptions to start as pending and become active after first payment

-- Update the check constraint to include 'pending'
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_status_check;

ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_status_check 
CHECK (status IN ('pending', 'active', 'cancelled_by_creator', 'cancelled_by_payer', 'paused'));

-- Change default status to 'pending'
ALTER TABLE subscriptions
ALTER COLUMN status SET DEFAULT 'pending';

-- Update existing subscriptions that have 0 payments and zero address payer to 'pending'
UPDATE subscriptions
SET status = 'pending'
WHERE total_payments = 0 
  AND (payer_wallet_address = '0x0000000000000000000000000000000000000000' 
       OR payer_wallet_address IS NULL);

