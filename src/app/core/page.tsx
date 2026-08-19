"use client";

import { useState, type FormEvent } from "react";

export default function Core() {
  const [inputText, setInputText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<{
    options: string[];
    priorities: string[];
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = inputText.trim();
    if (!trimmed) {
      setValidationError("Describe the decision you're facing before extracting.");
      setResult(null);
      return;
    }

    setValidationError(null);
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
        <pre className="mt-10 whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
