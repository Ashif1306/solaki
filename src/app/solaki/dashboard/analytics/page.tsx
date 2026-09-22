"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Clock,
  Sparkles,
  Download,
  Target,
  Percent,
  CheckCircle2,
  MousePointerClick,
  HelpCircle,
  Zap,
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
import { toPng } from "html-to-image";
import AdminLiveClock from "@/components/AdminLiveClock";
import { useAdminTimezone } from "@/hooks/useAdminTimezone";
import { useSiteBrand } from "@/hooks/useSiteBrand";

interface AnalyticsData {
  range: string;
  totalPageviews: number;
  uniqueVisitors: number;
  viewsGrowth: number;
  visitorsGrowth: number;
  whatsappClicks: number;
  chatbotOpens: number;
  totalEngagements: number;
  er: number;
  ctr: number;
  conversionRate: number;
  interpretation: string;
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
  const { brand } = useSiteBrand();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"24h" | "7d" | "30d">("7d");
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchAnalytics = useCallback(async (selectedRange: string, tz: string) => {
    try {
      setRefreshing(true);
      const res = await fetch(
        `/api/admin/analytics?range=${selectedRange}&tz=${encodeURIComponent(tz)}`
      );
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

  const handleDownloadImage = async () => {
    if (!reportRef.current) return;
    try {
      setDownloadingImage(true);
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0B0F17",
      });
      const link = document.createElement("a");
      const dateTag = new Date().toISOString().slice(0, 10);
      link.download = `SOLAKI-Web-Analytics-${range}-${dateTag}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image:", err);
      alert("Gagal mengunduh gambar analitik. Silakan coba kembali.");
    } finally {
      setDownloadingImage(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-solaki-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            Website Traffic Analytics • 7 Layers Framework
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Analitik Kunjungan Website
          </h1>
          <p className="text-xs sm:text-sm text-solaki-muted font-inter mt-1">
            Pantau jumlah visitor, metrik aksi (CTR & ER), dan konversi sesuai panduan Social Media & Web Analytics.
          </p>
        </div>

        {/* Live Clock, Range Selector & Download Button */}
        <div className="flex flex-wrap items-center gap-3">
          <AdminLiveClock variant="banner" />

          {/* Range Selector */}
          <div className="flex items-center gap-1.5 bg-solaki-surface p-1 rounded-xl border border-solaki-border text-xs font-semibold font-inter">
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

          {/* Download Image Button */}
          <button
            onClick={handleDownloadImage}
            disabled={downloadingImage || loading || !data}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Download seluruh hasil insight dan metrik dalam bentuk gambar PNG"
          >
            {downloadingImage ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{downloadingImage ? "Membuat Gambar..." : "Download Gambar Insight"}</span>
          </button>

          {/* Refresh Button */}
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
          {/* Main Printable / Downloadable Report Container */}
          <div ref={reportRef} className="space-y-6 p-1 sm:p-2 rounded-3xl bg-[#0B0F17]">
            {/* Infographic Top Banner (Visible in screenshot/download) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0D5C46]/20 via-[#0B0F17] to-purple-900/15 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {brand.logoType === "image" && brand.logoImageUrl ? (
                  <div className="w-11 h-11 rounded-xl border border-white/20 bg-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={brand.logoImageUrl} alt="SOLAKI" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-md">
                    S
                  </div>
                )}
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>SOLAKI</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      Performance Report
                    </span>
                  </h2>
                  <p className="text-xs text-solaki-muted font-inter">
                    Laporan Kinerja Trafik & Action Analysis (Layer 2 & Layer 4)
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs font-inter text-solaki-muted">
                <p className="text-white font-semibold">
                  Periode: {range === "24h" ? "24 Jam Terakhir" : range === "7d" ? "7 Hari Terakhir" : "30 Hari Terakhir"}
                </p>
                <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                  Zona Waktu: {tzCode} ({resolvedTimezone})
                </p>
              </div>
            </div>

            {/* Row 1: Key Traffic Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Pageviews */}
              <div className="bento-card p-5 rounded-2xl bg-solaki-card border border-solaki-border flex flex-col justify-between">
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
                    <span className="text-solaki-muted">vs periode lalu</span>
                  </div>
                </div>
              </div>

              {/* Unique Visitors */}
              <div className="bento-card p-5 rounded-2xl bg-solaki-card border border-solaki-border flex flex-col justify-between">
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

              {/* WhatsApp Clicks */}
              <div className="bento-card p-5 rounded-2xl bg-solaki-card border border-solaki-border flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-solaki-muted uppercase tracking-wider font-inter">
                    Klik CTA WhatsApp
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
                    Calon klien menghubungi WhatsApp
                  </p>
                </div>
              </div>

              {/* Chatbot Inquiries */}
              <div className="bento-card p-5 rounded-2xl bg-solaki-card border border-solaki-border flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-solaki-muted uppercase tracking-wider font-inter">
                    Interaksi Chatbot
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {formatNumber(data.chatbotOpens)}
                  </div>
                  <p className="mt-2 text-xs text-solaki-muted">
                    Konsultasi awal via Chatbot Sola
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2: Action Analysis (Layer 2 & Layer 4 Sesuai Pertemuan II.pdf) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D1424] border border-solaki-teal/30 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-solaki-teal mb-1">
                    <Target className="w-4 h-4" />
                    Layer 2 & Layer 4 Action Analysis (Pertemuan II)
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Metrik Efektivitas Interaksi & Rasio Konversi
                  </h3>
                </div>
                <div className="text-xs text-solaki-muted font-inter flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Formula Standar Dr. Valentino Aris / Gohar F. Khan</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Click-Through Rate (CTR) Card */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center justify-between text-xs text-solaki-muted mb-1 font-inter">
                    <span className="font-bold text-white uppercase tracking-wider">CTR (Click-Through)</span>
                    <MousePointerClick className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-emerald-400 mt-2">
                    {data.ctr}%
                  </div>
                  <div className="mt-2 text-[11px] text-solaki-muted font-mono leading-tight">
                    Rumus: (Klik CTA / Pageviews) × 100%
                  </div>
                  <div className="mt-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        data.ctr >= 1.5
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : data.ctr >= 0.5
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {data.ctr >= 1.5 ? "CTA Sangat Efektif (>1.5%)" : "Standar UMKM (0.5 - 1.5%)"}
                    </span>
                  </div>
                </div>

                {/* Engagement Rate (ER) Card */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all">
                  <div className="flex items-center justify-between text-xs text-solaki-muted mb-1 font-inter">
                    <span className="font-bold text-white uppercase tracking-wider">Engagement Rate (ER)</span>
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-purple-400 mt-2">
                    {data.er}%
                  </div>
                  <div className="mt-2 text-[11px] text-solaki-muted font-mono leading-tight">
                    Rumus: (Total Aksi / Pageviews) × 100%
                  </div>
                  <div className="mt-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        data.er >= 3.0
                          ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                          : data.er >= 1.0
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {data.er >= 3.0 ? "ER Tinggi (Target UMKM 3-6%)" : "Perlu Peningkatan Relevansi"}
                    </span>
                  </div>
                </div>

                {/* Total Action Engagements */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition-all">
                  <div className="flex items-center justify-between text-xs text-solaki-muted mb-1 font-inter">
                    <span className="font-bold text-white uppercase tracking-wider">Total Engagements</span>
                    <Percent className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-black text-blue-400 mt-2">
                    {formatNumber(data.totalEngagements)}
                  </div>
                  <div className="mt-2 text-[11px] text-solaki-muted font-mono leading-tight">
                    Aksi: WhatsApp ({data.whatsappClicks}) + Chat ({data.chatbotOpens})
                  </div>
                  <div className="mt-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      Total Interaksi Terukur
                    </span>
                  </div>
                </div>

                {/* Conversion Rate (Leads per Visitor) */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-teal-500/40 transition-all">
                  <div className="flex items-center justify-between text-xs text-solaki-muted mb-1 font-inter">
                    <span className="font-bold text-white uppercase tracking-wider">Conversion Rate</span>
                    <Target className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-3xl font-black text-teal-400 mt-2">
                    {data.conversionRate}%
                  </div>
                  <div className="mt-2 text-[11px] text-solaki-muted font-mono leading-tight">
                    Rumus: (Leads WA / Pengunjung Unik) × 100%
                  </div>
                  <div className="mt-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                      Benchmark UMKM: 2% – 3%
                    </span>
                  </div>
                </div>
              </div>

              {/* Marketing Interpretation Box (Slide 21 & 22) */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/25 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1 font-inter">
                    Interpretasi Pemasaran & Rekomendasi Taktis (Slide 21 & 22)
                  </h4>
                  <p className="text-xs text-white/90 font-inter leading-relaxed">
                    {data.interpretation}
                  </p>
                  <p className="text-[11px] text-solaki-muted font-inter mt-1.5">
                    *Acuan evaluasi: <em>“Jika CTR tinggi & ER rendah → konten punya CTA bagus, tapi interaksi visual kurang. Keseimbangan ideal jika ER & CTR berada di atas rata-rata industri.”</em>
                  </p>
                </div>
              </div>
            </div>

            {/* Row 3: Interactive Chart */}
            <div className="bento-card p-5 sm:p-6 rounded-2xl bg-solaki-card border border-solaki-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Tren Kunjungan ({range === "24h" ? "24 Jam" : range === "7d" ? "7 Hari" : "30 Hari"})
                  </h2>
                  <p className="text-xs text-solaki-muted font-inter mt-0.5">
                    Grafik perbandingan Total Pageviews dan Pengunjung Unik
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold font-inter">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                    <span className="text-white">Pageviews</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-purple-500 inline-block" />
                    <span className="text-white">Unique Visitors</span>
                  </div>
                </div>
              </div>

              <div className="h-60 sm:h-64 w-full">
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
                      <XAxis dataKey="label" stroke="#888888" fontSize={11} tickLine={false} axisLine={{ stroke: "#2A2A2A" }} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={{ stroke: "#2A2A2A" }} allowDecimals={false} />
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
                      <Area type="monotone" dataKey="views" name="Pageviews" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#viewsGradient)" />
                      <Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#C084FC" strokeWidth={2} fillOpacity={1} fill="url(#visitorsGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-solaki-muted text-xs">
                    Belum ada data kunjungan dalam rentang waktu ini.
                  </div>
                )}
              </div>
            </div>

            {/* Row 4: Top Pages, Referrers, and Devices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Top Pages */}
              <div className="bento-card p-5 rounded-2xl bg-solaki-card border border-solaki-border">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-solaki-teal" />
                    Halaman Terpopuler
                  </h3>
                  <span className="text-[10px] text-solaki-muted font-inter">Kunjungan</span>
                </div>
                {data.topPages.length > 0 ? (
                  <div className="space-y-2.5">
                    {data.topPages.slice(0, 5).map((item) => (
                      <div key={item.path} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-white/90 truncate max-w-[150px]">
                            {item.path === "/" ? "/ (Beranda)" : item.path}
                          </span>
                          <span className="font-semibold text-white/80">
                            {formatNumber(item.count)} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${Math.max(item.percentage, 5)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-solaki-muted py-4 text-center font-inter">Belum ada data.</p>
                )}
              </div>

              {/* Top Referrers */}
              <div className="bento-card p-5 rounded-2xl bg-solaki-card border border-solaki-border">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-solaki-glow" />
                    Sumber Traffic (Referrers)
                  </h3>
                  <span className="text-[10px] text-solaki-muted font-inter">Asal</span>
                </div>
                {data.topReferrers.length > 0 ? (
                  <div className="space-y-2.5">
                    {data.topReferrers.slice(0, 5).map((ref) => (
                      <div key={ref.source} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white/90 flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-solaki-glow" />
                            {ref.source}
                          </span>
                          <span className="font-semibold text-white/80">
                            {formatNumber(ref.count)} ({ref.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full"
                            style={{ width: `${Math.max(ref.percentage, 5)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-solaki-muted py-4 text-center font-inter">Belum ada data.</p>
                )}
              </div>

              {/* Devices */}
              <div className="bento-card p-5 rounded-2xl bg-solaki-card border border-solaki-border">
                <h3 className="text-sm font-bold text-white mb-3.5 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  Distribusi Perangkat
                </h3>
                <div className="space-y-2.5">
                  {data.deviceBreakdown.map((dev) => {
                    const Icon =
                      dev.name === "Mobile" ? Smartphone : dev.name === "Tablet" ? Tablet : Monitor;
                    return (
                      <div key={dev.name} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-1.5 font-semibold text-white">
                            <Icon className="w-3.5 h-3.5 text-solaki-teal" />
                            <span>{dev.name}</span>
                          </div>
                          <span className="font-bold text-white">
                            {dev.percentage}% ({formatNumber(dev.count)})
                          </span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-solaki-teal rounded-full" style={{ width: `${dev.percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Infographic Footer (Branded note in exported image) */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-solaki-muted font-inter">
              <p>© {new Date().getFullYear()} SOLAKI Creative Agency • Performance Intelligence</p>
              <p className="text-solaki-teal font-medium">
                Framework: 7 Layers of Social Media Analytics (Dr. Valentino Aris, S.Kom., M.M.)
              </p>
            </div>
          </div>

          {/* Live Activity Stream (On dashboard) */}
          <div className="bento-card p-6 rounded-2xl bg-solaki-card border border-solaki-border">
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
        </>
      ) : null}
    </div>
  );
}
