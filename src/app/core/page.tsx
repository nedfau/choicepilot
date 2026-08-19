"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

type SaveStatus = "idle" | "saving" | "saved" | "error" | "not-configured";

interface RecentEntry {
  id: string;
  input_text: string;
  created_at: string;
}

const TITLE_WORD_COUNT = 6;
const RELATIVE_TIME_UNITS: Array<{
  amount: number;
  unit: Intl.RelativeTimeFormatUnit;
}> = [
  { amount: 60, unit: "seconds" },
  { amount: 60, unit: "minutes" },
  { amount: 24, unit: "hours" },
  { amount: 7, unit: "days" },
  { amount: 4.34524, unit: "weeks" },
  { amount: 12, unit: "months" },
  { amount: Infinity, unit: "years" },
];

function titleFromText(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= TITLE_WORD_COUNT) return words.join(" ");
  return words.slice(0, TITLE_WORD_COUNT).join(" ") + "…";
}

function relativeTime(isoDate: string): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let duration = (new Date(isoDate).getTime() - Date.now()) / 1000;

  for (const { amount, unit } of RELATIVE_TIME_UNITS) {
    if (Math.abs(duration) < amount) {
      return rtf.format(Math.round(duration), unit);
    }
    duration /= amount;
  }
  return rtf.format(Math.round(duration), "years");
}

export default function Core() {
  const [inputText, setInputText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<{
    options: string[];
    priorities: string[];
  } | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [recentEntries, setRecentEntries] = useState<RecentEntry[] | null>(
    null
  );
  const [recentUnavailable, setRecentUnavailable] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadRecentEntries() {
      if (!supabase) {
        if (!ignore) {
          setRecentEntries([]);
          setRecentUnavailable(true);
        }
        return;
      }
      const { data, error } = await supabase
        .from("core_outputs")
        .select("id, input_text, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (ignore) return;
      if (error || !data) {
        setRecentEntries([]);
        setRecentUnavailable(true);
        return;
      }
      setRecentEntries(data);
      setRecentUnavailable(false);
    }

    loadRecentEntries();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = inputText.trim();
    if (!trimmed) {
      setValidationError("Describe the decision you're facing before extracting.");
      setResult(null);
      return;
    }

    setValidationError(null);
    setSaveStatus("idle");
    setIsExtracting(true);
    try {
      const response = await fetch("/api/core/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await response.json();
      setResult(data);
    } finally {
      setIsExtracting(false);
    }
  }

  async function handleSave() {
    if (!result) return;

    if (!supabase) {
      setSaveStatus("not-configured");
      return;
    }

    setSaveStatus("saving");
    const { error } = await supabase.from("core_outputs").insert({
      input_text: inputText.trim(),
      options: result.options,
      priorities: result.priorities,
    });
    setSaveStatus(error ? "error" : "saved");
    if (!error) setRefreshKey((key) => key + 1);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Extract the core of your decision
      </h1>
      <p className="mt-3 text-lg leading-7 text-zinc-600">
        Describe your situation in your own words. ChoicePilot pulls out the
        options and priorities so a comparison can act on them later.
      </p>

      <form onSubmit={handleSubmit} className="mt-10">
        <label
          htmlFor="decision-text"
          className="block text-sm font-medium text-zinc-700"
        >
          Describe the decision you&apos;re facing
        </label>
        <textarea
          id="decision-text"
          rows={5}
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
          placeholder="e.g. I'm choosing between Apartment A and Apartment B, price and commute time matter most"
        />
        {validationError && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {validationError}
          </p>
        )}
        <button
          type="submit"
          disabled={isExtracting}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
        >
          {isExtracting ? "Extracting…" : "Extract core"}
        </button>
      </form>

      {result && (
        <div className="mt-10 rounded-xl border border-zinc-200 p-6">
          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            Simulated — rule-based, not AI
          </span>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                Options detected
              </h2>
              {result.options.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {result.options.map((option) => (
                    <li
                      key={option}
                      className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-zinc-500">
                  No options detected.
                </p>
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                Priorities detected
              </h2>
              {result.priorities.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {result.priorities.map((priority) => (
                    <li
                      key={priority}
                      className="rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700"
                    >
                      {priority}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-zinc-500">
                  No priorities detected.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-60"
            >
              {saveStatus === "saving" ? "Saving…" : "Save"}
            </button>
            {saveStatus === "saved" && (
              <p className="text-sm text-emerald-600">Saved.</p>
            )}
            {saveStatus === "error" && (
              <p className="text-sm text-red-600">
                Couldn&apos;t save — please try again.
              </p>
            )}
            {saveStatus === "not-configured" && (
              <p className="text-sm text-zinc-500">
                Supabase isn&apos;t configured yet — set NEXT_PUBLIC_SUPABASE_URL
                and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable saving.
              </p>
            )}
          </div>
        </div>
      )}

      <section className="mt-16 border-t border-zinc-100 pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Recent decisions
        </h2>
        {recentEntries === null ? (
          <p className="mt-4 text-sm text-zinc-500">Loading…</p>
        ) : recentUnavailable ? (
          <p className="mt-4 text-sm text-zinc-500">
            Recent entries aren&apos;t available yet.
          </p>
        ) : recentEntries.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            No saved decisions yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {recentEntries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3"
              >
                <span className="text-sm text-zinc-800">
                  {titleFromText(entry.input_text)}
                </span>
                <span className="text-xs text-zinc-400">
                  {relativeTime(entry.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
