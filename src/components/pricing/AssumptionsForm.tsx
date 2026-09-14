"use client";

export interface AssumptionsFields {
  plusSubscribers: string;
  plusPrice: string;
  campusPartners: string;
  campusPrice: string;
}

const FIELD_CONFIG: Array<{
  key: keyof AssumptionsFields;
  label: string;
  step?: string;
}> = [
  { key: "plusSubscribers", label: "Plus subscribers" },
  { key: "plusPrice", label: "Plus price per month ($)", step: "0.01" },
  { key: "campusPartners", label: "Campus partners" },
  { key: "campusPrice", label: "Campus price per month ($)", step: "0.01" },
];

export default function AssumptionsForm({
  values,
  onChange,
}: {
  values: AssumptionsFields;
  onChange: (field: keyof AssumptionsFields, value: string) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {FIELD_CONFIG.map(({ key, label, step }) => (
        <div key={key}>
          <label
            htmlFor={key}
            className="block text-sm font-medium text-zinc-700"
          >
            {label}
          </label>
          <input
            id={key}
            type="number"
            step={step}
            value={values[key]}
            onChange={(e) => onChange(key, e.target.value)}
            className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      ))}
    </div>
  );
}
