"use client";

import { ANNUAL_DISCOUNT } from "@/lib/pricingScenario";

export interface AssumptionsFields {
  plusSubscribers: string;
  plusPrice: string;
  campusPartners: string;
  campusPrice: string;
}

const EDITABLE_NOTE = "Placeholder, unvalidated hypothesis";

const FIELD_CONFIG: Array<{
  key: keyof AssumptionsFields;
  label: string;
  unit: string;
  step?: string;
}> = [
  { key: "plusSubscribers", label: "Plus subscribers", unit: "subscribers" },
  { key: "plusPrice", label: "Plus price", unit: "$/mo", step: "0.01" },
  { key: "campusPartners", label: "Campus partners", unit: "partners" },
  { key: "campusPrice", label: "Campus price", unit: "$/mo", step: "0.01" },
];

export default function AssumptionsForm({
  values,
  onChange,
}: {
  values: AssumptionsFields;
  onChange: (field: keyof AssumptionsFields, value: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3">Assumption</th>
            <th className="px-4 py-3">Value</th>
            <th className="px-4 py-3">Unit</th>
            <th className="px-4 py-3">Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {FIELD_CONFIG.map(({ key, label, unit, step }) => (
            <tr key={key}>
              <td className="px-4 py-3 font-medium text-zinc-900">{label}</td>
              <td className="px-4 py-3">
                <input
                  id={key}
                  type="number"
                  step={step}
                  value={values[key]}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-28 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
                />
              </td>
              <td className="px-4 py-3 text-zinc-600">{unit}</td>
              <td className="px-4 py-3 text-zinc-500">{EDITABLE_NOTE}</td>
            </tr>
          ))}
          <tr>
            <td className="px-4 py-3 font-medium text-zinc-900">
              Annual discount
            </td>
            <td className="px-4 py-3 text-zinc-700">
              {ANNUAL_DISCOUNT * 100}
            </td>
            <td className="px-4 py-3 text-zinc-600">%</td>
            <td className="px-4 py-3 text-zinc-500">Fixed, not editable</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
