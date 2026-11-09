"use client";

import { useEffect, useState, type FormEvent } from "react";
import { INTAKE_QUESTIONS } from "@/lib/chat-logic";

interface TestLogEntry {
  id: string;
  tester_label: string;
  tester_role: string;
  decision_type: string;
  completed: boolean;
  rating: number;
  issue_found: string;
  suggestion: string | null;
  created_at: string;
}

const DECISION_TYPE_OPTIONS = INTAKE_QUESTIONS[0].options;

const EMPTY_FORM = {
  testerLabel: "",
  testerRole: "",
  decisionType: "",
  completed: "Yes",
  rating: "5",
  issueFound: "",
  suggestion: "",
};

type FormField = keyof typeof EMPTY_FORM;

export default function TestLog() {
  const [entries, setEntries] = useState<TestLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const response = await fetch("/api/chat/tests");
        const data = await response.json();
        if (!ignore) {
          setEntries(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      } catch {
        if (!ignore) {
          setEntries([]);
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

    if (
      !form.testerLabel.trim() ||
      !form.testerRole.trim() ||
      !form.decisionType ||
      !form.issueFound.trim()
    ) {
      setStatus("error");
      setErrorText(
        "Tester label, tester role, decision type, and issue found are required."
      );
      return;
    }

    setStatus("submitting");
    setErrorText("");

    try {
      const response = await fetch("/api/chat/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tester_label: form.testerLabel.trim(),
          tester_role: form.testerRole.trim(),
          decision_type: form.decisionType,
          completed: form.completed === "Yes",
          rating: Number(form.rating),
          issue_found: form.issueFound.trim(),
          suggestion: form.suggestion.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setStatus("error");
        setErrorText(
          data?.error ?? "Couldn't save this test result — please try again."
        );
        return;
      }

      setForm(EMPTY_FORM);
      setStatus("idle");
      setRefreshKey((key) => key + 1);
    } catch {
      setStatus("error");
      setErrorText("Couldn't save this test result — please try again.");
    }
  }

  return (
    <details className="mt-12 w-full min-w-0 rounded-xl border border-zinc-200 p-6">
      <summary className="cursor-pointer text-lg font-semibold text-zinc-900">
        For evaluators: external test log
      </summary>

      <div className="mt-6">
        <p className="text-sm text-zinc-500">
          No names or personal data — use a label like &quot;Tester 1&quot;.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 grid w-full min-w-0 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tester-label" className="block text-sm font-medium text-zinc-700">
              Tester label
            </label>
            <input
              id="tester-label"
              type="text"
              value={form.testerLabel}
              onChange={(e) => updateField("testerLabel", e.target.value)}
              placeholder="e.g. Tester 1"
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="tester-role" className="block text-sm font-medium text-zinc-700">
              Tester role
            </label>
            <input
              id="tester-role"
              type="text"
              value={form.testerRole}
              onChange={(e) => updateField("testerRole", e.target.value)}
              placeholder="e.g. Peer student"
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="test-decision-type" className="block text-sm font-medium text-zinc-700">
              Decision type
            </label>
            <select
              id="test-decision-type"
              value={form.decisionType}
              onChange={(e) => updateField("decisionType", e.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Select a type</option>
              {DECISION_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="test-completed" className="block text-sm font-medium text-zinc-700">
              Completed
            </label>
            <select
              id="test-completed"
              value={form.completed}
              onChange={(e) => updateField("completed", e.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label htmlFor="test-rating" className="block text-sm font-medium text-zinc-700">
              Rating
            </label>
            <select
              id="test-rating"
              value={form.rating}
              onChange={(e) => updateField("rating", e.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="test-issue" className="block text-sm font-medium text-zinc-700">
              Issue found
            </label>
            <input
              id="test-issue"
              type="text"
              value={form.issueFound}
              onChange={(e) => updateField("issueFound", e.target.value)}
              placeholder="e.g. Quick replies wrap oddly on mobile"
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="test-suggestion" className="block text-sm font-medium text-zinc-700">
              Suggestion (optional)
            </label>
            <input
              id="test-suggestion"
              type="text"
              value={form.suggestion}
              onChange={(e) => updateField("suggestion", e.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            {status === "error" && (
              <p className="mb-3 text-sm text-red-600">{errorText}</p>
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

        <div className="mt-8 w-full min-w-0 overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Tester</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Decision</th>
                <th className="px-4 py-3">Completed</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Issue found</th>
                <th className="px-4 py-3">Suggestion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3 font-medium text-zinc-900">{entry.tester_label}</td>
                  <td className="px-4 py-3 text-zinc-600">{entry.tester_role}</td>
                  <td className="px-4 py-3 text-zinc-600">{entry.decision_type}</td>
                  <td className="px-4 py-3 text-zinc-600">{entry.completed ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-zinc-600">{entry.rating}</td>
                  <td className="px-4 py-3 text-zinc-600">{entry.issue_found}</td>
                  <td className="px-4 py-3 text-zinc-600">{entry.suggestion ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && entries.length === 0 && (
            <p className="px-4 py-6 text-sm text-zinc-500">No test results yet.</p>
          )}
          {isLoading && <p className="px-4 py-6 text-sm text-zinc-500">Loading…</p>}
        </div>
      </div>
    </details>
  );
}
