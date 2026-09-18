"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import type { SessionUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function AdminGuard({
  initialSession,
  children,
}: {
  initialSession: SessionUser | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(initialSession);
  const isLoginPage = pathname === "/solaki/dashboard/login" || pathname === "/admin/login";
  const [loading, setLoading] = useState(!initialSession && !isLoginPage);

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    if (!session) {
      // Check session via API
      fetch("/api/admin/auth/me")
        .then((res) => {
          if (!res.ok) {
            router.push("/solaki/dashboard/login");
          } else {
            return res.json();
          }
        })
        .then((data) => {
          if (data?.user) {
            setSession(data.user);
          } else {
            router.push("/solaki/dashboard/login");
          }
        })
        .catch(() => {
          router.push("/solaki/dashboard/login");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [pathname, session, router, isLoginPage]);

  // If on login page, just render the children without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-solaki-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-solaki-teal" />
          <p className="text-sm font-inter text-solaki-muted">Memverifikasi sesi admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-solaki-black text-white flex flex-col md:flex-row">
      <AdminSidebar session={session} />
      <main className="flex-1 p-6 md:p-10 w-full overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
