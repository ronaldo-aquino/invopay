# Deployment Security Guide

## ⚠️ Important Security Information

Yes, you **do need a private key** to deploy the smart contract. However, you should **NEVER use your main wallet's private key**. Here's how to do it safely:

## Why You Need a Private Key

When deploying a smart contract, you need to:

1. Sign the deployment transaction
2. Pay for gas fees
3. The private key proves you own the wallet that will deploy the contract

## Security Best Practices

### ✅ DO: Use a Separate Deployer Wallet

**Create a dedicated wallet ONLY for contract deployment:**

1. **Create a new wallet** (using MetaMask or any wallet):
   - This should be a SEPARATE wallet from your main one
   - Only use it for deployment
   - Never use it for anything else

2. **Fund it with testnet tokens**:
   - Get testnet USDC from [Circle Faucet](https://faucet.circle.com)
   - You only need enough for gas (a few dollars worth is plenty)

3. **Export the private key**:
   - In MetaMask: Account Details → Show Private Key
   - Copy it (it will be a long hex string starting with `0x`)

4. **Add to `.env.local`** (NOT `.env`):

   ```bash
   DEPLOYER_PRIVATE_KEY=your_private_key_without_0x_prefix
   ```

   - Remove the `0x` prefix when adding to the env file
   - Example: If your key is `0xabc123...`, use `abc123...`

### ❌ DON'T: Use Your Main Wallet

- **Never use your main wallet's private key**
- **Never commit the private key to Git**
- **Never share it publicly**
- **Never use it in production with real funds**

## Step-by-Step Deployment

### 1. Create Deployer Wallet

```bash
# Option A: Use MetaMask
# 1. Create new account in MetaMask
# 2. Copy the address
# 3. Get testnet tokens to that address

# Option B: Generate programmatically (for testing only)
# You can use a tool like Hardhat's account generation
```

### 2. Fund the Wallet

- Visit [Circle Faucet](https://faucet.circle.com)
- Select "Arc Testnet"
- Send testnet USDC to your deployer wallet address
- You need enough for gas fees (usually < $1 worth)

### 3. Add Private Key to Environment

Create or update `.env.local`:

```bash
# Add this line (without 0x prefix)
DEPLOYER_PRIVATE_KEY=abc123def456...your_private_key_here
```

**Important**:

- `.env.local` is already in `.gitignore` (won't be committed)
- Never add this to `env.example` or commit it

### 4. Deploy

```bash
npm run compile
npm run deploy
```

### 5. Verify Deployment

After deployment:

- The contract address will be saved to `contract-address.json`
- Check it on [ArcScan](https://testnet.arcscan.app)
- The deployer wallet address will be shown (this is safe to share)

### 6. Clean Up (Optional but Recommended)

After successful deployment, you can:

- Remove the private key from `.env.local` if you won't deploy again
- Or keep it if you plan to redeploy/upgrade

## Alternative: Using Hardhat's Account Management

If you prefer not to use a private key directly, you can use Hardhat's account management:

1. Install `@nomicfoundation/hardhat-toolbox`
2. Configure accounts in `hardhat.config.ts`
3. Use Hardhat's account system

However, for simplicity, the direct private key approach is fine for testnet.

## Production Deployment

For **mainnet/production** deployments:

1. **Use a hardware wallet** (Ledger, Trezor)
2. **Use a multi-sig wallet** for important contracts
3. **Use a deployment service** (like OpenZeppelin Defender)
4. **Never store private keys in code or config files**

## What Happens After Deployment?

Once deployed:

- The contract address is public (safe to share)
- The deployer wallet address is public (safe to share)
- **The private key stays private** (never share this!)

You can even transfer ownership of the contract to a different address if needed.

## Troubleshooting

### "Insufficient funds"

- Make sure your deployer wallet has testnet tokens
- Get more from the faucet

### "Invalid private key"

- Make sure you removed the `0x` prefix
- Check for extra spaces or newlines
- The key should be 64 hex characters

### "Transaction failed"

- Check you're on Arc Testnet
- Verify you have enough gas
- Check the RPC endpoint is working

## Summary

✅ **Safe Approach:**

- Create separate deployer wallet
- Fund with testnet tokens only
- Store private key in `.env.local` (gitignored)
- Deploy contract
- Keep private key secret

❌ **Unsafe Approach:**

- Using main wallet's private key
- Committing private key to Git
- Sharing private key publicly
- Using production wallet for testnet

Remember: On testnet, even if someone gets your private key, they can only steal testnet tokens (worthless). But always follow best practices!

