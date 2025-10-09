import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractConfig";
import { useEffect } from "react";

export interface LeaderboardData {
  Bitcoin: {
    count: number;
    percentage: number;
  };
  Ethereum: {
    count: number;
    percentage: number;
  };
  Solana: {
    count: number;
    percentage: number;
  };
  Dogecoin: {
    count: number;
    percentage: number;
  };
  total: number;
}

export function useLeaderboard() {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getLeaderboardData",
  });

  // Log leaderboard data fetch for debugging
  useEffect(() => {
    if (isError) {
      console.error("❌ Failed to fetch leaderboard data from contract:", error);
      console.error("Contract address:", CONTRACT_ADDRESS);
    } else if (data) {
      console.log("✅ Leaderboard data fetched successfully:", data);
    }
  }, [data, isError, error]);

  // Process the data into a more usable format
  // If there's an error or no data, return empty state (0 counts)
  const leaderboardData: LeaderboardData = data
    ? (() => {
        const [bitcoinCount, ethereumCount, solanaCount, dogecoinCount, total] = data as [
          bigint,
          bigint,
          bigint,
          bigint,
          bigint
        ];
        
        const totalNum = Number(total);
        const btcCount = Number(bitcoinCount);
        const ethCount = Number(ethereumCount);
        const solCount = Number(solanaCount);
        const dogeCount = Number(dogecoinCount);

        return {
          Bitcoin: {
            count: btcCount,
            percentage: totalNum > 0 ? (btcCount / totalNum) * 100 : 0,
          },
          Ethereum: {
            count: ethCount,
            percentage: totalNum > 0 ? (ethCount / totalNum) * 100 : 0,
          },
          Solana: {
            count: solCount,
            percentage: totalNum > 0 ? (solCount / totalNum) * 100 : 0,
          },
          Dogecoin: {
            count: dogeCount,
            percentage: totalNum > 0 ? (dogeCount / totalNum) * 100 : 0,
          },
          total: totalNum,
        };
      })()
    : {
        // Return empty state when contract call fails or no data
        Bitcoin: { count: 0, percentage: 0 },
        Ethereum: { count: 0, percentage: 0 },
        Solana: { count: 0, percentage: 0 },
        Dogecoin: { count: 0, percentage: 0 },
        total: 0,
      };

  return {
    leaderboardData,
    isLoading,
    isError,
    refetch,
  };
}

