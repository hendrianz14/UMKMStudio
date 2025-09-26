"use client";

import { useState } from "react";
import { SessionContextProvider, type Session } from "@supabase/auth-helpers-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export interface SupabaseProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function SupabaseProvider({ children, session }: SupabaseProviderProps) {
  const [supabaseClient] = useState<SupabaseClient<Database>>(createSupabaseBrowserClient);

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={session}>
      {children}
    </SessionContextProvider>
  );
}
