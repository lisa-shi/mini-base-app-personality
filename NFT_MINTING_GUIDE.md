# 🎨 NFT Minting Setup Guide

## Overview

Your NFT minting functionality is already built! Users can mint a personality NFT after completing the quiz. You just need to set up the NFT metadata and images.

## What's Already Implemented ✅

- ✅ Smart contract with ERC-721 NFT minting (`mintPersonalityNFT` function)
- ✅ Frontend "Mint NFT" button on results page
- ✅ Minting logic in `handleMintNFT` function
- ✅ Loading states and success messages
- ✅ 4 placeholder SVG images in `public/` folder

## What You Need to Do

### Step 1: Create NFT Metadata Files

NFT metadata follows the OpenSea standard. You already have examples in `nft-metadata/` folder!

**Each JSON file should look like this:**

```json
{
  "name": "Bitcoin Personality NFT",
  "description": "You are Bitcoin: The Pioneer. Reliable, steady, and a true trailblazer.",
  "image": "ipfs://YOUR_IMAGE_CID_HERE",
  "attributes": [
    {
      "trait_type": "Personality Type",
      "value": "Bitcoin"
    },
    {
      "trait_type": "Best Skill",
      "value": "HODLing through market dips"
    },
    {
      "trait_type": "Favorite Activity",
      "value": "Reading whitepapers"
    },
    {
      "trait_type": "Animal Bestie",
      "value": "Wise old turtle"
    },
    {
      "trait_type": "Rarity",
      "value": "Pioneer"
    }
  ]
}
```

### Step 2: Prepare Your NFT Images

You have two options:

#### Option A: Use Your Existing Avatars (Quick!)
Use the avatars you already added:
- `/public/bitcoin.png`
- `/public/eth.png`
- `/public/solana.png`
- `/public/dogecoin.png`

#### Option B: Create Custom NFT Images
Create unique NFT designs (recommended 1000x1000px or larger):
- Square format works best
- PNG with transparent background looks professional
- Can use tools like Canva, Figma, or Midjourney

### Step 3: Upload to IPFS

**Option A: Using NFT.Storage (Free & Easy)**

1. Go to https://nft.storage/
2. Sign up for a free account
3. Click "Upload" → "File"

**Upload Images First:**
```
1. Upload bitcoin.png → Get CID like: QmX1Y2Z3...
2. Upload eth.png → Get CID
3. Upload solana.png → Get CID
4. Upload dogecoin.png → Get CID
```

**Update metadata JSON files with image CIDs:**
```json
{
  "name": "Bitcoin Personality NFT",
  "image": "ipfs://QmX1Y2Z3...",  // ← Your actual CID here
  ...
}
```

**Upload Metadata JSON Files:**
```
1. Upload bitcoin.json → Get CID: QmA1B2C3...
2. Upload ethereum.json → Get CID
3. Upload solana.json → Get CID
4. Upload dogecoin.json → Get CID
```

**Option B: Using Pinata (Alternative)**

1. Go to https://pinata.cloud/
2. Sign up for free account
3. Same process: Upload images, then metadata

### Step 4: Update Your Config

Update `lib/contractConfig.ts` with your IPFS CIDs:

```typescript
export const NFT_METADATA_URIS = {
  Bitcoin: "ipfs://QmA1B2C3...",      // Your Bitcoin metadata CID
  Ethereum: "ipfs://QmD4E5F6...",     // Your Ethereum metadata CID
  Solana: "ipfs://QmG7H8I9...",       // Your Solana metadata CID
  Dogecoin: "ipfs://QmJ0K1L2...",     // Your Dogecoin metadata CID
};
```

### Step 5: Deploy/Redeploy Contract

