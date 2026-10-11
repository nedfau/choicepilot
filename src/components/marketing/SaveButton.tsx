"use client";

import { useState } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function SaveButton({
  assetType,
  title,
  content,
  onSaved,
}: {
  assetType: string;
  title: string;
  content: string;
  onSaved?: () => void;
}) {
  const [status, setStatus] = useState<SaveStatus>("idle");

  async function handleSave() {
    setStatus("saving");
    try {
      const response = await fetch("/api/marketing/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset_type: assetType, title, content }),
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      setStatus("saved");
      onSaved?.();
    } catch {
      setStatus("error");
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleSave}
        disabled={status === "saving"}
        aria-label={`Save ${title}`}
        className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Save"}
      </button>
      {status === "error" && (
        <span className="text-xs text-red-600">Couldn&apos;t save.</span>
      )}
    </span>
  );
}
