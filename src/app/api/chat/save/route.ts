import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const VALID_DECISION_TYPES = ["housing", "insurance", "banking"];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const decisionType =
    typeof body?.decision_type === "string"
      ? body.decision_type.toLowerCase()
      : "";
  const priority = typeof body?.priority === "string" ? body.priority : null;
  const situation = typeof body?.situation === "string" ? body.situation : null;
  const guardrailCategory =
    typeof body?.guardrail_category === "string" ? body.guardrail_category : null;
  const humanCheckpoint = body?.human_checkpoint === true;
  const checkpointConfirmed = body?.checkpoint_confirmed === true;

  if (!VALID_DECISION_TYPES.includes(decisionType)) {
    return NextResponse.json(
      { error: "decision_type must be housing, insurance, or banking" },
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
    .from("chat_sessions")
    .insert({
      decision_type: decisionType,
      priority,
      situation,
      guardrail_category: guardrailCategory,
      human_checkpoint: humanCheckpoint,
      checkpoint_confirmed: checkpointConfirmed,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
