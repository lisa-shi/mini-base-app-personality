import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI, PersonalityEnum, NFT_METADATA_URIS } from "./contractConfig";
import { useState } from "react";
import { baseSepolia } from "wagmi/chains";

type Personality = "Bitcoin" | "Ethereum" | "Solana" | "Dogecoin";

export function useQuizContract() {
  const { address, isConnected, connector, chain, chainId } = useAccount();
  const { writeContract, writeContractAsync, data: txData, isPending, isError, error } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | undefined>();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: lastTxHash,
  });

  console.log("📱 useQuizContract - Account Status:", {
    address,
    isConnected,
    connectorName: connector?.name,
    currentChainId: chainId,
    currentChainName: chain?.name,
    requiredChainId: baseSepolia.id,
    requiredChainName: baseSepolia.name,
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

    // CRITICAL: Ensure we're on Base Sepolia before writing
    if (chainId !== baseSepolia.id) {
      console.error(`❌ WRONG NETWORK! Current: ${chainId} (${chain?.name}), Required: ${baseSepolia.id} (${baseSepolia.name})`);
      console.log("🔄 Attempting to switch to Base Sepolia...");
      
      try {
        if (switchChainAsync) {
          await switchChainAsync({ chainId: baseSepolia.id });
          console.log("✅ Successfully switched to Base Sepolia");
        } else {
          throw new Error("Chain switching not available");
        }
      } catch (switchError) {
        console.error("❌ Failed to switch network:", switchError);
        throw new Error(`Please switch to Base Sepolia (Chain ID: ${baseSepolia.id}) in your wallet. Currently on Chain ID: ${chainId}`);
      }
    }

    try {
      const personalityEnum = PersonalityEnum[personality];
      
      console.log("🔗 Calling storeQuizResult on contract:", {
        contractAddress: CONTRACT_ADDRESS,
        personality,
        personalityEnum,
        scores,
        userAddress: address,
        chainId,
        chainName: chain?.name,
        requiredChain: `${baseSepolia.name} (${baseSepolia.id})`,
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
          chainId: baseSepolia.id, // Force Base Sepolia
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
          chainId: baseSepolia.id, // Force Base Sepolia
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

    // CRITICAL: Ensure we're on Base Sepolia before minting
    if (chainId !== baseSepolia.id) {
      console.error(`❌ WRONG NETWORK for NFT mint! Current: ${chainId}, Required: ${baseSepolia.id}`);
      
      try {
        if (switchChainAsync) {
          await switchChainAsync({ chainId: baseSepolia.id });
          console.log("✅ Successfully switched to Base Sepolia for NFT mint");
        } else {
          throw new Error("Chain switching not available");
        }
      } catch (switchError) {
        console.error("❌ Failed to switch network:", switchError);
        throw new Error(`Please switch to Base Sepolia (Chain ID: ${baseSepolia.id}) in your wallet`);
      }
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
          chainId: baseSepolia.id, // Force Base Sepolia
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
          chainId: baseSepolia.id, // Force Base Sepolia
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

