"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/auth-form";

export function LoginShell() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <p className="font-display text-3xl font-semibold text-slate-900">UMKM Studio</p>
            <p className="text-sm text-slate-600">
              Sign in to continue or create a new account to get started.
            </p>
          </div>
          <AuthForm />
          <p className="text-center text-xs text-slate-500">
            By continuing you agree to our <Link href="#" className="underline">Terms</Link> & {" "}
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
