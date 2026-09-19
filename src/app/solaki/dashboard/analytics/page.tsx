"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Users,
  Eye,
  MessageCircle,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Globe,
  Compass,
  ArrowUpRight,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import AdminLiveClock from "@/components/AdminLiveClock";
import { useAdminTimezone } from "@/hooks/useAdminTimezone";

interface AnalyticsData {
  range: string;
  totalPageviews: number;
  uniqueVisitors: number;
  viewsGrowth: number;
  visitorsGrowth: number;
  whatsappClicks: number;
  chatbotOpens: number;
  deviceBreakdown: Array<{ name: string; count: number; percentage: number }>;
  topPages: Array<{ path: string; count: number; percentage: number }>;
  topReferrers: Array<{ source: string; count: number; percentage: number }>;
  trendData: Array<{ label: string; views: number; visitors: number }>;
  recentEvents: Array<{
    id: string;
    type: string;
    path: string;
    referrer: string;
    device: string;
    browser: string;
    createdAt: string;
  }>;
}

export default function AnalyticsDashboardPage() {
  const { resolvedTimezone, tzCode, formatDateTime } = useAdminTimezone();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"24h" | "7d" | "30d">("7d");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async (selectedRange: string, tz: string) => {
    try {
      setRefreshing(true);
      const res = await fetch(`/api/admin/analytics?range=${selectedRange}&tz=${encodeURIComponent(tz)}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Error loading analytics:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(range, resolvedTimezone);
  }, [range, resolvedTimezone, fetchAnalytics]);

  const formatNumber = (num: number) => num.toLocaleString("id-ID");

  const timeAgo = (dateStr: string) => {
    const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diffSec < 60) return "Baru saja";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mnt lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
    return `${Math.floor(diffSec / 86400)} hari lalu`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-solaki-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            Website Traffic Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Analitik Kunjungan Website
          </h1>
          <p className="text-xs sm:text-sm text-solaki-muted font-inter mt-1">
            Pantau jumlah pengunjung, halaman populer, dan konversi yang otomatis diselaraskan dengan waktu lokal Anda.
          </p>
        </div>

        {/* Live Clock & Range Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <AdminLiveClock variant="banner" />

          <div className="flex items-center gap-2 bg-solaki-surface p-1 rounded-xl border border-solaki-border text-xs font-semibold font-inter">
            {(["24h", "7d", "30d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  range === r
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                    : "text-solaki-muted hover:text-white"
                }`}
              >
                {r === "24h" ? "24 Jam" : r === "7d" ? "7 Hari" : "30 Hari"}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalytics(range, resolvedTimezone)}
            disabled={refreshing}
            aria-label="Segarkan data"
            className="p-2.5 rounded-xl bg-solaki-surface hover:bg-white/5 border border-solaki-border text-solaki-muted hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
          <p className="text-sm font-inter text-solaki-muted">Memuat data analitik website...</p>
        </div>
      ) : data ? (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Pageviews */}
            <div className="bento-card p-5 sm:p-6 rounded-2xl bg-solaki-card border border-solaki-border flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-solaki-muted uppercase tracking-wider font-inter">
                  Total Pageviews
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {formatNumber(data.totalPageviews)}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  {data.viewsGrowth >= 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> +{data.viewsGrowth}%
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-rose-400 font-semibold">
                      <TrendingDown className="w-3.5 h-3.5" /> {data.viewsGrowth}%
                    </span>
                  )}
                  <span className="text-solaki-muted">vs periode sebelumnya</span>
                </div>
              </div>
            </div>

            {/* Unique Visitors */}
            <div className="bento-card p-5 sm:p-6 rounded-2xl bg-solaki-card border border-solaki-border flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-solaki-muted uppercase tracking-wider font-inter">
                  Pengunjung Unik
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {formatNumber(data.uniqueVisitors)}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  {data.visitorsGrowth >= 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> +{data.visitorsGrowth}%
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-rose-400 font-semibold">
                      <TrendingDown className="w-3.5 h-3.5" /> {data.visitorsGrowth}%
                    </span>
                  )}
                  <span className="text-solaki-muted">individu unik</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Leads Clicks */}
            <div className="bento-card p-5 sm:p-6 rounded-2xl bg-solaki-card border border-solaki-border flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-solaki-muted uppercase tracking-wider font-inter">
                  Klik WhatsApp CTA
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-600/15 border border-emerald-500/25 flex items-center justify-center text-emerald-300">
                  <MessageCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {formatNumber(data.whatsappClicks)}
                </div>
                <p className="mt-2 text-xs text-solaki-muted">
                  Pengunjung menghubungi via WhatsApp
                </p>
              </div>
            </div>

            {/* Mobile vs Desktop */}
            <div className="bento-card p-5 sm:p-6 rounded-2xl bg-solaki-card border border-solaki-border flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-solaki-muted uppercase tracking-wider font-inter">
                  Perangkat Terbanyak
                </span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Smartphone className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {data.deviceBreakdown.find((d) => d.name === "Mobile")?.percentage || 0}%
                </div>
                <div className="mt-2 text-xs text-solaki-muted flex items-center gap-2">
                  <span>📱 HP: {data.deviceBreakdown.find((d) => d.name === "Mobile")?.percentage || 0}%</span>
                  <span>•</span>
                  <span>💻 Desktop: {data.deviceBreakdown.find((d) => d.name === "Desktop")?.percentage || 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="bento-card p-6 sm:p-7 rounded-2xl bg-solaki-card border border-solaki-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Tren Kunjungan ({range === "24h" ? "24 Jam Terakhir" : range === "7d" ? "7 Hari Terakhir" : "30 Hari Terakhir"})
                </h2>
                <p className="text-xs text-solaki-muted font-inter mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>Perbandingan Total Pageviews & Pengunjung Unik</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    Zona Waktu: {tzCode} ({resolvedTimezone})
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold font-inter">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-solaki-teal inline-block" />
                  <span className="text-white">Pageviews</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-purple-500 inline-block" />
                  <span className="text-white">Unique Visitors</span>
                </div>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              {data.trendData && data.trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0D5C46" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#0D5C46" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#2A2A2A" }}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#2A2A2A" }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1A1A1A",
                        borderColor: "#333333",
                        borderRadius: "12px",
                        color: "#FFFFFF",
                        fontSize: "12px",
                      }}
                      labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      name="Pageviews"
                      stroke="#10B981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#viewsGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      name="Unique Visitors"
                      stroke="#C084FC"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#visitorsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-solaki-muted text-xs">
                  Belum ada data kunjungan dalam rentang waktu ini.
                </div>
              )}
            </div>
          </div>

          {/* Top Pages & Top Referrers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <div className="bento-card p-6 rounded-2xl bg-solaki-card border border-solaki-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-solaki-teal" />
                  Halaman Terpopuler
                </h3>
                <span className="text-xs text-solaki-muted font-inter">Kunjungan</span>
              </div>

              {data.topPages.length > 0 ? (
                <div className="space-y-3.5">
                  {data.topPages.map((item, idx) => (
                    <div key={item.path} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-white/90 truncate max-w-[200px] sm:max-w-xs">
                          {item.path === "/" ? "/ (Beranda)" : item.path}
                        </span>
                        <span className="font-semibold text-white/80">
                          {formatNumber(item.count)}{" "}
                          <span className="text-[10px] text-solaki-muted font-normal">
                            ({item.percentage}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-solaki-teal to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(item.percentage, 4)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-solaki-muted py-8 text-center font-inter">
                  Belum ada rekaman halaman yang dikunjungi.
                </p>
              )}
            </div>

            {/* Top Referrers */}
            <div className="bento-card p-6 rounded-2xl bg-solaki-card border border-solaki-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-solaki-glow" />
                  Sumber Traffic (Referrers)
                </h3>
                <span className="text-xs text-solaki-muted font-inter">Asal Pengunjung</span>
              </div>

              {data.topReferrers.length > 0 ? (
                <div className="space-y-3.5">
                  {data.topReferrers.map((ref) => (
                    <div key={ref.source} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white/90 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-solaki-glow" />
                          {ref.source}
                        </span>
                        <span className="font-semibold text-white/80">
                          {formatNumber(ref.count)}{" "}
                          <span className="text-[10px] text-solaki-muted font-normal">
                            ({ref.percentage}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-600 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(ref.percentage, 4)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-solaki-muted py-8 text-center font-inter">
                  Belum ada data sumber rujukan.
                </p>
              )}
            </div>
          </div>

          {/* Bottom Row: Device Breakdown & Live Activity Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device Breakdown */}
            <div className="bento-card p-6 rounded-2xl bg-solaki-card border border-solaki-border">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-400" />
                Distribusi Perangkat
              </h3>

              <div className="space-y-4">
                {data.deviceBreakdown.map((dev) => {
                  const Icon =
                    dev.name === "Mobile"
                      ? Smartphone
                      : dev.name === "Tablet"
                      ? Tablet
                      : Monitor;
                  return (
                    <div key={dev.name} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-2 font-semibold text-white">
                          <Icon className="w-4 h-4 text-solaki-teal" />
                          <span>{dev.name}</span>
                        </div>
                        <span className="font-bold text-white">
                          {dev.percentage}%{" "}
                          <span className="font-normal text-solaki-muted">
                            ({formatNumber(dev.count)})
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-solaki-teal rounded-full"
                          style={{ width: `${dev.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Activity Stream */}
            <div className="lg:col-span-2 bento-card p-6 rounded-2xl bg-solaki-card border border-solaki-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Aktivitas Pengunjung Terkini
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Stream
                </span>
              </div>

              {data.recentEvents.length > 0 ? (
                <div className="space-y-2.5">
                  {data.recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            event.type === "whatsapp_click"
                              ? "bg-emerald-400"
                              : event.type === "chatbot_open"
                              ? "bg-purple-400"
                              : "bg-blue-400"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate font-mono">
                            {event.path === "/" ? "/ (Beranda)" : event.path}
                          </p>
                          <p className="text-[11px] text-solaki-muted truncate">
                            Via {event.referrer || "Direct"} • {event.device} • {event.browser}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <span className="text-[11px] text-white font-mono font-medium block">
                          {formatDateTime(event.createdAt).split(", ")[1] || formatDateTime(event.createdAt)}
                        </span>
                        <span className="text-[10px] text-solaki-muted block">
                          {timeAgo(event.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-solaki-muted py-8 text-center font-inter">
                  Belum ada aktivitas pengunjung yang terekam.
                </p>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
