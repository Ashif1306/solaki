"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Briefcase,
  Users,
  CreditCard,
  ArrowUpRight,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Activity,
  Globe,
} from "lucide-react";

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  servicesCount: number;
  teamCount: number;
  packagesCount: number;
  recentLeads: Array<{
    id?: string;
    _id?: string;
    ownerName: string;
    businessName: string;
    whatsapp: string;
    serviceChoice: string;
    status: string;
    createdAt: string;
  }>;
}

interface AnalyticsSnapshot {
  totalViews: number;
  uniqueVisitors: number;
  topPage: string;
  growth: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((res) => res.json()).catch(() => null),
      fetch("/api/admin/analytics?range=7d").then((res) => res.json()).catch(() => null),
    ])
      .then(([statsData, analyticsData]) => {
        if (statsData) setStats(statsData);
        if (analyticsData && !analyticsData.error) {
          setAnalytics({
            totalViews: analyticsData.totalViews ?? 0,
            uniqueVisitors: analyticsData.uniqueVisitors ?? 0,
            topPage: analyticsData.topPages?.[0]?.path ?? "/",
            growth: analyticsData.growth ?? 0,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-solaki-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solaki-teal/10 border border-solaki-teal/20 text-solaki-teal text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            SOLAKI Control Center
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-solaki-muted font-inter mt-1">
            Kelola konten website, pantau leads masuk, dan perbarui portofolio agensi secara terpusat.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="btn-secondary py-2.5 px-4 text-xs font-semibold flex items-center gap-2"
          >
            Lihat Website
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/solaki/dashboard/leads"
            className="btn-primary py-2.5 px-4 text-xs font-semibold flex items-center gap-2"
          >
            <Inbox className="w-3.5 h-3.5" />
            Lihat Pesan Masuk
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bento-card p-5 border-solaki-teal/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-solaki-muted uppercase font-inter">Total Leads</span>
            <div className="w-8 h-8 rounded-lg bg-solaki-teal/10 flex items-center justify-center text-solaki-teal">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {loading ? "..." : stats?.totalLeads ?? 0}
          </div>
          <div className="mt-2 text-[11px] text-solaki-teal font-inter flex items-center gap-1">
            <span>{stats?.newLeads ?? 0} baru menunggu respon</span>
          </div>
        </div>

        <div className="bento-card p-5 border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-solaki-muted uppercase font-inter">Layanan Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {loading ? "..." : stats?.servicesCount ?? 0}
          </div>
          <div className="mt-2 text-[11px] text-solaki-muted font-inter">
            Content, Socmed & Digital Ads
          </div>
        </div>

        <div className="bento-card p-5 border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-solaki-muted uppercase font-inter">Anggota Tim</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {loading ? "..." : stats?.teamCount ?? 0}
          </div>
          <div className="mt-2 text-[11px] text-solaki-muted font-inter">
            Founder & Spesialis Agensi
          </div>
        </div>

        <div className="bento-card p-5 border-amber-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-solaki-muted uppercase font-inter">Paket Model</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {loading ? "..." : stats?.packagesCount ?? 0}
          </div>
          <div className="mt-2 text-[11px] text-solaki-muted font-inter">
            Retainer, Project & Ad Fee
          </div>
        </div>
      </div>

      {/* Web Traffic Snapshot Widget */}
      <div className="bento-card p-6 border-solaki-teal/30 bg-gradient-to-r from-solaki-teal/10 via-transparent to-purple-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-solaki-teal/20 border border-solaki-teal/30 flex items-center justify-center text-solaki-teal shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Web Traffic & Pengunjung</h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-solaki-teal/15 text-solaki-teal border border-solaki-teal/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-solaki-teal animate-pulse" />
                  Live Tracker
                </span>
              </div>
              <p className="text-xs text-solaki-muted font-inter mt-0.5">
                Statistik aktivitas kunjungan website SOLAKI dalam 7 hari terakhir
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-4 sm:gap-6">
            <div className="text-left sm:text-right">
              <div className="text-xs text-solaki-muted font-inter">Total Dilihat</div>
              <div className="text-2xl font-black text-white">
                {loading ? "..." : (analytics?.totalViews ?? 0).toLocaleString()}
              </div>
            </div>
            <div className="h-8 w-px bg-solaki-border hidden sm:block" />
            <div className="text-left sm:text-right">
              <div className="text-xs text-solaki-muted font-inter">Pengunjung Unik</div>
              <div className="text-2xl font-black text-solaki-teal">
                {loading ? "..." : (analytics?.uniqueVisitors ?? 0).toLocaleString()}
              </div>
            </div>
            <Link
              href="/solaki/dashboard/analytics"
              className="btn-primary py-2.5 px-4 text-xs font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              Lihat Analitik Lengkap
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Web Analytics",
            desc: "Pantau pengunjung unik, halaman terpopuler, dan sumber traffic",
            href: "/solaki/dashboard/analytics",
            icon: Activity,
            color: "text-emerald-400",
          },
          {
            title: "Edit Konten",
            desc: "Ubah tagline, headline hero, dan filosofi",
            href: "/solaki/dashboard/content",
            icon: Sparkles,
            color: "text-solaki-teal",
          },
          {
            title: "Kelola Layanan",
            desc: "Tambah atau perbarui paket 3 layanan utama",
            href: "/solaki/dashboard/services",
            icon: Briefcase,
            color: "text-blue-400",
          },
          {
            title: "Kelola Tim",
            desc: "Edit profil Zikri, Ifan, dan Ashif",
            href: "/solaki/dashboard/team",
            icon: Users,
            color: "text-purple-400",
          },
          {
            title: "Kelola Paket",
            desc: "Sesuaikan harga retainer & ad fee",
            href: "/solaki/dashboard/packages",
            icon: CreditCard,
            color: "text-amber-400",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bento-card p-5 group hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <ArrowUpRight className="w-4 h-4 text-solaki-subtle group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-base font-bold text-white mb-1 font-inter">{item.title}</h2>
              <p className="text-xs text-solaki-muted font-inter leading-relaxed">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Leads Section */}
      <div className="bento-card p-6 border-solaki-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Pesan & Permintaan Klien Terbaru</h2>
            <p className="text-xs text-solaki-muted font-inter mt-0.5">
              Calon mitra UMKM yang mengirimkan formulir konsultasi
            </p>
          </div>
          <Link
            href="/solaki/dashboard/leads"
            className="text-xs text-solaki-teal hover:underline font-semibold font-inter flex items-center gap-1"
          >
            Lihat Semua Pesan →
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-solaki-muted py-8 text-center font-inter">Memuat data...</p>
        ) : !stats?.recentLeads || stats.recentLeads.length === 0 ? (
          <div className="py-12 text-center">
            <Inbox className="w-10 h-10 text-solaki-subtle mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold text-white font-inter">Belum ada pesan masuk</p>
            <p className="text-xs text-solaki-muted mt-1 font-inter">
              Pesan dari form kontak di halaman utama akan tampil di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-inter">
              <thead>
                <tr className="border-b border-solaki-border/60 text-xs text-solaki-muted uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Nama Pemilik</th>
                  <th className="pb-3 font-semibold">Bisnis / UMKM</th>
                  <th className="pb-3 font-semibold">Layanan Diminati</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-solaki-border/40">
                {stats.recentLeads.map((lead) => {
                  const leadId = lead.id || lead._id || "";
                  const cleanWA = lead.whatsapp.replace(/[^0-9]/g, "");
                  const waNumber = cleanWA.startsWith("0") ? `62${cleanWA.slice(1)}` : cleanWA;

                  return (
                    <tr key={leadId} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 font-medium text-white">{lead.ownerName}</td>
                      <td className="py-3.5 text-solaki-muted">{lead.businessName}</td>
                      <td className="py-3.5 text-xs text-solaki-teal font-semibold">
                        {lead.serviceChoice}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            lead.status === "new"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : lead.status === "contacted"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : lead.status === "converted"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-white/5 text-solaki-subtle border border-white/10"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <a
                          href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(
                            lead.ownerName
                          )},%20kami%20dari%20SOLAKI%20Creative%20Agency...`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 text-xs font-semibold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Chat WhatsApp
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
