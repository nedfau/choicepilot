"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { INTAKE_QUESTIONS, type ResponseLink } from "@/lib/chat-logic";
import TestLog from "@/components/chat/TestLog";

const GREETING =
  "Hi! I'm ChoicePilot's guided assistant. I'll ask a few quick questions to help structure your decision.";
const NO_MATCH_MESSAGE =
  "Sorry, I didn't quite catch that — try picking one of the options below, or describe it a little differently.";

type Message =
  | { id: string; role: "assistant" | "user"; kind: "text"; text: string }
  | {
      id: string;
      role: "assistant";
      kind: "question";
      text: string;
      options: string[];
    }
  | {
      id: string;
      role: "assistant";
      kind: "guardrail";
      category: string;
      message: string;
    }
  | {
      id: string;
      role: "assistant";
      kind: "response";
      summary: string[];
      steps: string[];
      links: ResponseLink[];
    }
  | {
      id: string;
      role: "assistant";
      kind: "checkpoint";
      text: string;
      status: "pending" | "confirmed" | "declined";
    }
  | { id: string; role: "assistant"; kind: "error"; text: string }
  | {
      id: string;
      role: "assistant";
      kind: "feedback";
      sessionId: string;
      comment: string;
      status: "idle" | "submitting" | "submitted" | "error";
      errorText?: string;
    };

const MAX_FEEDBACK_COMMENT_LENGTH = 200;

function firstQuestionMessage(id: string): Message {
  const question = INTAKE_QUESTIONS[0];
  return {
    id,
    role: "assistant",
    kind: "question",
    text: question.question,
    options: question.options,
  };
}

