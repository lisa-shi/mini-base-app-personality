/**
 * Contract Event Monitor
 * 
 * This script monitors the contract for QuizCompleted and NFTMinted events in real-time
 * Run with: node scripts/monitor-events.js
 */

const ethers = require("ethers");

const CONTRACT_ADDRESS = "0x850eb63dE7F69e485F4163A46c3484c8D43ef355";
const BASE_SEPOLIA_RPC = "https://sepolia.base.org";

const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "enum CryptoPersonalityQuiz.Personality", "name": "personality", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "QuizCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "enum CryptoPersonalityQuiz.Personality", "name": "personality", "type": "uint8" }
    ],
    "name": "PersonalityNFTMinted",
    "type": "event"
  }
];

const PERSONALITY_NAMES = ["Bitcoin", "Ethereum", "Solana", "Dogecoin"];

async function monitorEvents() {
  console.log("🎧 Contract Event Monitor");
  console.log("================================\n");
  console.log(`📝 Contract: ${CONTRACT_ADDRESS}`);
  console.log(`🌐 Network: Base Sepolia`);
  console.log(`🔗 Explorer: https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}`);
  console.log("\n⏳ Listening for events... (Press Ctrl+C to stop)\n");

  // Connect to Base Sepolia
  const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  // Listen for QuizCompleted events
  contract.on("QuizCompleted", (user, personality, timestamp, event) => {
    const personalityName = PERSONALITY_NAMES[personality];
    const date = new Date(Number(timestamp) * 1000);
    
    console.log("🎯 Quiz Completed!");
    console.log(`   User: ${user}`);
    console.log(`   Personality: ${personalityName}`);
    console.log(`   Time: ${date.toLocaleString()}`);
    console.log(`   Tx: https://sepolia.basescan.org/tx/${event.log.transactionHash}`);
    console.log("");
  });

  // Listen for PersonalityNFTMinted events
  contract.on("PersonalityNFTMinted", (user, tokenId, personality, event) => {
    const personalityName = PERSONALITY_NAMES[personality];
    
    console.log("🎨 NFT Minted!");
    console.log(`   User: ${user}`);
    console.log(`   Token ID: ${tokenId.toString()}`);
    console.log(`   Personality: ${personalityName}`);
    console.log(`   Tx: https://sepolia.basescan.org/tx/${event.log.transactionHash}`);
    console.log("");
  });

  // Also fetch recent past events
  console.log("📜 Fetching recent events (last 100 blocks)...\n");
  
  const currentBlock = await provider.getBlockNumber();
  const fromBlock = currentBlock - 100;

  try {
    // Get recent QuizCompleted events
    const quizFilter = contract.filters.QuizCompleted();
    const quizEvents = await contract.queryFilter(quizFilter, fromBlock, currentBlock);
    
    if (quizEvents.length > 0) {
      console.log(`Found ${quizEvents.length} recent quiz completion(s):`);
      for (const event of quizEvents) {
        const personalityName = PERSONALITY_NAMES[event.args.personality];
        const date = new Date(Number(event.args.timestamp) * 1000);
        console.log(`  - ${personalityName} by ${event.args.user.slice(0, 10)}... at ${date.toLocaleString()}`);
      }
      console.log("");
    } else {
      console.log("No recent quiz completions found.\n");
    }

    // Get recent PersonalityNFTMinted events
    const nftFilter = contract.filters.PersonalityNFTMinted();
    const nftEvents = await contract.queryFilter(nftFilter, fromBlock, currentBlock);
    
    if (nftEvents.length > 0) {
      console.log(`Found ${nftEvents.length} recent NFT mint(s):`);
      for (const event of nftEvents) {
        const personalityName = PERSONALITY_NAMES[event.args.personality];
        console.log(`  - Token #${event.args.tokenId.toString()} (${personalityName}) minted by ${event.args.user.slice(0, 10)}...`);
      }
      console.log("");
    } else {
      console.log("No recent NFT mints found.\n");
    }
  } catch (error) {
    console.log("⚠️  Could not fetch past events:", error.message);
    console.log("");
  }

  console.log("✅ Now monitoring for new events in real-time...\n");
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log("\n\n👋 Stopping event monitor...");
  process.exit(0);
});

monitorEvents().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});


