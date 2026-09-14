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

type SaveStatus = "idle" | "saving" | "saved" | "error";

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
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  async function handleSave() {
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/pricing/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plus_subscribers: assumptions.plusSubscribers,
          plus_price: assumptions.plusPrice,
          campus_partners: assumptions.campusPartners,
          campus_price: assumptions.campusPrice,
          billing_period: billingPeriod,
          monthly_revenue: revenue.monthly,
          annual_revenue: revenue.annual,
        }),
      });
      setSaveStatus(response.ok ? "saved" : "error");
    } catch {
      setSaveStatus("error");
    }
  }

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

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
        >
          {saveStatus === "saving" ? "Saving…" : "Save scenario"}
        </button>
        {saveStatus === "saved" && (
          <p className="text-sm text-emerald-600">Saved.</p>
        )}
        {saveStatus === "error" && (
          <p className="text-sm text-red-600">
            Couldn&apos;t save — please try again.
          </p>
        )}
      </div>
    </div>
  );
}
