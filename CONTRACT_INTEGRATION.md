# Smart Contract Integration Guide

## ✅ What's Been Integrated

The frontend has been updated to use the **ArcLedger smart contract** for:

1. **On-chain Invoice Registration** - Invoices are registered on the blockchain when created
2. **Automatic Status Updates** - Payment events are listened to automatically, updating status in real-time
3. **Contract-Based Payments** - Payments go through the contract instead of direct transfers

## 🚀 Deployment Steps

### 1. Deploy the Contract

```bash
# Install dependencies (if not done)
npm install

# Compile the contract
npm run compile

# Deploy to Arc Testnet
npm run deploy
```

After deployment, you'll get a contract address. Save it!

### 2. Configure Environment

Add to your `.env.local`:

```bash
NEXT_PUBLIC_ARCLEDGER_CONTRACT_ADDRESS=0x...your_deployed_contract_address
```

### 3. Restart the Application

```bash
npm run dev
```

## 📋 How It Works

### Invoice Creation Flow

1. User fills out invoice form
2. Invoice is saved to Supabase (off-chain record)
3. Invoice is registered on-chain via `createInvoice()` contract call
4. `InvoiceCreated` event is emitted
5. User is redirected to payment page

### Payment Flow

1. User clicks "Pay with Wallet"
2. System checks token allowance
3. If needed, user approves contract to spend tokens
4. User clicks "Pay Invoice"
5. Contract's `payInvoice()` function is called
6. Tokens are transferred from payer to receiver
7. `InvoicePaid` event is emitted
8. **Event listener automatically updates Supabase status** ✨
9. UI updates in real-time

### Automatic Status Updates

The payment page uses `useWatchContractEvent` to listen for `InvoicePaid` events. When a payment is detected:

- Supabase status is automatically updated to "paid"
- Transaction hash is saved
- UI refreshes immediately
- No polling needed!

## 🔧 Technical Details

### Invoice ID Conversion

Invoice IDs (UUIDs) are converted to `bytes32` using `keccak256` hash:

```typescript
const invoiceIdBytes32 = keccak256(toHex(invoiceId));
```

This ensures deterministic conversion that matches the contract's expected format.

### Contract Functions Used

- `createInvoice(bytes32, address, uint256, address, string)` - Register invoice
- `payInvoice(bytes32)` - Pay invoice (requires approval first)
- `getInvoice(bytes32)` - Read invoice from chain
- `InvoicePaid` event - Listen for payments

### Token Approval Flow

Before payment, users must approve the contract:

1. Check current allowance
2. If insufficient, show "Approve" button
3. User approves contract to spend tokens
4. Then user can pay

## 🎯 Benefits

✅ **On-chain Registry** - All invoices are registered on blockchain  
✅ **Event-Based Updates** - No polling, instant status updates  
✅ **Transparent** - All invoices visible on-chain  
✅ **Automatic** - Status updates happen automatically via events  
✅ **Reliable** - Blockchain is the source of truth

## ⚠️ Important Notes

1. **Contract Address Required** - The app won't work without `NEXT_PUBLIC_ARCLEDGER_CONTRACT_ADDRESS` set
2. **Two-Step Payment** - Users must approve, then pay (two transactions)
3. **Gas Costs** - Slightly higher than direct transfers (approval + payment)
4. **Event Listening** - Events are only detected while the page is open

## 🐛 Troubleshooting

### "Contract not configured"

- Make sure `NEXT_PUBLIC_ARCLEDGER_CONTRACT_ADDRESS` is set in `.env.local`
- Restart the dev server after adding it

### "Approval needed"

- This is normal! Users must approve the contract before paying
- The approval is a one-time action per token

### Status not updating

- Check that events are being emitted (view on ArcScan)
- Make sure the payment page is open (events only work while page is active)
- Check browser console for errors

### Invoice not found on-chain

- Make sure invoice creation transaction succeeded
- Check the contract address is correct
- Verify the invoice ID conversion matches

## 📊 Monitoring

You can monitor contract activity on:

- **ArcScan**: https://testnet.arcscan.app/address/YOUR_CONTRACT_ADDRESS
- **Events**: Filter by `InvoiceCreated`, `InvoicePaid`, `InvoiceStatusUpdated`

## 🔄 Fallback Mode

If the contract address is not set, the app will show an error message. You can still use the direct transfer mode by removing contract integration, but you'll lose:

- On-chain registration
- Automatic status updates
- Event-based monitoring

For production, always use the contract!

