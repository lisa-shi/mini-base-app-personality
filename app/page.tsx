"use client";
import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount, useConnect } from "wagmi";
import styles from "./page.module.css";
// import { useQuizContract } from "../lib/useQuizContract"; // Uncomment when contract is deployed

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
    pickupLine: "Are you a Bitcoin maximalist? Because you're the only coin I want to HODL forever. I'm the original, and I'll always be your safe bet. 💰",
    emoji: "₿",
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
    pickupLine: "Let's make this relationship decentralized—no single point of failure. I'm versatile, and I can be anything you need me to be. We're proof of stake that love works! 💜",
    emoji: "⟠",
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
    pickupLine: "They say I'm too fast, but baby, I'll slow down for you. I'm fast, scalable, and ready to take you places at 65,000 TPS! Want to experience high-speed romance? 🚀",
    emoji: "◎",
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
    pickupLine: "Much wow. Very cute. So date? I'm not just a meme—I'm the whole vibe! To the moon and back? No, to your heart! 🌙💕",
    emoji: "Ð",
    gradient: "linear-gradient(135deg, #c2a633 0%, #f0d460 100%)",
  },
};

export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  // Uncomment when contract is deployed:
  // import { useQuizContract } from "../lib/useQuizContract";
  // const { storeQuizResult, mintPersonalityNFT, isPending, isConfirmed } = useQuizContract();
  
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

  useEffect(() => {
    // Check if we're in local development (not in MiniKit)
    setIsLocalDev(typeof window !== 'undefined' && window.location.hostname === 'localhost');
    
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleConnectWallet = () => {
    // For local development, connect with first available connector
    if (isLocalDev && connectors.length > 0) {
      connect({ connector: connectors[0] });
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
        handleSaveResultOnchain(finalResult, newScores);
      }
    }, 600);
  };

  const handleSaveResultOnchain = async (personality: Personality, quizScores: Record<Personality, number>) => {
    if (!address) return;
    
    try {
      setIsSavingResult(true);
      
      // When contract is deployed, uncomment this:
      // await storeQuizResult(personality, quizScores);
      
      // Simulated saving for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("📝 Quiz result ready to save onchain:", {
        wallet: address,
        personality,
        scores: quizScores,
        timestamp: new Date().toISOString()
      });
      
      setResultSaved(true);
      
      // Remove this alert once contract is deployed
      // alert("🎉 Result would be saved onchain! (Contract not deployed yet)");
      
    } catch (error) {
      console.error("Error saving result:", error);
      setResultSaved(false);
    } finally {
      setIsSavingResult(false);
    }
  };

  const handleMintNFT = async () => {
    if (!result || !address) return;
    
    try {
      setIsMintingNFT(true);
      
      // When contract is deployed, uncomment this:
      // await mintPersonalityNFT(result);
      
      // Simulated minting for now
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log("🎨 NFT ready to mint:", {
        wallet: address,
        personality: result,
        timestamp: new Date().toISOString()
      });
      
      alert(`🎨 ${result} NFT would be minted! (Contract not deployed yet)\n\nOnce deployed, this will create a unique ${result}-themed NFT in your wallet.`);
      
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Failed to mint NFT. Please try again.");
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
                <p>Wallet will auto-connect via MiniKit</p>
              )}
            </div>
          )}
          
          {/* Show connect button for local development */}
          {!address && isLocalDev ? (
            <button 
              onClick={handleConnectWallet} 
              className={styles.connectButton}
            >
              Connect Wallet 🔗
            </button>
          ) : null}
          
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
          <div className={styles.resultEmoji} style={{ background: personality.gradient }}>
            {personality.emoji}
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
            <p>{personality.pickupLine}</p>
          </div>
          
          {/* Onchain Status */}
          <div className={styles.onchainStatus}>
            {isSavingResult ? (
              <div className={styles.statusSaving}>
                <span className={styles.spinner}>⏳</span>
                <span>Saving result onchain...</span>
              </div>
            ) : resultSaved ? (
              <div className={styles.statusSaved}>
                <span className={styles.checkmark}>✅</span>
                <span>Result saved onchain!</span>
              </div>
            ) : (
              <div className={styles.statusPending}>
                <span className={styles.infoIcon}>ℹ️</span>
                <span>Deploy contract to save results onchain</span>
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
