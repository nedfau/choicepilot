import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  if (!supabase) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("chat_tests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const testerLabel = typeof body?.tester_label === "string" ? body.tester_label.trim() : "";
  const testerRole = typeof body?.tester_role === "string" ? body.tester_role.trim() : "";
  const decisionType = typeof body?.decision_type === "string" ? body.decision_type.trim() : "";
  const completed = body?.completed === true;
  const rating = Number(body?.rating);
  const issueFound = typeof body?.issue_found === "string" ? body.issue_found.trim() : "";
  const suggestionRaw = typeof body?.suggestion === "string" ? body.suggestion.trim() : "";
  const suggestion = suggestionRaw || null;

  if (
    !testerLabel ||
    !testerRole ||
    !decisionType ||
    !issueFound ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      {
        error:
          "tester_label, tester_role, decision_type, issue_found, and a rating from 1 to 5 are required",
      },
      { status: 400 }
    );
  }

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("chat_tests")
    .insert({
      tester_label: testerLabel,
      tester_role: testerRole,
      decision_type: decisionType,
      completed,
      rating,
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
