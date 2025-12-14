# Database Migration Guide

## Adding Fee and Gas Cost Tracking

This migration adds `fee_amount` and `gas_cost` columns to the `invoices` table.

### Step 1: Run SQL Migration in Supabase

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the following SQL:

```sql
-- Add fee_amount column (0.05% of invoice amount)
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS fee_amount NUMERIC(18, 6) DEFAULT 0;

-- Add gas_cost column (in native token, e.g., USDC for gas on Arc)
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS gas_cost NUMERIC(18, 6);

-- Add comment for documentation
COMMENT ON COLUMN invoices.fee_amount IS 'Platform fee charged (0.05% of invoice amount)';
COMMENT ON COLUMN invoices.gas_cost IS 'Gas cost paid for the transaction';
```

4. Click **Run** to execute the migration

### Step 2: Verify Migration

After running the migration, verify the columns were added:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'invoices'
AND column_name IN ('fee_amount', 'gas_cost');
```

You should see both columns listed.

### What Gets Tracked

- **fee_amount**: The 0.05% platform fee charged when creating an invoice (stored in invoice currency)
- **gas_cost**: The gas cost paid for transactions (creation + payment, stored in invoice currency)

### Notes

- Existing invoices will have `fee_amount = 0` and `gas_cost = NULL`
- New invoices will automatically track fees and gas costs
- Gas costs accumulate (creation gas + payment gas if applicable)

