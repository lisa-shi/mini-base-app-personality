# 🐛 Debugging Quiz Result Writes

## Issue: Quiz results not being written to contract

## What I Fixed

### 1. **Added Error Handling** ✅
Changed from:
```typescript
handleSaveResultOnchain(finalResult, newScores);
```

To:
```typescript
handleSaveResultOnchain(finalResult, newScores).catch((err) => {
  console.error("Failed to save quiz result:", err);
});
```

**Why:** Without `.catch()`, errors were failing silently. Now they're logged.

### 2. **Added Wallet Connection Alert** ✅
If wallet is not connected, user now sees:
```
⚠️ Wallet not connected!

You need to connect your wallet to save your quiz results on the blockchain.

You can still view your results, but they won't be stored permanently.
```

### 3. **Enhanced Logging** ✅
Added detailed logs to track the flow:
```javascript
console.log("📝 Initiating quiz result save to blockchain...");
console.log("🔗 About to call storeQuizResult with contract:", CONTRACT_ADDRESS);
console.log("✅ storeQuizResult returned successfully with hash:", txHash);
```

## How to Test

### 1. **Check Console Logs**
When a user finishes the quiz, you should see:

```javascript
📝 Initiating quiz result save to blockchain: {
  wallet: "0x...",
  personality: "Bitcoin",
  scores: {...},
  timestamp: "..."
}

🔗 About to call storeQuizResult with contract: 0xDEe03E50791d3b6A531110F3C34a9e61E175F895

🔗 Calling storeQuizResult on contract: {
  address: "0xDEe03E50791d3b6A531110F3C34a9e61E175F895",
  personality: "Bitcoin",
  personalityEnum: 0,
  scores: {...},
  userAddress: "0x..."
}

✅ Quiz result stored successfully! {
  transactionHash: "0x...",
  explorer: "https://sepolia.basescan.org/tx/0x...",
  wallet: "0x...",
  personality: "Bitcoin"
}

✅ storeQuizResult returned successfully with hash: 0x...

✅ Quiz result transaction submitted! {
  transactionHash: "0x...",
  wallet: "0x...",
  personality: "Bitcoin",
  scores: {...},
  explorer: "https://sepolia.basescan.org/tx/0x..."
}

🔄 Refreshing leaderboard data...

✅ Leaderboard refreshed with new data!
```

### 2. **Common Issues & Solutions**

#### ❌ No logs appear at all
**Problem:** `handleSaveResultOnchain` is not being called
**Check:**
- Is the quiz actually completing? (Are you seeing the results page?)
- Check browser console for JavaScript errors

#### ❌ See "Cannot save result - wallet not connected"
**Problem:** Wallet is not connected
**Solution:**
- Connect wallet before starting quiz
- In MiniKit environment, wallet should auto-connect
- For local dev, use the "Connect Wallet" button

#### ❌ See "🔗 About to call storeQuizResult" but nothing after
**Problem:** `storeQuizResult` is failing
**Check console for:**
- "❌ Error storing quiz result: ..."
- Look for specific error message
- Common errors:
  - User rejected transaction
  - Insufficient gas
  - Wrong network (need Base Sepolia)

#### ❌ Transaction submitted but never confirms
**Problem:** Network congestion or RPC issues
**Check:**
- Copy transaction hash from console
- Visit: `https://sepolia.basescan.org/tx/[TX_HASH]`
- See transaction status

### 3. **Verify Contract Address**

The contract being used is:
```
0xDEe03E50791d3b6A531110F3C34a9e61E175F895
```

**Verify it's correct:**
1. Check `lib/contractConfig.ts` - CONTRACT_ADDRESS
2. Check console logs show this address
3. Verify on BaseScan: https://sepolia.basescan.org/address/0xDEe03E50791d3b6A531110F3C34a9e61E175F895

## Expected Flow

