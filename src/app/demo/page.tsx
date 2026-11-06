"use client";

import { useEffect, useState } from "react";
import AgentMap from "@/components/demo/AgentMap";
import ImpactCheck from "@/components/demo/ImpactCheck";
import RoadmapV2 from "@/components/demo/RoadmapV2";
import TestingSummary from "@/components/demo/TestingSummary";

interface TableResult {
  count: number | null;
  rows: Record<string, unknown>[];
  error: string | null;
}

type DashboardResponse = Record<string, TableResult>;

interface StepLink {
  label: string;
  href: string;
}

interface Step {
  number: number;
  title: string;
  task: string;
  whatToNotice: string;
  links: StepLink[];
}

const STEPS: Step[] = [
  {
    number: 1,
    title: "Core",
    task: "Describe a housing, insurance, or banking decision in your own words and extract its core.",
    whatToNotice:
      "The output is clearly labeled Simulated — it's rule-based keyword matching, not a live AI call.",
    links: [{ label: "Open /core", href: "/core" }],
  },
  {
    number: 2,
    title: "Research",
    task: "Browse the research table and toggle between the Table and Cards views.",
    whatToNotice:
      "Every competitor entry includes a Gap — what it doesn't solve for international students — not just a feature list.",
    links: [{ label: "Open /research", href: "/research" }],
  },
  {
    number: 3,
    title: "Product and Pricing",
    task: "Compare the three tiers on /product, then adjust the assumptions on /pricing to see the revenue change live.",
    whatToNotice:
      "Every number on /pricing is explicitly labeled a hypothesis, not a validated figure.",
    links: [
      { label: "Open /product", href: "/product" },
      { label: "Open /pricing", href: "/pricing" },
    ],
  },
  {
    number: 4,
    title: "Marketing",
    task: "Vote on one of the A/B headline tests and try the Copy button on a social post.",
    whatToNotice:
      "All content here is marked as a template — drafted content, never claimed as published or real engagement.",
    links: [{ label: "Open /marketing", href: "/marketing" }],
  },
  {
    number: 5,
    title: "Chat",
    task: "Try a guardrail message (for example, ask about a visa or a headache) and see the human checkpoint after finishing the three questions.",
    whatToNotice:
      "The guardrail runs server-side, so it can't be bypassed from the browser, and nothing you type is stored as raw text.",
    links: [{ label: "Open /chat", href: "/chat" }],
  },
  {
    number: 6,
    title: "Dashboard",
    task: "Scroll the dashboard to see every module's saved record count and latest rows.",
    whatToNotice:
      "Only structured fields are shown — no free text ever appears here, even though it's public.",
    links: [{ label: "Open /dashboard", href: "/dashboard" }],
  },
];

interface Stat {
  label: string;
  value: number | null;
}

export default function Demo() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [doneSteps, setDoneSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const response = await fetch("/api/dashboard");
        const json = await response.json();
        if (!ignore) setData(json);
      } catch {
        // Stat strip just shows "—" per stat if this fails; no page-level error needed.
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  function toggleDone(stepNumber: number) {
    setDoneSteps((prev) => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
  }

  const doneCount = Object.values(doneSteps).filter(Boolean).length;
  const progressPercent = Math.round((doneCount / STEPS.length) * 100);

  const chatTests = data?.chat_tests;
  const demoTests = data?.demo_tests;
  const externalTesters =
    chatTests?.error && demoTests?.error
      ? null
      : (chatTests?.count ?? 0) + (demoTests?.count ?? 0);

  const stats: Stat[] = [
    { label: "Decisions extracted", value: data?.core_outputs.error ? null : data?.core_outputs.count ?? null },
    { label: "Research entries", value: data?.research_entries.error ? null : data?.research_entries.count ?? null },
    { label: "Pricing scenarios", value: data?.pricing_scenarios.error ? null : data?.pricing_scenarios.count ?? null },
    { label: "A/B votes", value: data?.ab_votes.error ? null : data?.ab_votes.count ?? null },
    { label: "Chat sessions", value: data?.chat_sessions.error ? null : data?.chat_sessions.count ?? null },
    { label: "External testers", value: data ? externalTesters : null },
  ];

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Demo: ChoicePilot end to end
      </h1>
      <p className="mt-3 text-lg leading-7 text-zinc-600">
        A 5-minute guided walkthrough of every module.
      </p>
      <span className="mt-4 inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
        Simulated: all assistants on this site are rule-based, not live AI
      </span>

      {/* Stat strip */}
      <div className="mt-10 grid w-full min-w-0 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="min-w-0 rounded-xl border border-zinc-200 p-4"
          >
            <p className="break-words text-xs font-semibold uppercase tracking-wide text-zinc-400">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
              {stat.value === null ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="mt-10">
        <div className="flex items-center justify-between text-sm text-zinc-600">
          <span>Walkthrough progress</span>
          <span>{doneCount} of {STEPS.length} done</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={doneCount}
          aria-valuemin={0}
          aria-valuemax={STEPS.length}
          aria-label="Walkthrough progress"
          className="mt-2 h-2 w-full rounded-full bg-zinc-100"
        >
          <div
            className="h-2 rounded-full bg-indigo-600 transition-[width]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Walkthrough steps */}
      <div className="mt-8 flex w-full min-w-0 flex-col gap-6">
        {STEPS.map((step) => {
          const isDone = Boolean(doneSteps[step.number]);
          return (
            <div
              key={step.number}
              id={`demo-step-${step.number}`}
              className={`w-full min-w-0 rounded-xl border p-6 ${
                isDone ? "border-emerald-200 bg-emerald-50" : "border-zinc-200"
              }`}
            >
              <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                    {step.number}
                  </span>
                  <div className="min-w-0">
                    <p className="break-words text-base font-semibold text-zinc-900">
                      {step.title}
                    </p>
                    <p className="mt-1 break-words text-sm leading-6 text-zinc-600">
                      {step.task}
                    </p>
                    <p className="mt-2 break-words text-xs font-medium text-zinc-500">
                      What to notice: {step.whatToNotice}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDone(step.number)}
                  aria-pressed={isDone}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isDone
                      ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                      : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {isDone ? "Done" : "Mark as done"}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {step.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <section id="agent-map" className="mt-16 border-t border-zinc-100 pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Agent map
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          Who — or what — is actually doing the work behind each module.
        </p>
        <div className="mt-6">
          <AgentMap />
        </div>
      </section>

      <section id="impact-check" className="mt-16 border-t border-zinc-100 pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Impact check
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          Benefits and risks of the product as it exists today, and what&apos;s
          mitigated versus still open.
        </p>
        <div className="mt-6">
          <ImpactCheck />
        </div>
      </section>

      <section id="testing-summary" className="mt-16 border-t border-zinc-100 pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Testing summary
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          Aggregated results from everyone who&apos;s run through this demo.
        </p>
        <div className="mt-6">
          <TestingSummary />
        </div>
      </section>

      <section id="roadmap" className="mt-16 border-t border-zinc-100 pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Version 2 roadmap
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          What&apos;s next, why it matters, and what&apos;s blocking it today.
        </p>
        <div className="mt-6">
          <RoadmapV2 />
        </div>
      </section>
    </div>
  );
}
