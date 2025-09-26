import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";

export const createSupabaseBrowserClient = () =>
  createBrowserSupabaseClient<Database>();
