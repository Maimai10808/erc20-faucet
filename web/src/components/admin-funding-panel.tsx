"use client";

import { ShieldCheck } from "lucide-react";
import { candidates, type CandidateId } from "@/shared/election";

type AdminFundingPanelProps = {
  amount: string;
  owner?: `0x${string}`;
  selectedCandidateId: CandidateId;
  canManage: boolean;
  isBusy: boolean;
  onAmountChange: (value: string) => void;
  onCandidateChange: (value: CandidateId) => void;
  onSubmit: () => void;
};

export function AdminFundingPanel({
  amount,
  owner,
  selectedCandidateId,
  canManage,
  isBusy,
  onAmountChange,
  onCandidateChange,
  onSubmit,
}: AdminFundingPanelProps) {
  if (!owner) return null;

  return (
    <section className="paper-panel animate-panel-rise rounded-[28px] px-6 py-6 md:px-8">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-font text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
              Campaign treasury
            </p>
            <h2 className="headline-font mt-3 text-4xl leading-none text-[color:var(--ink)]">
              Administrator funding controls
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-[color:var(--ink)]">
            <ShieldCheck className="h-4 w-4 text-[color:var(--success)]" />
            {canManage ? "Owner wallet connected" : "Read-only for non-owner"}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[24px] border border-black/10 bg-white/60 p-5">
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Owner-only controls let the campaign treasury approve token spending and
              refill the election faucet for either ticket.
            </p>
            <p className="mt-3 mono-font text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Owner
            </p>
            <p className="mt-2 break-all text-sm font-semibold text-[color:var(--ink)]">
              {owner}
            </p>
          </div>

          <div className="rounded-[24px] border border-black/10 bg-white/60 p-5">
            <div className="grid gap-3">
              <label className="grid gap-2">
                <span className="mono-font text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Candidate reserve
                </span>
                <select
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[color:var(--ink)]"
                  disabled={!canManage || isBusy}
                  onChange={(event) =>
                    onCandidateChange(event.target.value as CandidateId)
                  }
                  value={selectedCandidateId}
                >
                  {candidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="mono-font text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Fund amount
                </span>
                <input
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[color:var(--ink)]"
                  disabled={!canManage || isBusy}
                  onChange={(event) => onAmountChange(event.target.value)}
                  placeholder="500"
                  value={amount}
                />
              </label>

              <button
                className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-55"
                disabled={!canManage || isBusy}
                onClick={onSubmit}
                type="button"
              >
                {isBusy ? "Submitting treasury tx..." : "Approve and fund reserve"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
