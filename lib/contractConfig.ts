// Contract configuration
// After deploying your contract, update this address
export const CONTRACT_ADDRESS = "0x850eb63dE7F69e485F4163A46c3484c8D43ef355"; // Deployed to Base Sepolia

// Contract ABI - simplified version for the key functions we'll use
export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "enum CryptoPersonalityQuiz.Personality", "name": "personality", "type": "uint8" },
      { "internalType": "uint256", "name": "bitcoinScore", "type": "uint256" },
      { "internalType": "uint256", "name": "ethereumScore", "type": "uint256" },
      { "internalType": "uint256", "name": "solanaScore", "type": "uint256" },
      { "internalType": "uint256", "name": "dogecoinScore", "type": "uint256" }
    ],
    "name": "storeQuizResult",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "enum CryptoPersonalityQuiz.Personality", "name": "personality", "type": "uint8" },
      { "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "mintPersonalityNFT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
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
  },
  {
    "inputs": [],
    "name": "getLeaderboardData",
    "outputs": [
      { "internalType": "uint256", "name": "bitcoinCount", "type": "uint256" },
      { "internalType": "uint256", "name": "ethereumCount", "type": "uint256" },
      { "internalType": "uint256", "name": "solanaCount", "type": "uint256" },
      { "internalType": "uint256", "name": "dogecoinCount", "type": "uint256" },
      { "internalType": "uint256", "name": "total", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPersonalityCounts",
    "outputs": [
      { "internalType": "uint256[4]", "name": "", "type": "uint256[4]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalQuizCompletions",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Personality enum mapping (matches Solidity enum)
export enum PersonalityEnum {
  Bitcoin = 0,
  Ethereum = 1,
  Solana = 2,
  Dogecoin = 3,
}

// NFT Metadata URIs (you can host these on IPFS or a server)
export const NFT_METADATA_URIS = {
  Bitcoin: "ipfs://YOUR_BITCOIN_METADATA_CID",
  Ethereum: "ipfs://YOUR_ETHEREUM_METADATA_CID",
  Solana: "ipfs://YOUR_SOLANA_METADATA_CID",
  Dogecoin: "ipfs://YOUR_DOGECOIN_METADATA_CID",
};

