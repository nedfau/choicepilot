import type { ResearchEntry, ResearchType } from "@/lib/researchEntry";

const TYPE_BADGE_STYLES: Record<ResearchType, string> = {
  "Global Example": "bg-indigo-50 text-indigo-700",
  Competitor: "bg-amber-50 text-amber-700",
  Substitute: "bg-zinc-100 text-zinc-600",
};

export default function BenchmarkCards({
  entries,
  totalCount,
}: {
  entries: ResearchEntry[];
  totalCount: number;
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 px-4 py-6">
        <p className="text-sm text-zinc-500">
          {totalCount === 0
            ? "No research entries yet."
            : "No entries match this filter/search."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-xl border border-zinc-200 p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-zinc-900">
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
            </h3>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${TYPE_BADGE_STYLES[entry.type]}`}
            >
              {entry.type}
            </span>
          </div>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
            {entry.region ?? "Region unknown"}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {entry.description}
          </p>
          {entry.gap_note && (
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              <span className="font-medium text-zinc-700">Gap: </span>
              {entry.gap_note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
