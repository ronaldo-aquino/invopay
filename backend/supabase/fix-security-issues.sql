-- Fix 1: Enable RLS on payment_links table (if it exists)
ALTER TABLE IF EXISTS payment_links ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_links if they don't exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_links') THEN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Anyone can view payment_links" ON payment_links;
    DROP POLICY IF EXISTS "Users can create payment_links" ON payment_links;
    DROP POLICY IF EXISTS "System can update payment_links" ON payment_links;
    
    -- Create new policies
    CREATE POLICY "Anyone can view payment_links"
      ON payment_links
      FOR SELECT
      USING (true);
    
    CREATE POLICY "Users can create payment_links"
      ON payment_links
      FOR INSERT
      WITH CHECK (true);
    
    CREATE POLICY "System can update payment_links"
      ON payment_links
      FOR UPDATE
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Fix 2: Fix function search_path for update_updated_at_column
-- This makes the function more secure by setting a fixed search_path
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


