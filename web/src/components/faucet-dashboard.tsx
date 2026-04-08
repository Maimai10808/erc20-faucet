"use client";

import { Landmark, NotebookPen } from "lucide-react";
import { AdminFundingPanel } from "@/components/admin-funding-panel";
import { CandidatePanel } from "@/components/candidate-panel";
import { ElectionScoreboard } from "@/components/election-scoreboard";
import { NetworkNotice } from "@/components/network-notice";
import { WalletButton } from "@/components/wallet-button";
import { useElection } from "@/hooks/use-election";
import { candidates } from "@/shared/election";

export function FaucetDashboard() {
  const state = useElection();
  const currentVoteId = state.election.votedFor?.id ?? null;

  return (
    <main className="page-shell min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="paper-panel animate-panel-rise overflow-hidden rounded-[36px] px-6 py-6 md:px-8 md:py-8">
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#a3202d_0%,#f5f5f5_50%,#143f8b_100%)]" />
            <div className="max-w-4xl pt-3">
              <p className="mono-font text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
                National election faucet
              </p>
              <h1 className="headline-font mt-4 text-5xl leading-none tracking-tight text-[color:var(--ink)] md:text-7xl">
                Cast one ballot.
                <br />
                Claim one side.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[color:var(--muted)] md:text-lg">
                The faucet now behaves like a campaign election. A wallet can vote
                only once. Voting for Trump transfers Trump Coin. Voting for Biden
                transfers Biden Coin. The scoreboard above the race updates as ballots
                come in.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Badge icon={<Landmark className="h-4 w-4" />}>
                  One wallet, one ballot
                </Badge>
                <Badge icon={<NotebookPen className="h-4 w-4" />}>
                  Vote and claim in the same transaction
                </Badge>
              </div>
            </div>

            <WalletButton />
          </div>
        </header>

        <NetworkNotice />

        <ElectionScoreboard
          bidenBalance={state.candidates.biden.balance}
          bidenVotes={state.candidates.biden.votes}
          rewardAmount={state.election.rewardAmount}
          totalVotes={state.election.totalVotes}
          trumpBalance={state.candidates.trump.balance}
          trumpVotes={state.candidates.trump.votes}
          votePercentages={state.election.votePercentages}
        />

        <section className="grid gap-5 lg:grid-cols-2">
          <CandidatePanel
            candidate={candidates[0]}
            currentVoteId={currentVoteId}
            hasVoted={state.election.hasVoted}
            highlight={state.election.highlightCandidateId === "trump"}
            isBusy={state.election.isBusy}
            isConnected={state.account.isConnected}
            onVote={() => void state.election.voteFor(candidates[0])}
            reserveBalance={state.candidates.trump.balance}
            rewardAmount={state.election.rewardAmount}
            voteCount={state.candidates.trump.votes}
            walletBalance={state.candidates.trump.walletBalance}
          />

          <CandidatePanel
            candidate={candidates[1]}
            currentVoteId={currentVoteId}
            hasVoted={state.election.hasVoted}
            highlight={state.election.highlightCandidateId === "biden"}
            isBusy={state.election.isBusy}
            isConnected={state.account.isConnected}
            onVote={() => void state.election.voteFor(candidates[1])}
            reserveBalance={state.candidates.biden.balance}
            rewardAmount={state.election.rewardAmount}
            voteCount={state.candidates.biden.votes}
            walletBalance={state.candidates.biden.walletBalance}
          />
        </section>

        <AdminFundingPanel
          amount={state.admin.adminAmount}
          canManage={state.admin.canManage}
          isBusy={state.election.isBusy}
          onAmountChange={state.admin.setAdminAmount}
          onCandidateChange={state.admin.setSelectedCandidateId}
          onSubmit={() => void state.admin.submitFund()}
          owner={state.admin.owner}
          selectedCandidateId={state.admin.selectedCandidateId}
        />

        {state.election.hasVoted ? (
          <section className="paper-panel animate-panel-rise rounded-[28px] px-6 py-6">
            <p className="mono-font text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
              Ballot lock
            </p>
            <h2 className="headline-font mt-3 text-4xl leading-none text-[color:var(--ink)]">
              This wallet has already voted for {state.election.votedFor?.name}.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[color:var(--muted)]">
              The election contract permanently locks each wallet after one vote. To
              test the other path, use a different funded local account.
            </p>
          </section>
        ) : null}

        {state.election.actionError ? (
          <section className="rounded-[24px] border border-[#a3202d]/20 bg-[rgba(255,241,239,0.78)] px-5 py-4 text-sm text-[#7d1d28]">
            {state.election.actionError}
          </section>
        ) : null}
      </div>
    </main>
  );
}

function Badge({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[color:var(--ink)]">
      {icon}
      {children}
    </div>
  );
}
