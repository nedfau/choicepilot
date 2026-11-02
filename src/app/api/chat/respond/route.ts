import { NextResponse } from "next/server";
import {
  INTAKE_QUESTIONS,
  checkGuardrail,
  matchOption,
  buildResponse,
  type IntakeAnswers,
  type IntakeQuestion,
} from "@/lib/chat-logic";

const QUESTION_IDS = INTAKE_QUESTIONS.map((q) => q.id);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const text = typeof body?.text === "string" ? body.text : "";
  const questionId = body?.questionId as IntakeQuestion["id"] | undefined;
  const answers =
    typeof body?.answers === "object" && body?.answers !== null
      ? (body.answers as Record<string, string>)
      : {};

  if (!text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  if (!questionId || !QUESTION_IDS.includes(questionId)) {
    return NextResponse.json(
      { error: "a valid questionId is required" },
      { status: 400 }
    );
  }

  const guardrail = checkGuardrail(text);
  if (guardrail) {
    return NextResponse.json({
      status: "guardrail",
      category: guardrail.category,
      message: guardrail.message,
    });
  }

  const matched = matchOption(questionId, text);
  if (!matched) {
    return NextResponse.json({ status: "no_match" });
  }

  const updatedAnswers = { ...answers, [questionId]: matched };

  if (questionId === "timeline") {
    const response = buildResponse(updatedAnswers as unknown as IntakeAnswers);
    return NextResponse.json({
      status: "matched",
      option: matched,
      done: true,
      response,
    });
  }

  return NextResponse.json({ status: "matched", option: matched, done: false });
}
