"use client";

import { useEffect, useState } from "react";
import IntakeForm from "@/components/research/IntakeForm";
import ResearchTable from "@/components/research/ResearchTable";
import { supabase } from "@/lib/supabaseClient";
import type { ResearchEntry } from "@/lib/researchEntry";

export default function Research() {
  const [entries, setEntries] = useState<ResearchEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadEntries() {
      if (!supabase) {
        if (!ignore) setIsLoading(false);
        return;
      }
      const { data } = await supabase
        .from("research_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!ignore) {
        setEntries(data ?? []);
        setIsLoading(false);
      }
    }

    loadEntries();
    return () => {
      ignore = true;
    };
  }, []);

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
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Entries
        </h2>
        {isLoading ? (
          <p className="mt-4 text-sm text-zinc-500">Loading…</p>
        ) : (
          <div className="mt-4">
            <ResearchTable entries={entries} />
          </div>
        )}
      </div>
    </div>
  );
}
