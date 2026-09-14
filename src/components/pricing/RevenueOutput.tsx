"use client";

import type { BillingPeriod, RevenueResult } from "@/lib/pricingScenario";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function RevenueOutput({
  revenue,
  billingPeriod,
  onBillingPeriodChange,
}: {
  revenue: RevenueResult;
  billingPeriod: BillingPeriod;
  onBillingPeriodChange: (period: BillingPeriod) => void;
}) {
  const figure = billingPeriod === "monthly" ? revenue.monthly : revenue.annual;

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
    </div>
  );
}
