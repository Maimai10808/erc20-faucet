"use client";

import { useEffect, useMemo, useState } from "react";
import { zeroAddress } from "viem";
import {
  useAccount,
  useConnect,
  useConnectors,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useToast } from "@/components/toast-provider";
import { faucetAbi, myTokenAbi } from "@/contracts/generated";
import { appChain } from "@/lib/web3/config";
import type { FaucetDefinition } from "@/shared/faucets";

function getPreferredConnector(
  connectors: ReturnType<typeof useConnectors>,
) {
  return (
    connectors.find((connector) => connector.id === "metaMask") ??
    connectors.find((connector) => connector.id === "injected") ??
    connectors[0]
  );
}

export function useFaucetCard(faucet: FaucetDefinition) {
  const { pushToast } = useToast();
  const { address, chainId, isConnected } = useAccount();
  const connectors = useConnectors();
  const { connectAsync, isPending: isConnecting } = useConnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const {
    writeContractAsync,
    data: hash,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();
  const [actionError, setActionError] = useState<string | null>(null);
  const [highlightBalance, setHighlightBalance] = useState(false);

  const isWrongChain = Boolean(isConnected && chainId !== appChain.id);
  const pollingMs = hash ? 1_500 : 8_000;

  const amountAllowed = useReadContract({
    chainId: appChain.id,
    address: faucet.faucetAddress,
    abi: faucetAbi,
    functionName: "amountAllowed",
    query: {
      refetchInterval: pollingMs,
    },
  });

  const hasClaimed = useReadContract({
    chainId: appChain.id,
    address: faucet.faucetAddress,
    abi: faucetAbi,
    functionName: "requestedAddress",
    args: [address ?? zeroAddress],
    query: {
      enabled: Boolean(address),
      refetchInterval: pollingMs,
    },
  });

  const tokenBalance = useReadContract({
    chainId: appChain.id,
    address: faucet.tokenAddress,
    abi: myTokenAbi,
    functionName: "balanceOf",
    args: [address ?? zeroAddress],
    query: {
      enabled: Boolean(address),
      refetchInterval: pollingMs,
    },
  });

  const receipt = useWaitForTransactionReceipt({
    chainId: appChain.id,
    hash,
    query: {
      enabled: Boolean(hash),
    },
  });

  useEffect(() => {
    if (receipt.isSuccess) {
      setHighlightBalance(true);
      pushToast({
        tone: "success",
        title: `${faucet.tokenSymbol} claimed`,
        description: `Your wallet has received the faucet transfer for ${faucet.tokenName}.`,
      });
      void hasClaimed.refetch();
      void tokenBalance.refetch();
    }
  }, [
    faucet.tokenName,
    faucet.tokenSymbol,
    hasClaimed,
    pushToast,
    receipt.isSuccess,
    tokenBalance,
  ]);

  useEffect(() => {
    if (!highlightBalance) return;

    const timeoutId = window.setTimeout(() => {
      setHighlightBalance(false);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [highlightBalance]);

  useEffect(() => {
    if (writeError) {
      setActionError(writeError.message);
      pushToast({
        tone: "error",
        title: `Unable to claim ${faucet.tokenSymbol}`,
        description: writeError.message,
      });
    }
  }, [faucet.tokenSymbol, pushToast, writeError]);

  const claim = async () => {
    setActionError(null);

    try {
      if (!isConnected || !address) {
        const connector = getPreferredConnector(connectors);

        if (!connector) {
          throw new Error(
            "No wallet connector found. Install MetaMask or an injected wallet.",
          );
        }

        await connectAsync({
          connector,
          chainId: appChain.id,
        });
        pushToast({
          tone: "info",
          title: "Wallet connected",
          description: "Your wallet is ready. Click claim again if the prompt closes before sending.",
        });
        return;
      }

      if (chainId !== appChain.id) {
        await switchChainAsync({ chainId: appChain.id });
        pushToast({
          tone: "info",
          title: "Network switched",
          description: "You are now on Hardhat Localhost. Submit the claim again if needed.",
        });
      }

      await writeContractAsync({
        chainId: appChain.id,
        address: faucet.faucetAddress,
        abi: faucetAbi,
        functionName: "requestTokens",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to process claim.";
      setActionError(message);
      pushToast({
        tone: "error",
        title: "Claim request failed",
        description: message,
      });
    }
  };

  const status = useMemo(() => {
    if (!isConnected) {
      return {
        label: "Connect required",
        accent: "bg-[color:var(--gold)]",
      };
    }

    if (receipt.isLoading || isWriting || isSwitching) {
      return {
        label: "Processing",
        accent: "bg-[color:var(--gold)]",
      };
    }

    if (hasClaimed.data) {
      return {
        label: "Already claimed",
        accent: "bg-[color:var(--muted)]",
      };
    }

    return {
      label: "Available",
      accent: "bg-[color:var(--success)]",
    };
  }, [
    hasClaimed.data,
    isConnected,
    isSwitching,
    isWriting,
    receipt.isLoading,
  ]);

  const ctaLabel = useMemo(() => {
    if (!isConnected) return isConnecting ? "Connecting..." : "Connect to claim";
    if (isWrongChain) return isSwitching ? "Switching..." : "Switch network";
    if (receipt.isLoading || isWriting) return "Claiming...";
    if (hasClaimed.data) return "Claimed";
    return `Claim ${faucet.tokenSymbol}`;
  }, [
    faucet.tokenSymbol,
    hasClaimed.data,
    isConnected,
    isConnecting,
    isSwitching,
    isWrongChain,
    isWriting,
    receipt.isLoading,
  ]);

  return {
    address,
    amountAllowed: amountAllowed.data,
    balance: tokenBalance.data,
    claim,
    ctaLabel,
    hasClaimed: Boolean(hasClaimed.data),
    highlightBalance,
    isBusy: isConnecting || isSwitching || isWriting || receipt.isLoading,
    isConnected,
    isWrongChain,
    receiptHash: hash,
    status,
    txError: actionError,
  };
}
