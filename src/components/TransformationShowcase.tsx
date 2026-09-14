"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  XCircle,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Eye,
  Heart,
  Share2,
  DollarSign,
  AlertTriangle,
  Zap,
  Smartphone,
} from "lucide-react";

export default function TransformationShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");

  return (
    <section className="py-28 relative overflow-hidden bg-solaki-black border-y border-solaki-border/40">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(13,92,70,0.1)_0%,transparent_70%)]" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4 inline-flex">
            <Sparkles className="w-3.5 h-3.5 text-solaki-green" />
            Evolusi & Dampak Nyata
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Transformasi Terukur:{" "}
            <span className="gradient-text-green">Sebelum vs Sesudah</span>
            <br className="hidden sm:block" /> Bermitra dengan SOLAKI
          </h2>
          <p className="text-solaki-muted text-base sm:text-lg max-w-2xl mx-auto font-inter">
            Dari strategi sporadis dan inefisiensi alokasi biaya menjadi ekosistem akuisisi pelanggan yang terstruktur, elegan, dan menghasilkan pertumbuhan berkelanjutan.
          </p>

          {/* Interactive Switcher */}
          <div className="flex justify-center mt-8">
            <div className="p-1.5 rounded-2xl glass-card border border-solaki-border/70 flex gap-2 shadow-2xl">
              <button
                onClick={() => setActiveTab("before")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                  activeTab === "before"
                    ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow-lg"
                    : "text-solaki-muted hover:text-white"
                }`}
              >
                <XCircle className="w-4 h-4" />
                Sebelum Optimasi Strategis
              </button>
              <button
                onClick={() => setActiveTab("after")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                  activeTab === "after"
                    ? "bg-solaki-green/25 text-solaki-green border border-solaki-green/50 shadow-lg"
                    : "text-solaki-muted hover:text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Setelah Transformasi SOLAKI
              </button>
            </div>
          </div>
        </motion.div>

        {/* Interactive Comparison Card & Mockup */}
        <AnimatePresence mode="wait">
          {activeTab === "before" ? (
            <motion.div
              key="before"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto"
            >
              {/* Left Column: Problem List */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm font-bold">Tantangan Pemasaran Sebelum Optimasi</p>
                </div>

                {[
                  {
                    title: "Konten Sporadis & Tanpa Riset Target",
                    desc: "Produksi konten tidak terencana, visual seadanya, dan copywriting tanpa value proposition yang kuat.",
                  },
                  {
                    title: "Inefisiensi Alokasi Budget Iklan",
                    desc: "Iklan berbayar tanpa struktur funnel dan pixel tracking yang tepat, memicu tingginya biaya per akuisisi.",
                  },
                  {
                    title: "Identitas Brand Kurang Menonjol",
                    desc: "Tampilan visual generik yang membuat calon konsumen ragu dan sulit membedakan dari kompetitor.",
                  },
                  {
                    title: "Keterbatasan Tim & Sumber Daya Internal",
                    desc: "Waktu bisnis tersita untuk produksi aset digital teknis dibanding fokus pada pengembangan produk & ekspansi.",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 rounded-2xl bg-solaki-card/60 border border-red-500/20 hover:border-red-500/40 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm sm:text-base mb-1">{item.title}</h4>
                        <p className="text-solaki-muted text-xs sm:text-sm font-inter leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Right Column: Simulated Sad Mockup */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-sm rounded-3xl p-6 bg-solaki-dark/95 border border-red-500/30 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between pb-4 border-b border-solaki-border/50 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-400 font-bold">
                        BRAND
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">@brand.unoptimized</p>
                        <p className="text-red-400 text-xs flex items-center gap-1 font-inter">
                          <TrendingDown className="w-3 h-3" /> Jangkauan Terbatas
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/25">
                      Unstructured
                    </span>
                  </div>

                  {/* Sad metrics box */}
                  <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-solaki-card/40 border border-solaki-border/40 mb-4">
                    <div>
                      <p className="text-xs text-solaki-muted">Followers</p>
                      <p className="text-sm font-bold text-gray-400">128</p>
                    </div>
                    <div>
                      <p className="text-xs text-solaki-muted">Avg Views</p>
                      <p className="text-sm font-bold text-gray-400">45</p>
                    </div>
                    <div>
                      <p className="text-xs text-solaki-muted">ROAS</p>
                      <p className="text-sm font-bold text-red-400">0.8x (Suboptimal)</p>
                    </div>
                  </div>

                  {/* Sad notification item */}
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Konversi rendah dari channel media sosial</span>
                  </div>
                  <div className="p-3 rounded-xl bg-solaki-card/60 border border-solaki-border/40 text-xs text-solaki-muted flex items-center gap-2">
                    <Smartphone className="w-4 h-4 flex-shrink-0" />
                    <span>Jadwal publikasi tidak teratur & tidak konsisten</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="after"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto"
            >
              {/* Left Column: Solution List */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 rounded-2xl bg-solaki-green/15 border border-solaki-green/35 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-solaki-green flex-shrink-0" />
                  <p className="text-solaki-green text-sm font-bold">Hasil Transformasi Ekosistem SOLAKI</p>
                </div>

                {[
                  {
                    title: "Produksi Konten Visual & Video Terstruktur",
                    desc: "Desain visual premium, carousel edukatif, dan short-form video (Reels & TikTok) dengan hook kuat dan konsisten.",
                  },
                  {
                    title: "Kampanye Iklan Berbasis ROAS Optimal",
                    desc: "Arsitektur funnel berbayar lengkap dengan retargeting cerdas dan pelacakan metrik konversi real-time.",
                  },
                  {
                    title: "Otoritas & Reputasi Brand Meningkat",
                    desc: "Tampilan identitas digital yang kohesif dan profesional, membangun kepercayaan instan bagi calon pelanggan.",
                  },
                  {
                    title: "Akselerasi Bisnis & Operasional Efisien",
                    desc: "Seluruh alur kreasi konten, optimasi iklan, dan analitik performa dikelola secara dedikatif oleh tim ahli SOLAKI.",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 rounded-2xl bg-solaki-card/60 border border-solaki-green/30 hover:border-solaki-green/60 transition-all shadow-lg"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-6 h-6 rounded-full bg-solaki-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-solaki-green" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm sm:text-base mb-1">{item.title}</h4>
                        <p className="text-solaki-muted text-xs sm:text-sm font-inter leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Right Column: Simulated Winning Mockup */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-sm rounded-3xl p-6 bg-gradient-to-br from-solaki-card to-solaki-dark border-2 border-solaki-green/50 shadow-[0_0_50px_rgba(13,92,70,0.25)] relative overflow-hidden">
                  {/* Decorative badge */}
                  <div className="absolute top-0 right-0 bg-solaki-green text-white text-[10px] font-black px-4 py-1 rounded-bl-xl tracking-wider uppercase">
                    ★ SOLAKI Accelerated
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-solaki-border/50 mb-4 mt-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-solaki-green to-solaki-coral p-0.5">
                        <div className="w-full h-full rounded-full bg-solaki-black flex items-center justify-center text-xs text-white font-bold">
                          BRAND
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-white font-bold text-sm">@brand.accelerated</p>
                          <span className="w-3.5 h-3.5 rounded-full bg-solaki-green flex items-center justify-center text-[8px] text-white font-black">✓</span>
                        </div>
                        <p className="text-solaki-green text-xs flex items-center gap-1 font-inter font-semibold">
                          <TrendingUp className="w-3 h-3" /> +380% Growth Rate
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Winning metrics box */}
                  <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-solaki-green/10 border border-solaki-green/25 mb-4">
                    <div>
                      <p className="text-xs text-solaki-muted">Reach</p>
                      <p className="text-sm font-extrabold text-white">48.5K</p>
                    </div>
                    <div>
                      <p className="text-xs text-solaki-muted">Reels Views</p>
                      <p className="text-sm font-extrabold text-solaki-coral">125.4K</p>
                    </div>
                    <div>
                      <p className="text-xs text-solaki-muted">Target ROAS</p>
                      <p className="text-sm font-extrabold text-solaki-green">4.6x</p>
                    </div>
                  </div>

                  {/* Incoming simulated customer chats */}
                  <div className="space-y-2 mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-solaki-green/15 border border-solaki-green/30 flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-bold text-white truncate">Qualified Customer Inquiry</p>
                        <p className="text-[10px] text-solaki-muted truncate">&quot;Halo, saya ingin konfirmasi order & kemitraan...&quot;</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="p-3 rounded-xl bg-solaki-coral/10 border border-solaki-coral/25 flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-full bg-solaki-coral/20 flex items-center justify-center text-solaki-coral">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-bold text-white truncate">High-Engagement Content Surge</p>
                        <p className="text-[10px] text-solaki-muted truncate">+12.4K views organik & 480 bookmark disimpan</p>
                      </div>
                    </motion.div>
                  </div>

                  <button
                    onClick={() => document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" })}
                    className="w-full btn-neon py-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    Akselerasi Brand Anda Sekarang
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
