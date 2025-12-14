# Smart Contract Deployment Guide

## Overview

The Arc Ledger application can work in two modes:

1. **Direct Transfer Mode (Current)**: Payer sends tokens directly to receiver address
   - ✅ Simple, no contract deployment needed
   - ✅ Lower gas costs
   - ❌ Requires polling to detect payments
   - ❌ No on-chain invoice registry

2. **Contract-Based Mode (Recommended for Production)**: Uses ArcLedger smart contract
   - ✅ Event-based payment detection (no polling)
   - ✅ On-chain invoice registry
   - ✅ Automatic status updates
   - ✅ Better payment verification
   - ❌ Requires contract deployment
   - ❌ Slightly higher gas costs (approval + transfer)

## Deploying the Smart Contract

### Prerequisites

1. Install Hardhat dependencies:

   ```bash
   npm install
   ```

2. Get a deployer wallet with testnet tokens:
   - Create a new wallet or use an existing one
   - Fund it with testnet USDC from [Circle Faucet](https://faucet.circle.com)
   - You'll need tokens for gas fees

### Step 1: Create a Deployer Wallet

**⚠️ IMPORTANT: Use a SEPARATE wallet for deployment, NOT your main wallet!**

1. Create a new wallet in MetaMask (or any wallet)
2. Export the private key:
   - MetaMask: Account Details → Show Private Key
   - Copy the key (it starts with `0x`)
3. Fund it with testnet tokens from [Circle Faucet](https://faucet.circle.com)
   - You only need enough for gas fees (~$1 worth is plenty)

### Step 2: Set Up Environment Variables

Add to your `.env.local`:

```bash
DEPLOYER_PRIVATE_KEY=your_private_key_without_0x_prefix
ARC_TESTNET_RPC_URL=https://rpc.testnet.arc.network
```

**⚠️ Security Warnings:**

- **Never commit your private key to version control!**
- **Use a separate wallet, not your main wallet!**
- **`.env.local` is already in `.gitignore` (safe)**
- **Remove the `0x` prefix when adding to env file**

See [DEPLOYMENT_SECURITY.md](./DEPLOYMENT_SECURITY.md) for detailed security guidelines.

### Step 2: Compile the Contract

```bash
npm run compile
```

This will compile the Solidity contract and generate artifacts in the `artifacts/` directory.

### Step 3: Deploy the Contract

```bash
npm run deploy
```

The deployment script will:

- Deploy the ArcLedger contract to Arc Testnet
- Save the contract address to `contract-address.json`
- Display the contract address and explorer link

### Step 4: Get Contract Address

After deployment, the script will:

- Display the contract address in the console
- Save it to `contract-address.json`

Copy the contract address from the console output or from `contract-address.json`.

### Step 5: Update Frontend Configuration

Add the contract address to your `.env.local`:

```bash
NEXT_PUBLIC_ARCLEDGER_CONTRACT_ADDRESS=0x...your_deployed_contract_address
```

**Important**: You must restart your Next.js dev server after adding this variable:

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

### Step 5: Update Frontend Code (Optional)

If you want to use the contract-based approach, you'll need to:

1. Import the contract ABI from artifacts
2. Update the payment flow to:
   - Approve the contract to spend tokens
   - Call `payInvoice()` instead of direct transfer
3. Listen to contract events for automatic status updates

## Contract Functions

### `createInvoice(bytes32 invoiceId, address receiver, uint256 amount, address tokenAddress, string memory paymentLink)`

Creates a new invoice on-chain. Should be called when creating an invoice in the frontend.

### `payInvoice(bytes32 invoiceId)`

Pays an invoice. Requires the payer to have approved the contract to spend tokens.

### `getInvoice(bytes32 invoiceId)`

Returns invoice details.

### `getCreatorInvoices(address creator)`

Returns all invoice IDs for a given creator.

### `cancelInvoice(bytes32 invoiceId)`

Cancels a pending invoice (only creator can call).

## Events

The contract emits events that can be listened to:

- `InvoiceCreated`: Emitted when a new invoice is created
- `InvoicePaid`: Emitted when an invoice is paid
- `InvoiceStatusUpdated`: Emitted when invoice status changes

## Example: Listening to Events

```typescript
import { createPublicClient, http, parseAbiItem } from "viem";
import { arcTestnet } from "@/lib/wagmi";

const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});

// Listen for InvoicePaid events
const unwatch = publicClient.watchEvent({
  address: CONTRACT_ADDRESS,
  event: parseAbiItem(
    "event InvoicePaid(bytes32 indexed invoiceId, address indexed payer, bytes32 indexed transactionHash)"
  ),
  onLogs: (logs) => {
    logs.forEach((log) => {
      const invoiceId = log.args.invoiceId;
      // Update invoice status in Supabase
      updateInvoiceStatus(invoiceId, "paid");
    });
  },
});
```

## Current Implementation

**The current frontend uses direct transfers** (no contract). This works perfectly fine for the MVP, but for production, consider:

1. Deploying the contract
2. Updating the frontend to use contract-based payments
3. Implementing event listeners for automatic status updates

## Gas Costs

- **Direct Transfer**: ~21,000 gas (just the transfer)
- **Contract Payment**: ~65,000 gas (approval + contract call)

The contract approach is slightly more expensive but provides better functionality.

## Verification

After deployment, verify the contract on ArcScan:

```bash
npm run verify <CONTRACT_ADDRESS>
```

This makes the contract source code publicly verifiable on the block explorer.
