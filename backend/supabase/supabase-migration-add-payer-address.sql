-- Add payer_address column to track who paid each invoice
-- This allows us to show "Invoices I Paid" correctly

ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS payer_address TEXT;

-- Create index for faster queries on payer_address
CREATE INDEX IF NOT EXISTS idx_invoices_payer_address ON invoices(payer_address);

-- Add comment for documentation
COMMENT ON COLUMN invoices.payer_address IS 'Address of the wallet that paid this invoice (null if not paid yet)';












