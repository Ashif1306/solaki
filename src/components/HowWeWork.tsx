"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Map, Rocket, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Understand",
    subtitle: "Pahami Bisnis Anda",
    desc: "Kami mulai dengan memahami bisnis Anda secara mendalam, meliputi siapa target pasar, apa masalah utama, dan apa tujuan yang ingin dicapai.",
    color: "#dec83a",
    bg: "rgba(222,200,58,0.08)",
    border: "rgba(222,200,58,0.25)",
    details: ["Riset target pasar & kompetitor", "Audit aset digital yang ada", "Identifikasi masalah & peluang"],
  },
  {
    number: "02",
    icon: Map,
    title: "Strategize",
    subtitle: "Susun Strategi Tepat",
    desc: "Berdasarkan pemahaman mendalam tersebut, kami merancang strategi pemasaran digital yang disesuaikan dengan kondisi dan tujuan bisnis Anda.",
    color: "#dec83a",
    bg: "rgba(222,200,58,0.08)",
    border: "rgba(222,200,58,0.25)",
    details: ["Perancangan content pillars", "Kalender editorial bulanan", "Roadmap iklan digital"],
  },
  {
    number: "03",
    icon: Rocket,
    title: "Create & Execute",
    subtitle: "Produksi & Eksekusi",
    desc: "Kami memproduksi konten berkualitas dan menjalankan seluruh aktivitas media sosial maupun iklan sesuai strategi yang telah disepakati.",
    color: "#dec83a",
    bg: "rgba(222,200,58,0.08)",
    border: "rgba(222,200,58,0.25)",
    details: ["Produksi konten visual & video", "Pengelolaan & publikasi konten", "Setup dan run kampanye iklan"],
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Analyze & Grow",
    subtitle: "Evaluasi & Optimasi",
    desc: "Kami mengevaluasi performa secara berkala berdasarkan data nyata, kemudian mengoptimalkan strategi agar bisnis Anda terus berkembang.",
    color: "#dec83a",
    bg: "rgba(222,200,58,0.08)",
    border: "rgba(222,200,58,0.25)",
    details: ["Laporan performa berkala", "Analisis engagement & konversi", "Optimasi strategi berkelanjutan"],
  },
];

export default function HowWeWork() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      id="process"
      ref={sectionRef}
      className="pt-8 sm:pt-12 md:pt-14 pb-12 sm:pb-16 md:pb-20 relative overflow-hidden bg-solaki-surface"
    >
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="section-badge mb-3 sm:mb-3.5 inline-flex">
            <Rocket className="w-3 h-3" />
            Cara Kerja SOLAKI
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Proses Kerja{" "}
            <span className="gradient-text-teal">4 Tahap</span>
          </h2>
          <p className="text-solaki-muted text-lg max-w-2xl mx-auto font-inter leading-relaxed">
            Pendekatan sistematis kami memastikan setiap keputusan berangkat dari pemahaman yang nyata dan strategi yang tepat sasaran.
          </p>
        </motion.div>

        {/* Steps: desktop 4 columns, mobile stacked */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Connector line for desktop */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-full w-5 h-px z-10"
                  style={{ background: `${step.color}40` }}
                />
              )}

              <div
                className="bento-card p-6 h-full flex flex-col"
                style={{ borderColor: step.border }}
              >
                {/* Number + Icon */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: step.bg, border: `1px solid ${step.border}` }}
                  >
                    <step.icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                  <span
                    className="text-2xl font-black opacity-25"
                    style={{ color: step.color }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                <p className="text-xs font-semibold mb-3" style={{ color: step.color }}>
                  {step.subtitle}
                </p>

                {/* Desc */}
                <p className="text-xs text-solaki-muted font-inter leading-relaxed mb-5 flex-grow">
                  {step.desc}
                </p>

                {/* Details */}
                <ul className="space-y-1.5">
                  {step.details.map((d) => (
                    <li key={d} className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: step.color }}
                      />
                      <span className="text-[11px] font-inter text-solaki-subtle">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <motion.button
            onClick={() => document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Mulai Perjalanan Bersama SOLAKI
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <p className="text-solaki-subtle text-xs font-inter mt-3">
            Konsultasi awal gratis · Tanpa komitmen
          </p>
        </motion.div>
      </div>
    </section>
  );
}
