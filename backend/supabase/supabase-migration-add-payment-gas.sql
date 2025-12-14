-- Add gas_cost_creation and gas_cost_payment columns to track gas costs separately
-- This allows us to show different gas costs for invoice creator vs payer

-- Add gas_cost_creation column (for gas paid by creator when creating invoice)
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS gas_cost_creation NUMERIC(18, 6);

-- Add gas_cost_payment column (for gas paid by payer when paying invoice)
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS gas_cost_payment NUMERIC(18, 6);

-- Create index for faster queries on gas_cost_payment
CREATE INDEX IF NOT EXISTS idx_invoices_gas_cost_payment ON invoices(gas_cost_payment);

-- Add comments for documentation
COMMENT ON COLUMN invoices.gas_cost_creation IS 'Gas cost paid by invoice creator when creating the invoice (in USDC)';
COMMENT ON COLUMN invoices.gas_cost_payment IS 'Gas cost paid by payer when paying the invoice (in USDC)';

