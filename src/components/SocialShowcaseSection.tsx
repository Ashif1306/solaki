"use client";

import ShowcaseMedia from "@/components/ShowcaseMedia";
import { showcaseKind, safeMediaUrl } from "@/lib/showcase-media";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  Sparkles,
  Eye,
  Heart,
  TrendingUp,
  ExternalLink,
  X,
  Flame,
  Search,
  Map,
  Rocket,
  BarChart3,
  ArrowRight,
  Share2,
  Bookmark,
  MessageCircle,
  Play,
  ChevronRight,
  Award,
  Users,
  Zap,
} from "lucide-react";

const processSteps = [
  {
    number: "01",
    icon: Search,
    title: "Understand",
    subtitle: "Pahami Bisnis Anda",
    desc: "Kami mulai dengan memahami bisnis Anda secara mendalam — target pasar, audit aset digital, dan peluang pertumbuhan.",
    color: "#10B981",
    accent: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.25)",
    details: ["Riset target pasar & kompetitor", "Audit aset digital yang ada", "Identifikasi peluang konversi"],
  },
  {
    number: "02",
    icon: Map,
    title: "Strategize",
    subtitle: "Susun Strategi Tepat",
    desc: "Merancang strategi pemasaran digital yang terarah, mulai dari struktur pilar konten hingga formulasi kampanye iklan.",
    color: "#F59E0B",
    accent: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
    details: ["Perancangan content pillars", "Kalender editorial bulanan", "Roadmap digital ads (Meta & TikTok)"],
  },
  {
    number: "03",
    icon: Rocket,
    title: "Create & Execute",
    subtitle: "Produksi & Eksekusi",
    desc: "Memproduksi konten kreatif visual & video berdaya pikat tinggi, serta mengelola penayangan iklan secara disiplin.",
    color: "#8B5CF6",
    accent: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.25)",
    details: ["Produksi video Reels & TikTok", "Pengelolaan & publikasi terjadwal", "Eksekusi iklan tertarget"],
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Analyze & Grow",
    subtitle: "Evaluasi & Optimasi",
    desc: "Mengevaluasi hasil secara berkala berbasis data riil (reach, retention, engagement) untuk optimasi pertumbuhan jangka panjang.",
    color: "#10B981",
    accent: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.25)",
    details: ["Laporan performa berkala", "Analisis engagement & ROI", "Optimasi strategi berkelanjutan"],
  },
];

interface ShowcaseItem {
  id: string;
  order: number;
  platform: "instagram" | "tiktok";
  title: string;
  caption: string;
  mediaUrl: string;
  postUrl?: string;
  format: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: string;
  reachMultiplier: string;
  hookStrategy: string;
  contentPillar: string;
  targetAudience: string;
  keyTakeaway: string;
  sentimentScore: string;
  isActive: boolean;
  isFeatured: boolean;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, motionVal, value]);

  useEffect(() => {
    return spring.on("change", (v: number) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("id-ID") + suffix;
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

function PlatformBadge({ platform, size = "sm" }: { platform: "instagram" | "tiktok"; size?: "sm" | "md" }) {
  const cls = size === "md" ? "px-3 py-1.5 text-xs" : "px-2 py-0.5 text-[10px]";
  if (platform === "instagram")
    return (
      <span className={`${cls} rounded-full font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-pink-400/30`}>
        Instagram
      </span>
    );
  return (
    <span className={`${cls} rounded-full font-black uppercase tracking-wider bg-black text-white border border-white/25`}>
      TikTok
    </span>
  );
}

function PortfolioCard({
  item,
  idx,
  formatNumber,
  onDetailClick,
}: {
  item: ShowcaseItem;
  idx: number;
  formatNumber: (n: number) => string;
  onDetailClick: (item: ShowcaseItem) => void;
}) {
  const video = showcaseKind(item) === "video";
  return (
    <motion.article layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.3) }} className="group rounded-3xl border border-white/10 bg-[#111816] p-2 transition-colors hover:border-emerald-300/40">
      <button type="button" onClick={() => onDetailClick(item)} aria-label={`Lihat ${item.title}`} className="relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-black text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300">
        <ShowcaseMedia mediaUrl={item.mediaUrl} postUrl={item.postUrl} title={item.title} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2"><PlatformBadge platform={item.platform} />{item.isFeatured && <span className="rounded-full bg-emerald-200 px-2 py-1 text-[10px] font-bold text-emerald-950">Pilihan SOLAKI</span>}</div>
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-white"><span className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs backdrop-blur-md">{video ? "Reels / Video" : /carousel/i.test(item.format) ? "Carousel" : "Foto / Feed"}</span><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">{video ? <Play className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}</span></div>
      </button>
      <div className="p-3 sm:p-4">
        <p className="mb-2 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">{item.contentPillar || "Creative work"}</p>
        <button onClick={() => onDetailClick(item)} className="text-left focus-visible:outline-emerald-300"><h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-white">{item.title}</h3></button>
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-3 text-xs text-white/65"><span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />{formatNumber(item.views)}</span><span className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5" />{formatNumber(item.likes)}</span>{item.engagementRate && <span className="ml-auto font-semibold text-emerald-300">{item.engagementRate} ER</span>}</div>
      </div>
    </motion.article>
  );
}

