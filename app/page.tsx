"use client";
import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount, useConnect } from "wagmi";
import styles from "./page.module.css";
import { useQuizContract } from "../lib/useQuizContract";
import { useLeaderboard } from "../lib/useLeaderboard";
import { CONTRACT_ADDRESS } from "../lib/contractConfig";

// Declare window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: Array<any> }) => Promise<any>;
    };
  }
}

type Personality = "Bitcoin" | "Ethereum" | "Solana" | "Dogecoin";

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    personality: Personality;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "You've just discovered a mysterious portal to the crypto universe. What's the first thing you do?",
    options: [
      { text: "Carefully study the portal, read all the instructions, and make a plan.", personality: "Bitcoin" },
      { text: "Jump in immediately—adventure awaits!", personality: "Solana" },
      { text: "Call your friends to see if they've heard about it and ask for advice.", personality: "Ethereum" },
      { text: "Take a selfie with the portal and post it online before stepping through.", personality: "Dogecoin" },
    ],
  },
  {
    id: 2,
    question: "As you step through the portal, you find yourself in a bustling crypto marketplace. What catches your eye first?",
    options: [
      { text: "A booth offering a secure vault for long-term investments.", personality: "Bitcoin" },
      { text: "A fast-paced auction where people are flipping NFTs for huge profits.", personality: "Solana" },
      { text: "A group of people collaborating on a cutting-edge DeFi project.", personality: "Ethereum" },
      { text: "A crowd gathered around a booth giving away free tokens and memes.", personality: "Dogecoin" },
    ],
  },
  {
    id: 3,
    question: "You're approached by a guide who offers to help you navigate the marketplace. What kind of guide do you choose?",
    options: [
      { text: "A wise and experienced mentor who knows the history of the crypto world.", personality: "Bitcoin" },
      { text: "A daring adventurer who's always chasing the next big thing.", personality: "Solana" },
      { text: "A tech-savvy innovator who's building the future of blockchain.", personality: "Ethereum" },
      { text: "A fun and friendly mascot who makes everything feel lighthearted.", personality: "Dogecoin" },
    ],
  },
  {
    id: 4,
    question: "The guide takes you to a treasure chest filled with crypto opportunities. How do you decide what to take?",
    options: [
      { text: "Choose the most stable and reliable treasure—it's a long-term investment.", personality: "Bitcoin" },
      { text: "Grab the rarest and most valuable item before anyone else can.", personality: "Solana" },
      { text: "Pick something that can be used to build or create something new.", personality: "Ethereum" },
      { text: "Take the item that looks the most fun and exciting, even if it's not the most valuable.", personality: "Dogecoin" },
    ],
  },
  {
    id: 5,
    question: "As you leave the marketplace, you're invited to join a crypto community. What kind of group do you join?",
    options: [
      { text: "A group of seasoned investors who share tips on long-term strategies.", personality: "Bitcoin" },
      { text: "A fast-paced trading group that's always on the hunt for the next big win.", personality: "Solana" },
      { text: "A collaborative team working on innovative blockchain projects.", personality: "Ethereum" },
      { text: "A fun and welcoming community that loves sharing memes and good vibes.", personality: "Dogecoin" },
    ],
  },
];

