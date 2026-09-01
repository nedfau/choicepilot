type RiskLevel = "Low" | "Medium" | "High";

interface Risk {
  name: string;
  description: string;
  level: RiskLevel;
}

const RISKS: Risk[] = [
  {
    name: "Incumbent pivot risk",
    description:
      "Existing single-category platforms (housing, insurance, or banking) could bolt on multi-category comparison and out-resource a new entrant.",
    level: "Medium",
  },
  {
    name: "Trust risk",
    description:
      "Non-affiliate, transparent-scoring claims are hard to prove to skeptical users without visible methodology.",
    level: "Medium",
  },
  {
    name: "Regulatory risk",
    description:
      "Insurance and banking rules, disclosures, and eligibility vary by country and change over time.",
    level: "High",
  },
  {
    name: "Monetization risk",
    description:
      "Staying non-affiliate rules out the standard commission model most comparison sites rely on.",
    level: "High",
  },
];

const LEVEL_STYLES: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-700",
};

export default function RiskMap() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {RISKS.map((risk) => (
        <div
          key={risk.name}
          className="rounded-xl border border-zinc-200 p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-zinc-900">
              {risk.name}
            </h3>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${LEVEL_STYLES[risk.level]}`}
            >
              {risk.level}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {risk.description}
          </p>
        </div>
      ))}
    </div>
  );
}
