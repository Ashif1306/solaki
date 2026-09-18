"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  CreditCard,
  Inbox,
  ExternalLink,
  LogOut,
  Sliders,
  Sparkles,
  BarChart3,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { useSiteBrand } from "@/hooks/useSiteBrand";

export default function AdminSidebar({ session }: { session?: SessionUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { brand } = useSiteBrand();

  // If on login page, don't show sidebar
  if (pathname === "/solaki/dashboard/login" || pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/solaki/dashboard/login");
    router.refresh();
  };

  const navItems = [
    { href: "/solaki/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/solaki/dashboard/settings", label: "Brand & Logo", icon: Sliders },
    { href: "/solaki/dashboard/showcase", label: "Showcase & Media", icon: Sparkles },
    { href: "/solaki/dashboard/insights", label: "Instagram Insights", icon: BarChart3 },
    { href: "/solaki/dashboard/content", label: "Konten Website", icon: FileText },
    { href: "/solaki/dashboard/services", label: "Layanan", icon: Briefcase },
    { href: "/solaki/dashboard/team", label: "Tim & Kolektif", icon: Users },
    { href: "/solaki/dashboard/packages", label: "Paket & Harga", icon: CreditCard },
    { href: "/solaki/dashboard/leads", label: "Pesan & Leads", icon: Inbox },
  ];

  return (
    <aside className="w-full md:w-64 bg-solaki-card border-b md:border-b-0 md:border-r border-solaki-border flex-shrink-0 flex flex-col">
      {/* Brand Header */}
      <div className="p-6 border-b border-solaki-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          {brand.logoType === "image" && brand.logoImageUrl ? (
            <div
              className={`w-9 h-9 flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/20 bg-white/10 ${
                brand.logoShape === "circle" ? "rounded-full" : "rounded-xl"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.logoImageUrl}
                alt={brand.logoText}
                className={
                  brand.logoShape === "contain"
                    ? "h-full w-auto object-contain p-0.5"
                    : brand.logoShape === "circle"
                    ? "w-full h-full object-cover object-center rounded-full"
                    : "w-full h-full object-cover object-center rounded-xl"
                }
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="22" cy="10" r="5" fill="currentColor" />
                <circle cx="8" cy="34" r="4" fill="currentColor" />
                <circle cx="36" cy="34" r="4" fill="currentColor" />
                <circle cx="22" cy="26" r="3" fill="currentColor" opacity="0.7" />
                <line x1="22" y1="15" x2="22" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="20" y1="28" x2="10" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="24" y1="28" x2="34" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
          <div className="min-w-0">
            <span className="font-black text-white text-base tracking-wider truncate block">
              {brand.logoText || "SOLAKI"}
            </span>
            <span className="block text-[10px] text-solaki-teal font-semibold tracking-widest uppercase">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="p-4 space-y-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors font-inter ${
                isActive
                  ? "bg-solaki-teal text-white shadow-lg shadow-solaki-teal/20 font-semibold"
                  : "text-solaki-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info & Footer actions */}
      <div className="p-4 border-t border-solaki-border space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-solaki-muted hover:text-white hover:bg-white/5 transition-colors font-inter"
        >
          <span>Lihat Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {session && (
          <div className="px-3.5 py-2">
            <p className="text-xs font-semibold text-white truncate">{session.name}</p>
            <p className="text-[11px] text-solaki-subtle truncate">{session.email}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors font-inter"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
