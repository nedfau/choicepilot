"use client";

import { useState } from "react";

function fallbackCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch {
    succeeded = false;
  }
  document.body.removeChild(textarea);
  return succeeded;
}

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    let succeeded = false;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        succeeded = true;
      }
    } catch {
      succeeded = false;
    }

    if (!succeeded) {
      succeeded = fallbackCopy(text);
    }

    if (succeeded) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy to clipboard"
      className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
