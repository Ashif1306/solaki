"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Rocket,
  CheckCircle2,
  ArrowRight,
  Layers,
  Video,
  BarChart3,
  Users,
  FileText,
  Zap,
  ShieldCheck,
  Cpu,
  Target,
  Sparkles,
  LineChart,
} from "lucide-react";

// Deliverables teknis yang kami eksekusi
const deliverables = [
  {
    icon: FileText,
    title: "Riset Pasar & Kalender Editorial",
    desc: "Pemetaan persona audiens, riset kata kunci dan tren kompetitor, serta perancangan kalender konten terstruktur 30 hari ke depan.",
    tag: "Intelligence",
    color: "#0D5C46",
    bg: "rgba(13,92,70,0.12)",
  },
  {
    icon: Layers,
    title: "Produksi Aset Visual & Template Brand",
    desc: "Desain grafis presisi tinggi — micro-graphics, carousel edukatif, feed visual identity, dan guideline tipografi yang konsisten.",
    tag: "Creative",
    color: "#D95338",
    bg: "rgba(217,83,56,0.12)",
  },
  {
    icon: Video,
    title: "Short-Form Video Engineering",
    desc: "Produksi video TikTok & Reels berorientasi retensi dengan formulasi hook 3 detik pertama, dynamic pacing, dan subtitling profesional.",
    tag: "Video",
    color: "#FCEEB5",
    bg: "rgba(252,238,181,0.1)",
  },
  {
    icon: Users,
    title: "Optimasi Profil & Community Nurturing",
    desc: "Restrukturisasi bio, CTA button, katalog produk, highlight terarah, serta playbook responsif untuk interaksi audiens.",
    tag: "Conversion",
    color: "#0D5C46",
    bg: "rgba(13,92,70,0.12)",
  },
  {
    icon: BarChart3,
    title: "Pelacakan Metrik & Analitik Mingguan",
    desc: "Pemantauan KPI performa: Reach, Engagement Rate, Click-Through Rate (CTR), dan Customer Acquisition Cost (CAC) secara transparan.",
    tag: "Analytics",
    color: "#D95338",
    bg: "rgba(217,83,56,0.12)",
  },
  {
    icon: Zap,
    title: "Arsitektur Iklan Meta & TikTok Ads",
    desc: "Setup Pixel tracking, segmentasi Custom Audience, pembuatan Lookalike Audience, dan optimasi penawaran untuk konversi maksimal.",
    tag: "Ads Engine",
    color: "#FCEEB5",
    bg: "rgba(252,238,181,0.1)",
  },
];

// Standar keunggulan teknis
const technicalPillars = [
  {
    icon: Cpu,
    title: "Full-Funnel Marketing Architecture",
    desc: "Menghubungkan setiap tahap perjalanan konsumen dari Top-of-Funnel (awareness), Middle (nurturing), hingga Bottom (conversion).",
    highlight: true,
  },
  {
    icon: Target,
    title: "Data-Driven Creative Formulation",
    desc: "Setiap konten dirancang berdasarkan analisis retensi visual, heat-map tren, dan pengujian hipotesis (A/B testing) berkala.",
    highlight: true,
  },
  {
    icon: LineChart,
    title: "Transparent Attribution & Reporting",
    desc: "Laporan analitik data mingguan tanpa metrik semu (vanity metrics) — fokus pada pertumbuhan engagement dan efisiensi konversi.",
    highlight: false,
  },
  {
    icon: ShieldCheck,
    title: "Standardized Digital Asset SOP",
    desc: "Semua template desain, dokumen strategi, dan panduan komunikasi diserahkan rapi untuk keberlanjutan operasional mandiri.",
    highlight: false,
  },
];

// 3-Phase Implementation Framework
const roadmapMonths = [
  {
    month: "Fase 01",
    title: "Audit, Tracking & Brand Architecture",
    items: [
      "Audit komprehensif aset digital & analisis kompetitor",
      "Perumusan brand guidelines & template visual identity",
      "Setup tracking pixel, konversi akun, & bio optimization",
      "Peluncuran 30 batch konten pertama & content pillar",
    ],
    color: "#0D5C46",
  },
  {
    month: "Fase 02",
    title: "Creative Production & Organic Distribution",
    items: [
      "Produksi berkesinambungan video Reels/TikTok dengan hook teruji",
      "Optimasi interaksi & playbook manajemen komunitas",
      "A/B testing copywriting penawaran & format carousel",
      "Review analitik data retensi & performa konten bulanan",
    ],
    color: "#D95338",
  },
  {
    month: "Fase 03",
    title: "Paid Scaling, Retargeting & Optimization",
    items: [
      "Implementasi kampanye iklan berbayar Meta/TikTok Ads",
      "Setup retargeting audiens hangat & lookalike segment",
      "Optimasi conversion rate & efisiensi biaya akuisisi",
      "Penyusunan laporan akhir komprehensif & penyerahan SOP",
    ],
    color: "#FCEEB5",
  },
];

