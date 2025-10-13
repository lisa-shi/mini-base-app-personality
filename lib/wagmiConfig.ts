import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

// Create wagmi config with proper RPC transport and connectors
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(), // MetaMask, Brave Wallet, etc.
    coinbaseWallet({
      appName: "Crypto Personality Quiz",
      appLogoUrl: "https://mini-base-app-personality.vercel.app/icon.png",
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo", // Get free project ID at https://cloud.walletconnect.com
      metadata: {
        name: "Crypto Personality Quiz",
        description: "Discover your crypto personality onchain!",
        url: "https://mini-base-app-personality.vercel.app",
        icons: ["https://mini-base-app-personality.vercel.app/icon.png"],
      },
    }),
  ],
  transports: {
    [baseSepolia.id]: http(), // Uses OnchainKit's RPC by default
  },
});

