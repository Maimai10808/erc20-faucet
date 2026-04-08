import type { Address } from "viem";
import {
  bidenFaucetAddress,
  bidenTokenAddress,
  trumpFaucetAddress,
  trumpTokenAddress,
} from "@/contracts/generated";

export type FaucetDefinition = {
  id: "trump" | "biden";
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: Address;
  faucetAddress: Address;
  theme: {
    tone: "red" | "blue";
    tintClassName: string;
    badgeClassName: string;
    buttonClassName: string;
  };
  slogan: string;
};

export const faucetDefinitions: FaucetDefinition[] = [
  {
    id: "trump",
    tokenName: "Trump Coin",
    tokenSymbol: "TRUMP",
    tokenAddress: trumpTokenAddress,
    faucetAddress: trumpFaucetAddress,
    slogan: "High volume rhetoric. One claim only.",
    theme: {
      tone: "red",
      tintClassName:
        "border-[color:var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,226,221,0.95),rgba(255,245,238,0.9))]",
      badgeClassName: "bg-[color:var(--red)] text-white",
      buttonClassName:
        "bg-[color:var(--red)] text-white hover:bg-[#891925] focus-visible:outline-[color:var(--red)]",
    },
  },
  {
    id: "biden",
    tokenName: "Biden Coin",
    tokenSymbol: "BIDEN",
    tokenAddress: bidenTokenAddress,
    faucetAddress: bidenFaucetAddress,
    slogan: "Steady drip. Same one-time rule.",
    theme: {
      tone: "blue",
      tintClassName:
        "border-[color:var(--line-strong)] bg-[linear-gradient(180deg,rgba(223,233,255,0.95),rgba(245,248,255,0.9))]",
      badgeClassName: "bg-[color:var(--blue)] text-white",
      buttonClassName:
        "bg-[color:var(--blue)] text-white hover:bg-[#143170] focus-visible:outline-[color:var(--blue)]",
    },
  },
];
