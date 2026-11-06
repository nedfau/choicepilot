interface AgentNode {
  name: string;
  type: string;
  description: string;
  oversight: string;
}

const BUILDER_NODE: AgentNode = {
  name: "Claude Code",
  type: "Coding agent",
  description: "Writes and edits the code behind every module below.",
  oversight:
    "The project owner reviews and approves every change as a commit before it's pushed, and Vercel deploys it.",
};

const MODULE_NODES: AgentNode[] = [
  {
    name: "Core extraction",
    type: "Rule-based · Simulated",
    description:
      "Matches free text to a decision type, priority, and timeline using keyword rules — no AI/LLM call.",
    oversight:
      "Claude Code wrote the matching rules; no human reviews individual extractions at runtime.",
  },
  {
    name: "Research benchmarking",
    type: "Curated · Human-written",
    description:
      "A manually researched table of competitors, substitutes, and global examples, entered through an intake form.",
    oversight:
      "Every entry is typed in and reviewed by a human before it's saved — nothing is scraped automatically.",
  },
  {
    name: "Pricing simulator",
    type: "Calculator · Hypothetical",
    description:
      "A fixed formula over user-adjustable assumptions — no real pricing data or paying customers behind it.",
    oversight:
      "The formula is fixed in code; the assumptions themselves aren't reviewed per use.",
  },
  {
    name: "Marketing generator",
    type: "Rule-based · Simulated",
    description:
      "Pre-drafted social posts, scripts, and landing copy, plus real A/B voting and asset-saving mechanics.",
    oversight:
      "Content was drafted once and reviewed before publishing; votes and saves happen live with no review.",
  },
  {
    name: "Chat assistant",
    type: "Rule-based · Simulated",
    description:
      "Asks three fixed questions and checks every message against server-side guardrails before responding.",
    oversight:
      "Guardrail rules are fixed in server code; flagged messages aren't reviewed by a person in this version.",
  },
];

const CHECKPOINT_NODE: AgentNode = {
  name: "Human checkpoint",
  type: "Human-in-the-loop",
  description:
    "A prompt shown after Chat's three questions, for insurance decisions and for any \"Meets all requirements\" priority.",
  oversight:
    "The student themselves — it's a self-checkpoint cue, not a review routed to ChoicePilot staff.",
};

function NodeCard({ node }: { node: AgentNode }) {
  return (
    <div className="w-full min-w-0 rounded-xl border border-zinc-200 p-4">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
        <p className="min-w-0 break-words text-sm font-semibold text-zinc-900">
          {node.name}
        </p>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
          {node.type}
        </span>
      </div>
      <p className="mt-2 break-words text-xs leading-5 text-zinc-600">{node.description}</p>
      <p className="mt-2 break-words text-xs leading-5 text-zinc-400">
        <span className="font-medium text-zinc-500">Overseen by:</span>{" "}
        {node.oversight}
      </p>
    </div>
  );
}

export default function AgentMap() {
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-3">
      <div className="w-full min-w-0 max-w-xs">
        <NodeCard node={BUILDER_NODE} />
      </div>
      <p aria-hidden="true" className="text-sm text-zinc-400">
        ↓ builds &amp; deploys
      </p>

      <div className="grid w-full min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {MODULE_NODES.map((node) => (
          <NodeCard key={node.name} node={node} />
        ))}
      </div>

      <p aria-hidden="true" className="text-sm text-zinc-400">
        ↓ triggered by Chat, for insurance or &quot;Meets all requirements&quot;
      </p>

      <div className="w-full min-w-0 max-w-xs">
        <NodeCard node={CHECKPOINT_NODE} />
      </div>
    </div>
  );
}