```
User completes quiz
  ↓
handleAnswer() called for last question
  ↓
Calculates final result
  ↓
Sets gameState to "result"
  ↓
Calls handleSaveResultOnchain(finalResult, newScores)
  ↓
Checks if wallet is connected
  ↓ YES
Calls storeQuizResult(personality, scores)
  ↓
useQuizContract.storeQuizResult() executes
  ↓
Calls writeContractAsync() with contract address & ABI
  ↓
Prompts user to sign transaction
  ↓
User approves
  ↓
Transaction submitted to blockchain
  ↓
Returns transaction hash
  ↓
Logs success
  ↓
Waits 3 seconds
  ↓
Refreshes leaderboard
  ↓
✅ COMPLETE
```

## Testing Checklist

- [ ] Open app in browser
- [ ] Open Developer Console (F12)
- [ ] Ensure wallet is connected (check top of screen)
- [ ] Complete the quiz (answer all 5 questions)
- [ ] Watch console for logs starting with "📝 Initiating..."
- [ ] Approve transaction in wallet popup
- [ ] Wait for "✅ Quiz result stored successfully!"
- [ ] Copy transaction hash
- [ ] Verify on BaseScan
- [ ] Wait 3 seconds for leaderboard refresh
- [ ] Check leaderboard shows updated counts

## Contract Functions

### Write Function: `storeQuizResult`
```solidity
function storeQuizResult(
    Personality personality,  // 0=Bitcoin, 1=Ethereum, 2=Solana, 3=Dogecoin
    uint256 bitcoinScore,
    uint256 ethereumScore,
    uint256 solanaScore,
    uint256 dogecoinScore
) external
```

**What it does:**
1. Creates a QuizResult struct with user data
2. Pushes to userResults[msg.sender] array
3. Increments personalityCount[personality]
4. Increments totalQuizCompletions
5. Emits QuizCompleted event

### Read Function: `getLeaderboardData`
```solidity
function getLeaderboardData() external view returns (
    uint256 bitcoinCount,
    uint256 ethereumCount,
    uint256 solanaCount,
    uint256 dogecoinCount,
    uint256 total
)
```

**What it returns:**
- Count for each personality type
- Total quiz completions

## Network Details

- **Network:** Base Sepolia (testnet)
- **Chain ID:** 84532
- **RPC:** Uses OnchainKit's RPC (configured in wagmiConfig)
- **Contract:** 0xDEe03E50791d3b6A531110F3C34a9e61E175F895
- **Explorer:** https://sepolia.basescan.org

## Next Steps if Still Not Working

1. **Check wallet connection:**
   ```javascript
   // In console:
   console.log("Address:", address);
   // Should show "0x..."
   ```

2. **Test contract manually:**
   - Go to BaseScan: https://sepolia.basescan.org/address/0xDEe03E50791d3b6A531110F3C34a9e61E175F895#writeContract
   - Connect wallet
   - Try calling `storeQuizResult` manually
   - If this works, issue is in frontend code
   - If this fails, issue is with contract/wallet

3. **Check wagmi configuration:**
   - Verify `lib/wagmiConfig.ts` exists
   - Check `app/rootProvider.tsx` has WagmiProvider
   - Ensure QueryClientProvider is wrapping OnchainKitProvider

4. **Enable verbose wagmi logging:**
   Add to `lib/wagmiConfig.ts`:
   ```typescript
   export const wagmiConfig = createConfig({
     chains: [baseSepolia],
     transports: {
       [baseSepolia.id]: http(),
     },
     // Add this for debugging:
   });
   ```

## Summary

✅ **Fixed:**
- Error handling with `.catch()`
- Wallet connection alerts
- Enhanced logging throughout
- Import CONTRACT_ADDRESS for logging

✅ **Verified:**
- Contract address is correct: `0xDEe03E50791d3b6A531110F3C34a9e61E175F895`
- Both write and read use the same contract
- Flow is correct: quiz → save → refresh leaderboard

🔍 **To debug, check:**
1. Browser console for all logs
2. Wallet is connected
3. Transaction hash on BaseScan
4. Network is Base Sepolia

The code is now set up to provide detailed logging so you can see exactly where things are failing (if they are failing).

