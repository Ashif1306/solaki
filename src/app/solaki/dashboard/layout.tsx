import { getAdminSession } from "@/lib/auth";
import AdminGuard from "./AdminGuard";

export const metadata = {
  title: "Dashboard — SOLAKI Creative Agency",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return <AdminGuard initialSession={session}>{children}</AdminGuard>;
}
