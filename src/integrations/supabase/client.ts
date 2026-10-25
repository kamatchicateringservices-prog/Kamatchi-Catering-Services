import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  import.meta.env["VITE_SUPABASE_URL"] || "https://vnqnnjojhtagipdycbjl.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
  import.meta.env["VITE_SUPABASE_ANON_KEY"] ||
  "sb_publishable_lK2lsrvoxV7y-L22p39jsQ_97vdiKp6";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
