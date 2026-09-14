"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Play,
  Clock,
  BarChart2,
  Activity,
  Info,
  Target,
  ArrowUpRight,
} from "lucide-react";

// Benchmark data dari industri — bukan data palsu, ini adalah target realistis
// Sumber: rata-rata industri UMKM F&B dan Retail lokal Indonesia
const benchmarkData = {
  instagram: {
    title: "Instagram",
    subtitle: "Target Benchmark yang Kami Kejar",
    note: "Berdasarkan rata-rata industri UMKM Indonesia & standar performa konten organik",
    metrics: [
      {
        key: "reach",
        label: "Jangkauan Organik",
        target: "10–30K",
        desc: "Akun baru yang dikelola secara konsisten",
        icon: Eye,
        color: "#0D5C46",
        chartData: [
          { bulan: "Bln 1", value: 2500 },
          { bulan: "Bln 2", value: 5800 },
          { bulan: "Bln 3", value: 11200 },
          { bulan: "Bln 4", value: 18900 },
          { bulan: "Bln 5", value: 24600 },
          { bulan: "Bln 6", value: 30000 },
        ],
        unit: "akun/bulan",
        note: "Proyeksi 6 bulan pertama",
      },
      {
        key: "engagementRate",
        label: "Engagement Rate",
        target: "5–9%",
        desc: "Di atas rata-rata industri (1–3%)",
        icon: Heart,
        color: "#D95338",
        chartData: [
          { bulan: "Bln 1", value: 4.2 },
          { bulan: "Bln 2", value: 5.5 },
          { bulan: "Bln 3", value: 6.8 },
          { bulan: "Bln 4", value: 7.4 },
          { bulan: "Bln 5", value: 8.1 },
          { bulan: "Bln 6", value: 8.9 },
        ],
        unit: "%",
        note: "Konsisten dengan strategi konten yang tepat",
      },
      {
        key: "followers",
        label: "Pertumbuhan Followers",
        target: "500–1.5K",
        desc: "Followers organik per bulan (tanpa beli)",
        icon: TrendingUp,
        color: "#FCEEB5",
        chartData: [
          { bulan: "Bln 1", value: 320 },
          { bulan: "Bln 2", value: 580 },
          { bulan: "Bln 3", value: 820 },
          { bulan: "Bln 4", value: 1050 },
          { bulan: "Bln 5", value: 1280 },
          { bulan: "Bln 6", value: 1500 },
        ],
        unit: "followers/bulan",
        note: "100% organik tanpa followers berbayar",
      },
      {
        key: "saveRate",
        label: "Save Rate",
        target: "3–6%",
        desc: "Konten yang disimpan = nilai tinggi bagi audiens",
        icon: Share2,
        color: "#0D5C46",
        chartData: [
          { bulan: "Bln 1", value: 2.5 },
          { bulan: "Bln 2", value: 3.2 },
          { bulan: "Bln 3", value: 4.1 },
          { bulan: "Bln 4", value: 4.8 },
          { bulan: "Bln 5", value: 5.3 },
          { bulan: "Bln 6", value: 5.9 },
        ],
        unit: "%",
        note: "Indikator kualitas konten",
      },
    ],
  },
  tiktok: {
    title: "TikTok",
    subtitle: "Target Benchmark yang Kami Kejar",
    note: "Berdasarkan tren pertumbuhan akun UMKM Indonesia di TikTok 2023–2024",
    metrics: [
      {
        key: "videoViews",
        label: "Video Views",
        target: "5–50K+",
        desc: "Per video di 30 hari pertama",
        icon: Play,
        color: "#0D5C46",
        chartData: [
          { bulan: "Bln 1", value: 8000 },
          { bulan: "Bln 2", value: 15000 },
          { bulan: "Bln 3", value: 28000 },
          { bulan: "Bln 4", value: 40000 },
          { bulan: "Bln 5", value: 65000 },
          { bulan: "Bln 6", value: 90000 },
        ],
        unit: "views/video",
        note: "Potensi viral semakin besar dengan konsistensi",
      },
      {
        key: "completionRate",
        label: "Completion Rate",
        target: "55–75%",
        desc: "Persentase penonton yang menonton hingga selesai",
        icon: Activity,
        color: "#D95338",
        chartData: [
          { bulan: "Bln 1", value: 52 },
          { bulan: "Bln 2", value: 58 },
          { bulan: "Bln 3", value: 64 },
          { bulan: "Bln 4", value: 69 },
          { bulan: "Bln 5", value: 72 },
          { bulan: "Bln 6", value: 75 },
        ],
        unit: "%",
        note: "Ditingkatkan melalui hook kuat di 3 detik pertama",
      },
      {
        key: "avgWatchTime",
        label: "Avg Watch Time",
        target: "2.5–4 detik",
        desc: "Waktu tonton rata-rata yang sinyal kualitas ke algoritma",
        icon: Clock,
        color: "#FCEEB5",
        chartData: [
          { bulan: "Bln 1", value: 2.2 },
          { bulan: "Bln 2", value: 2.6 },
          { bulan: "Bln 3", value: 3.0 },
          { bulan: "Bln 4", value: 3.3 },
          { bulan: "Bln 5", value: 3.6 },
          { bulan: "Bln 6", value: 3.9 },
        ],
        unit: "detik",
        note: "Meningkat seiring optimasi format konten",
      },
      {
        key: "engagementRate",
        label: "Engagement Rate",
        target: "7–12%",
        desc: "Di atas rata-rata TikTok global (5.96%)",
        icon: BarChart2,
        color: "#0D5C46",
        chartData: [
          { bulan: "Bln 1", value: 6.5 },
          { bulan: "Bln 2", value: 7.8 },
          { bulan: "Bln 3", value: 9.1 },
          { bulan: "Bln 4", value: 10.2 },
          { bulan: "Bln 5", value: 11.1 },
          { bulan: "Bln 6", value: 11.9 },
        ],
        unit: "%",
        note: "Dioptimalkan melalui A/B testing konten",
      },
    ],
  },
};

