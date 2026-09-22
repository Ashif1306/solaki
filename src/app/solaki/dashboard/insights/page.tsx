"use client";

import { useState, useEffect, useRef } from "react";
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  BarChart3,
  Award,
  Flame,
  Zap,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
  MousePointerClick,
  Download,
  Sparkles,
  Target,
  Percent,
  CheckCircle2,
} from "lucide-react";
import { toPng } from "html-to-image";
import { useAdminTimezone } from "@/hooks/useAdminTimezone";
import { useSiteBrand } from "@/hooks/useSiteBrand";

/* ── Types ─────────────────────────────────────── */
interface AggregateStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  totalInteractions: number;
  followersCount?: number;
  avgER: string;
  avgCTR: string;
  amplificationRate?: string;
  conversationRate?: string;
  interpretation?: string;
}

interface PostInsight {
  id: string;
  title: string;
  caption: string;
  platform: string;
  format: string;
  mediaUrl: string;
  postUrl?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  er: number;
  ctr: number;
  erStr: string;
  ctrStr: string;
  isFeatured: boolean;
  createdAt: string;
}

interface FormatDist {
  name: string;
  count: number;
  percentage: number;
}

interface InsightsData {
  aggregate: AggregateStats;
  posts: PostInsight[];
  topPerformers: {
    byER: PostInsight[];
    byViews: PostInsight[];
    byLikes: PostInsight[];
  };
  formatDistribution: FormatDist[];
}

/* ── Helpers ───────────────────────────────────── */
function fmtNum(n: number): string {
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("id-ID");
}

const FORMAT_COLORS: Record<string, string> = {
  "Reels / Video": "bg-purple-500",
  Carousel: "bg-blue-500",
  "Feed / Foto": "bg-emerald-500",
};

