# Deployment Workflow

## Correct Order of Operations

### ✅ Step 1: Deploy the Contract First

```bash
# 1. Compile
npm run compile

# 2. Deploy (requires DEPLOYER_PRIVATE_KEY in .env.local)
npm run deploy
```

**Output will show:**

```
✅ ArcLedger deployed to: 0x1234...abcd
Contract address saved to contract-address.json
```

### ✅ Step 2: Get the Contract Address

You'll get the address from:

- **Console output** (shown after deployment)
- **`contract-address.json`** file (created automatically)

Example:

```json
{
  "address": "0x1234567890abcdef1234567890abcdef12345678",
  "network": "arcTestnet",
  "chainId": 5042002,
  ...
}
```

### ✅ Step 3: Add to Environment

**Only after deployment**, add to `.env.local`:

```bash
NEXT_PUBLIC_ARCLEDGER_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

### ✅ Step 4: Restart Dev Server

**Important**: Restart your Next.js server after adding the contract address:

```bash
# Stop server (Ctrl+C)
npm run dev
```

## Why This Order?

1. **Contract doesn't exist yet** - You can't know the address before deployment
2. **Deployment creates the address** - The address is generated when the contract is deployed
3. **Frontend needs the address** - The app reads it from environment variables

## What Happens If Address Is Missing?

The app will:

- ✅ Still run (won't crash)
- ⚠️ Show error messages on invoice creation/payment pages
- ❌ Won't be able to register invoices on-chain
- ❌ Won't have automatic status updates

## Quick Reference

```bash
# 1. Deploy (get address)
npm run deploy

# 2. Copy address from console or contract-address.json

# 3. Add to .env.local
echo "NEXT_PUBLIC_ARCLEDGER_CONTRACT_ADDRESS=0x..." >> .env.local

# 4. Restart
npm run dev
```

## Verification

After adding the address, check:

1. Invoice creation page doesn't show "Contract not configured" error
2. Payment page shows approval/payment buttons
3. Console shows no contract-related errors

