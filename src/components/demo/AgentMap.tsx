type ColorKey = "human" | "agent" | "simulated" | "curated";

interface AgentNode {
  name: string;
  type: string;
  colorKey: ColorKey;
  description: string;
  oversight: string;
}

const BADGE_STYLES: Record<ColorKey, string> = {
  human: "bg-emerald-50 text-emerald-700",
  agent: "bg-indigo-50 text-indigo-700",
  simulated: "bg-amber-50 text-amber-700",
  curated: "bg-blue-50 text-blue-700",
};

const PEOPLE_NODES: AgentNode[] = [
  {
    name: "Product owner",
    type: "Human",
    colorKey: "human",
    description:
      "Plans the product, decides what gets built or rejected, and reviews and approves every commit.",
    oversight:
      "No one else signs off — the product owner is the final check before anything ships.",
  },
  {
    name: "Claude chat",
    type: "Planning agent",
    colorKey: "agent",
    description:
      "Helps write the Build Discipline Packets that tell the coding agent exactly what to build, as a planning agent, not a coder.",
    oversight:
      "The product owner reviews each packet before it's handed to Claude Code.",
  },
];

const BUILD_NODE: AgentNode = {
  name: "Claude Code",
  type: "Coding agent",
  colorKey: "agent",
  description: "Writes and edits the code behind every module below.",
  oversight:
    "The product owner reviews and approves every change as a commit before it's pushed, and Vercel deploys it.",
};

const MODULE_NODES: AgentNode[] = [
  {
    name: "Core extraction",
    type: "Rule-based · Simulated",
    colorKey: "simulated",
    description:
      "Matches free text to a decision type, priority, and timeline using keyword rules — no AI/LLM call.",
    oversight:
      "Claude Code wrote the matching rules; no human reviews individual extractions at runtime.",
  },
  {
    name: "Research benchmarking",
    type: "Curated · Human-written",
    colorKey: "curated",
    description:
      "A manually researched table of competitors, substitutes, and global examples, entered through an intake form.",
    oversight:
      "Every entry is typed in and reviewed by a human before it's saved — nothing is scraped automatically.",
  },
  {
    name: "Pricing simulator",
    type: "Calculator · Hypothetical",
    colorKey: "simulated",
    description:
      "A fixed formula over user-adjustable assumptions — no real pricing data or paying customers behind it.",
    oversight:
      "The formula is fixed in code; the assumptions themselves aren't reviewed per use.",
  },
  {
    name: "Marketing generator",
    type: "Rule-based · Simulated",
    colorKey: "simulated",
    description:
      "Pre-drafted social posts, scripts, and landing copy, plus real A/B voting and asset-saving mechanics.",
    oversight:
      "Content was drafted once and reviewed before publishing; votes and saves happen live with no review.",
  },
  {
    name: "Chat assistant with guardrails",
    type: "Rule-based · Simulated",
    colorKey: "simulated",
    description:
      "Asks three fixed questions and checks every message against server-side guardrails before responding.",
    oversight:
      "Guardrail rules are fixed in server code; flagged messages aren't reviewed by a person in this version.",
  },
];

const CHECKPOINT_NODE: AgentNode = {
  name: "Human checkpoint",
  type: "Human-in-the-loop",
  colorKey: "human",
  description:
    "A prompt shown after Chat's three questions, for insurance decisions and for any \"Meets all requirements\" priority.",
  oversight:
    "The student themselves — it's a self-checkpoint cue, not a review routed to ChoicePilot staff.",
};

function NodeCard({ node }: { node: AgentNode }) {
  return (
    <div className="w-full min-w-0 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
        <p className="min-w-0 break-words text-sm font-semibold text-zinc-900">
          {node.name}
        </p>
        <span
          className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${BADGE_STYLES[node.colorKey]}`}
        >
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

function Column({ title, nodes }: { title: string; nodes: AgentNode[] }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {title}
      </h3>
      <div className="flex w-full min-w-0 flex-col gap-4">
        {nodes.map((node) => (
          <NodeCard key={node.name} node={node} />
        ))}
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex items-center justify-center py-1 lg:self-center lg:py-0">
      <span aria-hidden="true" className="text-xl text-zinc-300 lg:hidden">
        ↓
      </span>
      <span aria-hidden="true" className="hidden text-xl text-zinc-300 lg:inline">
        →
      </span>
    </div>
  );
}

export default function AgentMap() {
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-6">
      <div className="grid w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_1fr_auto_2fr] lg:items-start lg:gap-4">
        <Column title="People" nodes={PEOPLE_NODES} />
        <Connector />
        <Column title="Build" nodes={[BUILD_NODE]} />
        <Connector />
        <Column title="Product agents" nodes={MODULE_NODES} />
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
