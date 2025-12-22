-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet_address TEXT NOT NULL,
  receiver_wallet_address TEXT NOT NULL,
  amount NUMERIC(18, 6) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('USDC', 'EURC')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired')),
  payment_link TEXT NOT NULL UNIQUE,
  description TEXT,
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_wallet_address for faster queries
CREATE INDEX IF NOT EXISTS idx_invoices_user_wallet ON invoices(user_wallet_address);

-- Create index on payment_link for faster lookups
CREATE INDEX IF NOT EXISTS idx_invoices_payment_link ON invoices(payment_link);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Enable Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own invoices
CREATE POLICY "Users can view their own invoices"
  ON invoices
  FOR SELECT
  USING (user_wallet_address = current_setting('app.user_wallet_address', true));

-- Policy: Anyone can read invoices (for payment page)
CREATE POLICY "Anyone can view invoices for payment"
  ON invoices
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert their own invoices
-- Note: In a production app, you'd want to verify the wallet signature
CREATE POLICY "Users can create invoices"
  ON invoices
  FOR INSERT
  WITH CHECK (true);

-- Policy: System can update invoice status
CREATE POLICY "System can update invoices"
  ON invoices
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


