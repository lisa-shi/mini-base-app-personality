# Crypto Personality Quiz - Deployment Guide

This guide will walk you through deploying the smart contract and integrating it with the frontend.

## Prerequisites

- Node.js 18+ installed
- MetaMask or another Web3 wallet
- Some Base Sepolia or Base Mainnet ETH for gas fees
- Basic knowledge of Solidity and Web3

## Step 1: Install Dependencies

```bash
npm install
```

For smart contract deployment, you'll also need:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
```

## Step 2: Set Up Hardhat (if not already set up)

Initialize Hardhat in your project:

```bash
npx hardhat init
```

Choose "Create a TypeScript project" and follow the prompts.

## Step 3: Configure Hardhat for Base Network

Create or update `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84532,
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 8453,
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY || "",
      base: process.env.BASESCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
    ],
  },
};

export default config;
```

## Step 4: Create Environment Variables

Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_wallet_private_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
NEXT_PUBLIC_CONTRACT_ADDRESS=will_fill_after_deployment
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key_here
```

⚠️ **IMPORTANT**: Never commit your `.env` file to git!

## Step 5: Deploy the Smart Contract

Create a deployment script at `scripts/deploy.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying CryptoPersonalityQuiz contract...");

  const CryptoPersonalityQuiz = await ethers.getContractFactory("CryptoPersonalityQuiz");
  const contract = await CryptoPersonalityQuiz.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`CryptoPersonalityQuiz deployed to: ${address}`);
  console.log(`\nUpdate your .env file with:`);
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Deploy to Base Sepolia (testnet):

```bash
npx hardhat run scripts/deploy.ts --network baseSepolia
```

Or deploy to Base Mainnet:

```bash
npx hardhat run scripts/deploy.ts --network base
```

## Step 6: Verify the Contract (Optional but Recommended)

```bash
npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS
```

## Step 7: Prepare NFT Metadata

Create JSON metadata files for each personality and upload them to IPFS:

### Option A: Using Pinata (Recommended)

1. Go to [Pinata.cloud](https://pinata.cloud) and create a free account
2. Upload the metadata JSON files from the `nft-metadata/` folder
3. Copy the IPFS CIDs for each file
4. Update `lib/contractConfig.ts` with the CIDs

### Option B: Using NFT.Storage

1. Go to [NFT.Storage](https://nft.storage) and create a free account
2. Upload your metadata files
3. Get the CIDs and update the config

## Step 8: Update Contract Configuration

Update `lib/contractConfig.ts`:

```typescript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export const NFT_METADATA_URIS = {
  Bitcoin: "ipfs://YOUR_BITCOIN_METADATA_CID",
  Ethereum: "ipfs://YOUR_ETHEREUM_METADATA_CID",
  Solana: "ipfs://YOUR_SOLANA_METADATA_CID",
  Dogecoin: "ipfs://YOUR_DOGECOIN_METADATA_CID",
};
```

## Step 9: Enable Contract Integration in Frontend

In `app/page.tsx`, uncomment the following lines:

```typescript
// Uncomment this:
import { useQuizContract } from "../lib/useQuizContract";

// And this:
const { storeQuizResult, mintPersonalityNFT, isPending, isConfirmed } = useQuizContract();

// And enable the onchain functionality:
// In handleAnswer, uncomment:
handleSaveResultOnchain(finalResult, newScores);

// In handleMintNFT, uncomment:
await mintPersonalityNFT(result);
```

## Step 10: Run the Application

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

## Step 11: Test Everything

1. Connect your wallet (should auto-connect in MiniKit)
2. Complete the quiz
3. Verify the result is saved onchain (check the transaction on Basescan)
4. Try minting an NFT
5. Check your wallet to see the NFT

## Troubleshooting

### Contract Interaction Fails

- Make sure you have enough Base ETH for gas fees
- Verify the contract address is correct
- Check that the wallet is connected

### NFT Images Don't Show

- Verify the IPFS CIDs are correct
- Make sure the metadata JSON is properly formatted
- Try accessing the IPFS URLs directly to test

### Wallet Connection Issues

- Clear browser cache and cookies
- Try a different wallet
- Check console for error messages

## Cost Estimates

- Contract deployment: ~0.001-0.005 ETH
- Storing quiz result: ~0.0001-0.0003 ETH per submission
- Minting NFT: ~0.0002-0.0005 ETH per mint

## Security Considerations

1. Never share your private key
2. Test thoroughly on testnet before mainnet deployment
3. Consider adding rate limiting to prevent spam
4. Implement proper access controls if needed
5. Consider auditing the contract for production use

## Support

For issues or questions:
- Check the Base documentation: https://docs.base.org
- OnchainKit docs: https://onchainkit.xyz
- Hardhat docs: https://hardhat.org

---

Congratulations! Your Crypto Personality Quiz is now fully deployed and functional! 🎉