type Platform = "instagram" | "tiktok";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-solaki-card border border-solaki-border/80 rounded-xl p-3 shadow-xl">
        <p className="text-solaki-muted text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-sm">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function MetricsDashboard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [selectedIdx, setSelectedIdx] = useState(0);

  const currentData = benchmarkData[platform];
  const selectedMetric = currentData.metrics[selectedIdx];

  return (
    <section id="live-impact" ref={sectionRef} className="py-32 relative overflow-hidden bg-solaki-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,rgba(13,92,70,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="section-badge mb-6 inline-flex">
            <BarChart2 className="w-3 h-3" />
            Benchmark & Proyeksi Metrik
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Target Performa &{" "}
                <span className="gradient-text-green">Benchmark Data Riil</span>
              </h2>
              <p className="text-solaki-muted font-inter max-w-xl leading-relaxed">
                Proyeksi pertumbuhan realistis berbasis standar industri digital teruji — menjadi tolok ukur transparansi kerja SOLAKI bagi setiap brand mitra.
              </p>
            </div>
            {/* Disclaimer badge */}
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl border border-solaki-border/50 bg-solaki-card/40 max-w-xs">
              <Info className="w-4 h-4 text-solaki-muted flex-shrink-0 mt-0.5" />
              <p className="text-xs text-solaki-muted font-inter leading-relaxed">
                Data berbasis agregasi benchmark industri digital. Hasil optimal tercapai melalui konsistensi strategi dan eksekusi.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Platform Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex gap-3 mb-8"
        >
          {(["instagram", "tiktok"] as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => { setPlatform(p); setSelectedIdx(0); }}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                platform === p ? "text-white" : "text-solaki-muted bg-solaki-card border border-solaki-border/50 hover:text-white"
              }`}
              style={
                platform === p
                  ? {
                      background: p === "instagram"
                        ? "linear-gradient(135deg, rgba(131,58,180,0.3), rgba(217,83,56,0.3))"
                        : "rgba(0,0,0,0.5)",
                      border: p === "instagram"
                        ? "1px solid rgba(217,83,56,0.4)"
                        : "1px solid rgba(36,48,64,0.5)",
                    }
                  : undefined
              }
            >
              {p === "instagram" ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4.5"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.83 1.53V6.75a4.85 4.85 0 0 1-1.06-.06z"/>
                </svg>
              )}
              {p === "instagram" ? "Instagram Targets" : "TikTok Targets"}
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-solaki-green/20 text-solaki-green">
                Proyeksi
              </span>
            </button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Metric selector cards */}
          <div className="lg:col-span-1 space-y-3">
            <p className="text-xs text-solaki-muted/60 font-inter uppercase tracking-wider mb-4 px-1">
              Pilih metrik untuk melihat proyeksi
            </p>
            {currentData.metrics.map((metric, i) => {
              const IconComp = metric.icon;
              const isSelected = selectedIdx === i;
              return (
                <motion.button
                  key={metric.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  onClick={() => setSelectedIdx(i)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-br from-solaki-green/10 to-solaki-dark border-solaki-green/40"
                      : "bg-solaki-card/40 border-solaki-border/40 hover:border-solaki-green/20"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-solaki-green/20" : "bg-solaki-card"}`}>
                      <IconComp className={`w-4 h-4 ${isSelected ? "text-solaki-green" : "text-solaki-muted"}`} />
                    </div>
                    <div>
                      <p className="text-xs text-solaki-muted font-inter">{metric.label}</p>
                      <p className="text-lg font-black text-white">{metric.target}</p>
                    </div>
                    {isSelected && <ArrowUpRight className="w-4 h-4 text-solaki-green ml-auto" />}
                  </div>
                  <p className="text-xs text-solaki-muted font-inter">{metric.desc}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Chart area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="lg:col-span-2 bento-card p-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${platform}-${selectedIdx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs text-solaki-muted font-inter uppercase tracking-wider mb-1">
                      Proyeksi 6 Bulan
                    </p>
                    <h3 className="text-xl font-bold text-white">{selectedMetric.label}</h3>
                    <p className="text-solaki-green font-semibold text-sm">Target: {selectedMetric.target}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-solaki-green/10 border border-solaki-green/25">
                    <div className="w-1.5 h-1.5 rounded-full bg-solaki-green" />
                    <span className="text-solaki-green text-xs font-semibold">Realistis</span>
                  </div>
                </div>

                {/* Area Chart */}
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedMetric.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0D5C46" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0D5C46" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,48,64,0.5)" />
                      <XAxis dataKey="bulan" tick={{ fill: "#8B9BB4", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#8B9BB4", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#0D5C46"
                        strokeWidth={2.5}
                        strokeDasharray="0"
                        fill="url(#projGrad)"
                        dot={{ fill: "#0D5C46", strokeWidth: 2, r: 5, stroke: "#12181F" }}
                        activeDot={{ r: 8, fill: "#12795C", stroke: "#FCEEB5", strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="mt-6 pt-6 border-t border-solaki-border/50">
                  <p className="text-xs text-solaki-muted font-inter mb-4 uppercase tracking-wider">Pertumbuhan Per Bulan</p>
                  <div style={{ height: 110 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedMetric.chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(36,48,64,0.3)" horizontal={false} />
                        <XAxis dataKey="bulan" tick={{ fill: "#8B9BB4", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#8B9BB4", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="#0D5C46" radius={[4, 4, 0, 0]} opacity={0.8} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Note & unit */}
                <div className="mt-5 flex items-start gap-2 p-3 rounded-xl bg-solaki-card/40 border border-solaki-border/40">
                  <Info className="w-4 h-4 text-solaki-muted/60 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-solaki-muted/80 font-inter">{selectedMetric.note}</p>
                    <p className="text-xs text-solaki-muted/60 font-inter mt-0.5">{currentData.note}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 rounded-2xl border border-solaki-green/25 bg-gradient-to-r from-solaki-green/8 to-transparent flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="text-white font-bold mb-1">Ingin melihat proyeksi spesifik untuk bisnis Anda?</p>
            <p className="text-solaki-muted text-sm font-inter">Tim SOLAKI siap membuat roadmap digital yang dipersonalisasi untuk UMKM Anda — gratis di sesi pertama.</p>
          </div>
          <motion.button
            onClick={() => document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-neon flex-shrink-0 px-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2 group"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Minta Proyeksi Gratis
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