function DetailModal({
  item,
  onClose,
  formatNumber,
}: {
  item: ShowcaseItem;
  onClose: () => void;
  formatNumber: (n: number) => string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previous; };
  }, []);
  const metrics = [
    { icon: Eye, label: "Views", value: formatNumber(item.views), color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { icon: Heart, label: "Likes", value: formatNumber(item.likes), color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
    { icon: TrendingUp, label: "Engagement", value: item.engagementRate || "—", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { icon: MessageCircle, label: "Komentar", value: formatNumber(item.comments), color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
    { icon: Share2, label: "Shares", value: formatNumber(item.shares), color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { icon: Bookmark, label: "Saves", value: formatNumber(item.saves), color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  ];

  return (
    <motion.dialog ref={dialogRef} onCancel={(event) => { event.preventDefault(); onClose(); }} aria-label={item.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="m-0 h-dvh max-h-none w-screen max-w-none border-0 fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl my-8 bg-[#0E0E0E] border border-white/[0.09] rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row"
      >
        <button
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left visual */}
        <div className="md:w-5/12 relative min-h-[280px] md:min-h-[560px] bg-black flex-shrink-0">
          <ShowcaseMedia mediaUrl={item.mediaUrl} postUrl={item.postUrl} title={item.title} controls />
          <div className="pointer-events-none relative z-10 p-5">
            <PlatformBadge platform={item.platform} size="md" />
          </div>
          <div className="absolute bottom-12 left-0 right-0 p-5 z-10">
            {item.postUrl && (
              <a
                href={safeMediaUrl(item.postUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Buka Postingan Asli
              </a>
            )}
          </div>
        </div>

        {/* Right analysis */}
        <div className="md:w-7/12 p-7 md:p-8 overflow-y-auto space-y-6 max-h-[80vh] md:max-h-none">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black text-solaki-glow uppercase tracking-widest">{item.format}</span>
              <span className="text-white/20">•</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">{item.contentPillar}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{item.title}</h3>
            {item.caption && (
              <p className="text-sm text-white/45 font-inter mt-2 leading-relaxed">{item.caption}</p>
            )}
          </div>

          <div>
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-3">Metrik Performa</p>
            <div className="grid grid-cols-3 gap-2">
              {metrics.map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className={`p-3 rounded-xl border ${bg} text-center`}>
                  <Icon className={`w-3.5 h-3.5 ${color} mx-auto mb-1`} />
                  <div className={`text-sm font-black ${color}`}>{value}</div>
                  <div className="text-[10px] text-white/30">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {item.hookStrategy && (
              <div className="p-4 rounded-xl bg-amber-500/[0.07] border border-amber-500/20">
                <div className="flex items-center gap-1.5 mb-2">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Hook 3 Detik Pertama</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{item.hookStrategy}</p>
              </div>
            )}

            {item.keyTakeaway && (
              <div className="p-4 rounded-xl bg-emerald-500/[0.07] border border-emerald-500/20">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Dampak Bisnis Nyata</span>
                </div>
                <p className="text-sm text-white/90 font-medium leading-relaxed">{item.keyTakeaway}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] text-white/30 mb-1">Target Audiens</p>
                <p className="text-xs text-white font-semibold">{item.targetAudience || "—"}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] text-white/30 mb-1">Sentimen Audiens</p>
                <p className="text-xs text-emerald-400 font-semibold">{item.sentimentScore || "Belum tersedia"}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.dialog>
  );
}

function AggregateStatsBar({ items }: { items: ShowcaseItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const totalViews = items.reduce((s, i) => s + (i.views || 0), 0);
  const totalLikes = items.reduce((s, i) => s + (i.likes || 0), 0);
  const totalSaves = items.reduce((s, i) => s + (i.saves || 0), 0);
  const erItems = items.filter((i) => i.engagementRate);
  const avgER =
    erItems.length > 0
      ? (erItems.reduce((s, i) => s + parseFloat(i.engagementRate || "0"), 0) / erItems.length).toFixed(1) + "%"
      : "—";

  const stats = [
    { icon: Eye, label: "Total Views", value: totalViews, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { icon: Heart, label: "Total Likes", value: totalLikes, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
    { icon: Bookmark, label: "Total Saves", value: totalSaves, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
    { icon: TrendingUp, label: "Avg. Engagement", value: null, valueStr: avgER, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  ];

  if (items.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12"
    >
      {stats.map(({ icon: Icon, label, value, valueStr, color, bg }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
          className={`flex items-center gap-3 px-4 py-4 rounded-2xl border ${bg}`}
        >
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div>
            <div className={`text-lg font-black ${color}`}>
              {value !== null ? (
                <AnimatedCounter value={value!} suffix="+" />
              ) : (
                valueStr
              )}
            </div>
            <div className="text-[10px] text-white/40 font-medium">{label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function SocialShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [activePlatform, setActivePlatform] = useState<"all" | "instagram" | "tiktok">("all");
  const [activeFormat, setActiveFormat] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  useEffect(() => {
    fetch("/api/showcase")
      .then((r) => { if (!r.ok) throw new Error("Gagal memuat"); return r.json(); })
      .then((data) => {
        if (data.items && data.items.length > 0) setItems(data.items);
      })
      .catch(() => setLoadError(true)).finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter((item) =>
    (activePlatform === "all" || item.platform === activePlatform) && (activeFormat === "all" || showcaseKind(item) === activeFormat)
  );

  const formatNumber = (num: number) => {
    if (!num) return "0";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString("id-ID");
  };

  return (
    <section id="showcase" ref={sectionRef} className="relative overflow-hidden" style={{ background: "#080808" }}>
      {/* Ambient */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-solaki-teal/40 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(13,92,70,0.13)_0%,transparent_65%)] pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(139,92,246,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      {/* -- Portfolio -- */}
      <div className="py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-left mb-10"
          >
            <div className="section-badge mb-5 inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-solaki-glow animate-pulse" />
              <span>SOLAKI / SELECTED SOCIAL WORK</span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-4">
              Konten yang bicara.{" "}<br />
              <span className="gradient-text-teal">Brand yang diingat.</span>
            </h2>
            <p className="text-white/60 text-base font-inter max-w-xl leading-relaxed">
              Portofolio konten media sosial SOLAKI. Jelajahi cerita, visual, dan ide kreatif yang menghubungkan brand dengan audiensnya.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="flex items-center gap-2 mt-8 flex-wrap"
            >
              {(
                [
                  { id: "all" as const, label: "Semua Karya" },
                  { id: "instagram" as const, label: "Instagram" },
                  { id: "tiktok" as const, label: "TikTok" },
                ]
              ).map((tab) => (
                <button
                  key={tab.id}
                  aria-pressed={activePlatform === tab.id}
                  onClick={() => setActivePlatform(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                    activePlatform === tab.id
                      ? tab.id === "instagram"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-pink-500/20 scale-105"
                        : tab.id === "tiktok"
                        ? "bg-white text-black shadow-lg scale-105"
                        : "bg-solaki-teal text-white shadow-lg shadow-solaki-teal/25 scale-105"
                      : "bg-white/[0.05] text-white/50 hover:text-white border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {items.length > 0 && <AggregateStatsBar items={items} />}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5"><div><h3 className="text-lg font-bold text-white">Eksplorasi karya</h3><p className="mt-1 text-xs text-white/45">{filteredItems.length} konten terpilih / Foto, cerita, dan video</p></div><div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">{[{ id: "all", label: "Semua" }, { id: "video", label: "Reels / Video" }, { id: "photo", label: "Foto / Carousel" }].map(tab => <button key={tab.id} aria-pressed={activeFormat === tab.id} onClick={() => setActiveFormat(tab.id)} className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${activeFormat === tab.id ? "bg-emerald-200 text-emerald-950" : "text-white/60 hover:text-white"}`}>{tab.label}</button>)}</div></div>

          {loading ? <div aria-label="Memuat portofolio" className="grid grid-cols-2 lg:grid-cols-4 gap-5">{[1,2,3,4].map(i => <div key={i} className="aspect-[3/5] animate-pulse rounded-3xl bg-white/5" />)}</div> : filteredItems.length > 0 ? (
            <div className={`grid grid-cols-1 min-[480px]:grid-cols-2 gap-5 ${filteredItems.length > 2 ? "lg:grid-cols-3" : "max-w-4xl mx-auto"}`}>
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, idx) => (
                  <div key={item.id} className="min-w-0">
                    <PortfolioCard
                      item={item}
                      idx={idx}
                      formatNumber={formatNumber}
                      onDetailClick={setSelectedItem}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="text-center py-24"
            >
              <div className="w-24 h-24 rounded-3xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-solaki-teal opacity-50" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">{loadError ? "Portofolio belum dapat dimuat" : "Belum ada konten di kategori ini"}</h3>
              <p className="text-sm text-white/40 font-inter max-w-md mx-auto mb-8 leading-relaxed">
                {loadError ? "Silakan muat ulang halaman untuk mencoba kembali." : "Pilih kategori lain untuk menjelajahi karya SOLAKI."}
              </p>
              <button onClick={() => { if (loadError) window.location.reload(); else { setActivePlatform("all"); setActiveFormat("all"); } }} className="rounded-full bg-emerald-200 px-6 py-3 text-sm font-bold text-emerald-950">{loadError ? "Coba lagi" : "Lihat semua karya"}</button>
            </motion.div>
          )}
        </div>
      </div>

      {/* -- Process -- */}
      <div className="border-t border-white/[0.06]">
        <div className="py-24 sm:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <div className="section-badge mb-5 inline-flex items-center gap-2">
                <Rocket className="w-3.5 h-3.5 text-solaki-glow animate-pulse" />
                <span>Metodologi Kerja SOLAKI</span>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Bagaimana Kami Mewujudkan{" "}
                <span className="gradient-text-teal">Konten Viral</span>
              </h3>
              <p className="text-white/50 text-base font-inter max-w-xl mx-auto leading-relaxed">
                Pendekatan 4 tahap terstruktur yang mengubah bisnis lokal menjadi merek digital yang kuat dan berkelanjutan.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 28 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="relative group"
                >
                  {i < processSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-9 -right-2 z-20 items-center">
                      <ChevronRight className="w-4 h-4" style={{ color: step.color, opacity: 0.5 }} />
                    </div>
                  )}

                  <div
                    className="h-full p-6 rounded-2xl relative overflow-hidden transition-all duration-500 group-hover:-translate-y-1"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: `1px solid ${step.border}`,
                    }}
                  >
                    <div
                      className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: step.accent }}
                    />

                    <div className="flex items-center justify-between mb-6">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: step.accent, border: `1px solid ${step.border}` }}
                      >
                        <step.icon className="w-5 h-5" style={{ color: step.color }} />
                      </div>
                      <span
                        className="text-3xl font-black opacity-20 font-jakarta tabular-nums"
                        style={{ color: step.color }}
                      >
                        {step.number}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white mb-0.5">{step.title}</h4>
                    <p className="text-xs font-semibold mb-3 font-inter" style={{ color: step.color }}>
                      {step.subtitle}
                    </p>
                    <p className="text-xs text-white/45 font-inter leading-relaxed mb-5">{step.desc}</p>

                    <ul className="space-y-2 pt-4 border-t border-white/[0.06]">
                      {step.details.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ background: step.color }}
                          />
                          <span className="text-[11px] font-inter text-white/40">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-12"
            >
              {[
                { icon: Award, text: "Strategi Berbasis Data" },
                { icon: Users, text: "Tim Kreatif Berpengalaman" },
                { icon: Zap, text: "Eksekusi Cepat & Terukur" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/55 text-sm font-medium"
                >
                  <Icon className="w-4 h-4 text-solaki-glow" />
                  {text}
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex flex-col sm:flex-row items-center gap-4">
                <motion.button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="btn-primary text-base"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>Yuk, Garap Kontenmu Bareng!</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <p className="text-white/30 text-xs font-inter">
                  Konsultasi gratis · tanpa komitmen · tanpa biaya
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            formatNumber={formatNumber}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
