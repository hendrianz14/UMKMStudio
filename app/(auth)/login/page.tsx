import type { Metadata } from "next";
import { LoginShell } from "@/components/auth/login-shell";

export const metadata: Metadata = {
  title: "Login | UMKM Studio"
};

export default function LoginPage() {
  return <LoginShell />;
}
