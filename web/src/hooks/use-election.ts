"use client";

import { useEffect, useMemo, useState } from "react";
import { parseUnits, zeroAddress } from "viem";
import {
  useAccount,
  useConnect,
  useConnectors,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useToast } from "@/components/toast-provider";
import {
  electionFaucetAbi,
  electionFaucetAddress,
  myTokenAbi,
} from "@/contracts/generated";
import { appChain } from "@/lib/web3/config";
import {
  candidates,
  getCandidateByVoteResult,
  type CandidateDefinition,
  type CandidateId,
} from "@/shared/election";

function getPreferredConnector(connectors: ReturnType<typeof useConnectors>) {
  return (
    connectors.find((connector) => connector.id === "metaMask") ??
    connectors.find((connector) => connector.id === "injected") ??
    connectors[0]
  );
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown wallet error.";
}

export function useElection() {
  const { pushToast } = useToast();
  const { address, chain, chainId, isConnected } = useAccount();
  const connectors = useConnectors();
  const { connectAsync, isPending: isConnecting } = useConnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const {
    writeContractAsync,
    data: txHash,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();

  const [actionError, setActionError] = useState<string | null>(null);
  const [highlightCandidateId, setHighlightCandidateId] = useState<CandidateId | null>(null);
  const [adminAmount, setAdminAmount] = useState("500");
  const [adminCandidateId, setAdminCandidateId] = useState<CandidateId>("trump");
  const [lastAction, setLastAction] = useState<"vote" | "fund" | null>(null);

  const isWrongChain = Boolean(isConnected && chainId !== appChain.id);

  const contractState = useReadContracts({
    contracts: [
      {
        address: electionFaucetAddress,
        abi: electionFaucetAbi,
        functionName: "rewardAmount",
        chainId: appChain.id,
      },
      {
        address: electionFaucetAddress,
        abi: electionFaucetAbi,
        functionName: "trumpVotes",
        chainId: appChain.id,
      },
      {
        address: electionFaucetAddress,
        abi: electionFaucetAbi,
        functionName: "bidenVotes",
        chainId: appChain.id,
      },
      {
        address: electionFaucetAddress,
        abi: electionFaucetAbi,
        functionName: "totalVotes",
        chainId: appChain.id,
      },
      {
        address: electionFaucetAddress,
        abi: electionFaucetAbi,
        functionName: "getBalances",
        chainId: appChain.id,
      },
      {
        address: electionFaucetAddress,
        abi: electionFaucetAbi,
        functionName: "owner",
        chainId: appChain.id,
      },
    ],
    query: {
      refetchInterval: txHash ? 1_500 : 8_000,
    },
  });

  const rewardAmount = contractState.data?.[0]?.result as bigint | undefined;
  const trumpVotes = contractState.data?.[1]?.result as bigint | undefined;
  const bidenVotes = contractState.data?.[2]?.result as bigint | undefined;
  const totalVotes = contractState.data?.[3]?.result as bigint | undefined;
  const balances = contractState.data?.[4]?.result as
    | readonly [bigint, bigint]
    | undefined;
  const owner = contractState.data?.[5]?.result as `0x${string}` | undefined;

  const voteState = useReadContracts({
    contracts: [
      {
        address: electionFaucetAddress,
        abi: electionFaucetAbi,
        functionName: "hasVoted",
        args: [address ?? zeroAddress],
        chainId: appChain.id,
      },
      {
        address: electionFaucetAddress,
        abi: electionFaucetAbi,
        functionName: "getVoteResult",
        args: [address ?? zeroAddress],
        chainId: appChain.id,
      },
      {
        address: candidates[0].tokenAddress,
        abi: myTokenAbi,
        functionName: "balanceOf",
        args: [address ?? zeroAddress],
        chainId: appChain.id,
      },
      {
        address: candidates[1].tokenAddress,
        abi: myTokenAbi,
        functionName: "balanceOf",
        args: [address ?? zeroAddress],
        chainId: appChain.id,
      },
    ],
    query: {
      enabled: Boolean(address),
      refetchInterval: txHash ? 1_500 : 8_000,
    },
  });

  const hasVoted = Boolean(voteState.data?.[0]?.result);
  const votedFor = getCandidateByVoteResult(
    Number(voteState.data?.[1]?.result ?? 0),
  );
  const trumpWalletBalance = voteState.data?.[2]?.result as bigint | undefined;
  const bidenWalletBalance = voteState.data?.[3]?.result as bigint | undefined;

  const receipt = useWaitForTransactionReceipt({
    chainId: appChain.id,
    hash: txHash,
    query: { enabled: Boolean(txHash) },
  });

  useEffect(() => {
    if (!writeError) return;
    const message = writeError.message;
    setActionError(message);
    pushToast({
      tone: "error",
      title: "Transaction failed",
      description: message,
    });
  }, [pushToast, writeError]);

  useEffect(() => {
    if (!receipt.isSuccess) return;

    void contractState.refetch();
    void voteState.refetch();

    if (lastAction === "vote" && votedFor?.id) {
      setHighlightCandidateId(votedFor.id);
      pushToast({
        tone: "success",
        title: "Vote cast and reward claimed",
        description: `Your ballot is locked in for ${votedFor.name}.`,
      });
    }

    if (lastAction === "fund") {
      pushToast({
        tone: "success",
        title: "Campaign reserves topped up",
        description: "The selected candidate vault received additional tokens.",
      });
    }
  }, [contractState, lastAction, pushToast, receipt.isSuccess, voteState, votedFor]);

  useEffect(() => {
    if (!highlightCandidateId) return;

    const timeoutId = window.setTimeout(() => {
      setHighlightCandidateId(null);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [highlightCandidateId]);

  const connectOrSwitchIfNeeded = async () => {
    if (!isConnected || !address) {
      const connector = getPreferredConnector(connectors);
      if (!connector) {
        throw new Error("No injected wallet detected.");
      }

      await connectAsync({
        connector,
        chainId: appChain.id,
      });

      pushToast({
        tone: "info",
        title: "Wallet connected",
        description: "Your ballot can be submitted now.",
      });

      return false;
    }

    if (chainId !== appChain.id) {
      await switchChainAsync({ chainId: appChain.id });
      pushToast({
        tone: "info",
        title: "Network switched",
        description: `Now connected to ${appChain.name}.`,
      });
      return false;
    }

    return true;
  };

  const voteFor = async (candidate: CandidateDefinition) => {
    setActionError(null);

    try {
      const ready = await connectOrSwitchIfNeeded();
      if (!ready) return;

      setLastAction("vote");
      if (candidate.id === "trump") {
        await writeContractAsync({
          address: electionFaucetAddress,
          abi: electionFaucetAbi,
          functionName: "voteTrump",
          chainId: appChain.id,
        });
      } else {
        await writeContractAsync({
          address: electionFaucetAddress,
          abi: electionFaucetAbi,
          functionName: "voteBiden",
          chainId: appChain.id,
        });
      }
    } catch (error) {
      const message = toErrorMessage(error);
      setActionError(message);
      pushToast({
        tone: "error",
        title: "Vote could not be submitted",
        description: message,
      });
    }
  };

  const fundSelectedCandidate = async () => {
    setActionError(null);

    try {
      const ready = await connectOrSwitchIfNeeded();
      if (!ready) return;

      if (!adminAmount || Number(adminAmount) <= 0) {
        throw new Error("Funding amount must be greater than zero.");
      }

      const candidate = candidates.find((item) => item.id === adminCandidateId);
      if (!candidate) {
        throw new Error("Invalid candidate selected.");
      }

      const amount = parseUnits(adminAmount, 18);
      setLastAction("fund");

      await writeContractAsync({
        address: candidate.tokenAddress,
        abi: myTokenAbi,
        functionName: "approve",
        args: [electionFaucetAddress, amount],
        chainId: appChain.id,
      });

      pushToast({
        tone: "info",
        title: "Approval submitted",
        description: `Approve transaction sent for ${candidate.symbol}. Confirm the funding transaction next.`,
      });

      if (candidate.id === "trump") {
        await writeContractAsync({
          address: electionFaucetAddress,
          abi: electionFaucetAbi,
          functionName: "fundTrump",
          args: [amount],
          chainId: appChain.id,
        });
      } else {
        await writeContractAsync({
          address: electionFaucetAddress,
          abi: electionFaucetAbi,
          functionName: "fundBiden",
          args: [amount],
          chainId: appChain.id,
        });
      }
    } catch (error) {
      const message = toErrorMessage(error);
      setActionError(message);
      pushToast({
        tone: "error",
        title: "Funding failed",
        description: message,
      });
    }
  };

  const votePercentages = useMemo(() => {
    const total = Number(totalVotes ?? BigInt(0));
    const trump = Number(trumpVotes ?? BigInt(0));
    const biden = Number(bidenVotes ?? BigInt(0));

    if (total === 0) {
      return { trump: 50, biden: 50 };
    }

    return {
      trump: (trump / total) * 100,
      biden: (biden / total) * 100,
    };
  }, [bidenVotes, totalVotes, trumpVotes]);

  return {
    account: {
      address,
      chain,
      chainId,
      isConnected,
      isWrongChain,
    },
    admin: {
      adminAmount,
      canManage: Boolean(
        address &&
          owner &&
          address.toLowerCase() === owner.toLowerCase(),
      ),
      owner,
      selectedCandidateId: adminCandidateId,
      setAdminAmount,
      setSelectedCandidateId: setAdminCandidateId,
      submitFund: fundSelectedCandidate,
    },
    candidates: {
      biden: {
        balance: balances?.[1],
        votes: bidenVotes,
        walletBalance: bidenWalletBalance,
      },
      trump: {
        balance: balances?.[0],
        votes: trumpVotes,
        walletBalance: trumpWalletBalance,
      },
    },
    election: {
      actionError,
      hasVoted,
      highlightCandidateId,
      isBusy: isConnecting || isSwitching || isWriting || receipt.isLoading,
      receiptHash: txHash,
      rewardAmount,
      totalVotes,
      voteFor,
      votePercentages,
      votedFor,
    },
  };
}
