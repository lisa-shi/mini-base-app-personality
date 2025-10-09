# Testing Guide: Contract Integration

This guide helps you verify that quiz results are being written to the blockchain correctly.

## Quick Start

### 1. Run the App
```bash
npm run dev
```

### 2. Complete a Quiz
1. Open http://localhost:3000
2. Connect your wallet
3. Complete the quiz (answer all 5 questions)
4. Check the browser console for transaction logs

### 3. Expected Console Output

When the quiz completes, you should see:

```javascript
📝 Initiating quiz result save to blockchain: {
  wallet: "0x1234...",
  personality: "Bitcoin",
  scores: { Bitcoin: 3, Ethereum: 1, Solana: 1, Dogecoin: 0 },
  timestamp: "2024-..."
}

🔗 Calling storeQuizResult on contract: {
  address: "0x850eb63dE7F69e485F4163A46c3484c8D43ef355",
  personality: "Bitcoin",
  personalityEnum: 0,
  scores: { ... }
}

✅ Quiz result saved successfully! {
  transactionHash: "0xabcd...",
  wallet: "0x1234...",
  personality: "Bitcoin",
  scores: { ... },
  explorer: "https://sepolia.basescan.org/tx/0xabcd..."
}
```

## Verification Methods

### Method 1: Check Block Explorer

1. Copy the transaction hash from the console
2. Visit: https://sepolia.basescan.org/tx/[TX_HASH]
3. Verify:
   - ✅ Status: Success
   - ✅ Method: `storeQuizResult`
   - ✅ From: Your wallet address
   - ✅ To: Contract address (`0x850eb...`)

### Method 2: Use Verification Script

Run the verification script to check stored results:

```bash
# Check contract status
node scripts/verify-contract.js

# Check specific user's results
node scripts/verify-contract.js 0xYourWalletAddress
```

**Example output:**
```
🔍 Contract Verification Script
================================

📝 Contract Address: 0x850eb63dE7F69e485F4163A46c3484c8D43ef355
🌐 Network: Base Sepolia
🔗 Explorer: https://sepolia.basescan.org/address/0x850eb...

✅ Contract found and deployed

🎨 Total NFTs Minted: 5

👤 Checking results for: 0x1234...

📊 Total Quiz Attempts: 2

📋 Quiz History:
─────────────────────────────────────────────────

Attempt 1:
  🎯 Personality: Bitcoin
  📅 Date: 10/9/2024, 3:45:23 PM
  💯 Scores:
     Bitcoin: 3
     Ethereum: 1
     Solana: 1
     Dogecoin: 0

Attempt 2:
  🎯 Personality: Ethereum
  📅 Date: 10/9/2024, 4:12:15 PM
  💯 Scores:
     Bitcoin: 1
     Ethereum: 3
     Solana: 1
     Dogecoin: 0
```

### Method 3: Browser DevTools

1. Open browser DevTools (F12)
2. Go to Console tab
3. Complete a quiz
4. Look for the transaction logs marked with emojis:
   - 📝 = Initiating save
   - 🔗 = Calling contract
   - ✅ = Success
   - ❌ = Error

## Common Issues and Solutions

### Issue: "Wallet not connected"
```
⚠️ Cannot save result - wallet not connected
```

**Solution:**
- For MiniKit: Ensure app is running in MiniKit environment
- For local dev: Click "Connect Wallet" button
- Check that wallet is on Base Sepolia network

### Issue: "Transaction timeout"
```
Transaction timeout - no hash received after 30 seconds
```

**Possible causes:**
1. User rejected transaction in wallet
2. Network congestion
3. RPC connection issues

**Solution:**
- Check if wallet prompt appeared
- Ensure sufficient ETH for gas
- Try again

### Issue: Transaction Fails
```
❌ Error saving result to blockchain: execution reverted
```

**Check:**
1. **Wallet Balance:** Need ETH on Base Sepolia
   - Get testnet ETH: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
2. **Network:** Connected to Base Sepolia
3. **Contract:** Verify contract is deployed correctly

### Issue: No Console Logs
If you don't see any logs:

1. Check browser console is open
2. Clear console filters
3. Refresh the page
4. Try completing quiz again

## Testing Checklist

- [ ] App runs without errors (`npm run dev`)
- [ ] Wallet connects successfully
- [ ] Quiz can be completed
- [ ] Console shows "🔗 Calling storeQuizResult"
- [ ] Console shows "✅ Quiz result saved successfully!"
- [ ] Transaction hash appears in console
- [ ] Block explorer shows successful transaction
- [ ] Verification script shows quiz results
- [ ] NFT mint button works (optional)

## Data Written to Contract

Every quiz completion writes:

```solidity
struct QuizResult {
    address user;           // Your wallet (automatic)
    Personality personality; // Winning personality (0-3)
    uint256 timestamp;      // Block timestamp (automatic)
    uint256 bitcoinScore;   // Score for Bitcoin
    uint256 ethereumScore;  // Score for Ethereum
    uint256 solanaScore;    // Score for Solana
    uint256 dogecoinScore;  // Score for Dogecoin
}
```

## Gas Costs (Estimated)

- **storeQuizResult:** ~100,000-150,000 gas (~$0.01-0.02 on testnet)
- **mintPersonalityNFT:** ~150,000-200,000 gas (~$0.02-0.03 on testnet)

## Debug Mode

To enable more detailed logs, open browser console and run:

```javascript
localStorage.setItem('DEBUG', 'true');
location.reload();
```

## Next Steps After Verification

Once you've confirmed writes are working:

1. **Deploy to Production:**
   ```bash
   vercel deploy --prod
   ```

2. **Update NFT Metadata:**
   - Upload metadata to IPFS
   - Update `contractConfig.ts` with IPFS URIs

3. **Monitor Usage:**
   - Use BaseScan to monitor transactions
   - Set up event listening for analytics

4. **Optimize Gas:**
   - Consider batching if needed
   - Optimize data structures

## Support Links

- **Base Sepolia Faucet:** https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- **BaseScan (Testnet):** https://sepolia.basescan.org/
- **Contract Address:** `0x850eb63dE7F69e485F4163A46c3484c8D43ef355`
- **Documentation:** See CONTRACT_FIX_SUMMARY.md

## Need Help?

If you're still experiencing issues:

1. Check CONTRACT_FIX_SUMMARY.md for technical details
2. Review browser console for specific error messages
3. Verify contract deployment with verification script
4. Check wallet connection and network settings


