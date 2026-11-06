"use client";

import { useEffect, useState, type FormEvent } from "react";

interface DemoTestRow {
  id: string;
  tester_label: string;
  completed: boolean;
  clarity_rating: number;
  value_rating: number;
  would_use: boolean;
  created_at: string;
}

interface Summary {
  total: number;
  completionRate: number | null;
  avgClarity: number | null;
  avgValue: number | null;
  wouldUseShare: number | null;
  rows: DemoTestRow[];
  error?: string;
}

const EMPTY_FORM = {
  testerLabel: "",
  testerRole: "",
  completed: "Yes",
  minutesTaken: "",
  clarityRating: "5",
  valueRating: "5",
  wouldUse: "Yes",
  issueFound: "",
  suggestion: "",
};

type FormField = keyof typeof EMPTY_FORM;

function formatPercent(value: number | null): string {
  return value === null ? "—" : `${Math.round(value)}%`;
}

function formatAverage(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(1)} / 5`;
}

export default function TestingSummary() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const response = await fetch("/api/demo/tests");
        const data = await response.json();
        if (!ignore) {
          setSummary(data);
          setIsLoading(false);
        }
      } catch {
        if (!ignore) {
          setSummary({
            total: 0,
            completionRate: null,
            avgClarity: null,
            avgValue: null,
            wouldUseShare: null,
            rows: [],
            error: "Couldn't load the testing summary.",
          });
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  function updateField(field: FormField, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/demo/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tester_label: form.testerLabel.trim(),
          tester_role: form.testerRole.trim(),
          completed: form.completed === "Yes",
          minutes_taken: form.minutesTaken.trim() ? Number(form.minutesTaken) : null,
          clarity_rating: Number(form.clarityRating),
          value_rating: Number(form.valueRating),
          would_use: form.wouldUse === "Yes",
          issue_found: form.issueFound.trim(),
          suggestion: form.suggestion.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setStatus("error");
        setMessage(data?.error ?? "Couldn't save this test result — please try again.");
        return;
      }

      setForm(EMPTY_FORM);
      setStatus("success");
      setMessage("Thanks — your test result was saved.");
      setRefreshKey((key) => key + 1);
    } catch {
      setStatus("error");
      setMessage("Couldn't save this test result — please try again.");
    }
  }

  return (
    <div className="w-full min-w-0">
      {isLoading ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : summary?.error ? (
        <p role="alert" className="text-sm text-red-600">
          {summary.error}
        </p>
      ) : summary && summary.total === 0 ? (
        <p className="text-sm text-zinc-500">No test results yet.</p>
      ) : summary ? (
        <>
          <div className="grid w-full min-w-0 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="min-w-0 rounded-xl border border-zinc-200 p-4">
              <p className="break-words text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Total testers
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
                {summary.total}
              </p>
            </div>
            <div className="min-w-0 rounded-xl border border-zinc-200 p-4">
              <p className="break-words text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Completion rate
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
                {formatPercent(summary.completionRate)}
              </p>
            </div>
            <div className="min-w-0 rounded-xl border border-zinc-200 p-4">
              <p className="break-words text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Average clarity
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
                {formatAverage(summary.avgClarity)}
              </p>
            </div>
            <div className="min-w-0 rounded-xl border border-zinc-200 p-4">
              <p className="break-words text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Average value
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
                {formatAverage(summary.avgValue)}
              </p>
            </div>
            <div className="min-w-0 rounded-xl border border-zinc-200 p-4">
              <p className="break-words text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Would use it
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
                {formatPercent(summary.wouldUseShare)}
              </p>
            </div>
          </div>

          <div className="mt-6 w-full min-w-0 overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Tester</th>
                  <th className="px-4 py-3">Completed</th>
                  <th className="px-4 py-3">Clarity</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Would use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {summary.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 font-medium text-zinc-900">{row.tester_label}</td>
                    <td className="px-4 py-3 text-zinc-600">{row.completed ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-zinc-600">{row.clarity_rating} / 5</td>
                    <td className="px-4 py-3 text-zinc-600">{row.value_rating} / 5</td>
                    <td className="px-4 py-3 text-zinc-600">{row.would_use ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <details className="mt-8 rounded-xl border border-zinc-200 p-6">
        <summary className="cursor-pointer text-base font-semibold text-zinc-900">
          For evaluators: add a test result
        </summary>

        <div className="mt-6">
          <p className="text-sm text-zinc-500">No names or personal data.</p>

          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="demo-tester-label" className="block text-sm font-medium text-zinc-700">
                Tester label
              </label>
              <input
                id="demo-tester-label"
                type="text"
                required
                maxLength={40}
                value={form.testerLabel}
                onChange={(e) => updateField("testerLabel", e.target.value)}
                placeholder="e.g. Tester 1"
                className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="demo-tester-role" className="block text-sm font-medium text-zinc-700">
                Tester role
              </label>
              <input
                id="demo-tester-role"
                type="text"
                required
                maxLength={60}
                value={form.testerRole}
                onChange={(e) => updateField("testerRole", e.target.value)}
                placeholder="e.g. Peer student"
                className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="demo-completed" className="block text-sm font-medium text-zinc-700">
                Completed the walkthrough
              </label>
              <select
                id="demo-completed"
                value={form.completed}
                onChange={(e) => updateField("completed", e.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label htmlFor="demo-minutes" className="block text-sm font-medium text-zinc-700">
                Minutes taken (optional)
              </label>
              <input
                id="demo-minutes"
                type="number"
                min={1}
                max={60}
                value={form.minutesTaken}
                onChange={(e) => updateField("minutesTaken", e.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="demo-clarity" className="block text-sm font-medium text-zinc-700">
                Clarity rating
              </label>
              <select
                id="demo-clarity"
                value={form.clarityRating}
                onChange={(e) => updateField("clarityRating", e.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="demo-value" className="block text-sm font-medium text-zinc-700">
                Value rating
              </label>
              <select
                id="demo-value"
                value={form.valueRating}
                onChange={(e) => updateField("valueRating", e.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="demo-would-use" className="block text-sm font-medium text-zinc-700">
                Would use it
              </label>
              <select
                id="demo-would-use"
                value={form.wouldUse}
                onChange={(e) => updateField("wouldUse", e.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="demo-issue" className="block text-sm font-medium text-zinc-700">
                Issue found
              </label>
              <input
                id="demo-issue"
                type="text"
                required
                maxLength={300}
                value={form.issueFound}
                onChange={(e) => updateField("issueFound", e.target.value)}
                placeholder="e.g. The checkpoint buttons were easy to miss"
                className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="demo-suggestion" className="block text-sm font-medium text-zinc-700">
                Suggestion (optional)
              </label>
              <input
                id="demo-suggestion"
                type="text"
                maxLength={300}
                value={form.suggestion}
                onChange={(e) => updateField("suggestion", e.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              {status === "error" && (
                <p role="alert" className="mb-3 text-sm text-red-600">
                  {message}
                </p>
              )}
              {status === "success" && (
                <p className="mb-3 text-sm text-emerald-600">{message}</p>
              )}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting…" : "Submit test result"}
              </button>
            </div>
          </form>
        </div>
      </details>
    </div>
  );
}
