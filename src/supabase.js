import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabasePublishableKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = hasSupabaseConfig
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null;

export function assertSupabase() {
    if (!supabase) {
        throw new Error(
            "Missing Supabase env vars: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_PUBLISHABLE_KEY"
        );
    }

    return supabase;
}
