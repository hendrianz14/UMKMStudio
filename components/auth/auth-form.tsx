"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Database } from "@/types/database.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type FormData = z.infer<typeof schema>;

type AuthMode = "login" | "register";

export function AuthForm() {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit"
  });

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword(values);
        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp(values);
        if (error) throw error;
        toast.success("Account created. Check your email if confirmation is required.");
      }

      router.refresh();
      router.push("/dashboard");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to process request. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          {...register("password")}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner className="border-slate-100" />
            {mode === "login" ? "Signing in..." : "Creating account..."}
          </span>
        ) : mode === "login" ? (
          "Log in"
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-slate-600">
        {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="font-medium text-brand-600 hover:underline"
        >
          {mode === "login" ? "Create one" : "Log in"}
        </button>
      </p>
    </motion.form>
  );
}
