import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI, PersonalityEnum, NFT_METADATA_URIS } from "./contractConfig";
import { useState } from "react";

type Personality = "Bitcoin" | "Ethereum" | "Solana" | "Dogecoin";

export function useQuizContract() {
  const { address, isConnected, connector } = useAccount();
  const { writeContract, writeContractAsync, data: txData, isPending, isError, error } = useWriteContract();
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | undefined>();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: lastTxHash,
  });

  console.log("📱 useQuizContract - Account Status:", {
    address,
    isConnected,
    connectorName: connector?.name,
    contractAddress: CONTRACT_ADDRESS,
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

    if (!isConnected) {
      console.error("❌ Wallet shows as not connected");
      throw new Error("Wallet not properly connected");
    }

    try {
      const personalityEnum = PersonalityEnum[personality];
      
      console.log("🔗 Calling storeQuizResult on contract:", {
        contractAddress: CONTRACT_ADDRESS,
        personality,
        personalityEnum,
        scores,
        userAddress: address,
        connectorName: connector?.name,
        isConnected,
      });

      // Try using writeContractAsync first, but provide fallback
      let txHash: `0x${string}`;
      
      try {
        console.log("Attempting writeContractAsync with account:", address);
        txHash = await writeContractAsync({
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
          account: address, // Explicitly pass the account
        });
      } catch (asyncError) {
        console.warn("writeContractAsync failed, trying writeContract:", asyncError);
        
        // Fallback to writeContract (non-async version)
        writeContract({
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
          account: address, // Explicitly pass the account
        });
        
        // Wait for txData to be populated
        await new Promise<void>((resolve) => {
          const checkInterval = setInterval(() => {
            if (txData) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
          
          // Timeout after 30 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            throw new Error("Transaction submission timeout");
          }, 30000);
        });
        
        txHash = txData as `0x${string}`;
      }

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

      // Try using writeContractAsync first, but provide fallback
      let txHash: `0x${string}`;
      
      try {
        console.log("Attempting writeContractAsync for NFT mint with account:", address);
        txHash = await writeContractAsync({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: "mintPersonalityNFT",
          args: [personalityEnum, tokenURI],
          account: address, // Explicitly pass the account
        });
      } catch (asyncError) {
        console.warn("writeContractAsync failed for NFT, trying writeContract:", asyncError);
        
        // Fallback to writeContract (non-async version)
        writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: "mintPersonalityNFT",
          args: [personalityEnum, tokenURI],
          account: address, // Explicitly pass the account
        });
        
        // Wait for txData to be populated
        await new Promise<void>((resolve) => {
          const checkInterval = setInterval(() => {
            if (txData) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
          
          // Timeout after 30 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            throw new Error("Transaction submission timeout");
          }, 30000);
        });
        
        txHash = txData as `0x${string}`;
      }

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

