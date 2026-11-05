import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Always re-run on request — counts must be fresh, never cached.
export const dynamic = "force-dynamic";

interface TableResult {
  count: number | null;
  rows: Record<string, unknown>[];
  error: string | null;
}

// Table name -> the columns safe to expose on a public dashboard.
// No raw visitor-typed free text anywhere (core_outputs gets created_at
// only; comments, issue_found, suggestion, and tester_role are excluded).
const TABLES: Record<string, string> = {
  core_outputs: "id, created_at",
  research_entries: "id, name, type, region, created_at",
  pricing_scenarios:
    "id, plus_price, campus_price, plus_subscribers, campus_partners, monthly_revenue, annual_revenue, billing_period, created_at",
  marketing_assets: "id, asset_type, title, created_at",
  ab_votes: "id, test_name, variant, created_at",
  chat_sessions:
    "id, decision_type, priority, situation, human_checkpoint, checkpoint_confirmed, created_at",
  chat_feedback: "id, rating, created_at",
  chat_tests: "id, tester_label, decision_type, completed, rating, created_at",
  demo_tests:
    "id, tester_label, completed, clarity_rating, value_rating, would_use, created_at",
};

async function loadTable(tableName: string, safeColumns: string): Promise<TableResult> {
  if (!supabase) {
    return { count: null, rows: [], error: "Supabase is not configured" };
  }

  try {
    const [{ count, error: countError }, { data, error: dataError }] = await Promise.all([
      supabase.from(tableName).select("*", { count: "exact", head: true }),
      supabase
        .from(tableName)
        .select(safeColumns)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    const error = countError ?? dataError;
    if (error) {
      return { count: null, rows: [], error: error.message };
    }

    return {
      count: count ?? 0,
      rows: (data ?? []) as unknown as Record<string, unknown>[],
      error: null,
    };
  } catch (err) {
    return {
      count: null,
      rows: [],
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function GET() {
  const entries = await Promise.all(
    Object.entries(TABLES).map(async ([tableName, safeColumns]) => [
      tableName,
      await loadTable(tableName, safeColumns),
    ] as const)
  );

  const result = Object.fromEntries(entries);

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
