import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs — ChoicePilot",
};

export default function Docs() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Docs
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600">
        Documentation and technical details will grow with the project. Check
        back as ChoicePilot moves beyond Week 0.
      </p>

      <section className="mt-16 border-t border-zinc-100 pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Prompt library
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
          Extraction and generation logic used on ChoicePilot is documented
          here as it&apos;s added, whether it&apos;s a real model prompt or,
          as with the entry below, a simulated rule-based stand-in.
        </p>

        <div className="mt-8 rounded-xl border border-zinc-200 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-zinc-900">
              core-extraction-v1 — Decision core extraction
            </h3>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Simulated — rule-based, not AI
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Used by <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.85em]">POST /api/core/extract</code> on{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.85em]">/core</code>.
            Takes a free-text decision description and returns the options
            and priorities embedded in it, via plain text parsing — no
            external AI/LLM call this week.
          </p>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-zinc-900">
                Options logic
              </h4>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                If the text contains &quot;between&quot;, split the phrase
                that follows on &quot;and&quot;, &quot;or&quot;,
                &quot;vs&quot;, and commas. Otherwise split the whole text on
                &quot;or&quot;, &quot;vs&quot;, and commas. Each resulting
                segment is trimmed, and blank or overly long (60+ character)
                segments are dropped before de-duplicating.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900">
                Priorities logic
              </h4>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                The text is checked for exact-word matches against a fixed
                keyword dictionary: price, cost, budget, time, speed,
                quality, comfort, safety, commute, distance, location,
                coverage, flexibility, convenience, reliability, support.
                Every match found is included once.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <h4 className="text-sm font-semibold text-zinc-900">Example</h4>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Input: &quot;I&apos;m choosing between Apartment A and
              Apartment B, price and commute time matter most&quot;
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700">
{`{
  "options": ["Apartment A", "Apartment B"],
  "priorities": ["Price", "Time", "Commute"]
}`}
            </pre>
          </div>

          <p className="mt-5 text-sm leading-6 text-zinc-500">
            Routing this through an API route, even while simulated, keeps
            the seam open to swap in a real model call in a later week
            without changing the /core frontend.
          </p>
        </div>
      </section>
    </div>
  );
}
