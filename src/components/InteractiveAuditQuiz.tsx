"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calculator,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Layers,
  Video,
  Target,
  Zap,
  CheckCircle2,
  DollarSign,
  PieChart,
  Flame,
} from "lucide-react";

const industries = [
  { id: "fnb", name: "Food & Beverage", multiplier: 4.5, contentFocus: "Visual Storytelling, Aesthetic Reels, & Local Hyper-Targeting" },
  { id: "fashion", name: "Fashion & Apparel", multiplier: 4.8, contentFocus: "Dynamic Lookbook, Trend-Driven TikTok, & High-Conversion Catalog" },
  { id: "beauty", name: "Beauty & Personal Care", multiplier: 5.2, contentFocus: "Educational UGC, Scientific Storytelling, & Multi-Channel Retargeting" },
  { id: "service", name: "B2B & Professional Services", multiplier: 3.8, contentFocus: "Thought Leadership, Authority Content, & Inbound Lead Funnel" },
  { id: "retail", name: "Consumer Goods & Retail", multiplier: 4.2, contentFocus: "Interactive Product Showcase, Promo Engine, & Retention Campaign" },
];

const challenges = [
  { id: "traffic", label: "Meningkatkan Brand Awareness & Jangkauan Organik" },
  { id: "boncos", label: "Mengoptimalkan Efisiensi Iklan & Nilai ROAS" },
  { id: "content", label: "Membutuhkan Tim Produksi Konten Kreatif Dedikatif" },
  { id: "branding", label: "Meningkatkan Persepsi & Daya Saing Visual Brand" },
];

