"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

type SaveStatus = "idle" | "saving" | "saved" | "error" | "not-configured";

export default function Core() {
  const [inputText, setInputText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<{
    options: string[];
    priorities: string[];
  } | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

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
    </div>
  );
}