If you haven't deployed yet or need to redeploy:

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network baseSepolia
```

Update the contract address in `lib/contractConfig.ts`.

### Step 6: Commit and Deploy

```bash
git add lib/contractConfig.ts
git commit -m "Add NFT metadata URIs"
git push origin main
```

Vercel will auto-deploy! ✨

## Testing Your NFTs

1. **Take the quiz** on your deployed app
2. **Click "Mint NFT 🎨"** on the results page
3. **Approve the transaction** in your wallet
4. **Wait for confirmation** (usually 10-30 seconds)
5. **Check your wallet!**
   - Open MetaMask/Coinbase Wallet
   - Go to NFT section
   - Your personality NFT should appear!

## Viewing on OpenSea

After minting, view on OpenSea Testnet:

```
https://testnets.opensea.io/assets/base-sepolia/YOUR_CONTRACT_ADDRESS/TOKEN_ID
```

Replace:
- `YOUR_CONTRACT_ADDRESS` with your deployed contract
- `TOKEN_ID` starts at 1 (first mint), 2 (second mint), etc.

## Quick Start (Easiest Way)

**Want to test quickly? Use a hosted metadata URL:**

Instead of IPFS, you can temporarily use:

```typescript
export const NFT_METADATA_URIS = {
  Bitcoin: "https://yourapp.vercel.app/metadata/bitcoin.json",
  Ethereum: "https://yourapp.vercel.app/metadata/ethereum.json",
  Solana: "https://yourapp.vercel.app/metadata/solana.json",
  Dogecoin: "https://yourapp.vercel.app/metadata/dogecoin.json",
};
```

Then create a `public/metadata/` folder with your JSON files.

**Pros:** Easy to test and update  
**Cons:** Not decentralized (use IPFS for production)

## Example Metadata Files

### Bitcoin NFT (bitcoin.json)

```json
{
  "name": "Bitcoin Pioneer #1",
  "description": "You are Bitcoin: The Pioneer. Reliable, steady, and a true trailblazer. You value security, stability, and long-term growth.",
  "image": "ipfs://YOUR_IMAGE_CID",
  "external_url": "https://mini-base-app-personality.vercel.app",
  "attributes": [
    {
      "trait_type": "Personality",
      "value": "Bitcoin"
    },
    {
      "trait_type": "Archetype",
      "value": "Pioneer"
    },
    {
      "trait_type": "Best Skill",
      "value": "HODLing through market dips"
    },
    {
      "trait_type": "Spirit Animal",
      "value": "Wise Turtle"
    },
    {
      "trait_type": "Vibe",
      "value": "Steady & Reliable"
    }
  ]
}
```

### Ethereum NFT (ethereum.json)

```json
{
  "name": "Ethereum Innovator #1",
  "description": "You are Ethereum: The Innovator. Creative, adaptable, and always looking for the next big thing.",
  "image": "ipfs://YOUR_IMAGE_CID",
  "external_url": "https://mini-base-app-personality.vercel.app",
  "attributes": [
    {
      "trait_type": "Personality",
      "value": "Ethereum"
    },
    {
      "trait_type": "Archetype",
      "value": "Innovator"
    },
    {
      "trait_type": "Best Skill",
      "value": "Deploying smart contracts"
    },
    {
      "trait_type": "Spirit Animal",
      "value": "Curious Octopus"
    },
    {
      "trait_type": "Vibe",
      "value": "Creative & Dynamic"
    }
  ]
}
```

## Cost

**Gas Fees:**
- Minting costs ~$0.50-$2 in testnet ETH
- Make sure users have Base Sepolia ETH

**IPFS Storage:**
- NFT.Storage: FREE forever
- Pinata: FREE tier (1GB)

## Troubleshooting

### "Transaction Failed"
- Check user has enough Base Sepolia ETH
- Verify contract is deployed correctly
- Check metadata URIs are valid

### "NFT Not Showing in Wallet"
- Some wallets take 5-10 minutes to index
- Try refreshing or importing the NFT manually
- Use contract address + token ID

### "Image Not Loading"
- Verify IPFS CID is correct
- Check metadata JSON has correct image URL
- Try accessing `ipfs://YOUR_CID` directly in browser

### "Metadata Not Updating on OpenSea"
- OpenSea caches metadata for 24 hours
- Use "Refresh Metadata" button on OpenSea
- Or wait for cache to expire

## Pro Tips

1. **Add Rarity Traits**: Make some attributes more common than others
2. **Dynamic Metadata**: Update metadata based on score ranges
3. **Edition Numbers**: Add "#1", "#2" to names for collectibility
4. **High-Res Images**: Use at least 1000x1000px for quality
5. **Test First**: Mint on testnet before mainnet launch

## Next Steps

Once NFT minting works:
- 🎯 Add rarity tiers (rare personalities get special traits)
- 🏆 Display NFT gallery on your site
- 📱 Share NFT on social media integration
- 🎁 Special rewards for NFT holders
- 🔄 Allow re-minting if they retake quiz

## Need Help?

Check these files:
- `contracts/CryptoPersonalityQuiz.sol` - NFT minting logic
- `lib/useQuizContract.ts` - Minting hook
- `lib/contractConfig.ts` - Metadata URIs
- `nft-metadata/` - Example metadata files
- `public/nft-*.svg` - Placeholder NFT images

Your NFT minting is ready to go! Just add the metadata and you're live! 🚀

