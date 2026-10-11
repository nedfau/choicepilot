"use client";

import { useState } from "react";
import {
  TEMPLATE_CONTENT_LABEL,
  abTests,
  brand,
  persona,
  landingCopy,
  socialPosts,
  videoScripts,
} from "@/lib/marketing-content";
import {
  formatBrand,
  formatPersona,
  formatLandingCopy,
} from "@/lib/marketing-format";
import SocialPostCard from "@/components/marketing/SocialPostCard";
import VideoScriptCard from "@/components/marketing/VideoScriptCard";
import CampaignCalendar from "@/components/marketing/CampaignCalendar";
import AbTestCard from "@/components/marketing/AbTestCard";
import SaveButton from "@/components/marketing/SaveButton";
import SavedAssetsList from "@/components/marketing/SavedAssetsList";

export default function Marketing() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleSaved = () => setRefreshKey((key) => key + 1);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Marketing
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-7 text-zinc-600">
        The brand system, persona, and content drafts behind ChoicePilot&apos;s
        marketing — all pre-written, nothing published or live anywhere else.
      </p>
      <span className="mt-4 inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
        {TEMPLATE_CONTENT_LABEL}
      </span>

      {/* Brand system */}
      <section id="marketing-brand-card" className="mt-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Brand system
          </h2>
          <SaveButton
            assetType="brand"
            title={`Brand: ${brand.name}`}
            content={formatBrand(brand)}
            onSaved={handleSaved}
          />
        </div>
        <div className="mt-6 rounded-xl border border-zinc-200 p-6">
          <p className="text-base font-semibold text-zinc-900">
            {brand.name}
          </p>
          <p className="mt-1 text-sm text-zinc-600">{brand.tagline}</p>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Voice
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {brand.voiceAttributes.map((attr) => (
                <div
                  key={attr.name}
                  className="rounded-lg border border-zinc-100 bg-zinc-50 p-4"
                >
                  <p className="text-sm font-semibold text-zinc-900">
                    {attr.name}
                  </p>
                  <p className="mt-2 text-xs text-emerald-700">
                    Do: {attr.doExample}
                  </p>
                  <p className="mt-1 text-xs text-red-600">
                    Don&apos;t: {attr.dontExample}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Colors
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {brand.colors.map((color) => (
                <div
                  key={color.hex}
                  className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3"
                >
                  <span
                    className="h-8 w-8 shrink-0 rounded-full border border-zinc-200"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {color.name}{" "}
                      <span className="font-mono text-xs text-zinc-400">
                        {color.hex}
                      </span>
                    </p>
                    <p className="text-xs text-zinc-500">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Font
              </p>
              <p className="mt-1 text-sm text-zinc-600">{brand.font}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Logo
              </p>
              <p className="mt-1 text-sm text-zinc-600">{brand.logoNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Persona */}
      <section id="marketing-persona-card" className="mt-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Persona
          </h2>
          <SaveButton
            assetType="persona"
            title={`Persona: ${persona.name}`}
            content={formatPersona(persona)}
            onSaved={handleSaved}
          />
        </div>
        <div className="mt-6 rounded-xl border border-zinc-200 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-base font-semibold text-zinc-900">
              {persona.name}, {persona.age}
            </p>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Fictional
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500">{persona.fictionalNote}</p>
          <p className="mt-3 text-sm text-zinc-600">
            {persona.program}, moving from {persona.origin} to{" "}
            {persona.destination}.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Goals
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-600">
                {persona.goals.map((goal) => (
                  <li key={goal}>{goal}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Frustrations
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-600">
                {persona.frustrations.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Channels
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-600">
                {persona.channels.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Landing copy */}
      <section id="marketing-landing-copy-card" className="mt-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Landing copy
          </h2>
          <SaveButton
            assetType="landing_copy"
            title="Landing copy"
            content={formatLandingCopy(landingCopy)}
            onSaved={handleSaved}
          />
        </div>
        <div className="mt-6 rounded-xl border border-zinc-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Hero
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-900">
            {landingCopy.heroHeadline}
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            {landingCopy.subheadline}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-zinc-500">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">
              {landingCopy.primaryCta.label}
            </span>
            <span className="rounded-full border border-zinc-200 px-3 py-1">
              {landingCopy.secondaryCta.label}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Benefits
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {landingCopy.benefits.map((b) => (
                <div key={b.title}>
                  <p className="text-sm font-semibold text-zinc-900">
                    {b.title}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              How it works
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {landingCopy.howItWorksSteps.map((step) => (
                <div key={step.number}>
                  <p className="text-sm font-semibold text-zinc-900">
                    {step.number}. {step.title}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              FAQ
            </p>
            <div className="mt-3 space-y-3">
              {landingCopy.faq.map((item) => (
                <div key={item.question}>
                  <p className="text-sm font-medium text-zinc-900">
                    {item.question}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-4">
            <p className="text-sm font-semibold text-zinc-900">
              {landingCopy.finalCta.heading}
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              {landingCopy.finalCta.body}
            </p>
          </div>
        </div>
      </section>

      {/* Social posts */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Social posts
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {socialPosts.map((post) => (
            <SocialPostCard key={post.id} post={post} onSaved={handleSaved} />
          ))}
        </div>
      </section>

      {/* Video scripts */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Video scripts
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {videoScripts.map((script) => (
            <VideoScriptCard
              key={script.id}
              script={script}
              onSaved={handleSaved}
            />
          ))}
        </div>
      </section>

      {/* Campaign calendar */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Campaign calendar
        </h2>
        <div className="mt-6">
          <CampaignCalendar onSaved={handleSaved} />
        </div>
      </section>

      {/* A/B tests */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          A/B tests
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {abTests.map((test) => (
            <AbTestCard key={test.testName} test={test} />
          ))}
        </div>
      </section>

      {/* Saved assets */}
      <section className="mt-16 border-t border-zinc-100 pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Saved assets
        </h2>
        <div className="mt-6">
          <SavedAssetsList refreshKey={refreshKey} />
        </div>
      </section>
    </div>
  );
}
