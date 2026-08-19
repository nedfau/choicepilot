import { createClient } from "@supabase/supabase-js";

// Placeholder for future Supabase integration. No database logic uses this
// yet — it exists so the client is ready to import once a data layer is
// added. Values come from environment variables; see .env.example.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
