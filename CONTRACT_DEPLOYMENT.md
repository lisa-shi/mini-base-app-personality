# 🚀 Smart Contract Deployment Guide

Complete step-by-step guide to deploying your CryptoPersonalityQuiz smart contract and enabling onchain features.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Node.js 18+ installed
- ✅ MetaMask or another Web3 wallet
- ✅ Some Base Sepolia ETH for gas (get from faucet)
- ✅ Your wallet private key (KEEP SECURE!)

---

## Part 1: Install Hardhat & Dependencies

### Step 1: Install Required Packages

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv ethers
```

### Step 2: Verify Installation

```bash
npx hardhat --version
```

You should see: `2.x.x` or higher

---

## Part 2: Configure Environment

### Step 3: Update .env.local

Add your wallet private key to `.env.local`:

```bash
# ⚠️ NEVER COMMIT THIS FILE! ⚠️

# Your wallet private key (for deployment only)
PRIVATE_KEY=your_private_key_here_without_0x

# Get a Basescan API key from https://basescan.org/myapikey
BASESCAN_API_KEY=your_basescan_api_key_here
```

**Getting your private key:**
1. Open MetaMask
2. Click the three dots → Account details
3. Click "Export Private Key"
4. Enter your password
5. Copy the key (DO NOT share this!)

---

## Part 3: Get Testnet ETH

### Step 4: Get Base Sepolia ETH

You need testnet ETH for deployment gas fees:

**Option 1: QuickNode Faucet** (Recommended)
```
https://faucet.quicknode.com/base/sepolia
```

**Option 2: Coinbase Wallet Faucet**
```
https://portal.cdp.coinbase.com/products/faucet
```

Steps:
1. Go to one of the faucets
2. Connect your wallet
3. Select "Base Sepolia" network
4. Request testnet ETH
5. Wait 1-2 minutes for confirmation

### Step 5: Verify You Have ETH

Check your wallet in MetaMask:
- Network: Base Sepolia
- Balance: > 0.01 ETH

---

## Part 4: Deploy Smart Contract

### Step 6: Compile the Contract

```bash
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

### Step 7: Deploy to Base Sepolia

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

Expected output:
```
🚀 Starting deployment of CryptoPersonalityQuiz...
📝 Deploying contract with account: 0x...
💰 Account balance: 0.05 ETH

⏳ Deploying contract...

✅ CryptoPersonalityQuiz deployed successfully!
📍 Contract address: 0x1234567890abcdef1234567890abcdef12345678

📋 Next steps:
1. Update your .env.local file with:
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234...
```

### Step 8: Save Your Contract Address

**IMPORTANT:** Copy the contract address and save it!

Update `.env.local`:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

---

## Part 5: Verify Contract (Optional but Recommended)

### Step 9: Verify on Basescan

```bash
npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS
```

Replace `YOUR_CONTRACT_ADDRESS` with your actual address.

Expected output:
```
Successfully verified contract on Basescan
```

You can now view your contract on:
```
https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
```

---

## Part 6: Upload NFT Metadata to IPFS

### Step 10: Create NFT Images

You have placeholder SVGs in `/public/nft-*.svg`. You can:

**Option A:** Use the placeholders as-is
**Option B:** Create custom images (1000x1000px recommended)
**Option C:** Generate with AI (DALL-E, Midjourney, Stable Diffusion)

### Step 11: Upload to IPFS

**Using Pinata** (Recommended):

