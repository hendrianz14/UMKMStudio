import { cache } from "react";
import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const getUser = cache(async () => {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const referer = headers().get("referer");

  return {
    id: user.id,
    email: user.email,
    referer
  };
});
