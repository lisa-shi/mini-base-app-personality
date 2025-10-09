// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CryptoPersonalityQuiz
 * @dev Store quiz results onchain and mint personality NFTs
 */
contract CryptoPersonalityQuiz is ERC721, Ownable {
    uint256 private _tokenIds;

    // Personality types
    enum Personality { Bitcoin, Ethereum, Solana, Dogecoin }

    // Quiz result structure
    struct QuizResult {
        address user;
        Personality personality;
        uint256 timestamp;
        uint256 bitcoinScore;
        uint256 ethereumScore;
        uint256 solanaScore;
        uint256 dogecoinScore;
    }

    // Mapping from user address to their quiz results
    mapping(address => QuizResult[]) public userResults;
    
    // Mapping from token ID to personality type
    mapping(uint256 => Personality) public tokenPersonality;
    
    // Mapping from token ID to metadata URI
    mapping(uint256 => string) private _tokenURIs;
    
    // Counter for each personality type
    mapping(Personality => uint256) public personalityCount;
    
    // Total number of quiz completions
    uint256 public totalQuizCompletions;

    // Events
    event QuizCompleted(address indexed user, Personality personality, uint256 timestamp);
    event PersonalityNFTMinted(address indexed user, uint256 indexed tokenId, Personality personality);

    constructor() ERC721("Crypto Personality NFT", "CPNFT") Ownable(msg.sender) {}

    /**
     * @dev Store a quiz result onchain
     */
    function storeQuizResult(
        Personality personality,
        uint256 bitcoinScore,
        uint256 ethereumScore,
        uint256 solanaScore,
        uint256 dogecoinScore
    ) external {
        QuizResult memory result = QuizResult({
            user: msg.sender,
            personality: personality,
            timestamp: block.timestamp,
            bitcoinScore: bitcoinScore,
            ethereumScore: ethereumScore,
            solanaScore: solanaScore,
            dogecoinScore: dogecoinScore
        });

        userResults[msg.sender].push(result);
        
        // Increment personality counter
        personalityCount[personality]++;
        totalQuizCompletions++;
        
        emit QuizCompleted(msg.sender, personality, block.timestamp);
    }

    /**
     * @dev Mint a personality NFT based on quiz result
     */
    function mintPersonalityNFT(Personality personality, string memory tokenURI) external returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        tokenPersonality[newTokenId] = personality;
        _tokenURIs[newTokenId] = tokenURI;

        emit PersonalityNFTMinted(msg.sender, newTokenId, personality);
        return newTokenId;
    }

    /**
     * @dev Get all quiz results for a user
     */
    function getUserResults(address user) external view returns (QuizResult[] memory) {
        return userResults[user];
    }

    /**
     * @dev Get the latest quiz result for a user
     */
    function getLatestResult(address user) external view returns (QuizResult memory) {
        require(userResults[user].length > 0, "No results found for user");
        return userResults[user][userResults[user].length - 1];
    }

    /**
     * @dev Get personality name as string
     */
    function getPersonalityName(Personality personality) public pure returns (string memory) {
        if (personality == Personality.Bitcoin) return "Bitcoin";
        if (personality == Personality.Ethereum) return "Ethereum";
        if (personality == Personality.Solana) return "Solana";
        if (personality == Personality.Dogecoin) return "Dogecoin";
        return "Unknown";
    }

    /**
     * @dev Get token URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Get total number of quiz results stored
     */
    function getTotalResults() external view returns (uint256) {
        uint256 total = 0;
        // Note: This is gas-intensive for large datasets
        // Consider using events for analytics instead
        return total;
    }

    /**
     * @dev Get total NFTs minted
     */
    function getTotalNFTsMinted() external view returns (uint256) {
        return _tokenIds;
    }
    
    /**
     * @dev Get count for a specific personality type
     */
    function getPersonalityCount(Personality personality) external view returns (uint256) {
        return personalityCount[personality];
    }
    
    /**
     * @dev Get all personality counts as an array [Bitcoin, Ethereum, Solana, Dogecoin]
     */
    function getAllPersonalityCounts() external view returns (uint256[4] memory) {
        return [
            personalityCount[Personality.Bitcoin],
            personalityCount[Personality.Ethereum],
            personalityCount[Personality.Solana],
            personalityCount[Personality.Dogecoin]
        ];
    }
    
    /**
     * @dev Get leaderboard data with percentages
     * Returns counts and total for client-side percentage calculation
     */
    function getLeaderboardData() external view returns (
        uint256 bitcoinCount,
        uint256 ethereumCount,
        uint256 solanaCount,
        uint256 dogecoinCount,
        uint256 total
    ) {
        return (
            personalityCount[Personality.Bitcoin],
            personalityCount[Personality.Ethereum],
            personalityCount[Personality.Solana],
            personalityCount[Personality.Dogecoin],
            totalQuizCompletions
        );
    }
}

