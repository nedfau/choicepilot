"use client";

import { useEffect, useMemo, useState } from "react";
import IntakeForm from "@/components/research/IntakeForm";
import ResearchTable from "@/components/research/ResearchTable";
import BenchmarkCards from "@/components/research/BenchmarkCards";
import DashboardSummary from "@/components/research/DashboardSummary";
import RiskMap from "@/components/research/RiskMap";
import { supabase } from "@/lib/supabaseClient";
import {
  RESEARCH_TYPES,
  filterResearchEntries,
  type ResearchEntry,
} from "@/lib/researchEntry";

type View = "table" | "cards";

export default function Research() {
  const [entries, setEntries] = useState<ResearchEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<View>("table");

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

  const filteredEntries = useMemo(
    () => filterResearchEntries(entries, typeFilter, search),
    [entries, typeFilter, search]
  );

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

      <div className="mt-12">
        <IntakeForm onEntryAdded={handleEntryAdded} />
      </div>

      <div className="mt-12">
        {isLoading ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : (
          <DashboardSummary entries={entries} />
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Entries
        </h2>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
          >
            <option value="All">All types</option>
            {RESEARCH_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or description…"
            className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
          />
          <div className="inline-flex rounded-full border border-zinc-200 p-1 text-sm">
            {(["table", "cards"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                className={`rounded-full px-4 py-1.5 font-medium capitalize transition-colors ${
                  view === option
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="mt-4 text-sm text-zinc-500">Loading…</p>
        ) : (
          <div className="mt-4">
            {view === "table" ? (
              <ResearchTable
                entries={filteredEntries}
                totalCount={entries.length}
              />
            ) : (
              <BenchmarkCards
                entries={filteredEntries}
                totalCount={entries.length}
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-16 border-t border-zinc-100 pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Risk map
        </h2>
        <div className="mt-4">
          <RiskMap />
        </div>
      </div>
    </div>
  );
}