export default function PartnerShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeMonth, setActiveMonth] = useState(0);

  return (
    <section id="program-mitra" ref={sectionRef} className="py-32 relative overflow-hidden bg-solaki-dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_50%,rgba(217,83,56,0.07)_0%,transparent_70%)]" />
      <div className="absolute inset-0 grid-bg opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-6"
        >
          <span className="section-badge mb-6 inline-flex">
            <Cpu className="w-3.5 h-3.5" />
            Technical Execution & Growth Pipeline
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Arsitektur Eksekusi Digital{" "}
            <span className="gradient-text-coral">End-to-End</span>
          </h2>
          <p className="text-solaki-muted text-lg max-w-2xl mx-auto font-inter leading-relaxed">
            Standar operasional terstruktur untuk mengelola seluruh siklus pemasaran digital:
            dari riset analitik, rekayasa konten kreatif, distribusi berkesinambungan, hingga optimasi konversi.
          </p>
        </motion.div>

        {/* Tech Stack Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-8 py-4 rounded-2xl border border-solaki-green/30 bg-solaki-green/8 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-solaki-green animate-ping" />
              <p className="text-xs text-white font-semibold uppercase tracking-wider">Tech Ecosystem</p>
            </div>
            <div className="hidden sm:block h-6 w-px bg-solaki-border/60" />
            <div className="flex flex-wrap items-center gap-3 text-xs text-solaki-muted font-inter">
              <span className="px-2.5 py-1 rounded-lg bg-solaki-card border border-solaki-border/40 text-white font-mono">Meta Business Suite</span>
              <span className="px-2.5 py-1 rounded-lg bg-solaki-card border border-solaki-border/40 text-white font-mono">TikTok Ads Manager</span>
              <span className="px-2.5 py-1 rounded-lg bg-solaki-card border border-solaki-border/40 text-white font-mono">Creative Suite</span>
              <span className="px-2.5 py-1 rounded-lg bg-solaki-card border border-solaki-border/40 text-white font-mono">Analytics Dashboard</span>
            </div>
          </div>
        </motion.div>

        {/* Deliverables Grid */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-center text-sm font-bold text-solaki-muted uppercase tracking-widest mb-10"
          >
            Spesifikasi Deliverables & Output Kerja
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {deliverables.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bento-card p-6 group cursor-default"
                style={{ borderColor: `${item.color}20` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: item.bg, border: `1px solid ${item.color}30` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{ background: item.bg, color: item.color }}
                  >
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2 group-hover:text-solaki-cream transition-colors">
                  {item.title}
                </h4>
                <p className="text-solaki-muted text-sm font-inter leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3-Phase Implementation Framework */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-center text-sm font-bold text-solaki-muted uppercase tracking-widest mb-10"
          >
            Siklus Implementasi 3 Fase
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45 }}
            className="flex justify-center gap-3 mb-8"
          >
            {roadmapMonths.map((m, i) => (
              <button
                key={i}
                onClick={() => setActiveMonth(i)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeMonth === i ? "text-white" : "text-solaki-muted bg-solaki-card border border-solaki-border/50"
                }`}
                style={
                  activeMonth === i
                    ? { background: `${m.color}20`, border: `1px solid ${m.color}40`, color: m.color }
                    : undefined
                }
              >
                {m.month}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeMonth}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="bento-card p-8 max-w-2xl mx-auto"
              style={{ borderColor: `${roadmapMonths[activeMonth].color}30` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black"
                  style={{
                    background: `${roadmapMonths[activeMonth].color}20`,
                    color: roadmapMonths[activeMonth].color,
                    border: `1px solid ${roadmapMonths[activeMonth].color}40`,
                  }}
                >
                  0{activeMonth + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: roadmapMonths[activeMonth].color }}>
                    {roadmapMonths[activeMonth].month}
                  </p>
                  <h4 className="text-xl font-bold text-white">{roadmapMonths[activeMonth].title}</h4>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {roadmapMonths[activeMonth].items.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: `${roadmapMonths[activeMonth].color}08` }}
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: roadmapMonths[activeMonth].color }} />
                    <span className="text-sm text-white font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Technical Standards */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="text-center text-sm font-bold text-solaki-muted uppercase tracking-widest mb-10"
          >
            Standar Kualitas & Metodologi Eksekusi
          </motion.h3>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {technicalPillars.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`bento-card p-6 flex gap-5 ${item.highlight ? "border-solaki-coral/40" : ""}`}
                style={item.highlight ? { boxShadow: "0 0 30px rgba(217,83,56,0.12)" } : undefined}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: item.highlight ? "rgba(217,83,56,0.15)" : "rgba(13,92,70,0.12)",
                    border: `1px solid ${item.highlight ? "rgba(217,83,56,0.35)" : "rgba(13,92,70,0.3)"}`,
                  }}
                >
                  <item.icon
                    className="w-6 h-6"
                    style={{ color: item.highlight ? "#D95338" : "#0D5C46" }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    {item.highlight && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-solaki-coral/15 text-solaki-coral border border-solaki-coral/25 font-semibold">
                        ★ Core Stack
                      </span>
                    )}
                  </div>
                  <p className="text-solaki-muted text-sm font-inter leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            className="text-center mt-10"
          >
            <motion.button
              onClick={() => document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-neon inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mulai Konsultasi Strategi Pertumbuhan
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <p className="text-solaki-muted text-sm font-inter mt-3">
              Comprehensive Digital Audit · Benchmarking Kompetitor · Roadmap Pertumbuhan Strategis
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
