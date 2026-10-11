"use client";

import {
  abTests,
  brand,
  calendar,
  landingCopy,
  persona,
  socialPosts,
  videoScripts,
} from "@/lib/marketing-content";
import {
  calendarToCsv,
  calendarToText,
  formatAllAssetsMarkdown,
} from "@/lib/marketing-format";
import { downloadTextFile } from "@/lib/download";
import CopyButton from "./CopyButton";

export default function CampaignCalendar() {
  function handleExportCsv() {
    downloadTextFile(
      "choicepilot-campaign-calendar.csv",
      calendarToCsv(calendar),
      "text/csv"
    );
  }

  function handleExportMarkdown() {
    downloadTextFile(
      "choicepilot-marketing-assets.md",
      formatAllAssetsMarkdown({
        brand,
        persona,
        landingCopy,
        socialPosts,
        videoScripts,
        calendar,
        abTests,
      }),
      "text/markdown"
    );
  }

  return (
    <div id="marketing-calendar-card" className="rounded-xl border border-zinc-200 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-zinc-900">
          14-day campaign calendar
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton text={calendarToText(calendar)} />
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Export calendar (.csv)
          </button>
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Export all assets (.md)
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Asset ref</th>
              <th className="px-4 py-3">Goal</th>
              <th className="px-4 py-3">CTA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {calendar.map((day) => (
              <tr key={day.day}>
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {day.day}
                </td>
                <td className="px-4 py-3 text-zinc-600">{day.channel}</td>
                <td className="px-4 py-3 text-zinc-600">
                  <a href={`#${day.assetRef}`} className="text-indigo-600 hover:underline">
                    {day.assetRef}
                  </a>
                </td>
                <td className="px-4 py-3 capitalize text-zinc-600">
                  {day.goal}
                </td>
                <td className="px-4 py-3 text-zinc-600">{day.cta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
