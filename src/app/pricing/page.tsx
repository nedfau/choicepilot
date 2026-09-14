"use client";

import { useMemo, useState } from "react";
import AssumptionsForm, {
  type AssumptionsFields,
} from "@/components/pricing/AssumptionsForm";
import RevenueOutput from "@/components/pricing/RevenueOutput";
import {
  DEFAULT_ASSUMPTIONS,
  computeRevenue,
  sanitizeAssumption,
  type BillingPeriod,
} from "@/lib/pricingScenario";

const INITIAL_FIELDS: AssumptionsFields = {
  plusSubscribers: String(DEFAULT_ASSUMPTIONS.plusSubscribers),
  plusPrice: String(DEFAULT_ASSUMPTIONS.plusPrice),
  campusPartners: String(DEFAULT_ASSUMPTIONS.campusPartners),
  campusPrice: String(DEFAULT_ASSUMPTIONS.campusPrice),
};

export default function Pricing() {
  const [fields, setFields] = useState<AssumptionsFields>(INITIAL_FIELDS);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  function handleChange(field: keyof AssumptionsFields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }));
  }

  const assumptions = useMemo(
    () => ({
      plusSubscribers: sanitizeAssumption(fields.plusSubscribers),
      plusPrice: sanitizeAssumption(fields.plusPrice),
      campusPartners: sanitizeAssumption(fields.campusPartners),
      campusPrice: sanitizeAssumption(fields.campusPrice),
    }),
    [fields]
  );

  const revenue = useMemo(() => computeRevenue(assumptions), [assumptions]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Pricing simulator
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-7 text-zinc-600">
        Adjust the assumptions to see what ChoicePilot&apos;s revenue could
        look like. Hypothetical only — no payments happen here.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 p-6">
          <AssumptionsForm values={fields} onChange={handleChange} />
        </div>
        <RevenueOutput
          revenue={revenue}
          billingPeriod={billingPeriod}
          onBillingPeriodChange={setBillingPeriod}
        />
      </div>
    </div>
  );
}
