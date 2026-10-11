import Link from "next/link";
import { landingCopy } from "@/lib/marketing-content";

const roadmap = [
  {
    label: "Week 0",
    title: "Infrastructure",
    status: "shipped" as const,
  },
  {
    label: "Week 1",
    title: "Core Extraction",
    status: "shipped" as const,
  },
  {
    label: "Week 2",
    title: "Research & Benchmarking",
    status: "shipped" as const,
  },
  {
    label: "Week 3",
    title: "Product + Pricing Simulator",
    status: "shipped" as const,
  },
  {
    label: "Future",
    title: "Comparison & Scoring Engine",
    status: "upcoming" as const,
  },
  {
    label: "Future",
    title: "AI Recommendations",
    status: "upcoming" as const,
  },
  {
    label: "Future",
    title: "Saved Results",
    status: "upcoming" as const,
  },
];

const featureCards = [
  {
    href: "/core",
    title: "Core extraction",
    description:
      "Describe a decision in plain text and get a simulated breakdown of the options and priorities inside it.",
  },
  {
    href: "/research",
    title: "Research & benchmarking",
    description:
      "See how global examples, competitors, and substitutes stack up — and exactly where they fall short for international students.",
  },
  {
    href: "/product",
    title: "Product",
    description:
      "Free, Plus, and Campus tiers, with a feature-by-feature map of what each one includes.",
  },
  {
    href: "/pricing",
    title: "Pricing simulator",
    description:
      "Adjust hypothetical assumptions and see what ChoicePilot's revenue could look like — transparent, not final.",
  },
  {
    href: "/marketing",
    title: "Marketing",
    description:
      "The brand system, persona, and content behind how ChoicePilot talks about itself — all drafted, nothing published.",
  },
];

const trustPoints = [
  "No sponsored rankings — nothing is placed first because it paid to be.",
  "No referral fees or affiliate commissions on any comparison.",
  "Simulated or hypothetical content is always labeled as such, not presented as real.",
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            {landingCopy.heroHeadline}
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600">
            {landingCopy.subheadline}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={landingCopy.primaryCta.href}
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-500"
            >
              {landingCopy.primaryCta.label}
            </Link>
            <a
              href={landingCopy.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-6 py-3 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              {landingCopy.secondaryCta.label}
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            The first month abroad is three decisions, all at once.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Housing, insurance, and a bank account — usually before classes
            even start, and usually with no local experience to lean on.
            Comparison sites that are supposed to help often rank options by
            who pays the most, not what&apos;s actually right for you.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            How it works
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {landingCopy.howItWorksSteps.map((step) => (
              <div key={step.number} className="flex flex-col gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                  {step.number}
                </span>
                <h3 className="text-base font-semibold text-zinc-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-6 text-zinc-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why non-affiliate */}
      <section className="border-b border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Why non-affiliate
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            ChoicePilot doesn&apos;t take referral fees or sponsored
            placements. That means no incentive to rank one option above
            another — just your own priorities, weighed transparently. See
            exactly how comparisons are built on{" "}
            <Link href="/research" className="font-medium text-indigo-600 hover:text-indigo-500">
              /research
            </Link>
            .
          </p>
          <ul className="mt-6 max-w-2xl space-y-2">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2 text-sm text-zinc-600"
              >
                <span className="mt-0.5 text-indigo-600">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Feature cards */}
      <section className="border-b border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            What&apos;s built so far
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-xl border border-zinc-200 p-6 transition-colors hover:border-indigo-500 hover:bg-indigo-50"
              >
                <p className="text-base font-semibold text-zinc-900">
                  {card.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-b border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Curious what it might cost?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            See the tiers on{" "}
            <Link href="/product" className="font-medium text-indigo-600 hover:text-indigo-500">
              /product
            </Link>{" "}
            and play with the assumptions yourself on{" "}
            <Link href="/pricing" className="font-medium text-indigo-600 hover:text-indigo-500">
              /pricing
            </Link>
            . Both are hypotheses we&apos;re testing, not final answers.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            FAQ
          </h2>
          <div className="mt-10 space-y-6">
            {landingCopy.faq.map((item) => (
              <div key={item.question}>
                <p className="text-base font-semibold text-zinc-900">
                  {item.question}
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="border-b border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Roadmap
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-4">
            {roadmap.map((item) => (
              <div
                key={item.title}
                className={`rounded-xl border px-5 py-6 ${
                  item.status === "shipped"
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-zinc-100 bg-white"
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    item.status === "shipped"
                      ? "text-emerald-600"
                      : "text-zinc-400"
                  }`}
                >
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-900">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {landingCopy.finalCta.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-600">
            {landingCopy.finalCta.body}
          </p>
          <Link
            href={landingCopy.finalCta.cta.href}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-500"
          >
            {landingCopy.finalCta.cta.label}
          </Link>
        </div>
      </section>
    </div>
  );
}
