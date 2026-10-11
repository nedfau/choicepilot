import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const assetType = typeof body?.asset_type === "string" ? body.asset_type.trim() : "";
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!assetType || !title || !content) {
    return NextResponse.json(
      { error: "asset_type, title, and content are required" },
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
    .from("marketing_assets")
    .insert({ asset_type: assetType, title, content })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
