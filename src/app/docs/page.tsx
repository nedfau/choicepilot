import type { Metadata } from "next";
import PromptLibraryEntry from "@/components/docs/PromptLibraryEntry";
import { BUILD_LOG } from "@/data/build-log";

export const metadata: Metadata = {
  title: "Docs — ChoicePilot",
};

function Code({ children }: { children: string }) {
  return (
    <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.85em]">
      {children}
    </code>
  );
}

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

      {/* Prompt library */}
      <section className="mt-16 border-t border-zinc-100 pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Prompt library
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
          Extraction and generation logic used on ChoicePilot is documented
          here as it&apos;s added, whether it&apos;s a real model prompt or,
          as with every entry below, a simulated rule-based stand-in.
        </p>

        <PromptLibraryEntry
          title="core-extraction-v1 — Decision core extraction"
          usedBy={
            <>
              Used by <Code>POST /api/core/extract</Code> on <Code>/core</Code>.
              Takes a free-text decision description and returns the options
              and priorities embedded in it, via plain text parsing — no
              external AI/LLM call.
            </>
          }
          sections={[
            {
              heading: "Options logic",
              body: (
                <>
                  If the text contains &quot;between&quot;, split the phrase
                  that follows on &quot;and&quot;, &quot;or&quot;,
                  &quot;vs&quot;, and commas. Otherwise split the whole text on
                  &quot;or&quot;, &quot;vs&quot;, and commas. Each resulting
                  segment is trimmed, and blank or overly long (60+ character)
                  segments are dropped before de-duplicating.
                </>
              ),
            },
            {
              heading: "Priorities logic",
              body: (
                <>
                  The text is checked for exact-word matches against a fixed
                  keyword dictionary: price, cost, budget, time, speed,
                  quality, comfort, safety, commute, distance, location,
                  coverage, flexibility, convenience, reliability, support.
                  Every match found is included once.
                </>
              ),
            },
          ]}
          example={
            <>
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
            </>
          }
          note="Routing this through an API route, even while simulated, keeps the seam open to swap in a real model call in a later week without changing the /core frontend."
        />

        <PromptLibraryEntry
          title="pricing-calculator-v1 — Revenue calculation"
          usedBy={
            <>
              Used by <Code>/pricing</Code> (live, client-side) and{" "}
              <Code>POST /api/pricing/save</Code>, which stores the
              already-computed numbers — the server never recalculates them. A
              fixed formula over four user-adjustable assumptions, no real
              pricing data behind it.
            </>
          }
          sections={[
            {
              heading: "Formula",
              body: (
                <>
                  Monthly revenue = (Plus subscribers × Plus price) + (Campus
                  partners × Campus price). Annual revenue = monthly × 12 ×
                  0.85 (a fixed 15% annual discount). The same inputs split by
                  segment: Plus subscribers × Plus price is the Students
                  segment, Campus partners × Campus price is the Universities
                  segment.
                </>
              ),
            },
            {
              heading: "Scenario presets",
              body: (
                <>
                  Three fixed presets fill in the four inputs: Conservative
                  (100 subscribers, $6.99, 1 partner, $199), Base (500, $6.99,
                  4, $199 — the page&apos;s default), and Optimistic (2000,
                  $6.99, 15, $199). Editing any input by hand switches the page
                  to a &quot;Custom&quot; state.
                </>
              ),
            },
          ]}
          example={
            <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700">
{`// 100 subscribers, $10 Plus price, 0 Campus partners
{ "monthly": 1000, "annual": 10200 }`}
            </pre>
          }
          note="The calculator never calls the server for the live number — only Save and the saved-scenarios read touch Supabase."
        />

        <PromptLibraryEntry
          title="marketing-content-v1 — Content formatting and A/B display"
          usedBy={
            <>
              Used by <Code>/marketing</Code>, <Code>POST /api/marketing/vote</Code>,{" "}
              <Code>GET /api/marketing/votes</Code>, and{" "}
              <Code>POST /api/marketing/assets</Code>. There&apos;s no live
              generation step — every social post, video script, and piece of
              landing copy is pre-written and static.
            </>
          }
          sections={[
            {
              heading: "What's actually rule-based",
              body: (
                <>
                  Copy, Export (.csv/.md), and the text sent to{" "}
                  <Code>/api/marketing/assets</Code> are built by plain
                  string-formatting functions over the static content — not
                  generated per request.
                </>
              ),
            },
            {
              heading: "A/B display logic",
              body: (
                <>
                  Each test&apos;s two variants are randomly assigned to the
                  left or right position once per page load, but the vote sent
                  to the server always records the true variant id, not the
                  display position — so the stored result can&apos;t be skewed
                  by which side was clicked.
                </>
              ),
            },
          ]}
          note='All content is labeled "Template content drafted with AI assistance, not published anywhere" — it has never been posted, and no real engagement numbers are implied anywhere.'
        />

        <PromptLibraryEntry
          title="chat-intake-v1 — Guided intake and response assembly"
          usedBy={
            <>
              Used by <Code>POST /api/chat/respond</Code> on <Code>/chat</Code>.
              Runs entirely server-side — the client only renders what this
              route returns.
            </>
          }
          sections={[
            {
              heading: "Matching a typed answer",
              body: (
                <>
                  Each of the 3 fixed questions (decision type, priority,
                  timeline) has a keyword dictionary per option (e.g.
                  &quot;apartment&quot;, &quot;rent&quot;, &quot;dorm&quot; →
                  Housing). Typed text is checked against those keywords
                  first, then against the option&apos;s own text as a
                  fallback. No match returns null and the assistant asks
                  again.
                </>
              ),
            },
            {
              heading: "Building the final response",
              body: (
                <>
                  Once all 3 questions are answered, a fixed template per
                  decision type (Housing / Insurance / Banking) is combined
                  with a one-line note tailored to the chosen priority, plus a
                  fixed closing disclaimer. Housing&apos;s steps are reordered
                  to lead with &quot;check requirements&quot; when the
                  priority is &quot;Meets all requirements.&quot; A human
                  checkpoint is flagged whenever the decision type is
                  Insurance, or the priority is &quot;Meets all
                  requirements&quot; — regardless of decision type.
                </>
              ),
            },
          ]}
          note="The three questions, their options, and every template sentence are fixed in code — nothing here is generated per conversation."
        />

        <PromptLibraryEntry
          title="chat-guardrails-v1 — Server-side safety checks"
          usedBy={
            <>
              Used by <Code>POST /api/chat/respond</Code> (checked before
              intake matching, on every typed message) and{" "}
              <Code>POST /api/chat/feedback</Code> (checks the optional
              comment for personal data only). Runs entirely server-side, so
              it can&apos;t be bypassed from the browser.
            </>
          }
          sections={[
            {
              heading: "legal_visa",
              body: "Catches mentions of visa, residence/residency permit, immigration, lawyer, attorney, deportation, or asylum. Points to the university's international office or an immigration lawyer instead.",
            },
            {
              heading: "medical",
              body: "Word-boundary matching (not substring) against symptom(s), diagnosis, medication(s), prescription, illness, disease, surgery, headache, pain, sick, fever, dizzy, injury, medicine, pill(s), antibiotic(s), and treatment — word-boundary specifically so \"sick\" inside \"seasickness\" doesn't false-positive. Points to a doctor, the university health service, or emergency services.",
            },
            {
              heading: "financial_advice",
              body: "Catches invest, investment, stocks, crypto, loan advice, mortgage advice, and similar. Points to a bank advisor or licensed financial professional.",
            },
            {
              heading: "personal_data",
              body: "Combines regex pattern matching (email addresses, phone-number-shaped digit strings, IBAN-shaped codes) with keyword matches on \"passport\" and \"password.\" Tells the user not to share that information; never repeats it back.",
            },
            {
              heading: "prompt_injection",
              body: "Catches phrases like \"ignore previous instructions,\" \"system prompt,\" or \"pretend you are.\" Tells the user the assistant can't be redirected by instructions typed into the chat.",
            },
            {
              heading: "Distress variant (medical)",
              body: "Checked before the regular medical category. Phrases like \"depressed,\" \"hopeless,\" \"suicidal,\" or \"hurt myself\" get a short, supportive message — not the standard medical refusal — pointing to emergency services, a crisis line, or the university's counseling service. The category returned is still \"medical.\"",
            },
          ]}
          note="Every guardrail message explains what the assistant can't do and why, and offers a safe alternative — none of them echo back anything the user typed."
        />
      </section>

      {/* Build log */}
      <section className="mt-16 border-t border-zinc-100 pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Build log
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
          Every commit, grouped by week, generated from the real git history.
          Two entries are marked as an inferred grouping — they continued an
          existing week&apos;s module but weren&apos;t made under a prompt
          that restated the week number.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {BUILD_LOG.map((week) => (
            <details key={week.week} className="rounded-xl border border-zinc-200 p-6">
              <summary className="cursor-pointer text-base font-semibold text-zinc-900">
                {week.week} — {week.title}{" "}
                <span className="font-normal text-zinc-400">
                  ({week.entries.length} commits)
                </span>
              </summary>
              <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-100">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="px-4 py-2">Hash</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Message</th>
                      <th className="px-4 py-2">Page</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {week.entries.map((entry) => (
                      <tr key={entry.hash}>
                        <td className="px-4 py-2 font-mono text-xs text-zinc-500">
                          {entry.hash}
                        </td>
                        <td className="px-4 py-2 text-zinc-600">{entry.date}</td>
                        <td className="px-4 py-2 text-zinc-700">
                          {entry.message}
                          {entry.inferredWeek && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                              Inferred week
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-zinc-600">{entry.page ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Coding-agent prompts */}
      <section className="mt-16 border-t border-zinc-100 pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Coding-agent prompts
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
          The one-line purpose of each prompt given to the coding agent, per
          week, derived from the commit messages above. The verbatim prompts
          themselves live in each week&apos;s evidence packet, not here.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {BUILD_LOG.map((week) => (
            <div key={week.week} className="rounded-xl border border-zinc-200 p-5">
              <p className="text-sm font-semibold text-zinc-900">
                {week.week} — {week.title}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-6 text-zinc-600">
                {week.entries.map((entry) => (
                  <li key={entry.hash}>{entry.message}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
