"use client";

import { useState, type FormEvent } from "react";
import { RESEARCH_TYPES, type ResearchEntry } from "@/lib/researchEntry";

const EMPTY_FORM = {
  name: "",
  type: "",
  region: "",
  url: "",
  description: "",
  gapNote: "",
};

interface FieldErrors {
  name?: string;
  type?: string;
  description?: string;
}

export default function IntakeForm({
  onEntryAdded,
}: {
  onEntryAdded: (entry: ResearchEntry) => void;
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fieldErrors: FieldErrors = {};
    if (!form.name.trim()) fieldErrors.name = "Name is required.";
    if (!form.type.trim()) fieldErrors.type = "Type is required.";
    if (!form.description.trim())
      fieldErrors.description = "Description is required.";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/research/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          type: form.type,
          region: form.region.trim() || null,
          url: form.url.trim() || null,
          description: form.description.trim(),
          gap_note: form.gapNote.trim() || null,
        }),
      });

      if (!response.ok) {
        setSubmitError("Couldn't save — please try again.");
        return;
      }

      const entry: ResearchEntry = await response.json();
      onEntryAdded(entry);
      setForm(EMPTY_FORM);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-xl border border-zinc-200 p-6 sm:grid-cols-2"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
        />
        {errors.name && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-zinc-700">
          Type
        </label>
        <select
          id="type"
          value={form.type}
          onChange={(e) => updateField("type", e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">Select a type</option>
          {RESEARCH_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.type}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="region" className="block text-sm font-medium text-zinc-700">
          Region
        </label>
        <input
          id="region"
          type="text"
          placeholder="e.g. Mexico or Global"
          value={form.region}
          onChange={(e) => updateField("region", e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-zinc-700">
          URL
        </label>
        <input
          id="url"
          type="text"
          value={form.url}
          onChange={(e) => updateField("url", e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-700"
        >
          Description
        </label>
        <input
          id="description"
          type="text"
          placeholder="One line: what it is / what it does"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
        />
        {errors.description && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="gap-note" className="block text-sm font-medium text-zinc-700">
          Gap / Note
        </label>
        <textarea
          id="gap-note"
          rows={2}
          placeholder="What it does NOT solve for international students"
          value={form.gapNote}
          onChange={(e) => updateField("gapNote", e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div className="sm:col-span-2">
        {submitError && (
          <p role="alert" className="mb-3 text-sm text-red-600">
            {submitError}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
        >
          {isSubmitting ? "Adding…" : "Add to research"}
        </button>
      </div>
    </form>
  );
}
