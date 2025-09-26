"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { UploadForm } from "@/components/dashboard/upload-form";

interface DashboardShellProps {
  email?: string | null;
}

export function DashboardShell({ email }: DashboardShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:py-16">
      <Navbar />
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-3xl border border-slate-200 bg-white/60 p-8 shadow-2xl shadow-brand-50/70 backdrop-blur"
      >
        <div className="space-y-4">
          <h1 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
            Welcome back{email ? `, ${email}` : ""}!
          </h1>
          <p className="text-base text-slate-600 sm:text-lg">
            Upload an image with a caption to trigger your automated n8n workflow. You&apos;ll see the
            response from the workflow right here.
          </p>
        </div>
        <div className="mt-8">
          <UploadForm />
        </div>
      </motion.section>
    </div>
  );
}
