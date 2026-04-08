"use client";

import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import type { CandidateDefinition } from "@/shared/election";
import { formatTokenAmount } from "@/utils/format";

type CandidatePanelProps = {
  candidate: CandidateDefinition;
  currentVoteId: string | null;
  hasVoted: boolean;
  isBusy: boolean;
  isConnected: boolean;
  rewardAmount?: bigint;
  onVote: () => void;
};

export function CandidatePanel({
  candidate,
  currentVoteId,
  hasVoted,
  isBusy,
  isConnected,
  rewardAmount,
  onVote,
}: CandidatePanelProps) {
  const selected = currentVoteId === candidate.id;
  const disabled = isBusy || (hasVoted && !selected);

  const isTrump = candidate.id === "trump";

  return (
    <article
      className={`overflow-hidden rounded-[32px] border shadow-[0_20px_60px_rgba(15,23,42,0.08)] ${
        isTrump ? "border-red-200 bg-white" : "border-blue-200 bg-white"
      }`}
    >
      <div
        className={`px-6 pt-6 pb-5 md:px-8 md:pt-8 ${
          isTrump
            ? "bg-gradient-to-b from-red-50 to-white"
            : "bg-gradient-to-b from-blue-50 to-white"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                isTrump ? "text-red-700" : "text-blue-700"
              }`}
            >
              {candidate.runningMate}
            </p>

            <h3 className="mt-3 text-4xl font-black leading-none tracking-tight text-[color:var(--ink)] md:text-5xl xl:text-6xl">
              {candidate.name}
            </h3>

            <p className="mt-4 max-w-[28rem] text-base leading-7 text-[color:var(--muted)] md:text-lg">
              {candidate.manifesto}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
              selected
                ? "bg-black text-white"
                : isTrump
                  ? "bg-red-600 text-white"
                  : "bg-blue-700 text-white"
            }`}
          >
            {selected ? "Your vote" : candidate.symbol}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <div className="overflow-hidden rounded-[28px] border border-black/10 bg-neutral-100">
          <div className="relative aspect-[4/4.8] w-full md:aspect-[4/4.6]">
            <Image
              src={isTrump ? "/trump.jpg" : "/biden.jpg"}
              alt={candidate.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 md:p-7">
              <p className="max-w-[24rem] text-2xl font-extrabold leading-tight text-white md:text-3xl">
                {candidate.slogan}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            className={`inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold transition disabled:cursor-not-allowed disabled:opacity-55 ${
              isTrump
                ? "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600"
                : "bg-blue-700 text-white hover:bg-blue-800 focus-visible:outline-blue-700"
            }`}
            disabled={disabled}
            onClick={onVote}
            type="button"
          >
            {isBusy ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Submitting vote...
              </>
            ) : selected ? (
              "Vote already cast"
            ) : !isConnected ? (
              `Connect wallet to vote`
            ) : (
              `Vote for ${candidate.name}`
            )}
          </button>
        </div>

        <div className="mt-5 rounded-[24px] border border-black/10 bg-neutral-50 p-5">
          <p className="text-sm leading-7 text-[color:var(--muted)] md:text-[15px]">
            Claim{" "}
            <span className="font-semibold text-[color:var(--ink)]">
              {formatTokenAmount(rewardAmount)} {candidate.symbol}
            </span>{" "}
            with this vote. Each wallet can vote only once, and claiming a token
            counts as your final ballot.
          </p>
        </div>
      </div>
    </article>
  );
}
