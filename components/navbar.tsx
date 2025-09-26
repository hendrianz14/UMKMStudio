"use client";

import { useRouter } from "next/navigation";
import { useSupabaseClient, useSupabaseSession } from "@/components/providers/supabase-provider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export function Navbar() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const session = useSupabaseSession();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed out successfully");
    router.push("/login");
  };

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-30 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-lg shadow-slate-200/50 backdrop-blur"
    >
      <div>
        <p className="font-display text-xl font-semibold text-slate-900">UMKM Studio</p>
        {session?.user?.email && (
          <p className="text-sm text-slate-500">Signed in as {session.user.email}</p>
        )}
      </div>
      <Button variant="outline" onClick={handleLogout}>
        Log out
      </Button>
    </motion.nav>
  );
}
