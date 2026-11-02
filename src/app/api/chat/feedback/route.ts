import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { checkGuardrail } from "@/lib/chat-logic";

const MAX_COMMENT_LENGTH = 200;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const sessionId = typeof body?.session_id === "string" ? body.session_id : "";
  const rating = body?.rating === "up" || body?.rating === "down" ? body.rating : "";
  const commentRaw = typeof body?.comment === "string" ? body.comment.trim() : "";
  const comment = commentRaw.slice(0, MAX_COMMENT_LENGTH);

  if (!sessionId || !rating) {
    return NextResponse.json(
      { error: "session_id and rating ('up' or 'down') are required" },
      { status: 400 }
    );
  }

  if (comment) {
    const guardrail = checkGuardrail(comment);
    if (guardrail?.category === "personal_data") {
      return NextResponse.json(
        {
          error:
            "That comment may contain personal data (like an email, phone number, or passport info). Please remove it and try again.",
        },
        { status: 400 }
      );
    }
  }

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("chat_feedback")
    .insert({
      session_id: sessionId,
      rating,
      comment: comment || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
