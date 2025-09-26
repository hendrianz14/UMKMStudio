import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "UMKM Studio",
  description: "Upload inspirations directly to your workflow"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans">
        <SupabaseProvider session={session}>
          <ToasterProvider />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
