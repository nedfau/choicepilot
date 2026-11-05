interface RoadmapItem {
  title: string;
  reason: string;
  blocker: string;
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    title: "Real LLM with the same guardrails",
    reason:
      "Rule-based keyword matching misses paraphrased or unusual phrasing that a real model would catch.",
    blocker: "Cost and safety testing.",
  },
  {
    title: "Accounts and saved history",
    reason: "Let a student pick up a decision where they left off instead of starting over every visit.",
    blocker: "Privacy and auth.",
  },
  {
    title: "Verified provider data",
    reason: "Replace manually-researched comparisons with data confirmed directly by providers.",
    blocker: "Needs partnerships without breaking the non-affiliate stance.",
  },
  {
    title: "More languages",
    reason: "Most of ChoicePilot's target users are non-native English speakers.",
    blocker: "Translation work, and keeping guardrail keyword matching accurate per language.",
  },
  {
    title: "Human advisor handoff",
    reason: "Give a student a path to a real person when the guardrail or checkpoint isn't enough.",
    blocker: "Needs a staffed or partnered advisory channel, which doesn't exist yet.",
  },
  {
    title: "Mobile-first improvements",
    reason: "Most prospective users will likely find and use this from a phone first.",
    blocker: "Needs dedicated mobile UX testing beyond the current responsive styling.",
  },
];

export default function RoadmapV2() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ROADMAP_ITEMS.map((item) => (
        <div key={item.title} className="rounded-xl border border-zinc-200 p-5">
          <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
          <p className="mt-2 text-xs leading-5 text-zinc-600">{item.reason}</p>
          <p className="mt-3 text-xs font-medium text-zinc-500">Blocked by: {item.blocker}</p>
        </div>
      ))}
    </div>
  );
}
