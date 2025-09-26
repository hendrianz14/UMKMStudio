import { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard | UMKM Studio"
};

export default async function DashboardPage() {
  const user = await getUser();

  return <DashboardShell email={user?.email} />;
}
