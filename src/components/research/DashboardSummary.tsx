import { RESEARCH_TYPES, type ResearchEntry } from "@/lib/researchEntry";

export default function DashboardSummary({
  entries,
}: {
  entries: ResearchEntry[];
}) {
  const mexicoCount = entries.filter(
    (entry) => entry.region?.toLowerCase() === "mexico"
  ).length;

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="rounded-xl border border-zinc-200 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Total entries
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          {entries.length}
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          By type
        </p>
        <dl className="mt-2 space-y-1">
          {RESEARCH_TYPES.map((type) => (
            <div key={type} className="flex items-center justify-between text-sm">
              <dt className="text-zinc-600">{type}</dt>
              <dd className="font-semibold text-zinc-900">
                {entries.filter((entry) => entry.type === type).length}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-xl border border-zinc-200 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Region = Mexico
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          {mexicoCount}
        </p>
      </div>
    </div>
  );
}
