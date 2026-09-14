import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

function sanitizeNumber(value: unknown): number {
  const n = Number(value);
  if (Number.isNaN(n) || n < 0) return 0;
  return n;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const billingPeriod = body?.billing_period === "annual" ? "annual" : "monthly";
  const monthlyRevenue = Number(body?.monthly_revenue);
  const annualRevenue = Number(body?.annual_revenue);

  if (Number.isNaN(monthlyRevenue) || Number.isNaN(annualRevenue)) {
    return NextResponse.json(
      { error: "monthly_revenue and annual_revenue are required" },
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
    .from("pricing_scenarios")
    .insert({
      plus_subscribers: sanitizeNumber(body?.plus_subscribers),
      plus_price: sanitizeNumber(body?.plus_price),
      campus_partners: sanitizeNumber(body?.campus_partners),
      campus_price: sanitizeNumber(body?.campus_price),
      billing_period: billingPeriod,
      monthly_revenue: monthlyRevenue,
      annual_revenue: annualRevenue,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
