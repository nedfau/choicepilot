import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testName = searchParams.get("test")?.trim();

  if (!testName) {
    return NextResponse.json(
      { error: "test query parameter is required" },
      { status: 400 }
    );
  }

  if (!supabase) {
    return NextResponse.json({ a: 0, b: 0, total: 0 });
  }

  const { data, error } = await supabase
    .from("ab_votes")
    .select("variant")
    .eq("test_name", testName);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const a = (data ?? []).filter((row) => row.variant === "A").length;
  const b = (data ?? []).filter((row) => row.variant === "B").length;

  return NextResponse.json({ a, b, total: a + b });
}
