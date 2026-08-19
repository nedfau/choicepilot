const steps = [
  {
    number: "1",
    title: "Add the options you're weighing",
    description:
      "List the apartments, insurance plans, or bank accounts you're deciding between.",
  },
  {
    number: "2",
    title: "Set your priorities",
    description:
      "Tell ChoicePilot what matters most to you — price, coverage, location, flexibility, and more.",
  },
  {
    number: "3",
    title: "See a transparent, scored recommendation",
    description:
      "Get a clear, personalized ranking with no sponsored placements or affiliate bias.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            The confusing stuff, decided with confidence.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600">
            Weigh housing, insurance, and banking decisions by what matters to
            you — no sponsored rankings, wherever you&apos;re studying.
          </p>
          <a
            href="#how-it-works"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Start Comparing
          </a>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            How it works
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {steps.map((step) => (
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
    </div>
  );
}
