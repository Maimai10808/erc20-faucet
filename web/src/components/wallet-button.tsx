"use client";

import { useMemo, useState } from "react";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import { appChain } from "@/lib/web3/config";
import { shortenAddress } from "@/utils/format";

function getPreferredConnector(connectors: ReturnType<typeof useConnectors>) {
  return (
    connectors.find((connector) => connector.id === "metaMask") ??
    connectors.find((connector) => connector.id === "injected") ??
    connectors[0]
  );
}

export function WalletButton() {
  const { address, chain, chainId, isConnected } = useAccount();
  const connectors = useConnectors();
  const { connectAsync, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [error, setError] = useState<string | null>(null);

  const label = useMemo(() => {
    if (isConnected) return shortenAddress(address);
    return isPending ? "Connecting..." : "Connect wallet";
  }, [address, isConnected, isPending]);

  const networkLabel = useMemo(() => {
    if (!isConnected) return "No network";
    if (!chain) return `Chain ${chainId ?? "unknown"}`;
    return `${chain.name} (${chain.id})`;
  }, [chain, chainId, isConnected]);

  const isWrongChain = Boolean(isConnected && chainId !== appChain.id);

  const handleClick = async () => {
    setError(null);

    if (isConnected) {
      disconnect();
      return;
    }

    try {
      const connector = getPreferredConnector(connectors);
      if (!connector) {
        throw new Error("No injected wallet found.");
      }

      await connectAsync({ connector });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet connection failed.");
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        className="rounded-full border border-black/10 bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
        onClick={handleClick}
        type="button"
      >
        {label}
      </button>
      <div className="rounded-2xl border border-black/10 bg-white/55 px-3 py-2 text-right">
        <p className="mono-font text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
          Current network
        </p>
        <p
          className={`mt-1 text-sm font-semibold ${
            isWrongChain ? "text-[#8f2434]" : "text-[color:var(--ink)]"
          }`}
        >
          {networkLabel}
        </p>
      </div>
      {error ? <p className="max-w-52 text-right text-xs text-[#8f2434]">{error}</p> : null}
    </div>
  );
}
