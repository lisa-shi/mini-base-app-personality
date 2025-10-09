# 🚀 Redeploy Contract with Leaderboard Features

## Why You Need to Redeploy

Your current smart contract (`0x850eb63dE7F69e485F4163A46c3484c8D43ef355`) doesn't have the leaderboard tracking features. You need to deploy the **updated contract** that includes:

- Personality counters
- Total quiz completions tracking
- Leaderboard data functions

## Quick Deployment Steps

### 1. Compile the Updated Contract

```bash
cd /Users/kaitlynwang/mini-base-app-personality
npx hardhat compile
```

### 2. Deploy to Base Sepolia

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

**You'll see output like:**
```
Deploying CryptoPersonalityQuiz...
CryptoPersonalityQuiz deployed to: 0xNEW_CONTRACT_ADDRESS_HERE
```

**📝 Copy the new contract address!**

### 3. Update the Contract Address

Open `lib/contractConfig.ts` and update line 3:

```typescript
export const CONTRACT_ADDRESS = "0xNEW_CONTRACT_ADDRESS_HERE"; // Update with your new address
```

### 4. Commit and Push

```bash
git add lib/contractConfig.ts
git commit -m "Update contract address with leaderboard features"
git push origin main
```

### 5. Wait for Vercel Deployment

Vercel will automatically deploy your changes in ~2-3 minutes. ✅

## What You'll See After Deployment

### On the Welcome Page:
```
🏆 Global Rankings
X people have discovered their crypto personality

[Leaderboard with all 4 personalities]
```

### On the Results Page:
```
🏆 Global Personality Rankings
X people have taken the quiz

[Leaderboard with YOUR personality highlighted]
```

### If No Data Yet:
```
🎯
Be the first to discover your crypto personality!
```

## Testing the Leaderboard

1. Take the quiz and complete it
2. The `storeQuizResult` function will automatically increment the counter
3. Refresh the page - you'll see the leaderboard with your result!
4. Share with friends and watch the rankings grow!

## Troubleshooting

### Contract Not Compiling?
```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
npx hardhat clean
npx hardhat compile
```

### Need Testnet ETH?
Get Base Sepolia ETH from:
- https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- Bridge from Ethereum Goerli

### Deployment Fails?
Check your `.env.local`:
```
PRIVATE_KEY=your_wallet_private_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
```

## Important Notes

⚠️ **This is a new contract** - Previous quiz data won't carry over  
✅ **Free to deploy** - Just need testnet ETH for gas  
🔄 **Immediate effect** - Leaderboard works right after deployment  
📊 **Real-time updates** - Counters update with each quiz completion  

## Optional: Verify on BaseScan

After deployment, verify your contract:

```bash
npx hardhat verify --network baseSepolia YOUR_NEW_CONTRACT_ADDRESS
```

This makes your contract code visible on BaseScan! 🔍

## Need Help?

Check these files:
- `contracts/CryptoPersonalityQuiz.sol` - The contract code
- `scripts/deploy.js` - Deployment script
- `hardhat.config.js` - Network configuration
- `LEADERBOARD_FEATURE.md` - Feature documentation

---

Once deployed, your leaderboard will be live and tracking all quiz results! 🎉