const personalityResults = {
  Bitcoin: {
    title: "Bitcoin: The Pioneer 🟠",
    description: "You're reliable, steady, and a true trailblazer. You value security, stability, and long-term growth. People look up to you as a leader and trust your judgment.",
    traits: {
      bestSkill: "HODLing through market dips 💎",
      favoriteActivity: "Reading whitepapers and staying informed 📚",
      animalBestie: "A wise old turtle 🐢",
      nightmareFuel: "Losing your cold wallet seed phrase 😱"
    },
    pickupLine: "I don't chase pumps, but for you? I'd HODL forever. 💰",
    emoji: "₿",
    avatar: "/bitcoin.png",
    gradient: "linear-gradient(135deg, #f7931a 0%, #ffa940 100%)",
  },
  Ethereum: {
    title: "Ethereum: The Innovator 🟣",
    description: "You're creative, adaptable, and always looking for the next big thing. You thrive in dynamic environments and love building or experimenting with new ideas.",
    traits: {
      bestSkill: "Deploying smart contracts like a pro 🔧",
      favoriteActivity: "Exploring DeFi protocols and NFT marketplaces 🎨",
      animalBestie: "A curious octopus 🐙",
      nightmareFuel: "Gas fees during a bull run 💸"
    },
    pickupLine: "Are you gas fees? Because you take my breath away... but you're worth it. 💜",
    emoji: "⟠",
    avatar: "/eth.png",
    gradient: "linear-gradient(135deg, #627eea 0%, #8c9eff 100%)",
  },
  Solana: {
    title: "Solana: The Speedster 🟢",
    description: "You're fast, efficient, and always on the move. You love solving problems quickly and thrive in high-energy environments.",
    traits: {
      bestSkill: "Sniping NFTs before anyone else ⚡",
      favoriteActivity: "Participating in fast-paced DeFi trading 📈",
      animalBestie: "A sleek cheetah 🐆",
      nightmareFuel: "Network congestion during a mint 🚦"
    },
    pickupLine: "They say I'm fast... but I'll slow down for you. 65,000 TPS of pure romance. 🚀",
    emoji: "◎",
    avatar: "/solana.png",
    gradient: "linear-gradient(135deg, #14f195 0%, #9945ff 100%)",
  },
  Dogecoin: {
    title: "Dogecoin: The Meme King/Queen 🐕",
    description: "You're fun, approachable, and the life of the party. You don't take things too seriously and love being part of a community.",
    traits: {
      bestSkill: "Making people laugh and spreading good vibes ✨",
      favoriteActivity: "Sharing memes and tipping others in DOGE 🎁",
      animalBestie: "A loyal Shiba Inu 🐕",
      nightmareFuel: "People who don't get the joke 😅"
    },
    pickupLine: "Much wow. Very date. Such romance. To the moon? Nah, straight to your heart. 🌙",
    emoji: "Ð",
    avatar: "/dogecoin.png",
    gradient: "linear-gradient(135deg, #c2a633 0%, #f0d460 100%)",
  },
};

