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
    </div>
  );
}