1. Go to [pinata.cloud](https://pinata.cloud)
2. Sign up for free account
3. Click "Upload" → "File"
4. Upload each personality image:
   - `nft-bitcoin.svg` (or your custom image)
   - `nft-ethereum.svg`
   - `nft-solana.svg`
   - `nft-dogecoin.svg`

5. Copy each CID (Content Identifier)

### Step 12: Update Metadata Files

Edit the files in `nft-metadata/`:

**nft-metadata/bitcoin.json**:
```json
{
  "name": "Bitcoin: The Pioneer",
  "description": "...",
  "image": "ipfs://QmYOUR_BITCOIN_IMAGE_CID_HERE",
  ...
}
```

Repeat for all four personalities.

### Step 13: Upload Metadata to IPFS

1. In Pinata, upload each JSON file:
   - `bitcoin.json`
   - `ethereum.json`
   - `solana.json`
   - `dogecoin.json`

2. Copy each metadata CID

### Step 14: Update Contract Configuration

Edit `lib/contractConfig.ts`:

```typescript
export const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";

export const NFT_METADATA_URIS = {
  Bitcoin: "ipfs://QmYOUR_BITCOIN_METADATA_CID",
  Ethereum: "ipfs://QmYOUR_ETHEREUM_METADATA_CID",
  Solana: "ipfs://QmYOUR_SOLANA_METADATA_CID",
  Dogecoin: "ipfs://QmYOUR_DOGECOIN_METADATA_CID",
};
```

---

## Part 7: Enable Contract in Frontend

### Step 15: Uncomment Contract Integration

Edit `app/page.tsx`:

**Find line ~104:**
```typescript
// Uncomment when contract is deployed:
// import { useQuizContract } from "../lib/useQuizContract";
// const { storeQuizResult, mintPersonalityNFT, isPending, isConfirmed } = useQuizContract();
```

**Uncomment it:**
```typescript
import { useQuizContract } from "../lib/useQuizContract";
const { storeQuizResult, mintPersonalityNFT, isPending, isConfirmed } = useQuizContract();
```

**Find line ~165:**
```typescript
// When contract is deployed, uncomment this:
// await storeQuizResult(personality, quizScores);
```

**Uncomment it:**
```typescript
await storeQuizResult(personality, quizScores);
```

**Find line ~197:**
```typescript
// When contract is deployed, uncomment this:
// await mintPersonalityNFT(result);
```

**Uncomment it:**
```typescript
await mintPersonalityNFT(result);
```

**Remove the simulation lines (~168-169 and ~200-201):**
```typescript
// Remove these lines:
// await new Promise(resolve => setTimeout(resolve, 2000));
```

---

## Part 8: Test Everything

### Step 16: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 17: Take the Quiz

1. Open http://localhost:3000
2. Ensure wallet is connected
3. Complete the quiz
4. Check console for transaction logs
5. Watch for "Result saved onchain!" message

### Step 18: Verify on Basescan

1. Go to `https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS`
2. Click "Events" tab
3. You should see `QuizCompleted` events

### Step 19: Test NFT Minting

1. Complete the quiz
2. Click "Mint NFT 🎨"
3. Approve transaction in wallet
4. Wait for confirmation
5. Check your wallet for the NFT

---

## Part 9: Deploy to Production (Optional)

### Step 20: Deploy to Base Mainnet

⚠️ **WARNING:** This costs real ETH!

**Get Base Mainnet ETH:**
- Bridge from Ethereum mainnet
- Buy directly on Base

**Deploy:**
```bash
npx hardhat run scripts/deploy.js --network base
```

**Update .env.local:**
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_MAINNET_CONTRACT_ADDRESS
```

---

## 🔍 Testing Checklist

Before going to production:

- [ ] Contract deployed successfully
- [ ] Contract verified on Basescan
- [ ] NFT images uploaded to IPFS
- [ ] NFT metadata uploaded to IPFS
- [ ] Contract address updated in code
- [ ] NFT URIs updated in code
- [ ] Contract integration uncommented
- [ ] Quiz completes successfully
- [ ] Results save onchain (verified on Basescan)
- [ ] NFTs mint successfully
- [ ] NFTs visible in wallet
- [ ] NFT metadata displays correctly

---

## 💰 Cost Estimates

### Base Sepolia (Testnet)
- Contract deployment: **FREE** (testnet ETH)
- Storing results: **FREE**
- Minting NFTs: **FREE**

### Base Mainnet (Production)
- Contract deployment: ~0.002-0.005 ETH (~$5-12)
- Storing results: ~0.0001 ETH per submission (~$0.25)
- Minting NFTs: ~0.0003 ETH per mint (~$0.75)

*Costs based on typical gas prices; may vary*

---

## 🐛 Troubleshooting

### "Insufficient funds for gas"
- **Solution**: Get more testnet ETH from faucet

### "Contract not deployed"
- **Solution**: Check PRIVATE_KEY in .env.local
- **Solution**: Ensure you're on correct network

### "Transaction reverted"
- **Solution**: Check contract address is correct
- **Solution**: Verify you have gas fees

### "NFT not showing in wallet"
- **Solution**: Wait a few minutes
- **Solution**: Add contract address manually in wallet
- **Solution**: Verify IPFS metadata is accessible

### "Cannot find module '@openzeppelin/contracts'"
- **Solution**: Run `npm install @openzeppelin/contracts`

### "Network base not configured"
- **Solution**: Check `hardhat.config.js` has Base network
- **Solution**: Verify .env.local has correct values

---

## 📚 Helpful Resources

- [Hardhat Documentation](https://hardhat.org/)
- [Base Developer Docs](https://docs.base.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/)
- [Pinata IPFS](https://docs.pinata.cloud/)
- [Basescan](https://basescan.org/)
- [Base Sepolia Faucet](https://faucet.quicknode.com/base/sepolia)

---

## 🎉 Success!

Once everything is working:

1. ✅ Your quiz stores results permanently onchain
2. ✅ Users can mint personality NFTs
3. ✅ All interactions are verifiable on Basescan
4. ✅ NFTs show proper metadata and images

**Ready to deploy to production and launch! 🚀**

---

## 🔐 Security Reminders

- ❌ NEVER commit your private key
- ❌ NEVER share your .env.local file
- ✅ ALWAYS use environment variables
- ✅ ALWAYS test on testnet first
- ✅ ALWAYS verify contracts on Basescan

---

Need help? Check the main [README.md](./README.md) or [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)!

