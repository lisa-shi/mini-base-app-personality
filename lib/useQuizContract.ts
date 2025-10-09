import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI, PersonalityEnum, NFT_METADATA_URIS } from "./contractConfig";
import { useState } from "react";

type Personality = "Bitcoin" | "Ethereum" | "Solana" | "Dogecoin";

export function useQuizContract() {
  const { address } = useAccount();
  const { writeContractAsync, isPending, isError, error } = useWriteContract();
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | undefined>();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: lastTxHash,
  });

  /**
   * Store quiz result onchain
   */
  const storeQuizResult = async (
    personality: Personality,
    scores: Record<Personality, number>
  ) => {
    if (!address) {
      console.error("❌ Cannot store quiz result - wallet not connected");
      throw new Error("Wallet not connected");
    }

    try {
      const personalityEnum = PersonalityEnum[personality];
      
      console.log("🔗 Calling storeQuizResult on contract:", {
        address: CONTRACT_ADDRESS,
        personality,
        personalityEnum,
        scores,
        userAddress: address,
      });

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "storeQuizResult",
        args: [
          personalityEnum,
          BigInt(scores.Bitcoin),
          BigInt(scores.Ethereum),
          BigInt(scores.Solana),
          BigInt(scores.Dogecoin),
        ],
      });

      console.log("✅ Quiz result stored successfully!", {
        transactionHash: txHash,
        explorer: `https://sepolia.basescan.org/tx/${txHash}`,
        wallet: address,
        personality,
      });
      
      setLastTxHash(txHash);
      return txHash;
    } catch (err) {
      console.error("❌ Error storing quiz result:", err);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
      }
      throw err;
    }
  };

  /**
   * Mint personality NFT
   */
  const mintPersonalityNFT = async (personality: Personality) => {
    if (!address) {
      console.error("❌ Cannot mint NFT - wallet not connected");
      throw new Error("Wallet not connected");
    }

    try {
      const personalityEnum = PersonalityEnum[personality];
      const tokenURI = NFT_METADATA_URIS[personality];

      console.log("🎨 Calling mintPersonalityNFT on contract:", {
        address: CONTRACT_ADDRESS,
        personality,
        personalityEnum,
        tokenURI,
        userAddress: address,
      });

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "mintPersonalityNFT",
        args: [personalityEnum, tokenURI],
      });

      console.log("✅ NFT minted successfully!", {
        transactionHash: txHash,
        explorer: `https://sepolia.basescan.org/tx/${txHash}`,
        wallet: address,
        personality,
      });
      
      setLastTxHash(txHash);
      return txHash;
    } catch (err) {
      console.error("❌ Error minting NFT:", err);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
      }
      throw err;
    }
  };

  return {
    address,
    storeQuizResult,
    mintPersonalityNFT,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error,
    hash: lastTxHash,
  };
}

