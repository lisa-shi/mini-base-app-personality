import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI, PersonalityEnum, NFT_METADATA_URIS } from "./contractConfig";
import { useState } from "react";

type Personality = "Bitcoin" | "Ethereum" | "Solana" | "Dogecoin";

export function useQuizContract() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
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
      throw new Error("Wallet not connected");
    }

    try {
      const personalityEnum = PersonalityEnum[personality];
      
      const txHash = await writeContract({
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

      setLastTxHash(hash);
      return txHash;
    } catch (err) {
      console.error("Error storing quiz result:", err);
      throw err;
    }
  };

  /**
   * Mint personality NFT
   */
  const mintPersonalityNFT = async (personality: Personality) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      const personalityEnum = PersonalityEnum[personality];
      const tokenURI = NFT_METADATA_URIS[personality];

      const txHash = await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "mintPersonalityNFT",
        args: [personalityEnum, tokenURI],
      });

      setLastTxHash(hash);
      return txHash;
    } catch (err) {
      console.error("Error minting NFT:", err);
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