export default function Chat() {
  const idCounter = useRef(0);
  function nextId(): string {
    idCounter.current += 1;
    return `msg-${idCounter.current}`;
  }

  const [messages, setMessages] = useState<Message[]>(() => [
    { id: "msg-0", role: "assistant", kind: "text", text: GREETING },
    firstQuestionMessage("msg-1"),
  ]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstGuardrailCategoryRef = useRef<string | null>(null);
  const pendingCheckpointAnswersRef = useRef<Record<string, string> | null>(
    null
  );

  async function saveSession(
    finalAnswers: Record<string, string>,
    humanCheckpoint: boolean,
    checkpointConfirmed: boolean
  ) {
    try {
      const response = await fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision_type: finalAnswers.decision_type,
          priority: finalAnswers.priority,
          situation: finalAnswers.timeline,
          guardrail_category: firstGuardrailCategoryRef.current,
          human_checkpoint: humanCheckpoint,
          checkpoint_confirmed: checkpointConfirmed,
        }),
      });
      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            kind: "error",
            text: "Couldn't save this session — your results above are still shown, but weren't recorded.",
          },
        ]);
        return;
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          kind: "feedback",
          sessionId: data.id,
          comment: "",
          status: "idle",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          kind: "error",
          text: "Couldn't save this session — your results above are still shown, but weren't recorded.",
        },
      ]);
    }
  }

  function handleCheckpointChoice(messageId: string, confirmed: boolean) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId && m.kind === "checkpoint"
          ? { ...m, status: confirmed ? "confirmed" : "declined" }
          : m
      )
    );
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "assistant",
        kind: "text",
        text: confirmed
          ? "Good call — checking with an official source first is the safer move."
          : "Okay — just remember to confirm this before you commit to anything.",
      },
    ]);

    const finalAnswers = pendingCheckpointAnswersRef.current;
    if (finalAnswers) {
      saveSession(finalAnswers, true, confirmed);
      pendingCheckpointAnswersRef.current = null;
    }
  }

  function handleFeedbackCommentChange(messageId: string, value: string) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId && m.kind === "feedback"
          ? { ...m, comment: value.slice(0, MAX_FEEDBACK_COMMENT_LENGTH) }
          : m
      )
    );
  }

  async function handleFeedbackRate(messageId: string, rating: "up" | "down") {
    const message = messages.find((m) => m.id === messageId);
    if (!message || message.kind !== "feedback") return;

    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId && m.kind === "feedback" ? { ...m, status: "submitting" } : m
      )
    );

    try {
      const response = await fetch("/api/chat/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: message.sessionId,
          rating,
          comment: message.comment,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId && m.kind === "feedback"
              ? {
                  ...m,
                  status: "error",
                  errorText: data?.error ?? "Couldn't save your feedback — please try again.",
                }
              : m
          )
        );
        return;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId && m.kind === "feedback" ? { ...m, status: "submitted" } : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId && m.kind === "feedback"
            ? {
                ...m,
                status: "error",
                errorText: "Couldn't save your feedback — please try again.",
              }
            : m
        )
      );
    }
  }

  const isComplete = questionIndex >= INTAKE_QUESTIONS.length;
  const currentQuestion = isComplete ? null : INTAKE_QUESTIONS[questionIndex];

  function handleRestart() {
    idCounter.current = 1;
    firstGuardrailCategoryRef.current = null;
    pendingCheckpointAnswersRef.current = null;
    setMessages([
      { id: "msg-0", role: "assistant", kind: "text", text: GREETING },
      firstQuestionMessage("msg-1"),
    ]);
    setQuestionIndex(0);
    setAnswers({});
    setInputValue("");
    setIsSubmitting(false);
  }

  async function submitAnswer(rawText: string) {
    const text = rawText.trim();
    if (!text || !currentQuestion || isSubmitting) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", kind: "text", text },
    ]);
    setInputValue("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/chat/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          questionId: currentQuestion.id,
          answers,
        }),
      });
      const data = await response.json();

      if (data.status === "guardrail") {
        if (!firstGuardrailCategoryRef.current) {
          firstGuardrailCategoryRef.current = data.category;
        }
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            kind: "guardrail",
            category: data.category,
            message: data.message,
          },
        ]);
        return;
      }

      if (data.status === "no_match") {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", kind: "text", text: NO_MATCH_MESSAGE },
        ]);
        return;
      }

      if (data.status === "matched") {
        const updatedAnswers = { ...answers, [currentQuestion.id]: data.option };
        setAnswers(updatedAnswers);

        if (data.done) {
          setMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant",
              kind: "response",
              summary: data.response.summary,
              steps: data.response.steps,
              links: data.response.links,
            },
          ]);
          setQuestionIndex(INTAKE_QUESTIONS.length);

          if (data.response.needsHumanCheckpoint) {
            pendingCheckpointAnswersRef.current = updatedAnswers;
            setMessages((prev) => [
              ...prev,
              {
                id: nextId(),
                role: "assistant",
                kind: "checkpoint",
                text: data.response.checkpointText,
                status: "pending",
              },
            ]);
          } else {
            saveSession(updatedAnswers, false, false);
          }
        } else {
          const nextIndex = questionIndex + 1;
          const nextQuestion = INTAKE_QUESTIONS[nextIndex];
          setMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant",
              kind: "question",
              text: nextQuestion.question,
              options: nextQuestion.options,
            },
          ]);
          setQuestionIndex(nextIndex);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSend(event: React.FormEvent) {
    event.preventDefault();
    submitAnswer(inputValue);
  }

  const latestMessage = messages[messages.length - 1];
  const showQuickReplies =
    !isSubmitting &&
    latestMessage?.kind === "question" &&
    latestMessage.role === "assistant";

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Chat
      </h1>
      <p className="mt-3 text-lg leading-7 text-zinc-600">
        A guided assistant that asks a few structured questions about your
        decision.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Simulated assistant: rule-based, not a live AI
        </span>
        <button
          type="button"
          onClick={handleRestart}
          className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Restart
        </button>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 p-6">
        <div
          aria-live="polite"
          className="flex flex-col gap-3"
        >
          {messages.map((message) => {
            if (message.kind === "guardrail") {
              return (
                <div
                  key={message.id}
                  className="max-w-[85%] self-start rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"
                >
                  <span className="mb-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                    Guardrail
                  </span>
                  <p>{message.message}</p>
                </div>
              );
            }

            if (message.kind === "error") {
              return (
                <div
                  key={message.id}
                  className="max-w-[85%] self-start rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                >
                  {message.text}
                </div>
              );
            }

            if (message.kind === "checkpoint") {
              return (
                <div
                  key={message.id}
                  className="max-w-[90%] self-start rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-700"
                >
                  <p className="font-medium text-zinc-900">Human checkpoint</p>
                  <p className="mt-1">{message.text}</p>
                  {message.status === "pending" ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleCheckpointChoice(message.id, true)}
                        className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        I&apos;ll check with an official source first
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCheckpointChoice(message.id, false)}
                        className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        Not now
                      </button>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs font-medium text-zinc-500">
                      {message.status === "confirmed"
                        ? "You chose to check with an official source first."
                        : "You chose not now."}
                    </p>
                  )}
                </div>
              );
            }

            if (message.kind === "feedback") {
              const disabled = message.status !== "idle";
              return (
                <div
                  key={message.id}
                  className="max-w-[90%] self-start rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-700"
                >
                  {message.status === "submitted" ? (
                    <p className="font-medium text-zinc-900">
                      Thanks for the feedback
                    </p>
                  ) : (
                    <>
                      <p className="font-medium text-zinc-900">
                        Was this helpful?
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Helpful"
                          disabled={disabled}
                          onClick={() => handleFeedbackRate(message.id, "up")}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M18 15l-6-6-6 6"></path>
                          </svg>
                        </button>
                        <button
                          type="button"
                          aria-label="Not helpful"
                          disabled={disabled}
                          onClick={() => handleFeedbackRate(message.id, "down")}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M6 9l6 6 6-6"></path>
                          </svg>
                        </button>
                        <input
                          type="text"
                          value={message.comment}
                          onChange={(e) =>
                            handleFeedbackCommentChange(message.id, e.target.value)
                          }
                          disabled={disabled}
                          maxLength={MAX_FEEDBACK_COMMENT_LENGTH}
                          placeholder="Optional comment"
                          className="flex-1 rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
                        />
                      </div>
                      <p className="mt-2 text-xs text-zinc-400">
                        Max {MAX_FEEDBACK_COMMENT_LENGTH} characters. Don&apos;t include personal data.
                      </p>
                      {message.status === "error" && (
                        <p className="mt-2 text-sm text-red-600">{message.errorText}</p>
                      )}
                    </>
                  )}
                </div>
              );
            }

            if (message.kind === "response") {
              return (
                <div
                  key={message.id}
                  className="max-w-[90%] self-start rounded-2xl bg-zinc-100 p-4 text-sm leading-6 text-zinc-900"
                >
                  <div className="flex flex-col gap-1">
                    {message.summary.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <p className="mt-3 font-medium text-zinc-900">Next steps</p>
                  <ol className="mt-1 list-decimal space-y-1 pl-5">
                    {message.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                  <div className="mt-3 flex flex-wrap gap-4">
                    {message.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            const bubbleClasses =
              message.role === "user"
                ? "max-w-[75%] self-end rounded-2xl bg-indigo-600 px-4 py-3 text-sm leading-6 text-white"
                : "max-w-[75%] self-start rounded-2xl bg-zinc-100 px-4 py-3 text-sm leading-6 text-zinc-900";

            return (
              <div key={message.id} className={bubbleClasses}>
                {message.text}
              </div>
            );
          })}

          {showQuickReplies && latestMessage.kind === "question" && (
            <div className="flex flex-wrap gap-2 self-start">
              {latestMessage.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => submitAnswer(option)}
                  disabled={isSubmitting}
                  className="rounded-full border border-indigo-500 px-4 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSend}
          className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4"
        >
          <label htmlFor="chat-input" className="sr-only">
            Type your answer
          </label>
          <input
            id="chat-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isComplete || isSubmitting}
            placeholder={
              isComplete ? "This chat is finished — Restart to try again" : "Type your answer…"
            }
            className="flex-1 rounded-full border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none disabled:bg-zinc-50"
          />
          <button
            type="submit"
            disabled={isComplete || isSubmitting || !inputValue.trim()}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
          >
            Send
          </button>
        </form>

        <p className="mt-3 text-xs text-zinc-400">
          Don&apos;t type personal data. Free text is not stored.
        </p>
      </div>

      <TestLog />
    </div>
  );
}
