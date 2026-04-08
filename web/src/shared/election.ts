import type { Address } from "viem";
import {
  bidenTokenAddress,
  electionFaucetAddress,
  trumpTokenAddress,
} from "@/contracts/generated";

export type CandidateId = "trump" | "biden";

export type CandidateDefinition = {
  id: CandidateId;
  enumValue: 1 | 2;
  name: string;
  symbol: string;
  tokenAddress: Address;
  theme: {
    panelClassName: string;
    pillClassName: string;
    buttonClassName: string;
    accentClassName: string;
  };
  slogan: string;
  manifesto: string;
  runningMate: string;
  colorWord: string;
};

export const electionFaucetContractAddress = electionFaucetAddress;

export const candidates: CandidateDefinition[] = [
  {
    id: "trump",
    enumValue: 1,
    name: "Donald Trump",
    symbol: "TRUMP",
    tokenAddress: trumpTokenAddress,
    slogan: "Make America Great Again! Claim the red ticket.",
    manifesto:
      "Support Trump and receive the campaign token as your onchain reward. One wallet, one vote, one final choice.",
    runningMate: "Republican campaign",
    colorWord: "Red side",
    theme: {
      panelClassName: "",
      pillClassName: "",
      buttonClassName: "",
      accentClassName: "",
    },
  },
  {
    id: "biden",
    enumValue: 2,
    name: "Joe Biden",
    symbol: "BIDEN",
    tokenAddress: bidenTokenAddress,
    slogan: "Cast your ballot. Claim the blue ticket.",
    manifesto:
      "Support Biden and receive the campaign token as your onchain reward. Once your vote is cast, your decision is locked.",
    runningMate: "Democratic campaign",
    colorWord: "Blue side",
    theme: {
      panelClassName: "",
      pillClassName: "",
      buttonClassName: "",
      accentClassName: "",
    },
  },
];

export function getCandidateByVoteResult(value?: number) {
  return candidates.find((candidate) => candidate.enumValue === value) ?? null;
}
