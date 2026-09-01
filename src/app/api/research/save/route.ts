import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { RESEARCH_TYPES } from "@/lib/researchEntry";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const type = typeof body?.type === "string" ? body.type.trim() : "";
  const description =
    typeof body?.description === "string" ? body.description.trim() : "";
  const region = typeof body?.region === "string" ? body.region.trim() : null;
  const url = typeof body?.url === "string" ? body.url.trim() : null;
  const gapNote =
    typeof body?.gap_note === "string" ? body.gap_note.trim() : null;

  if (!name || !description || !RESEARCH_TYPES.includes(type as never)) {
    return NextResponse.json(
      { error: "name, type, and description are required" },
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
    .from("research_entries")
    .insert({
      name,
      type,
      region: region || null,
      url: url || null,
      description,
      gap_note: gapNote || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
