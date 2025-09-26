"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { type Session, type SupabaseClient } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import type { Database } from "@/types/database.types";

interface SupabaseContextValue {
  supabase: SupabaseClient<Database>;
  session: Session | null;
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

export function SupabaseProvider({ children, session: initialSession = null }: PropsWithChildren<{ session?: Session | null }>) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [session, setSession] = useState<Session | null>(initialSession);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session ?? null);
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo(() => ({ supabase, session }), [supabase, session]);

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

function useSupabaseContext() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}

export function useSupabaseClient(): SupabaseClient<Database> {
  return useSupabaseContext().supabase;
}

export function useSupabaseSession(): Session | null {
  return useSupabaseContext().session;
}

export function useSupabase() {
  return useSupabaseContext();
}
