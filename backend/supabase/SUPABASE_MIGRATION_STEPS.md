# Supabase Migration - Step by Step Guide

## What You Need to Do

Add two new columns (`fee_amount` and `gas_cost`) to your `invoices` table in Supabase.

## Step-by-Step Instructions

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Log in to your account
3. Select your ArcLedger project

### Step 2: Open SQL Editor

1. In the left sidebar, click on **"SQL Editor"** (it has a database icon)
2. You'll see a text area where you can write SQL queries

### Step 3: Copy and Paste the SQL Code

Copy this entire SQL code:

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

### Step 4: Run the SQL

1. Paste the SQL code into the SQL Editor text area
2. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
3. You should see a success message like "Success. No rows returned"

### Step 5: Verify It Worked (Optional)

To verify the columns were added, run this query:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'invoices'
AND column_name IN ('fee_amount', 'gas_cost');
```

You should see two rows showing:

- `fee_amount` with type `numeric`
- `gas_cost` with type `numeric`

## What This Does

- **fee_amount**: Stores the 0.05% platform fee charged when creating an invoice
- **gas_cost**: Stores the gas cost paid for transactions (creation + payment)

## Important Notes

- Existing invoices will have `fee_amount = 0` and `gas_cost = NULL` (this is normal)
- New invoices will automatically track fees and gas costs
- The `IF NOT EXISTS` clause means it's safe to run this multiple times

## Troubleshooting

If you get an error:

- Make sure you're in the correct project
- Check that the `invoices` table exists
- Try running each `ALTER TABLE` command separately

