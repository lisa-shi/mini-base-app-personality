import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";

// Create wagmi config with proper RPC transport
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(), // Uses OnchainKit's RPC by default
  },
});

