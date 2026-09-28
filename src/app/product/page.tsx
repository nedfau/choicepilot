import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product — ChoicePilot",
};

interface Tier {
  name: string;
  price: string;
  audience: string;
}

const TIERS: Tier[] = [
  { name: "Free", price: "$0", audience: "Any international student" },
  {
    name: "Plus",
    price: "$6.99/mo",
    audience: "Students who want ongoing decision support",
  },
  {
    name: "Campus",
    price: "$199/mo per partner",
    audience: "University international-student offices",
  },
];

interface FeatureRow {
  feature: string;
  included: [boolean, boolean, boolean]; // Free, Plus, Campus
}

const FEATURES: FeatureRow[] = [
  { feature: "Browse /research comparisons", included: [true, true, true] },
  { feature: "One-time /core extraction", included: [true, true, true] },
  { feature: "Unlimited /core extractions", included: [false, true, true] },
  { feature: "Saved decisions", included: [false, true, true] },
  {
    feature: "Full comparison + scoring engine (once built)",
    included: [false, true, true],
  },
  {
    feature: "Bulk/branded access for incoming students",
    included: [false, false, true],
  },
];

type Cell = boolean | string;

interface FeatureMapRow {
  feature: string;
  values: [Cell, Cell, Cell]; // Free, Plus, Campus
}

const FEATURE_MAP: FeatureMapRow[] = [
  {
    feature: "Priority-weighted comparisons (scoring engine, once built)",
    values: [false, true, true],
  },
  {
    feature: "Saved decisions",
    values: ["3 saved", "Unlimited", "Unlimited"],
  },
  {
    feature: "/core decision extractions",
    values: ["1 (one-time)", "Unlimited", "Unlimited"],
  },
  {
    feature: "Browse & search /research benchmarking data",
    values: [true, true, true],
  },
  {
    feature: "Bulk/branded partner access",
    values: [false, false, true],
  },
  {
    feature: "Partner dashboard (aggregate student trends)",
    values: [false, false, true],
  },
  {
    feature: "Support",
    values: ["Community/docs", "Email", "Dedicated account manager"],
  },
];

function FeatureCell({ value }: { value: Cell }) {
  if (typeof value === "string") {
    return <span className="text-zinc-700">{value}</span>;
  }
  return value ? (
    <span aria-label="Included" className="text-indigo-600">
      ✓
    </span>
  ) : (
    <span aria-label="Not included" className="text-zinc-300">
      —
    </span>
  );
}

export default function Product() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Product
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-7 text-zinc-600">
        What each ChoicePilot tier includes. This describes the product —
        nothing here is gated or billed yet.
      </p>

      <div className="mt-10 overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Feature
              </th>
              {TIERS.map((tier) => (
                <th key={tier.name} className="px-4 py-4">
                  <div className="text-base font-semibold text-zinc-900">
                    {tier.name}
                  </div>
                  <div className="mt-1 text-sm font-medium text-indigo-600">
                    {tier.price}
                  </div>
                  <div className="mt-1 text-xs font-normal text-zinc-500">
                    {tier.audience}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {FEATURES.map((row) => (
              <tr key={row.feature}>
                <td className="px-4 py-3 text-zinc-700">{row.feature}</td>
                {row.included.map((included, i) => (
                  <td key={i} className="px-4 py-3">
                    {included ? (
                      <span aria-label="Included" className="text-indigo-600">
                        ✓
                      </span>
                    ) : (
                      <span aria-label="Not included" className="text-zinc-300">
                        —
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-16 border-t border-zinc-100 pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Feature map
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          A closer look at what each tier includes, feature by feature.
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Feature
                </th>
                {TIERS.map((tier) => (
                  <th
                    key={tier.name}
                    className="px-4 py-4 text-sm font-semibold text-zinc-900"
                  >
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {FEATURE_MAP.map((row) => (
                <tr key={row.feature}>
                  <td className="px-4 py-3 text-zinc-700">{row.feature}</td>
                  {row.values.map((value, i) => (
                    <td key={i} className="px-4 py-3">
                      <FeatureCell value={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
