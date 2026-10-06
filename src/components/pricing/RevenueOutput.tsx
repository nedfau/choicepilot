"use client";

import type {
  BillingPeriod,
  RevenueResult,
  SegmentRevenue,
} from "@/lib/pricingScenario";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function RevenueOutput({
  revenue,
  segmentRevenue,
  billingPeriod,
  onBillingPeriodChange,
}: {
  revenue: RevenueResult;
  segmentRevenue: SegmentRevenue;
  billingPeriod: BillingPeriod;
  onBillingPeriodChange: (period: BillingPeriod) => void;
}) {
  const figure = billingPeriod === "monthly" ? revenue.monthly : revenue.annual;
  const studentsFigure =
    billingPeriod === "monthly"
      ? segmentRevenue.students.monthly
      : segmentRevenue.students.annual;
  const universitiesFigure =
    billingPeriod === "monthly"
      ? segmentRevenue.universities.monthly
      : segmentRevenue.universities.annual;

  return (
    <div className="rounded-xl border border-zinc-200 p-6">
      <div className="inline-flex rounded-full border border-zinc-200 p-1 text-sm">
        {(["monthly", "annual"] as const).map((period) => (
          <button
            key={period}
            type="button"
            onClick={() => onBillingPeriodChange(period)}
            className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
              billingPeriod === period
                ? "bg-indigo-600 text-white"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {period === "monthly" ? "Monthly" : "Annual"}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium text-zinc-500">
        {billingPeriod === "monthly" ? "Monthly revenue" : "Annual revenue"}
      </p>
      <p className="mt-1 text-4xl font-semibold tracking-tight text-zinc-900">
        {currency.format(figure)}
      </p>

      <div className="mt-6 space-y-2 border-t border-zinc-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          By segment
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600">Students (Plus)</span>
          <span className="font-medium text-zinc-900">
            {currency.format(studentsFigure)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600">Universities (Campus)</span>
          <span className="font-medium text-zinc-900">
            {currency.format(universitiesFigure)}
          </span>
        </div>
      </div>
    </div>
  );
}
