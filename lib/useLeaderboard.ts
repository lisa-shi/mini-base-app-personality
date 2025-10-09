import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractConfig";

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
  const { data, isLoading, isError, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getLeaderboardData",
  });

  // Process the data into a more usable format
  const leaderboardData: LeaderboardData | null = data
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
    : null;

  return {
    leaderboardData,
    isLoading,
    isError,
    refetch,
  };
}

