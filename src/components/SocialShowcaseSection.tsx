"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Sparkles,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  ExternalLink,
  X,
  Play,
  Zap,
  Bookmark,
  Target,
  BarChart2,
  Flame,
  Layers,
} from "lucide-react";
import Image from "next/image";

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

export default function SocialShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [activePlatform, setActivePlatform] = useState<"all" | "instagram" | "tiktok">("all");
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  useEffect(() => {
    fetch("/api/showcase")
      .then((r) => r.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch((err) => console.error("Error fetching showcase:", err));
  }, []);

  const filteredItems = items.filter((item) => {
    if (activePlatform === "all") return true;
    return item.platform === activePlatform;
  });

  const formatNumber = (num: number) => {
    if (!num) return "—";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString("id-ID");
  };

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="py-24 sm:py-28 relative overflow-hidden bg-solaki-surface"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(13,92,70,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="section-badge mb-4 inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-solaki-teal animate-pulse" />
            <span>Showcase Media Sosial & Analisis Konten</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Karya Nyata di <span className="gradient-text-teal">Instagram & TikTok</span>
          </h2>
          <p className="text-solaki-muted text-sm sm:text-base font-inter max-w-2xl mx-auto mt-3 leading-relaxed">
            Eksplorasi konten visual, video viral, dan strategi di balik pertumbuhan audiens nyata yang kami bangun bersama mitra lokal.
          </p>

          {/* Interactive Platform Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8">
            <button
              onClick={() => setActivePlatform("all")}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activePlatform === "all"
                  ? "bg-solaki-teal text-white shadow-lg shadow-solaki-teal/30 scale-105"
                  : "bg-white/[0.04] text-solaki-muted hover:text-white border border-solaki-border"
              }`}
            >
              Semua Karya
            </button>

            <button
              onClick={() => setActivePlatform("instagram")}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activePlatform === "instagram"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-pink-500/25 scale-105"
                  : "bg-white/[0.04] text-solaki-muted hover:text-white border border-solaki-border"
              }`}
            >
              <span>Instagram (Reels & Feeds)</span>
            </button>

            <button
              onClick={() => setActivePlatform("tiktok")}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activePlatform === "tiktok"
                  ? "bg-black text-white border border-white/40 shadow-lg scale-105"
                  : "bg-white/[0.04] text-solaki-muted hover:text-white border border-solaki-border"
              }`}
            >
              <span>TikTok FYP</span>
            </button>
          </div>
        </motion.div>

        {/* Showcase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bento-card overflow-hidden flex flex-col justify-between group cursor-pointer border border-solaki-border hover:border-solaki-teal transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-solaki-teal/15"
                onClick={() => setSelectedItem(item)}
              >
                {/* 9:16 Vertical Smartphone Visual Frame */}
                <div className="relative aspect-[9/14] bg-black/80 overflow-hidden select-none">
                  {item.mediaUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-solaki-muted">
                      <Sparkles className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  {/* Gradient shade overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

                  {/* Platform & Format Tag (Top) */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md ${
                        item.platform === "instagram"
                          ? "bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white border border-pink-400/40"
                          : "bg-black/90 text-white border border-white/25"
                      }`}
                    >
                      {item.platform === "instagram" ? "Instagram" : "TikTok"}
                    </span>

                    <span className="text-[10px] font-bold text-white/90 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                      {item.reachMultiplier || "Viral"}
                    </span>
                  </div>

                  {/* Center Play Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    <div className="w-12 h-12 rounded-full bg-solaki-teal/90 text-white flex items-center justify-center shadow-xl shadow-solaki-teal/50 scale-90 group-hover:scale-100 transition-transform">
                      <BarChart2 className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Bottom Stats Overlay (Views & Engagement) */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1 font-bold">
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        {formatNumber(item.views)}
                      </span>
                      <span className="flex items-center gap-1 font-bold">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        {formatNumber(item.likes)}
                      </span>
                      <span className="text-[10px] font-extrabold text-solaki-glow bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                        {item.engagementRate}
                      </span>
                    </div>

                    <p className="text-white text-xs font-bold line-clamp-1 group-hover:text-solaki-glow transition-colors">
                      {item.title}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Content Pillar & CTA */}
                <div className="p-4 bg-solaki-surface/90 border-t border-solaki-border flex items-center justify-between">
                  <span className="text-[11px] font-medium text-solaki-muted line-clamp-1 max-w-[150px]">
                    {item.contentPillar}
                  </span>
                  <span className="text-xs font-bold text-solaki-teal group-hover:text-solaki-glow flex items-center gap-1 transition-colors">
                    <span>Analisis</span>
                    <span className="text-sm">&rarr;</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footnote callout */}
        <div className="mt-12 text-center">
          <p className="text-xs text-solaki-muted font-inter">
            💡 <strong className="text-white">Transparansi Strategi</strong>: Setiap konten dirancang melalui riset hook visual, retensi menit pertama, dan call-to-action terukur.
          </p>
        </div>
      </div>

      {/* ── MODAL: DETAIL ANALISIS KONTEN ── */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-3xl my-8 bg-solaki-surface border border-solaki-border rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Visual Media & Direct Link */}
              <div className="md:w-5/12 bg-black relative flex flex-col justify-between p-4 min-h-[320px] md:min-h-[480px]">
                {selectedItem.mediaUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedItem.mediaUrl}
                    alt={selectedItem.title}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
                  />
                ) : null}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />

                {/* Platform Badge (Top-left) */}
                <div className="relative z-10">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      selectedItem.platform === "instagram"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-black text-white border border-white/30"
                    }`}
                  >
                    {selectedItem.platform === "instagram" ? "Instagram Reels" : "TikTok FYP"}
                  </span>
                </div>

                {/* Action button: Buka Postingan Asli */}
                <div className="relative z-10 pt-4">
                  {selectedItem.postUrl ? (
                    <a
                      href={selectedItem.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full py-2.5 px-4 rounded-xl text-xs font-bold justify-center flex items-center gap-2 shadow-lg"
                    >
                      <span>Buka Postingan Asli</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Right Column: In-depth Content Analysis */}
              <div className="md:w-7/12 p-6 md:p-8 overflow-y-auto space-y-6">
                {/* Header info */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-solaki-teal uppercase tracking-wider mb-1">
                    <span>{selectedItem.format}</span>
                    <span>&bull;</span>
                    <span className="text-solaki-muted">{selectedItem.contentPillar}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {selectedItem.title}
                  </h3>
                  <p className="text-xs text-solaki-muted font-inter mt-2 leading-relaxed">
                    {selectedItem.caption || "Analisis performa dan strategi konten digital SOLAKI."}
                  </p>
                </div>

                {/* Metrics Grid */}
                <div>
                  <span className="text-[11px] font-bold text-solaki-subtle uppercase tracking-wider block mb-2.5">
                    Metrik Performa Konten
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-solaki-border text-center">
                      <span className="text-[10px] text-solaki-muted block">Views</span>
                      <span className="text-base font-black text-white">
                        {formatNumber(selectedItem.views)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-solaki-border text-center">
                      <span className="text-[10px] text-solaki-muted block">Likes</span>
                      <span className="text-base font-black text-white">
                        {formatNumber(selectedItem.likes)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-solaki-teal/10 border border-solaki-teal/30 text-center">
                      <span className="text-[10px] text-solaki-teal block font-semibold">Engagement</span>
                      <span className="text-base font-black text-solaki-glow">
                        {selectedItem.engagementRate || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Strategy Analysis */}
                <div className="space-y-3.5 text-xs font-inter">
                  {selectedItem.hookStrategy && (
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        Analisis Hook 3 Detik Pertama
                      </span>
                      <p className="text-slate-200 leading-relaxed pt-0.5">
                        {selectedItem.hookStrategy}
                      </p>
                    </div>
                  )}

                  {selectedItem.keyTakeaway && (
                    <div className="p-3.5 rounded-xl bg-solaki-teal/[0.08] border border-solaki-teal/25 space-y-1">
                      <span className="text-[10px] font-black text-solaki-teal uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-solaki-teal" />
                        Dampak Bisnis (Key Takeaway)
                      </span>
                      <p className="text-white font-medium leading-relaxed pt-0.5">
                        {selectedItem.keyTakeaway}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2.5 pt-1 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                      <span className="text-solaki-muted block text-[10px]">Target Audiens:</span>
                      <span className="text-white font-semibold block mt-0.5 truncate">
                        {selectedItem.targetAudience}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                      <span className="text-solaki-muted block text-[10px]">Sentimen Audiens:</span>
                      <span className="text-emerald-400 font-semibold block mt-0.5">
                        {selectedItem.sentimentScore || "98% Positif"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
