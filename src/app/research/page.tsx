"use client";

import { useState } from "react";
import IntakeForm from "@/components/research/IntakeForm";
import type { ResearchEntry } from "@/lib/researchEntry";

export default function Research() {
  const [entries, setEntries] = useState<ResearchEntry[]>([]);

  function handleEntryAdded(entry: ResearchEntry) {
    setEntries((prev) => [entry, ...prev]);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Research &amp; benchmarking
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-7 text-zinc-600">
        Tracking global examples, competitors, and substitutes across
        housing, insurance, and banking — and the gaps they leave for
        international students.
      </p>

      <div className="mt-10">
        <IntakeForm onEntryAdded={handleEntryAdded} />
        {entries.length > 0 && (
          <p className="mt-4 text-sm text-zinc-500">
            {entries.length} added this session.
          </p>
        )}
      </div>
    </div>
  );
}
