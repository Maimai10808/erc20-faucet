"use client";

import { FaucetCard } from "@/components/faucet-card";
import { NetworkNotice } from "@/components/network-notice";
import { WalletButton } from "@/components/wallet-button";
import { faucetDefinitions } from "@/shared/faucets";

export function FaucetDashboard() {
  return (
    <main className="page-shell min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="paper-panel animate-panel-rise rounded-[32px] px-6 py-6 md:px-8 md:py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="mono-font text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
                Local campaign faucet
              </p>
              <h1 className="headline-font mt-4 text-5xl leading-none tracking-tight text-[color:var(--ink)] md:text-7xl">
                Claim one side.
                <br />
                Claim the other.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--muted)] md:text-lg">
                Two faucet contracts, two one-time claims, one wallet session. Connect
                your wallet, stay on the local Hardhat chain, and each card will tell
                you whether that wallet has already claimed.
              </p>
            </div>

            <WalletButton />
          </div>
        </header>

        <NetworkNotice />

        <section className="grid gap-5 lg:grid-cols-2">
          {faucetDefinitions.map((faucet, index) => (
            <div
              className={index === 1 ? "[animation-delay:120ms]" : ""}
              key={faucet.id}
            >
              <FaucetCard faucet={faucet} />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
