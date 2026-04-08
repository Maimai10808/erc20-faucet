"use client";

import { AlertTriangle, LoaderCircle, WandSparkles } from "lucide-react";
import { useAccount, useSwitchChain } from "wagmi";
import { appChain } from "@/lib/web3/config";

export function NetworkNotice() {
  const { chainId, isConnected } = useAccount();
  const { switchChainAsync, isPending } = useSwitchChain();
  const isWrongChain = Boolean(isConnected && chainId !== appChain.id);

  if (!isConnected) {
    return (
      <div className="paper-panel animate-panel-rise rounded-[24px] border px-5 py-4">
        <div className="flex items-start gap-3">
          <WandSparkles className="mt-0.5 h-5 w-5 text-[color:var(--blue)]" />
          <div>
            <p className="text-sm font-semibold text-[color:var(--ink)]">
              Wallet connection is optional until you claim.
            </p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Clicking a ballot button will prompt a wallet connection automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isWrongChain) return null;

  return (
    <div className="paper-panel animate-panel-rise rounded-[24px] border border-[color:var(--red)]/20 bg-[rgba(255,236,232,0.8)] px-5 py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-[color:var(--red)]" />
          <div>
            <p className="text-sm font-semibold text-[color:var(--ink)]">
              Wrong network detected.
            </p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Switch to Hardhat Localhost ({appChain.id}) before casting a ballot or
              funding campaign reserves.
            </p>
          </div>
        </div>

        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--red)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8f2434] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          onClick={() => void switchChainAsync({ chainId: appChain.id })}
          type="button"
        >
          {isPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Switching...
            </>
          ) : (
            "Switch to Hardhat"
          )}
        </button>
      </div>
    </div>
  );
}
