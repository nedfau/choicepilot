"use client";

import { useEffect, useState } from "react";
import type { AbTest } from "@/lib/marketing-content";

const STORAGE_PREFIX = "choicepilot_ab_vote_";

function getStoredVote(testName: string): "A" | "B" | null {
  try {
    const value = localStorage.getItem(STORAGE_PREFIX + testName);
    return value === "A" || value === "B" ? value : null;
  } catch {
    return null;
  }
}

function setStoredVote(testName: string, variant: "A" | "B") {
  try {
    localStorage.setItem(STORAGE_PREFIX + testName, variant);
  } catch {
    // Storage unavailable (private mode, disabled, etc.) — vote still recorded server-side.
  }
}

function clearStoredVote(testName: string) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + testName);
  } catch {
    // ignore
  }
}

interface VoteCounts {
  a: number;
  b: number;
  total: number;
}

async function fetchCounts(testName: string): Promise<VoteCounts> {
  try {
    const response = await fetch(
      `/api/marketing/votes?test=${encodeURIComponent(testName)}`
    );
    const data = await response.json();
    return { a: data.a ?? 0, b: data.b ?? 0, total: data.total ?? 0 };
  } catch {
    return { a: 0, b: 0, total: 0 };
  }
}

export default function AbTestCard({ test }: { test: AbTest }) {
  const [votedVariant, setVotedVariant] = useState<"A" | "B" | null>(null);
  const [counts, setCounts] = useState<VoteCounts>({ a: 0, b: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  // Randomize left/right display order once per mount (page load).
  const [variantAIsLeft] = useState(() => Math.random() < 0.5);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const stored = getStoredVote(test.testName);
      const result = await fetchCounts(test.testName);
      if (!ignore) {
        setVotedVariant(stored);
        setCounts(result);
        setIsLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [test.testName]);

  async function handleVote(variant: "A" | "B") {
    setIsVoting(true);
    setVoteError(null);
    try {
      const response = await fetch("/api/marketing/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test_name: test.testName, variant }),
      });
      if (!response.ok) {
        setVoteError("Couldn't record your vote — please try again.");
        return;
      }
      setStoredVote(test.testName, variant);
      setVotedVariant(variant);
      setCounts(await fetchCounts(test.testName));
    } catch {
      setVoteError("Couldn't record your vote — please try again.");
    } finally {
      setIsVoting(false);
    }
  }

  function handleReset() {
    clearStoredVote(test.testName);
    setVotedVariant(null);
  }

  const leftVariantId: "A" | "B" = variantAIsLeft ? "A" : "B";
  const rightVariantId: "A" | "B" = variantAIsLeft ? "B" : "A";
  const variantCopy: Record<"A" | "B", string> = {
    A: test.variants[0].copy,
    B: test.variants[1].copy,
  };

  const total = counts.total;
  const aPct = total > 0 ? Math.round((counts.a / total) * 100) : 0;
  const bPct = total > 0 ? Math.round((counts.b / total) * 100) : 0;
  const leader: "A" | "B" | "tie" =
    total === 0 || counts.a === counts.b ? "tie" : counts.a > counts.b ? "A" : "B";

  return (
    <div
      id={`marketing-abtest-${test.testName}`}
      className="rounded-xl border border-zinc-200 p-6"
    >
      <p className="text-sm font-semibold text-zinc-900">{test.label}</p>

      {isLoading ? (
        <p className="mt-4 text-sm text-zinc-500">Loading…</p>
      ) : !votedVariant ? (
        <>
          <p className="mt-1 text-xs text-zinc-500">
            Pick the version you prefer.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[leftVariantId, rightVariantId].map((variantId) => (
              <button
                key={variantId}
                type="button"
                disabled={isVoting}
                onClick={() => handleVote(variantId)}
                aria-label={`Vote for this version of ${test.label}`}
                className="rounded-lg border border-zinc-200 p-4 text-left text-sm text-zinc-700 transition-colors hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {variantCopy[variantId]}
              </button>
            ))}
          </div>
          {voteError && (
            <p className="mt-2 text-sm text-red-600">{voteError}</p>
          )}
        </>
      ) : (
        <div className="mt-4 space-y-3">
          {(["A", "B"] as const).map((variantId) => {
            const pct = variantId === "A" ? aPct : bPct;
            const count = variantId === "A" ? counts.a : counts.b;
            return (
              <div key={variantId}>
                <div className="flex items-center justify-between text-xs text-zinc-600">
                  <span>
                    Variant {variantId}
                    {votedVariant === variantId && " (your vote)"}
                  </span>
                  <span>
                    {pct}% ({count})
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-700">
                  {variantCopy[variantId]}
                </p>
                <div className="mt-1 h-2 w-full rounded-full bg-zinc-100">
                  <div
                    className="h-2 rounded-full bg-indigo-600"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}

          <p className="text-xs font-medium text-zinc-500">
            {total === 0
              ? "No votes yet."
              : leader === "tie"
                ? `Tied — ${total} total votes.`
                : `Leading: Variant ${leader} — ${total} total votes.`}
          </p>
          {total < 30 && (
            <p className="text-xs text-amber-700">
              Too few votes to be conclusive.
            </p>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-medium text-zinc-400 underline hover:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Reset my vote (demo)
          </button>
        </div>
      )}
    </div>
  );
}
