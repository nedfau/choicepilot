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
    <div className="mt-8 w-full min-w-0 rounded-xl border border-zinc-200 p-6">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <h3 className="min-w-0 break-words text-lg font-semibold text-zinc-900">{title}</h3>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Simulated — rule-based, not AI
        </span>
      </div>
      <p className="mt-3 break-words text-sm leading-6 text-zinc-600">{usedBy}</p>

      {sections && sections.length > 0 && (
        <div className="mt-5 grid w-full min-w-0 gap-6 sm:grid-cols-2">
          {sections.map((section) => (
            <div key={section.heading} className="min-w-0">
              <h4 className="break-words text-sm font-semibold text-zinc-900">
                {section.heading}
              </h4>
              <div className="mt-2 break-words text-sm leading-6 text-zinc-600">
                {section.body}
              </div>
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

      {note && <p className="mt-5 break-words text-sm leading-6 text-zinc-500">{note}</p>}
    </div>
  );
}
