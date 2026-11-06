"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TableResult {
  count: number | null;
  rows: Record<string, unknown>[];
  error: string | null;
}

type DashboardResponse = Record<string, TableResult>;

interface Module {
  tableKey: string;
  title: string;
  href: string;
}

const MODULES: Module[] = [
  { tableKey: "core_outputs", title: "Core Extraction", href: "/core" },
  { tableKey: "research_entries", title: "Research & Benchmarking", href: "/research" },
  { tableKey: "pricing_scenarios", title: "Pricing Scenarios", href: "/pricing" },
  { tableKey: "marketing_assets", title: "Marketing Assets", href: "/marketing" },
  { tableKey: "ab_votes", title: "A/B Votes", href: "/marketing" },
  { tableKey: "chat_sessions", title: "Chat Sessions", href: "/chat" },
  { tableKey: "chat_feedback", title: "Chat Feedback", href: "/chat" },
  { tableKey: "chat_tests", title: "Chat Test Log", href: "/chat" },
  { tableKey: "demo_tests", title: "Demo Tests", href: "/demo" },
];

function formatHeader(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatCell(key: string, value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (key === "created_at" && typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  }
  return String(value);
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const response = await fetch("/api/dashboard");
        const json = await response.json();
        if (!ignore) {
          setData(json);
          setIsLoading(false);
        }
      } catch {
        if (!ignore) {
          setLoadError("Couldn't load the dashboard — please try again later.");
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Dashboard
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-7 text-zinc-600">
        Everything ChoicePilot has saved so far, from all modules. Only
        structured data is shown, never free text.
      </p>
      <p className="mt-3 text-sm text-zinc-500">
        This data is public, structured only, and partly test data.
      </p>

      {isLoading && <p className="mt-10 text-sm text-zinc-500">Loading…</p>}
      {loadError && (
        <p role="alert" className="mt-10 text-sm text-red-600">
          {loadError}
        </p>
      )}

      {data && (
        <>
          <div className="mt-10 grid w-full min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((module) => {
              const result = data[module.tableKey];
              return (
                <Link
                  key={module.tableKey}
                  id={`dashboard-count-${module.tableKey}`}
                  href={module.href}
                  className="min-w-0 rounded-xl border border-zinc-200 p-6 transition-colors hover:border-indigo-500 hover:bg-indigo-50"
                >
                  <p className="break-words text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    {module.title}
                  </p>
                  {result?.error ? (
                    <p role="alert" className="mt-2 text-sm text-red-600">
                      Unavailable
                    </p>
                  ) : (
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                      {result?.count ?? 0}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-16 flex w-full min-w-0 flex-col gap-12">
            {MODULES.map((module) => {
              const result = data[module.tableKey];
              const columns =
                result && result.rows.length > 0
                  ? Object.keys(result.rows[0]).filter((key) => key !== "id")
                  : [];

              return (
                <section
                  key={module.tableKey}
                  id={`dashboard-table-${module.tableKey}`}
                  className="w-full min-w-0"
                >
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
                    {module.title} — Latest records
                  </h2>

                  {result?.error ? (
                    <p
                      role="alert"
                      className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                      This table couldn&apos;t be loaded: {result.error}
                    </p>
                  ) : result && result.rows.length === 0 ? (
                    <p className="mt-4 text-sm text-zinc-500">No records yet.</p>
                  ) : result ? (
                    <div className="mt-4 w-full min-w-0 overflow-x-auto rounded-xl border border-zinc-200">
                      <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          <tr>
                            {columns.map((col) => (
                              <th key={col} className="px-4 py-3">
                                {formatHeader(col)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {result.rows.map((row) => (
                            <tr key={String(row.id)}>
                              {columns.map((col) => (
                                <td key={col} className="px-4 py-3 text-zinc-600">
                                  {formatCell(col, row[col])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
