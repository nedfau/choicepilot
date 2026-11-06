import type { ReactNode } from "react";

interface Section {
  heading: string;
  body: ReactNode;
}

export default function PromptLibraryEntry({
  title,
  usedBy,
  sections,
  example,
  note,
}: {
  title: string;
  usedBy: ReactNode;
  sections?: Section[];
  example?: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className="mt-8 rounded-xl border border-zinc-200 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Simulated — rule-based, not AI
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{usedBy}</p>

      {sections && sections.length > 0 && (
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {sections.map((section) => (
            <div key={section.heading}>
              <h4 className="text-sm font-semibold text-zinc-900">{section.heading}</h4>
              <div className="mt-2 text-sm leading-6 text-zinc-600">{section.body}</div>
            </div>
          ))}
        </div>
      )}

      {example && (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-zinc-900">Example</h4>
          {example}
        </div>
      )}

      {note && <p className="mt-5 text-sm leading-6 text-zinc-500">{note}</p>}
    </div>
  );
}
