import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Aggregates must reflect every save immediately.
export const dynamic = "force-dynamic";

interface AggregateRow {
  completed: boolean;
  clarity_rating: number;
  value_rating: number;
  would_use: boolean;
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json({
      total: 0,
      completionRate: null,
      avgClarity: null,
      avgValue: null,
      wouldUseShare: null,
      rows: [],
    });
  }

  const [allResult, latestResult] = await Promise.all([
    supabase.from("demo_tests").select("completed, clarity_rating, value_rating, would_use"),
    supabase.from("demo_tests").select("*").order("created_at", { ascending: false }).limit(10),
  ]);

  const error = allResult.error ?? latestResult.error;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const allRows = (allResult.data ?? []) as unknown as AggregateRow[];
  const total = allRows.length;

  const completionRate =
    total > 0 ? (allRows.filter((r) => r.completed).length / total) * 100 : null;
  const avgClarity =
    total > 0 ? allRows.reduce((sum, r) => sum + r.clarity_rating, 0) / total : null;
  const avgValue =
    total > 0 ? allRows.reduce((sum, r) => sum + r.value_rating, 0) / total : null;
  const wouldUseShare =
    total > 0 ? (allRows.filter((r) => r.would_use).length / total) * 100 : null;

  return NextResponse.json({
    total,
    completionRate,
    avgClarity,
    avgValue,
    wouldUseShare,
    rows: (latestResult.data ?? []) as unknown as Record<string, unknown>[],
  });
}

function isValidString(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const testerLabel = typeof body?.tester_label === "string" ? body.tester_label.trim() : "";
  const testerRole = typeof body?.tester_role === "string" ? body.tester_role.trim() : "";
  const completed = body?.completed;
  const minutesTakenRaw = body?.minutes_taken;
  const hasMinutesTaken =
    minutesTakenRaw !== null && minutesTakenRaw !== undefined && minutesTakenRaw !== "";
  const minutesTaken = hasMinutesTaken ? Number(minutesTakenRaw) : null;
  const clarityRating = Number(body?.clarity_rating);
  const valueRating = Number(body?.value_rating);
  const wouldUse = body?.would_use;
  const issueFound = typeof body?.issue_found === "string" ? body.issue_found.trim() : "";
  const suggestionRaw = typeof body?.suggestion === "string" ? body.suggestion.trim() : "";
  const suggestion = suggestionRaw || null;

  const errors: string[] = [];
  if (!isValidString(testerLabel, 1, 40)) errors.push("tester_label must be 1-40 characters");
  if (!isValidString(testerRole, 1, 60)) errors.push("tester_role must be 1-60 characters");
  if (typeof completed !== "boolean") errors.push("completed must be true or false");
  if (hasMinutesTaken && (!Number.isInteger(minutesTaken) || minutesTaken! < 1 || minutesTaken! > 60)) {
    errors.push("minutes_taken must be a whole number from 1 to 60 if provided");
  }
  if (!Number.isInteger(clarityRating) || clarityRating < 1 || clarityRating > 5) {
    errors.push("clarity_rating must be a whole number from 1 to 5");
  }
  if (!Number.isInteger(valueRating) || valueRating < 1 || valueRating > 5) {
    errors.push("value_rating must be a whole number from 1 to 5");
  }
  if (typeof wouldUse !== "boolean") errors.push("would_use must be true or false");
  if (!isValidString(issueFound, 1, 300)) errors.push("issue_found must be 1-300 characters");
  if (suggestion && suggestion.length > 300) {
    errors.push("suggestion must be 300 characters or fewer");
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("demo_tests")
    .insert({
      tester_label: testerLabel,
      tester_role: testerRole,
      completed,
      minutes_taken: minutesTaken,
      clarity_rating: clarityRating,
      value_rating: valueRating,
      would_use: wouldUse,
      issue_found: issueFound,
      suggestion,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