/* ── Stat Card ─────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
  bgColor,
  borderColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div className={`bento-card p-5 ${borderColor} group hover:scale-[1.02] transition-transform`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-solaki-muted uppercase tracking-widest font-inter">
          {label}
        </span>
        <div className={`w-9 h-9 rounded-xl ${bgColor} flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <div className={`text-2xl sm:text-3xl font-black text-white tracking-tight`}>{value}</div>
      {subtitle && (
        <div className={`mt-1.5 text-[11px] font-semibold ${color} font-inter`}>{subtitle}</div>
      )}
    </div>
  );
}

/* ── Top Performer Card ────────────────────────── */
function TopCard({
  post,
  badge,
  badgeColor,
  badgeIcon: BadgeIcon,
  metricLabel,
  metricValue,
}: {
  post: PostInsight;
  badge: string;
  badgeColor: string;
  badgeIcon: React.ElementType;
  metricLabel: string;
  metricValue: string;
}) {
  return (
    <div className="bento-card overflow-hidden group hover:border-white/20 transition-all">
      {/* Thumbnail */}
      <div className="relative h-40 bg-black overflow-hidden">
        {post.mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.mediaUrl}
            alt={post.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <BarChart3 className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider force-text-white text-white ${badgeColor}`}
          >
            <BadgeIcon className="w-3 h-3 text-white force-text-white" />
            <span className="text-white force-text-white">{badge}</span>
          </span>
        </div>
        {/* Metric overlay */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5">
            <div className="text-[10px] text-white/70 font-medium force-text-light">{metricLabel}</div>
            <div className="text-base font-black text-white force-text-white">{metricValue}</div>
          </div>
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] font-bold text-solaki-teal uppercase tracking-widest mb-1 truncate">
          {post.format}
        </p>
        <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug min-h-[2.5rem]">
          {post.title}
        </h4>
        <div className="flex items-center gap-3 mt-3 text-xs text-solaki-muted">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {fmtNum(post.views)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" /> {fmtNum(post.likes)}
          </span>
          {post.postUrl && (
            <a
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-solaki-teal hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sort Options ──────────────────────────────── */
type SortKey = "er" | "ctr" | "views" | "likes" | "comments";

/* ── Main Page ─────────────────────────────────── */
export default function InsightsPage() {
  const { resolvedTimezone, tzCode } = useAdminTimezone();
  const { brand } = useSiteBrand();
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("er");
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/insights");
      if (!res.ok) throw new Error("Gagal memuat data insights");
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/admin/showcase/sync-instagram", { method: "POST" });
      const json = await res.json();
      if (json.error) {
        setSyncMsg(`❌ ${json.error}`);
      } else {
        setSyncMsg(`✅ ${json.message}`);
        fetchInsights();
      }
    } catch {
      setSyncMsg("❌ Gagal menghubungi server");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(null), 5000);
    }
  };

  const handleDownloadImage = async () => {
    if (!reportRef.current) return;
    try {
      setDownloadingImage(true);
      const isLight = document.documentElement.classList.contains("light");
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: isLight ? "#FFFFFF" : "#0B0F17",
      });
      const link = document.createElement("a");
      const dateTag = new Date().toISOString().slice(0, 10);
      link.download = `SOLAKI-Instagram-Insights-${dateTag}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image:", err);
      alert("Gagal mengunduh gambar analitik Instagram. Silakan coba kembali.");
    } finally {
      setDownloadingImage(false);
    }
  };

  const sortedPosts = data
    ? [...data.posts].sort((a, b) => {
        switch (sortBy) {
          case "er": return b.er - a.er;
          case "ctr": return b.ctr - a.ctr;
          case "views": return b.views - a.views;
          case "likes": return b.likes - a.likes;
          case "comments": return b.comments - a.comments;
          default: return 0;
        }
      })
    : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Instagram Insights</h1>
            <p className="text-sm text-solaki-muted font-inter">Memuat data analitik...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bento-card p-5 animate-pulse">
              <div className="h-4 w-24 bg-white/5 rounded mb-4" />
              <div className="h-8 w-20 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <BarChart3 className="w-16 h-16 mx-auto text-solaki-subtle mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Gagal Memuat Insights</h2>
        <p className="text-sm text-solaki-muted font-inter mb-6">{error}</p>
        <button onClick={fetchInsights} className="btn-primary px-6 py-2.5 text-sm font-semibold">
          Coba Lagi
        </button>
      </div>
    );
  }

  const { aggregate: agg, topPerformers: top, formatDistribution } = data;

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-solaki-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            SOLAKI / INSTAGRAM INSIGHTS
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Analitik Konten Instagram
          </h1>
          <p className="text-sm text-solaki-muted font-inter mt-1">
            Dashboard performa konten @solaki_digital — {agg.totalPosts} postingan teranalisis
            {Boolean(agg.followersCount && agg.followersCount > 0) && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                👥 {fmtNum(agg.followersCount!)} Followers
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Download Image Button */}
          <button
            onClick={handleDownloadImage}
            disabled={downloadingImage || loading || !data}
            className="btn-download-insight inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white force-text-white text-xs font-bold transition-all shadow-md hover:shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Download seluruh hasil insight dan metrik dalam bentuk gambar PNG"
          >
            {downloadingImage ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white force-text-white" />
            ) : (
              <Download className="w-4 h-4 text-white force-text-white" />
            )}
            <span className="text-white force-text-white">{downloadingImage ? "Membuat Gambar..." : "Download Gambar Insight"}</span>
          </button>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-secondary py-2.5 px-4 text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Menarik data..." : "Sinkronkan Instagram"}
          </button>
        </div>
      </div>

      {/* Sync message */}
      {syncMsg && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-semibold font-inter border ${
            syncMsg.startsWith("✅")
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {syncMsg}
        </div>
      )}

      {/* ── Main Printable / Downloadable Report Container ── */}
      <div ref={reportRef} className="admin-report-card space-y-6 p-2 sm:p-5 rounded-3xl transition-colors duration-300">
        {/* Infographic Top Banner (Visible in PNG export) */}
        <div className="admin-banner-insights p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300">
          <div className="flex items-center gap-3.5">
            {brand.logoType === "image" && brand.logoImageUrl ? (
              <div className="w-11 h-11 rounded-xl border border-white/20 bg-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brand.logoImageUrl} alt="SOLAKI" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 flex items-center justify-center text-white force-text-white font-black text-lg shadow-md">
                S
              </div>
            )}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>SOLAKI DIGITAL</span>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
                  Instagram Insights Report
                </span>
              </h2>
              <p className="text-xs text-solaki-muted font-inter">
                Laporan Kinerja Konten, Interaksi Sosial & Action Analysis (Layer 2 & Layer 4)
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs font-inter text-solaki-muted">
            <p className="text-white font-semibold">
              Postingan: {agg.totalPosts} Konten · {agg.followersCount && agg.followersCount > 0 ? `${fmtNum(agg.followersCount)} Followers` : "Akun Terhubung"}
            </p>
            <p className="text-[11px] text-purple-400 font-mono mt-0.5">
              Zona Waktu: {tzCode} ({resolvedTimezone})
            </p>
          </div>
        </div>

        {/* ── Action Analysis (Layer 2 & Layer 4) ── */}
        <div className="admin-action-box-insights p-6 rounded-2xl border space-y-5 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-solaki-border/40 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-pink-400 mb-1">
                <Target className="w-4 h-4" />
                Layer 2 & Layer 4 Action Analysis
              </div>
              <h3 className="text-lg font-black text-white">
                Metrik Efektivitas Konten Sosial (ER, CTR, Amplification & Conversation)
              </h3>
            </div>
            <div className="text-xs text-solaki-muted font-inter flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-pink-400 animate-ping" />
              <span>Standar Analisis Media Sosial</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Engagement Rate (ER) Card */}
            <div className="admin-action-subcard p-4 rounded-xl border transition-all">
              <div className="flex items-center justify-between text-xs text-solaki-muted mb-1 font-inter">
                <span className="font-bold text-white uppercase tracking-wider">Engagement Rate (ER)</span>
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400 mt-2">
                {agg.avgER}
              </div>
              <div className="mt-2 text-[11px] text-solaki-muted font-mono leading-tight">
                Rumus: (Total Engagements / Impressions) × 100%
              </div>
              <div className="mt-2.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    parseFloat(agg.avgER) >= 3.0
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : parseFloat(agg.avgER) >= 1.0
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {parseFloat(agg.avgER) >= 3.0 ? "ER Tinggi (Target UMKM 3-6%)" : "Perlu Optimasi Engagement"}
                </span>
              </div>
            </div>

            {/* Click-Through Rate (CTR) Card */}
            <div className="admin-action-subcard p-4 rounded-xl border transition-all">
              <div className="flex items-center justify-between text-xs text-solaki-muted mb-1 font-inter">
                <span className="font-bold text-white uppercase tracking-wider">Click-Through (CTR)</span>
                <MousePointerClick className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400 mt-2">
                {agg.avgCTR}
              </div>
              <div className="mt-2 text-[11px] text-solaki-muted font-mono leading-tight">
                Rumus: (Clicks / Impressions) × 100%
              </div>
              <div className="mt-2.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    parseFloat(agg.avgCTR) >= 1.5
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {parseFloat(agg.avgCTR) >= 1.5 ? "CTA Efektif (>1.5%)" : "Standar UMKM (0.5 - 1.5%)"}
                </span>
              </div>
            </div>

            {/* Amplification Rate Card */}
            <div className="admin-action-subcard p-4 rounded-xl border transition-all">
              <div className="flex items-center justify-between text-xs text-solaki-muted mb-1 font-inter">
                <span className="font-bold text-white uppercase tracking-wider">Amplification Rate</span>
                <Share2 className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-3xl font-black text-pink-400 mt-2">
                {agg.amplificationRate || "0.00%"}
              </div>
              <div className="mt-2 text-[11px] text-solaki-muted font-mono leading-tight">
                Rumus: (Shares per post / Followers) × 100%
              </div>
              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                  Social Sharing Multiplier
                </span>
              </div>
            </div>

            {/* Conversation Rate Card */}
            <div className="admin-action-subcard p-4 rounded-xl border transition-all">
              <div className="flex items-center justify-between text-xs text-solaki-muted mb-1 font-inter">
                <span className="font-bold text-white uppercase tracking-wider">Conversation Rate</span>
                <MessageCircle className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-3xl font-black text-violet-400 mt-2">
                {agg.conversationRate || "0.00%"}
              </div>
              <div className="mt-2 text-[11px] text-solaki-muted font-mono leading-tight">
                Rumus: (Comments per post / Followers) × 100%
              </div>
              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
                  Audience Dialogue Index
                </span>
              </div>
            </div>
          </div>

          {/* Marketing Interpretation Box */}
          <div className="admin-interpretation-insights p-4 rounded-xl border flex items-start gap-3.5 transition-colors duration-300">
            <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-inter mb-1">
                Interpretasi Pemasaran & Rekomendasi Taktis
              </h4>
              <p className="text-xs text-white/90 font-inter leading-relaxed">
                {agg.interpretation || "Menganalisis keseimbangan ER vs CTR konten..."}
              </p>
              <p className="text-[11px] text-solaki-muted font-inter mt-1.5">
                *Acuan evaluasi: <em>“Jika CTR tinggi & ER rendah → konten punya CTA bagus, tapi interaksi visual kurang. Keseimbangan ideal jika ER & CTR berada di atas rata-rata industri.”</em>
              </p>
            </div>
          </div>
        </div>

        {/* ── Section 1: Hero Stat Cards ──────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Eye}
            label="Total Views"
            value={fmtNum(agg.totalViews)}
            subtitle={`${agg.totalPosts} postingan`}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
            borderColor="border-blue-500/20"
          />
          <StatCard
            icon={Heart}
            label="Total Likes"
            value={fmtNum(agg.totalLikes)}
            subtitle={`${((agg.totalLikes / Math.max(agg.totalViews, 1)) * 100).toFixed(1)}% like rate`}
            color="text-rose-400"
            bgColor="bg-rose-500/10"
            borderColor="border-rose-500/20"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg. Engagement Rate"
            value={agg.avgER}
            subtitle={
              agg.followersCount && agg.followersCount > 0
                ? `ER = Interaksi / ${fmtNum(agg.followersCount)} Followers`
                : "ER = (Interaksi / Followers) × 100%"
            }
            color="text-emerald-400"
            bgColor="bg-emerald-500/10"
            borderColor="border-emerald-500/20"
          />
          <StatCard
            icon={MousePointerClick}
            label="Avg. CTR (Conversion)"
            value={agg.avgCTR}
            subtitle="CTR = (Simpan + Bagikan) / Views"
            color="text-amber-400"
            bgColor="bg-amber-500/10"
            borderColor="border-amber-500/20"
          />
        </div>

      {/* Second row stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={MessageCircle}
          label="Total Comments"
          value={fmtNum(agg.totalComments)}
          color="text-violet-400"
          bgColor="bg-violet-500/10"
          borderColor="border-violet-500/20"
        />
        <StatCard
          icon={Share2}
          label="Total Shares"
          value={fmtNum(agg.totalShares)}
          color="text-amber-400"
          bgColor="bg-amber-500/10"
          borderColor="border-amber-500/20"
        />
        <StatCard
          icon={Bookmark}
          label="Total Saves"
          value={fmtNum(agg.totalSaves)}
          color="text-cyan-400"
          bgColor="bg-cyan-500/10"
          borderColor="border-cyan-500/20"
        />
        <StatCard
          icon={Zap}
          label="Total Interaksi"
          value={fmtNum(agg.totalInteractions)}
          subtitle="Semua engagement digabung"
          color="text-yellow-400"
          bgColor="bg-yellow-500/10"
          borderColor="border-yellow-500/20"
        />
      </div>

      {/* ── Section 2: Format Distribution ──────────── */}
      {formatDistribution.length > 0 && (
        <div className="bento-card p-6 border-solaki-border">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            Distribusi Format Konten
          </h2>
          <div className="space-y-3">
            {formatDistribution.map((f) => (
              <div key={f.name} className="flex items-center gap-4">
                <span className="text-sm font-semibold text-white w-28 flex-shrink-0">{f.name}</span>
                <div className="flex-1 h-8 bg-white/5 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full ${FORMAT_COLORS[f.name] || "bg-white/20"} transition-all duration-700`}
                    style={{ width: `${Math.max(f.percentage, 5)}%` }}
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-xs font-bold text-white/70">
                    {f.count} post ({f.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section 3: Top Performers ──────────────── */}
      {data.posts.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Top Performers
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {top.byER[0] && (
              <TopCard
                post={top.byER[0]}
                badge="Top ER"
                badgeColor="bg-emerald-500/80 text-white"
                badgeIcon={TrendingUp}
                metricLabel="Engagement Rate"
                metricValue={top.byER[0].erStr}
              />
            )}
            {top.byViews[0] && (
              <TopCard
                post={top.byViews[0]}
                badge="Most Viewed"
                badgeColor="bg-blue-500/80 text-white"
                badgeIcon={Flame}
                metricLabel="Total Views"
                metricValue={fmtNum(top.byViews[0].views)}
              />
            )}
            {top.byLikes[0] && (
              <TopCard
                post={top.byLikes[0]}
                badge="Most Liked"
                badgeColor="bg-rose-500/80 text-white"
                badgeIcon={Heart}
                metricLabel="Total Likes"
                metricValue={fmtNum(top.byLikes[0].likes)}
              />
            )}
          </div>
        </div>
      )}

      {/* ── Section 4: Content Performance Table ───── */}
      <div className="bento-card p-6 border-solaki-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-white">Performa Per Konten</h2>
            <p className="text-xs text-solaki-muted font-inter mt-0.5">
              {data.posts.length} konten Instagram · Sortir berdasarkan metrik
            </p>
          </div>
          <div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            {(
              [
                { key: "er" as SortKey, label: "ER%" },
                { key: "ctr" as SortKey, label: "CTR%" },
                { key: "views" as SortKey, label: "Views" },
                { key: "likes" as SortKey, label: "Likes" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSortBy(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  sortBy === tab.key
                    ? "bg-solaki-teal text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-inter">
            <thead>
              <tr className="border-b border-solaki-border/60 text-[10px] text-solaki-muted uppercase tracking-wider">
                <th className="pb-3 font-semibold pl-2">#</th>
                <th className="pb-3 font-semibold">Konten</th>
                <th className="pb-3 font-semibold">Format</th>
                <th className="pb-3 font-semibold text-right">Views</th>
                <th className="pb-3 font-semibold text-right">Likes</th>
                <th className="pb-3 font-semibold text-right">Comments</th>
                <th className="pb-3 font-semibold text-right">Saves</th>
                <th className="pb-3 font-semibold text-right">Shares</th>
                <th className="pb-3 font-semibold text-right">ER%</th>
                <th className="pb-3 font-semibold text-right">CTR%</th>
                <th className="pb-3 font-semibold text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-solaki-border/40">
              {sortedPosts.map((post, idx) => {
                const isTopER = idx === 0 && sortBy === "er";
                return (
                  <tr
                    key={post.id}
                    className={`hover:bg-white/[0.03] transition-colors ${
                      isTopER ? "bg-emerald-500/[0.04]" : ""
                    }`}
                  >
                    <td className="py-3 pl-2 text-white/30 text-xs font-mono">{idx + 1}</td>
                    <td className="py-3 max-w-[240px]">
                      <p className="text-white font-medium truncate text-xs">{post.title}</p>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          /reel/i.test(post.format)
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : /carousel/i.test(post.format)
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {/reel/i.test(post.format) ? "Reels" : /carousel/i.test(post.format) ? "Carousel" : "Feed"}
                      </span>
                    </td>
                    <td className="py-3 text-right text-white/80 text-xs font-mono">{fmtNum(post.views)}</td>
                    <td className="py-3 text-right text-rose-400 text-xs font-mono">{fmtNum(post.likes)}</td>
                    <td className="py-3 text-right text-violet-400 text-xs font-mono">{fmtNum(post.comments)}</td>
                    <td className="py-3 text-right text-cyan-400 text-xs font-mono">{fmtNum(post.saves)}</td>
                    <td className="py-3 text-right text-amber-400 text-xs font-mono">{fmtNum(post.shares)}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`text-xs font-bold ${
                          post.er >= 10
                            ? "text-emerald-400"
                            : post.er >= 5
                            ? "text-yellow-400"
                            : "text-white/60"
                        }`}
                      >
                        {post.erStr}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-xs font-bold text-amber-300">{post.ctrStr}</span>
                    </td>
                    <td className="py-3 text-right">
                      {post.postUrl && (
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedPosts.length === 0 && (
          <div className="text-center py-16">
            <BarChart3 className="w-12 h-12 mx-auto text-solaki-subtle mb-3" />
            <p className="text-sm text-solaki-muted font-inter">
              Belum ada data konten. Klik &ldquo;Sinkronkan Instagram&rdquo; untuk memulai.
            </p>
          </div>
        )}
      </div>

      {/* Infographic Footer (Branded note in exported image) */}
      <div className="admin-report-footer pt-4 border-t border-solaki-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-solaki-muted font-inter">
        <p>© {new Date().getFullYear()} SOLAKI Creative Agency • Instagram Content Intelligence</p>
        <p className="text-pink-400 font-medium">
          Framework: 7 Layers of Social Media Analytics
        </p>
      </div>
    </div>
  </div>
  );
}
