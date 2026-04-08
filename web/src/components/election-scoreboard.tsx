"use client";

import { Trophy } from "lucide-react";
import { candidates } from "@/shared/election";
import { formatTokenAmount } from "@/utils/format";

type ElectionScoreboardProps = {
  trumpVotes?: bigint;
  bidenVotes?: bigint;
  totalVotes?: bigint;
  rewardAmount?: bigint;
  trumpBalance?: bigint;
  bidenBalance?: bigint;
  votePercentages: {
    trump: number;
    biden: number;
  };
};

export function ElectionScoreboard({
  trumpVotes,
  bidenVotes,
  totalVotes,
  rewardAmount,
  trumpBalance,
  bidenBalance,
  votePercentages,
}: ElectionScoreboardProps) {
  return (
    <section className="paper-panel animate-panel-rise rounded-[32px] px-6 py-6 md:px-8 md:py-8">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-font text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
              Electoral board
            </p>
            <h2 className="headline-font mt-3 text-4xl leading-none text-[color:var(--ink)] md:text-5xl">
              Live primary scoreboard
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-semibold text-[color:var(--ink)]">
            <Trophy className="h-4 w-4 text-[color:var(--gold)]" />
            Total ballots: {formatTokenAmount(totalVotes, 0, 0)}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[28px] border border-black/10 bg-[rgba(255,255,255,0.55)] p-5">
            <div className="flex h-6 overflow-hidden rounded-full bg-black/8">
              <div
                className="h-full bg-[#a3202d] transition-all duration-500"
                style={{ width: `${votePercentages.trump}%` }}
              />
              <div
                className="h-full bg-[#143f8b] transition-all duration-500"
                style={{ width: `${votePercentages.biden}%` }}
              />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <ScoreTile
                balance={trumpBalance}
                colorClassName="bg-[#a3202d]"
                label={candidates[0].name}
                percentage={votePercentages.trump}
                votes={trumpVotes}
              />
              <ScoreTile
                balance={bidenBalance}
                colorClassName="bg-[#143f8b]"
                label={candidates[1].name}
                percentage={votePercentages.biden}
                votes={bidenVotes}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-[rgba(255,255,255,0.55)] p-5">
            <p className="mono-font text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Current reward
            </p>
            <p className="headline-font mt-3 text-5xl text-[color:var(--ink)]">
              {formatTokenAmount(rewardAmount)} tokens
            </p>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              One ballot mints one political outcome. The wallet chooses a side only
              once, then receives the matching reward amount from the campaign reserve.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreTile({
  balance,
  colorClassName,
  label,
  percentage,
  votes,
}: {
  balance?: bigint;
  colorClassName: string;
  label: string;
  percentage: number;
  votes?: bigint;
}) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-white/70 p-4">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${colorClassName}`} />
        <p className="text-sm font-semibold text-[color:var(--ink)]">{label}</p>
      </div>
      <p className="mt-4 text-3xl font-semibold text-[color:var(--ink)]">
        {formatTokenAmount(votes, 0, 0)}
      </p>
      <p className="mt-1 text-sm text-[color:var(--muted)]">
        {percentage.toFixed(1)}% of ballots
      </p>
      <p className="mt-4 mono-font text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
        Reserve
      </p>
      <p className="mt-1 text-sm font-semibold text-[color:var(--ink)]">
        {formatTokenAmount(balance)} tokens
      </p>
    </div>
  );
}
