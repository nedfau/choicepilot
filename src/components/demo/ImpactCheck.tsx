import Link from "next/link";

interface ImpactRow {
  item: string;
  whoIsAffected: string;
  mitigation: string;
  stillOpen: string;
}

const ROWS: ImpactRow[] = [
  {
    item: "Bad or overconfident advice",
    whoIsAffected: "Students relying on the guidance",
    mitigation:
      'Guardrails run on the server; a human checkpoint is shown for insurance and for "Meets all requirements".',
    stillOpen: "The checkpoint is a prompt, not a hard block — a student can still ignore it.",
  },
  {
    item: "Affiliate bias",
    whoIsAffected: "Students comparing options",
    mitigation: "Non-affiliate stance; no referral links anywhere in the product.",
    stillOpen:
      "Unproven at scale — there are no real provider partnerships yet to test the claim against.",
  },
  {
    item: "Privacy",
    whoIsAffected: "Anyone using /chat or any intake form",
    mitigation:
      "No free text stored; structured fields only; public tables (e.g. /dashboard) hold no personal data.",
    stillOpen:
      "Guardrail detection is keyword-based, not perfect — some personal data could still slip through unflagged.",
  },
  {
    item: "Over-trust in simulated output",
    whoIsAffected: "Anyone reading /core, /chat, or /marketing output",
    mitigation: 'Every simulated output is clearly labeled (e.g. "Simulated", "Template content").',
    stillOpen: "A label can be skimmed past — it doesn't guarantee a reader registers it.",
  },
  {
    item: "Exclusion",
    whoIsAffected:
      "Non-English speakers; students facing decisions outside housing, insurance, or banking",
    mitigation: "None yet — English only, and only three decision types.",
    stillOpen: "Known limit, not yet addressed.",
  },
  {
    item: "Cost for students",
    whoIsAffected: "Students with no budget for another tool",
    mitigation: "Free tools only; a Free tier exists on /product.",
    stillOpen:
      "The revenue model on /pricing is still a hypothesis — long-term sustainability of the free tier isn't proven.",
  },
];

export default function ImpactCheck() {
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Benefit or risk</th>
              <th className="px-4 py-3">Who is affected</th>
              <th className="px-4 py-3">Mitigation in the product</th>
              <th className="px-4 py-3">Still open</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {ROWS.map((row) => (
              <tr key={row.item}>
                <td className="px-4 py-3 font-medium text-zinc-900">{row.item}</td>
                <td className="px-4 py-3 text-zinc-600">{row.whoIsAffected}</td>
                <td className="px-4 py-3 text-zinc-600">{row.mitigation}</td>
                <td className="px-4 py-3 text-zinc-600">{row.stillOpen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm leading-6 text-zinc-600">
        <span className="font-semibold text-zinc-900">Viability: </span>
        the pricing tiers and revenue projections shown on{" "}
        <Link href="/pricing" className="font-medium text-indigo-600 hover:text-indigo-500">
          /pricing
        </Link>{" "}
        are hypotheses, not validated numbers — there are no real paying customers yet.
      </p>
    </div>
  );
}
