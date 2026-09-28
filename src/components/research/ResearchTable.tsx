import type { ResearchEntry } from "@/lib/researchEntry";

export default function ResearchTable({
  entries,
  totalCount,
}: {
  entries: ResearchEntry[];
  totalCount: number;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200">
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
          {entries.map((entry) => (
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
      {entries.length === 0 && (
        <p className="px-4 py-6 text-sm text-zinc-500">
          {totalCount === 0
            ? "No research entries yet."
            : "No entries match this filter/search."}
        </p>
      )}
    </div>
  );
}
