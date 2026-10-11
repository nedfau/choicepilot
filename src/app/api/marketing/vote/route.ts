import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const testName = typeof body?.test_name === "string" ? body.test_name.trim() : "";
  const variant = body?.variant === "A" || body?.variant === "B" ? body.variant : "";

  if (!testName || !variant) {
    return NextResponse.json(
      { error: "test_name and variant ('A' or 'B') are required" },
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
    .from("ab_votes")
    .insert({ test_name: testName, variant })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