export default function InteractiveAuditQuiz() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [selectedIndustry, setSelectedIndustry] = useState(industries[0]);
  const [selectedChallenge, setSelectedChallenge] = useState(challenges[0].id);
  const [budgetTier, setBudgetTier] = useState<number>(2); // 1 = Starter, 2 = Growth, 3 = Scale

  const getEstimatedReach = () => {
    switch (budgetTier) {
      case 1:
        return "25,000 – 50,000";
      case 2:
        return "60,000 – 120,000";
      case 3:
        return "150,000 – 350,000+";
      default:
        return "60,000 – 120,000";
    }
  };

  const getEstimatedROAS = () => {
    const base = selectedIndustry.multiplier;
    return `${(base * 0.85).toFixed(1)}x – ${(base * 1.15).toFixed(1)}x`;
  };

  return (
    <section className="py-28 relative overflow-hidden bg-solaki-dark border-t border-solaki-border/40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_50%,rgba(217,83,56,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 grid-bg opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4 inline-flex">
            <Calculator className="w-3.5 h-3.5 text-solaki-coral" />
            Interactive Growth Simulator
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Kalkulasi Potensi Pertumbuhan{" "}
            <span className="gradient-text-coral">Brand Anda</span>
          </h2>
          <p className="text-solaki-muted text-base sm:text-lg max-w-2xl mx-auto font-inter">
            Pilih sektor industri dan target prioritas Anda untuk melihat estimasi jangkauan audiens, arah strategi konten kreatif, serta proyeksi efisiensi kampanye.
          </p>
        </motion.div>

        {/* Interactive Simulator Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Column: Interactive Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 bento-card p-6 sm:p-8 space-y-7"
          >
            {/* Step 1: Industry Selection */}
            <div>
              <label className="block text-xs font-bold text-solaki-muted uppercase tracking-wider mb-3">
                1. Pilih Kategori Industri Bisnis Anda
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setSelectedIndustry(ind)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 text-left flex items-center justify-between cursor-pointer ${
                      selectedIndustry.id === ind.id
                        ? "bg-solaki-green/20 border-solaki-green text-solaki-green shadow-md"
                        : "bg-solaki-card/50 border-solaki-border/50 text-solaki-muted hover:text-white hover:border-solaki-green/30"
                    }`}
                  >
                    <span>{ind.name}</span>
                    {selectedIndustry.id === ind.id && (
                      <span className="w-2 h-2 rounded-full bg-solaki-green flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Main Challenge */}
            <div>
              <label className="block text-xs font-bold text-solaki-muted uppercase tracking-wider mb-3">
                2. Apa Prioritas / Fokus Kebutuhan Utama Anda?
              </label>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {challenges.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChallenge(c.id)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 text-left cursor-pointer ${
                      selectedChallenge === c.id
                        ? "bg-solaki-coral/15 border-solaki-coral text-solaki-coral shadow-sm"
                        : "bg-solaki-card/50 border-solaki-border/50 text-solaki-muted hover:text-white hover:border-solaki-coral/30"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Intensity Tier */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-solaki-muted uppercase tracking-wider">
                  3. Skala Intensitas Pertumbuhan
                </label>
                <span className="text-xs font-bold text-solaki-coral">
                  {budgetTier === 1 ? "Starter Acceleration" : budgetTier === 2 ? "Growth Scaling (Rekomendasi)" : "Market Leader Expansion"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { tier: 1, label: "Starter", desc: "Fondasi Pertumbuhan" },
                  { tier: 2, label: "Growth", desc: "Optimal (Rekomendasi)" },
                  { tier: 3, label: "Scale", desc: "Akselerasi Maksimal" },
                ].map((item) => (
                  <button
                    key={item.tier}
                    onClick={() => setBudgetTier(item.tier)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      budgetTier === item.tier
                        ? "bg-gradient-to-br from-solaki-green/20 to-solaki-card border-solaki-green text-white shadow-md"
                        : "bg-solaki-card/50 border-solaki-border/50 text-solaki-muted hover:text-white"
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-bold">{item.label}</p>
                    <p className="text-[10px] text-solaki-muted font-inter mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Live Simulation Result */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 bento-card p-6 sm:p-8 bg-gradient-to-br from-solaki-dark to-solaki-black border-2 border-solaki-green/40 shadow-2xl relative overflow-hidden"
          >
            {/* Live Indicator */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-solaki-border/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-solaki-green animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">Hasil Analisis Diagnostik</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-solaki-green/20 text-solaki-green border border-solaki-green/30">
                Blueprint Siap
              </span>
            </div>

            {/* Projected Metrics */}
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-2xl bg-solaki-card/80 border border-solaki-border/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-solaki-muted font-inter">Estimasi Jangkauan Bulanan</span>
                  <TrendingUp className="w-4 h-4 text-solaki-green" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white">{getEstimatedReach()} <span className="text-xs font-normal text-solaki-muted">Audience Accounts</span></p>
                <p className="text-[11px] text-solaki-green font-inter mt-1">+350% potensi eksposur dari baseline awal</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-solaki-card/80 border border-solaki-border/60">
                  <p className="text-xs text-solaki-muted font-inter mb-0.5">Target ROAS Iklan</p>
                  <p className="text-xl font-extrabold text-solaki-coral">{getEstimatedROAS()}</p>
                  <p className="text-[10px] text-solaki-muted font-inter mt-0.5">Benchmark industri teruji</p>
                </div>
                <div className="p-3.5 rounded-xl bg-solaki-card/80 border border-solaki-border/60">
                  <p className="text-xs text-solaki-muted font-inter mb-0.5">Output Konten</p>
                  <p className="text-xl font-extrabold text-solaki-green">30+ Aset / Bln</p>
                  <p className="text-[10px] text-solaki-muted font-inter mt-0.5">Visual & Video High-Retention</p>
                </div>
              </div>

              {/* Strategy Recommended */}
              <div className="p-4 rounded-2xl bg-solaki-green/10 border border-solaki-green/25">
                <p className="text-xs font-bold text-solaki-green uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Rekomendasi Arah Strategi
                </p>
                <p className="text-xs sm:text-sm text-white font-semibold">
                  {selectedIndustry.contentFocus}
                </p>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => {
                const notesInput = document.getElementById("notes") as HTMLTextAreaElement | null;
                if (notesInput) {
                  notesInput.value = `Saya tertarik untuk berdiskusi mengenai strategi brand industri ${selectedIndustry.name}. Fokus prioritas: ${challenges.find(c => c.id === selectedChallenge)?.label}.`;
                }
                document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full btn-neon py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 group cursor-pointer shadow-lg"
            >
              Jadwalkan Konsultasi Strategis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-[11px] text-solaki-muted font-inter mt-2.5">
              Konsultasi Strategis Awal Tanpa Komitmen · Respon Tim Ahli 1×24 Jam
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
