"use client";

import { useMemo, useState } from "react";
import { RESEARCH_TYPES, type ResearchEntry } from "@/lib/researchEntry";

export default function ResearchTable({ entries }: { entries: ResearchEntry[] }) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesType = typeFilter === "All" || entry.type === typeFilter;
      const matchesSearch =
        query.length === 0 ||
        entry.name.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });
  }, [entries, typeFilter, search]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Gap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {entry.url ? (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {entry.name}
                    </a>
                  ) : (
                    entry.name
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-600">{entry.type}</td>
                <td className="px-4 py-3 text-zinc-600">
                  {entry.region ?? "—"}
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {entry.description}
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {entry.gap_note ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEntries.length === 0 && (
          <p className="px-4 py-6 text-sm text-zinc-500">
            {entries.length === 0
              ? "No research entries yet."
              : "No entries match this filter/search."}
          </p>
        )}
      </div>
    </div>
  );
}
