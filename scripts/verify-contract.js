/**
 * Contract Verification Script
 * 
 * This script helps verify that the contract is deployed and working correctly
 * Run with: node scripts/verify-contract.js [USER_ADDRESS]
 */

const ethers = require("ethers");

const CONTRACT_ADDRESS = "0x850eb63dE7F69e485F4163A46c3484c8D43ef355";
const BASE_SEPOLIA_RPC = "https://sepolia.base.org";

const CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserResults",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "user", "type": "address" },
          { "internalType": "enum CryptoPersonalityQuiz.Personality", "name": "personality", "type": "uint8" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "uint256", "name": "bitcoinScore", "type": "uint256" },
          { "internalType": "uint256", "name": "ethereumScore", "type": "uint256" },
          { "internalType": "uint256", "name": "solanaScore", "type": "uint256" },
          { "internalType": "uint256", "name": "dogecoinScore", "type": "uint256" }
        ],
        "internalType": "struct CryptoPersonalityQuiz.QuizResult[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalNFTsMinted",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getLatestResult",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "user", "type": "address" },
          { "internalType": "enum CryptoPersonalityQuiz.Personality", "name": "personality", "type": "uint8" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "uint256", "name": "bitcoinScore", "type": "uint256" },
          { "internalType": "uint256", "name": "ethereumScore", "type": "uint256" },
          { "internalType": "uint256", "name": "solanaScore", "type": "uint256" },
          { "internalType": "uint256", "name": "dogecoinScore", "type": "uint256" }
        ],
        "internalType": "struct CryptoPersonalityQuiz.QuizResult",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const PERSONALITY_NAMES = ["Bitcoin", "Ethereum", "Solana", "Dogecoin"];

async function main() {
  const userAddress = process.argv[2];
  
  console.log("🔍 Contract Verification Script");
  console.log("================================\n");
  console.log(`📝 Contract Address: ${CONTRACT_ADDRESS}`);
  console.log(`🌐 Network: Base Sepolia`);
  console.log(`🔗 Explorer: https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}\n`);

  // Connect to Base Sepolia
  const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  try {
    // Check contract exists
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === "0x") {
      console.error("❌ Contract not found at this address!");
      return;
    }
    console.log("✅ Contract found and deployed\n");

    // Get total NFTs minted
    const totalNFTs = await contract.getTotalNFTsMinted();
    console.log(`🎨 Total NFTs Minted: ${totalNFTs.toString()}\n`);

    // If user address provided, get their results
    if (userAddress) {
      console.log(`👤 Checking results for: ${userAddress}\n`);
      
      try {
        // Get all results
        const results = await contract.getUserResults(userAddress);
        console.log(`📊 Total Quiz Attempts: ${results.length}`);
        
        if (results.length > 0) {
          console.log("\n📋 Quiz History:");
          console.log("─────────────────────────────────────────────────\n");
          
          results.forEach((result, index) => {
            const personality = PERSONALITY_NAMES[result.personality];
            const timestamp = new Date(Number(result.timestamp) * 1000);
            
            console.log(`Attempt ${index + 1}:`);
            console.log(`  🎯 Personality: ${personality}`);
            console.log(`  📅 Date: ${timestamp.toLocaleString()}`);
            console.log(`  💯 Scores:`);
            console.log(`     Bitcoin: ${result.bitcoinScore}`);
            console.log(`     Ethereum: ${result.ethereumScore}`);
            console.log(`     Solana: ${result.solanaScore}`);
            console.log(`     Dogecoin: ${result.dogecoinScore}`);
            console.log("");
          });

          // Get latest result
          const latest = await contract.getLatestResult(userAddress);
          const latestPersonality = PERSONALITY_NAMES[latest.personality];
          console.log(`\n🌟 Latest Result: ${latestPersonality}`);
        } else {
          console.log("\n⚠️  No quiz results found for this address");
          console.log("    This user hasn't completed the quiz yet.");
        }
      } catch (error) {
        if (error.message.includes("No results found")) {
          console.log("⚠️  No quiz results found for this address");
          console.log("    This user hasn't completed the quiz yet.");
        } else {
          throw error;
        }
      }
    } else {
      console.log("💡 Usage: node scripts/verify-contract.js [USER_ADDRESS]");
      console.log("   Provide a user address to check their quiz results");
    }

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.code) {
      console.error(`   Code: ${error.code}`);
    }
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});


