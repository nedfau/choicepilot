import { NextResponse } from "next/server";
import { extractCore } from "@/lib/extractCore";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json(
      { error: "text is required" },
      { status: 400 }
    );
  }

  return NextResponse.json(extractCore(text));
}
