"use client";

import { SCENARIO_PRESETS, type ScenarioPreset } from "@/lib/pricingScenario";

const PRESET_LABELS: Record<keyof typeof SCENARIO_PRESETS, string> = {
  conservative: "Conservative",
  base: "Base",
  optimistic: "Optimistic",
};

export default function ScenarioToggle({
  preset,
  onSelect,
}: {
  preset: ScenarioPreset;
  onSelect: (preset: keyof typeof SCENARIO_PRESETS) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border border-zinc-200 p-1 text-sm">
          {(Object.keys(SCENARIO_PRESETS) as Array<keyof typeof SCENARIO_PRESETS>).map(
            (key) => (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
                  preset === key
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {PRESET_LABELS[key]}
              </button>
            )
          )}
        </div>
        {preset === "custom" && (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600">
            Custom
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-zinc-400">Hypothetical, not validated</p>
    </div>
  );
}
