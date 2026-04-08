"use client";

import { ExternalLink, LoaderCircle } from "lucide-react";
import type { FaucetDefinition } from "@/shared/faucets";
import { formatTokenAmount, shortenAddress } from "@/utils/format";
import { useFaucetCard } from "@/hooks/use-faucet-card";

export function FaucetCard({ faucet }: { faucet: FaucetDefinition }) {
  const state = useFaucetCard(faucet);

  return (
    <article
      className={`animate-panel-rise rounded-[28px] border p-6 md:p-7 ${faucet.theme.tintClassName} ${
        faucet.theme.tone === "red" ? "card-glow-red" : "card-glow-blue"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${faucet.theme.badgeClassName}`}
          >
            {faucet.tokenSymbol}
          </span>
          <div>
            <h2 className="headline-font text-4xl font-semibold tracking-tight text-[color:var(--ink)]">
              {faucet.tokenName}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-[color:var(--muted)]">
              {faucet.slogan}
            </p>
          </div>
        </div>

        <div className="status-pill bg-white/75 text-[color:var(--ink)]">
          <span className={`status-dot ${state.status.accent}`} />
          {state.status.label}
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Metric label="Wallet" value={shortenAddress(state.address)} />
        <Metric
          highlight={state.highlightBalance}
          label="Wallet balance"
          value={`${formatTokenAmount(state.balance)} ${faucet.tokenSymbol}`}
        />
        <Metric
          label="Claim amount"
          value={`${formatTokenAmount(state.amountAllowed)} ${faucet.tokenSymbol}`}
        />
        <Metric
          label="Claim rule"
          value={state.hasClaimed ? "One-time limit reached" : "One claim per wallet"}
        />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${faucet.theme.buttonClassName}`}
          disabled={state.hasClaimed || state.isBusy}
          onClick={state.claim}
          type="button"
        >
          {state.isBusy ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              {state.ctaLabel}
            </>
          ) : (
            state.ctaLabel
          )}
        </button>

        {state.isWrongChain ? (
          <div className="rounded-2xl border border-[color:var(--red)]/20 bg-[rgba(255,255,255,0.6)] p-3 text-sm text-[color:var(--muted)]">
            This wallet is connected, but not on Hardhat Localhost. The app can
            request a switch for you before claiming.
          </div>
        ) : null}

        {state.receiptHash ? (
          <p className="mono-font flex items-center gap-2 text-xs text-[color:var(--muted)]">
            Receipt pending
            <ExternalLink className="h-3.5 w-3.5" />
            {state.receiptHash.slice(0, 12)}...
          </p>
        ) : null}

        {state.txError ? (
          <p className="text-sm text-[#8f2434]">{state.txError}</p>
        ) : (
          <p className="text-sm text-[color:var(--muted)]">
            {state.isConnected
              ? "Each faucet can only be claimed once per wallet."
              : "If you click claim while disconnected, the app will ask you to connect first."}
          </p>
        )}
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-black/10 bg-white/55 p-4 transition ${
        highlight ? "balance-highlight" : ""
      }`}
    >
      <p className="mono-font text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-[color:var(--ink)]">
        {value}
      </p>
    </div>
  );
}
