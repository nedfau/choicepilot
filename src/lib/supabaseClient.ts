import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Values come from environment variables; see .env.example. `supabase` is
// null when they're unset so pages can render without crashing before the
// project is configured.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
