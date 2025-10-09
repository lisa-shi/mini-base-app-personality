# 🚀 Quick Start Guide

Get your Crypto Personality Quiz running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Copy the example env file:

```bash
cp env.example .env.local
```

Edit `.env.local` and add your Coinbase API key:

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_URL=http://localhost:3000
```

Get your API key from: https://portal.cdp.coinbase.com/

## Step 3: Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Step 4: Try the Quiz! 🎉

1. The wallet should auto-connect via MiniKit
2. Click "Start Quiz"
3. Answer the 5 questions
4. See your crypto personality!
5. Click "Take Quiz Again" to try different answers

## What Works Now

✅ Beautiful quiz interface
✅ All 5 questions with scoring
✅ Results screen with personality breakdown
✅ Responsive design
✅ Smooth animations

## What Needs Contract Deployment

⏸️ Saving results onchain (requires contract deployment)
⏸️ Minting NFTs (requires contract deployment)

## Next Steps

### To Enable Onchain Features:

1. **Install Hardhat** (for contract deployment):
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv
   ```

2. **Initialize Hardhat**:
   ```bash
   npx hardhat init
   ```
   Choose "Create a JavaScript project"

3. **Get Base Sepolia ETH**:
   - Go to https://faucet.quicknode.com/base/sepolia
   - Connect your wallet and get free testnet ETH

4. **Deploy Contract**:
   ```bash
   # Add your wallet private key to .env.local
   PRIVATE_KEY=your_private_key_here
   
   # Deploy to Base Sepolia testnet
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```

5. **Update Contract Address**:
   - Copy the deployed contract address
   - Update `lib/contractConfig.ts` with the address

6. **Enable Contract Features**:
   - In `app/page.tsx`, uncomment the contract integration lines
   - Look for comments starting with "// Uncomment"

7. **Upload NFT Metadata**:
   - See `nft-metadata/README.md` for instructions
   - Upload images and metadata to IPFS
   - Update `lib/contractConfig.ts` with IPFS CIDs

### To Deploy to Production:

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions on:
- Deploying to Vercel
- Publishing to Base app
- Setting up the Farcaster manifest

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Wallet not connecting
- Make sure you're using the app in a compatible environment (Base app or Farcaster)
- Check browser console for errors

### Questions not appearing
- Check that all imports are correct
- Look at browser console for errors
- Make sure dev server is running on port 3000

### Styling looks broken
- Clear browser cache
- Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check that CSS modules are loading

## Project Structure

```
📦 mini-base-app-personality
├── 📁 app/                    # Next.js app
│   ├── page.tsx              # Main quiz component ⭐
│   ├── page.module.css       # Quiz styling 🎨
│   └── layout.tsx            # App layout
├── 📁 contracts/             # Smart contracts
│   └── CryptoPersonalityQuiz.sol
├── 📁 lib/                   # Utilities
│   ├── contractConfig.ts     # Contract configuration
│   └── useQuizContract.ts    # React hooks
├── 📁 nft-metadata/          # NFT metadata files
├── 📁 public/                # Static assets
└── 📁 scripts/               # Deployment scripts
```

## Need Help?

1. Check the [README.md](./README.md) for full documentation
2. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment help
3. Check `nft-metadata/README.md` for NFT setup

## What's Next?

Once you have the basic app running:

1. ✏️ Customize the questions in `app/page.tsx`
2. 🎨 Modify colors and styling in `app/page.module.css`
3. 🖼️ Create custom NFT images
4. ⛓️ Deploy your smart contract
5. 🚀 Deploy to Vercel and publish to Base app!

---

**Ready to find your crypto personality? Let's go! 🌟**

