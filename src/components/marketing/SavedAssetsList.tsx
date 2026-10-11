"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CopyButton from "./CopyButton";

interface MarketingAsset {
  id: string;
  asset_type: string;
  title: string;
  content: string;
  created_at: string;
}

const RELATIVE_TIME_UNITS: Array<{
  amount: number;
  unit: Intl.RelativeTimeFormatUnit;
}> = [
  { amount: 60, unit: "seconds" },
  { amount: 60, unit: "minutes" },
  { amount: 24, unit: "hours" },
  { amount: 7, unit: "days" },
  { amount: 4.34524, unit: "weeks" },
  { amount: 12, unit: "months" },
  { amount: Infinity, unit: "years" },
];

function relativeTime(isoDate: string): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let duration = (new Date(isoDate).getTime() - Date.now()) / 1000;

  for (const { amount, unit } of RELATIVE_TIME_UNITS) {
    if (Math.abs(duration) < amount) {
      return rtf.format(Math.round(duration), unit);
    }
    duration /= amount;
  }
  return rtf.format(Math.round(duration), "years");
}

export default function SavedAssetsList({ refreshKey }: { refreshKey: number }) {
  const [assets, setAssets] = useState<MarketingAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!supabase) {
        if (!ignore) setIsLoading(false);
        return;
      }
      const { data } = await supabase
        .from("marketing_assets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!ignore) {
        setAssets(data ?? []);
        setIsLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading…</p>;
  }

  if (assets.length === 0) {
    return <p className="text-sm text-zinc-500">No saved assets yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {assets.map((asset) => (
        <li
          key={asset.id}
          className="flex items-center justify-between gap-4 rounded-lg border border-zinc-100 px-4 py-3"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                {asset.asset_type}
              </span>
              <span className="truncate text-sm font-medium text-zinc-900">
                {asset.title}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              {relativeTime(asset.created_at)}
            </p>
          </div>
          <CopyButton text={asset.content} />
        </li>
      ))}
    </ul>
  );
}
