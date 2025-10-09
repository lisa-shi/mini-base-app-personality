// Deploy script for CryptoPersonalityQuiz contract
// Run: npx hardhat run scripts/deploy.js --network baseSepolia

const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of CryptoPersonalityQuiz...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contract with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Get the contract factory
  const CryptoPersonalityQuiz = await hre.ethers.getContractFactory("CryptoPersonalityQuiz");
  
  // Deploy the contract
  console.log("⏳ Deploying contract...");
  const contract = await CryptoPersonalityQuiz.deploy();
  
  // Wait for deployment to finish
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  
  console.log("\n✅ CryptoPersonalityQuiz deployed successfully!");
  console.log("📍 Contract address:", address);
  
  console.log("\n📋 Next steps:");
  console.log("1. Update your .env file with:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  console.log("\n2. Update lib/contractConfig.ts with the contract address");
  console.log("\n3. Verify the contract (optional but recommended):");
  console.log(`   npx hardhat verify --network baseSepolia ${address}`);
  console.log("\n4. View your contract on Basescan:");
  const network = hre.network.name;
  if (network === "baseSepolia") {
    console.log(`   https://sepolia.basescan.org/address/${address}`);
  } else if (network === "base") {
    console.log(`   https://basescan.org/address/${address}`);
  }
  
  console.log("\n🎉 Deployment complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

