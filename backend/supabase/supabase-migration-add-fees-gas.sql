-- Migration: Add fee_amount and gas_cost columns to invoices table
-- Run this in the Supabase SQL Editor

-- Add fee_amount column (0.05% of invoice amount)
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS fee_amount NUMERIC(18, 6) DEFAULT 0;

-- Add gas_cost column (in native token, e.g., USDC for gas on Arc)
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS gas_cost NUMERIC(18, 6);

-- Add comment for documentation
COMMENT ON COLUMN invoices.fee_amount IS 'Platform fee charged (0.05% of invoice amount)';
COMMENT ON COLUMN invoices.gas_cost IS 'Gas cost paid for the transaction';