export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { storeQuizResult, mintPersonalityNFT } = useQuizContract();
  const { leaderboardData, refetch: refetchLeaderboard } = useLeaderboard();
  
  const [gameState, setGameState] = useState<"welcome" | "quiz" | "result">("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<Personality, number>>({
    Bitcoin: 0,
    Ethereum: 0,
    Solana: 0,
    Dogecoin: 0,
  });
  const [result, setResult] = useState<Personality | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isMintingNFT, setIsMintingNFT] = useState(false);
  const [isSavingResult, setIsSavingResult] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const [isLocalDev, setIsLocalDev] = useState(false);
  const [isRefreshingLeaderboard, setIsRefreshingLeaderboard] = useState(false);

  useEffect(() => {
    // Check if we're in local development (not in MiniKit)
    const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    setIsLocalDev(isDev);
    
    console.log("🔍 Environment check:", {
      isLocalDev: isDev,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
      isFrameReady,
      walletAddress: address,
    });
    
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady, address]);
  
  // Monitor wallet connection and network
  useEffect(() => {
    if (address) {
      console.log("✅ Wallet connected:", address);
      
      // Check if we're on the correct network
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.request({ method: 'eth_chainId' }).then((chainId: string) => {
          const chainIdDecimal = parseInt(chainId, 16);
          console.log("🌐 Current network chain ID:", chainIdDecimal);
          
          if (chainIdDecimal !== 84532) {
            console.warn("⚠️ WRONG NETWORK! Please switch to Base Sepolia (Chain ID: 84532)");
            console.warn(`   Current network: ${chainIdDecimal === 8453 ? 'Base Mainnet' : `Chain ID ${chainIdDecimal}`}`);
            
            // Alert user to switch networks
            alert(`⚠️ WRONG NETWORK!\n\nYou're on ${chainIdDecimal === 8453 ? 'Base Mainnet' : `Chain ID ${chainIdDecimal}`}\n\nPlease switch to Base Sepolia (testnet) in your wallet.\n\nThe contract is deployed on Base Sepolia, NOT mainnet.`);
          } else {
            console.log("✅ Correct network: Base Sepolia");
          }
        }).catch((err: Error) => {
          console.error("Failed to check network:", err);
        });
      }
    } else {
      console.log("⚠️ Wallet not connected yet. Waiting for MiniKit auto-connect...");
    }
  }, [address]);
 
  const handleConnectWallet = async () => {
    // Connect wallet for web/local development (not MiniKit)
    if (connectors.length > 0) {
      console.log("🔗 Available connectors:", connectors.map(c => c.name));
      
      // Try to find MetaMask or Coinbase Wallet, otherwise use first available
      const preferredConnector = 
        connectors.find(c => c.name.toLowerCase().includes('metamask')) ||
        connectors.find(c => c.name.toLowerCase().includes('coinbase')) ||
        connectors.find(c => c.name.toLowerCase().includes('walletconnect')) ||
        connectors[0];
      
      console.log("🔗 Connecting with:", preferredConnector.name);
      console.log("🌐 Required network: Base Sepolia (Chain ID: 84532)");
      
      try {
        await connect({ 
          connector: preferredConnector,
          chainId: 84532, // Base Sepolia
        });
        
        console.log("✅ Wallet connection initiated. Please switch to Base Sepolia if prompted.");
      } catch (error) {
        console.error("❌ Connection failed:", error);
        if (error instanceof Error) {
          alert(`Failed to connect wallet: ${error.message}\n\nMake sure you approve the connection and switch to Base Sepolia network when prompted.`);
        }
      }
    } else {
      console.error("❌ No wallet connectors available");
      alert("No wallet connectors available. Please install a wallet extension like MetaMask or Coinbase Wallet.");
    }
  };

  const handleStartQuiz = () => {
    setGameState("quiz");
    setCurrentQuestion(0);
    setScores({ Bitcoin: 0, Ethereum: 0, Solana: 0, Dogecoin: 0 });
  };

  const handleAnswer = (personality: Personality, answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    setTimeout(() => {
      const newScores = { ...scores };
      newScores[personality]++;
      setScores(newScores);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Calculate result
        const finalResult = (Object.keys(newScores) as Personality[]).reduce((a, b) =>
          newScores[a] > newScores[b] ? a : b
        );
        setResult(finalResult);
        setGameState("result");
        
        // Automatically save result onchain
        // Don't await so UI loads immediately, errors will be caught in handleSaveResultOnchain
        handleSaveResultOnchain(finalResult, newScores).catch((err) => {
          console.error("Failed to save quiz result:", err);
        });
      }
    }, 600);
  };

  const handleSaveResultOnchain = async (personality: Personality, quizScores: Record<Personality, number>) => {
    if (!address) {
      console.error("❌ Cannot save result - wallet not connected");
      console.error("User must connect wallet to save results to blockchain");
      alert("⚠️ Wallet not connected!\n\nYou need to connect your wallet to save your quiz results on the blockchain.\n\nYou can still view your results, but they won't be stored permanently.");
      return;
    }
    
    try {
      setIsSavingResult(true);
      
      console.log("📝 Initiating quiz result save to blockchain:", {
        wallet: address,
        personality,
        scores: quizScores,
        timestamp: new Date().toISOString()
      });
      
      console.log("🔗 About to call storeQuizResult with contract:", CONTRACT_ADDRESS);
      
      // Store quiz result onchain
      const txHash = await storeQuizResult(personality, quizScores);
      
      console.log("✅ storeQuizResult returned successfully with hash:", txHash);
      
      console.log("✅ Quiz result transaction submitted!", {
        transactionHash: txHash,
        wallet: address,
        personality,
        scores: quizScores,
        explorer: `https://sepolia.basescan.org/tx/${txHash}`
      });
      
      setResultSaved(true);
      
      // Refresh leaderboard to show updated counts
      // Wait a moment for the transaction to be processed
      setIsRefreshingLeaderboard(true);
      setTimeout(async () => {
        console.log("🔄 Refreshing leaderboard data...");
        await refetchLeaderboard();
        setIsRefreshingLeaderboard(false);
        console.log("✅ Leaderboard refreshed with new data!");
      }, 3000);
      
    } catch (error) {
      console.error("❌ Error saving result to blockchain:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      setResultSaved(false);
      
      // Show error to user
      alert(`Failed to save result onchain: ${error instanceof Error ? error.message : 'Unknown error'}\n\nYou can still view your result, but it won't be stored on the blockchain.`);
    } finally {
      setIsSavingResult(false);
    }
  };

  const handleMintNFT = async () => {
    if (!result || !address) {
      console.warn("⚠️ Cannot mint NFT - missing result or wallet");
      return;
    }
    
    try {
      setIsMintingNFT(true);
      
      console.log("🎨 Initiating NFT mint:", {
        wallet: address,
        personality: result,
        timestamp: new Date().toISOString()
      });
      
      // Mint NFT onchain
      const txHash = await mintPersonalityNFT(result);
      
      console.log("✅ NFT minted successfully!", {
        transactionHash: txHash,
        wallet: address,
        personality: result,
        explorer: `https://sepolia.basescan.org/tx/${txHash}`
      });
      
      alert(`🎉 Success! Your ${result} NFT has been minted!\n\nTransaction: ${txHash}\n\nCheck your wallet to see your new personality NFT.`);
      
    } catch (error) {
      console.error("❌ Error minting NFT:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      alert(`Failed to mint NFT: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again.`);
    } finally {
      setIsMintingNFT(false);
    }
  };

  const handleRestart = () => {
    setGameState("welcome");
    setCurrentQuestion(0);
    setScores({ Bitcoin: 0, Ethereum: 0, Solana: 0, Dogecoin: 0 });
    setResult(null);
    setSelectedAnswer(null);
  };

  if (gameState === "welcome") {
  return (
    <div className={styles.container}>
        <div className={styles.welcomeContent}>
          <div className={styles.welcomeEmoji}>🌟</div>
          <h1 className={styles.welcomeTitle}>Discover Your Crypto Personality!</h1>
          <p className={styles.welcomeSubtitle}>
            Hey {context?.user?.displayName || "there"}! 👋
            <br />
            Take this fun quiz to find out which cryptocurrency matches your personality!
          </p>
          <div className={styles.cryptoIcons}>
            <span className={styles.floatingIcon}>₿</span>
            <span className={styles.floatingIcon}>⟠</span>
            <span className={styles.floatingIcon}>◎</span>
            <span className={styles.floatingIcon}>Ð</span>
          </div>
          
          {/* Wallet Connection Status */}
          {address ? (
            <div className={styles.walletConnected}>
              <div className={styles.walletStatus}>
                <span className={styles.walletDot}>●</span>
                <span className={styles.walletLabel}>Wallet Connected</span>
              </div>
              <div className={styles.walletAddress}>
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            </div>
          ) : (
            <div className={styles.walletDisconnected}>
              <span className={styles.walletWarning}>⚠️</span>
              {isLocalDev ? (
                <p>Connect your wallet to continue</p>
              ) : (
                <>
                  <p>Wallet will auto-connect via MiniKit</p>
                  <p style={{ fontSize: '0.85em', marginTop: '0.5rem', opacity: 0.8 }}>
                    If on web, click connect button below
                  </p>
                </>
              )}
            </div>
          )}
          
          {/* Show connect button when wallet not connected */}
          {!address ? (
            <button 
              onClick={handleConnectWallet} 
              className={styles.connectButton}
            >
              {isLocalDev ? 'Connect Wallet 🔗' : 'Manual Connect (Web Only) 🔗'}
            </button>
          ) : null}
          
          {/* Global Leaderboard on Welcome Page */}
          {leaderboardData.total > 0 ? (
            <div className={styles.leaderboard}>
              <h3 className={styles.leaderboardTitle}>
                🏆 Global Rankings
              </h3>
              <p className={styles.leaderboardSubtitle}>
                {leaderboardData.total} {leaderboardData.total === 1 ? 'person has' : 'people have'} discovered their crypto personality
              </p>
              <div className={styles.leaderboardGrid}>
                {(['Bitcoin', 'Ethereum', 'Solana', 'Dogecoin'] as Personality[]).map((personalityType) => {
                  const data = leaderboardData[personalityType];
                  return (
                    <div 
                      key={personalityType} 
                      className={styles.leaderboardItem}
                    >
                      <div className={styles.leaderboardHeader}>
                        <img 
                          src={personalityResults[personalityType].avatar} 
                          alt={personalityType}
                          className={styles.leaderboardAvatar}
                        />
                        <div className={styles.leaderboardInfo}>
                          <div className={styles.leaderboardName}>
                            {personalityType}
                          </div>
                          <div className={styles.leaderboardCount}>
                            {data.count} {data.count === 1 ? 'person' : 'people'}
                          </div>
                        </div>
                      </div>
                      <div className={styles.leaderboardBarContainer}>
                        <div 
                          className={styles.leaderboardBar}
                          style={{
                            width: `${data.percentage}%`,
                            background: personalityResults[personalityType].gradient
                          }}
                        />
                      </div>
                      <div className={styles.leaderboardPercentage}>
                        {data.percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={styles.leaderboardEmpty}>
              <div className={styles.emptyIcon}>🎯</div>
              <p className={styles.emptyText}>Be the first to discover your crypto personality!</p>
            </div>
          )}
          
          <button 
            onClick={handleStartQuiz} 
            className={styles.startButton}
            disabled={!address}
          >
            {address ? "Start Quiz ✨" : "Waiting for Wallet..."}
      </button>
      
          {!address && !isLocalDev && (
            <p className={styles.walletHint}>
              Please ensure you&apos;re using this app in a MiniKit-compatible environment
            </p>
          )}
          
          {!address && isLocalDev && (
            <p className={styles.walletHint}>
              For local testing: Click &quot;Connect Wallet&quot; above or deploy to Base app for full MiniKit experience
            </p>
          )}
        </div>
      </div>
    );
  }

  if (gameState === "quiz") {
    const question = questions[currentQuestion];
    return (
      <div className={styles.container}>
        <div className={styles.quizContent}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className={styles.questionNumber}>
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <h2 className={styles.questionText}>{question.question}</h2>
          <div className={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.personality, index)}
                className={`${styles.optionButton} ${
                  selectedAnswer === index ? styles.optionSelected : ""
                }`}
                disabled={selectedAnswer !== null}
              >
                <span className={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={styles.optionText}>{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "result" && result) {
    const personality = personalityResults[result];
    return (
      <div className={styles.container}>
        <div className={styles.resultContent}>
          <div className={styles.avatarContainer}>
            <img 
              src={personality.avatar} 
              alt={`${result} personality avatar`}
              className={styles.avatarImage}
            />
          </div>
          <h1 className={styles.resultTitle}>{personality.title}</h1>
          <p className={styles.resultDescription}>{personality.description}</p>
          
          {/* Personality Traits */}
          <div className={styles.traitsContainer}>
            <div className={styles.traitItem}>
              <span className={styles.traitLabel}>Best Skill:</span>
              <span className={styles.traitValue}>{personality.traits.bestSkill}</span>
            </div>
            <div className={styles.traitItem}>
              <span className={styles.traitLabel}>Favorite Activity:</span>
              <span className={styles.traitValue}>{personality.traits.favoriteActivity}</span>
            </div>
            <div className={styles.traitItem}>
              <span className={styles.traitLabel}>Animal Bestie:</span>
              <span className={styles.traitValue}>{personality.traits.animalBestie}</span>
            </div>
            <div className={styles.traitItem}>
              <span className={styles.traitLabel}>Nightmare Fuel:</span>
              <span className={styles.traitValue}>{personality.traits.nightmareFuel}</span>
            </div>
          </div>
          
          {/* Pickup Line */}
          <div className={styles.pickupLine}>
            <div className={styles.pickupLineIcon}>💘</div>
            <div className={styles.pickupLineLabel}>Pickup Line:</div>
            <p>{personality.pickupLine}</p>
          </div>
          
          {/* Global Leaderboard */}
          {leaderboardData.total > 0 ? (
            <div className={styles.leaderboard}>
              <h3 className={styles.leaderboardTitle}>
                🏆 Global Personality Rankings {isRefreshingLeaderboard && <span style={{ fontSize: '0.8em', opacity: 0.7 }}>🔄 Updating...</span>}
              </h3>
              <p className={styles.leaderboardSubtitle}>
                {leaderboardData.total} {leaderboardData.total === 1 ? 'person has' : 'people have'} taken the quiz
              </p>
              <div className={styles.leaderboardGrid}>
                {(['Bitcoin', 'Ethereum', 'Solana', 'Dogecoin'] as Personality[]).map((personalityType) => {
                  const data = leaderboardData[personalityType];
                  const isCurrentPersonality = personalityType === result;
                  return (
                    <div 
                      key={personalityType} 
                      className={`${styles.leaderboardItem} ${isCurrentPersonality ? styles.leaderboardItemActive : ''}`}
                    >
                      <div className={styles.leaderboardHeader}>
                        <img 
                          src={personalityResults[personalityType].avatar} 
                          alt={personalityType}
                          className={styles.leaderboardAvatar}
                        />
                        <div className={styles.leaderboardInfo}>
                          <div className={styles.leaderboardName}>
                            {personalityType}
                            {isCurrentPersonality && <span className={styles.youBadge}>YOU</span>}
                          </div>
                          <div className={styles.leaderboardCount}>
                            {data.count} {data.count === 1 ? 'person' : 'people'}
                          </div>
                        </div>
                      </div>
                      <div className={styles.leaderboardBarContainer}>
                        <div 
                          className={styles.leaderboardBar}
                          style={{
                            width: `${data.percentage}%`,
                            background: personalityResults[personalityType].gradient
                          }}
                        />
                      </div>
                      <div className={styles.leaderboardPercentage}>
                        {data.percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={styles.leaderboardEmpty}>
              <div className={styles.emptyIcon}>🎯</div>
              <p className={styles.emptyText}>
                Once the updated smart contract is deployed, you&apos;ll be able to see global rankings here!
              </p>
            </div>
          )}
          
          {/* Onchain Status */}
          <div className={styles.onchainStatus}>
            {isSavingResult ? (
              <div className={styles.statusSaving}>
                <span className={styles.spinner}>⏳</span>
                <span>Saving result onchain...</span>
              </div>
            ) : resultSaved && isRefreshingLeaderboard ? (
              <div className={styles.statusSaving}>
                <span className={styles.spinner}>🔄</span>
                <span>Updating leaderboard...</span>
              </div>
            ) : resultSaved ? (
              <div className={styles.statusSaved}>
                <span className={styles.checkmark}>✅</span>
                <span>Result saved onchain!</span>
              </div>
            ) : (
              <div className={styles.statusPending}>
                <span className={styles.infoIcon}>ℹ️</span>
                <span>Ready to save results onchain</span>
              </div>
            )}
          </div>
          <div className={styles.scoreBreakdown}>
            <h3 className={styles.scoreTitle}>Your Score Breakdown:</h3>
            <div className={styles.scoreGrid}>
              {(Object.entries(scores) as [Personality, number][]).map(([key, value]) => (
                <div key={key} className={styles.scoreItem}>
                  <span className={styles.scoreName}>{key}</span>
                  <div className={styles.scoreBarContainer}>
                    <div
                      className={styles.scoreBar}
                      style={{
                        width: `${(value / questions.length) * 100}%`,
                        background: personalityResults[key].gradient,
                      }}
                    />
                  </div>
                  <span className={styles.scoreValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.resultActions}>
            <button onClick={handleRestart} className={styles.restartButton}>
              Take Quiz Again 🔄
            </button>
            <button 
              onClick={handleMintNFT} 
              className={styles.mintButton}
              disabled={isMintingNFT}
            >
              {isMintingNFT ? "Minting..." : "Mint NFT 🎨"}
            </button>
        </div>
      </div>
    </div>
  );
  }

  return null;
}
