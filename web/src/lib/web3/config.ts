import { createConfig, http } from "wagmi";
import { hardhat } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const appChain = hardhat;

export const rpcUrl =
  process.env.NEXT_PUBLIC_RPC_URL ?? "http://127.0.0.1:8545";

export const wagmiConfig = createConfig({
  chains: [appChain],
  connectors: [metaMask(), injected()],
  transports: {
    [appChain.id]: http(rpcUrl),
  },
  ssr: true,
});
