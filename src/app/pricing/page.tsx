"use client";

import { useState } from "react";
import AssumptionsForm, {
  type AssumptionsFields,
} from "@/components/pricing/AssumptionsForm";
import { DEFAULT_ASSUMPTIONS } from "@/lib/pricingScenario";

const INITIAL_FIELDS: AssumptionsFields = {
  plusSubscribers: String(DEFAULT_ASSUMPTIONS.plusSubscribers),
  plusPrice: String(DEFAULT_ASSUMPTIONS.plusPrice),
  campusPartners: String(DEFAULT_ASSUMPTIONS.campusPartners),
  campusPrice: String(DEFAULT_ASSUMPTIONS.campusPrice),
};

export default function Pricing() {
  const [fields, setFields] = useState<AssumptionsFields>(INITIAL_FIELDS);

  function handleChange(field: keyof AssumptionsFields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }));
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

      <div className="mt-10 rounded-xl border border-zinc-200 p-6">
        <AssumptionsForm values={fields} onChange={handleChange} />
      </div>
    </div>
  );
}
