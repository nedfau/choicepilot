"use client";

import type { PricingScenario } from "@/lib/pricingScenario";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const RELATIVE_TIME_UNITS: Array<{
  amount: number;
  unit: Intl.RelativeTimeFormatUnit;
}> = [
  { amount: 60, unit: "seconds" },
  { amount: 60, unit: "minutes" },
  { amount: 24, unit: "hours" },
  { amount: 7, unit: "days" },
  { amount: 4.34524, unit: "weeks" },
  { amount: 12, unit: "months" },
  { amount: Infinity, unit: "years" },
];

function relativeTime(isoDate: string): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let duration = (new Date(isoDate).getTime() - Date.now()) / 1000;

  for (const { amount, unit } of RELATIVE_TIME_UNITS) {
    if (Math.abs(duration) < amount) {
      return rtf.format(Math.round(duration), unit);
    }
    duration /= amount;
  }
  return rtf.format(Math.round(duration), "years");
}

export default function SavedScenarios({
  scenarios,
  isLoading,
}: {
  scenarios: PricingScenario[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <p className="mt-4 text-sm text-zinc-500">Loading…</p>;
  }

  if (scenarios.length === 0) {
    return (
      <p className="mt-4 text-sm text-zinc-500">No saved scenarios yet.</p>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3">Plus</th>
            <th className="px-4 py-3">Campus</th>
            <th className="px-4 py-3">Billing</th>
            <th className="px-4 py-3">Monthly</th>
            <th className="px-4 py-3">Annual</th>
            <th className="px-4 py-3">Saved</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {scenarios.map((scenario) => (
            <tr key={scenario.id}>
              <td className="px-4 py-3 text-zinc-700">
                {scenario.plus_subscribers} @ {currency.format(scenario.plus_price)}
              </td>
              <td className="px-4 py-3 text-zinc-700">
                {scenario.campus_partners} @ {currency.format(scenario.campus_price)}
              </td>
              <td className="px-4 py-3 capitalize text-zinc-700">
                {scenario.billing_period}
              </td>
              <td className="px-4 py-3 font-medium text-zinc-900">
                {currency.format(scenario.monthly_revenue)}
              </td>
              <td className="px-4 py-3 font-medium text-zinc-900">
                {currency.format(scenario.annual_revenue)}
              </td>
              <td className="px-4 py-3 text-zinc-500">
                {relativeTime(scenario.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
