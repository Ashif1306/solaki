"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, UtensilsCrossed, Shirt, Sparkles, Briefcase, Store, ArrowRight } from "lucide-react";

const targetClients = [
  {
    icon: UtensilsCrossed,
    label: "Kuliner & F&B",
    desc: "Restoran, cafe, warung makan, katering, brand minuman",
    color: "#D95338",
    bg: "rgba(217,83,56,0.08)",
    border: "rgba(217,83,56,0.2)",
  },
  {
    icon: Shirt,
    label: "Fashion & Retail",
    desc: "Clothing brand, butik, toko pakaian, aksesoris",
    color: "#0D5C46",
    bg: "rgba(13,92,70,0.08)",
    border: "rgba(13,92,70,0.2)",
  },
  {
    icon: Sparkles,
    label: "Beauty & Lifestyle",
    desc: "Skincare, kosmetik, salon, klinik kecantikan, wellness",
    color: "#9333EA",
    bg: "rgba(147,51,234,0.08)",
    border: "rgba(147,51,234,0.2)",
  },
  {
    icon: Briefcase,
    label: "Bisnis Jasa",
    desc: "Jasa desain, konsultan, pendidikan, properti, hukum",
    color: "#4F46E5",
    bg: "rgba(79,70,229,0.08)",
    border: "rgba(79,70,229,0.2)",
  },
  {
    icon: Store,
    label: "Brand Lokal",
    desc: "Brand yang baru berkembang dan ingin memperkuat identitas digital",
    color: "#D97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.2)",
  },
  {
    icon: Users,
    label: "UMKM Lainnya",
    desc: "Bisnis apapun yang ingin tumbuh melalui pemasaran digital",
    color: "#0D5C46",
    bg: "rgba(13,92,70,0.08)",
    border: "rgba(13,92,70,0.2)",
  },
];

const clientProblems = [
  "Kesulitan menjalankan pemasaran digital secara efektif",
  "Membutuhkan konten menarik yang relevan dengan target pasar",
  "Perlu strategi yang tepat dalam mengelola media sosial & iklan",
  "Belum memiliki sumber daya untuk tim digital marketing sendiri",
];

export default function TargetClients() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      id="target-clients"
      ref={sectionRef}
      className="pt-6 sm:pt-10 pb-20 sm:pb-28 relative overflow-hidden bg-solaki-bg"
    >
      <div className="absolute inset-0 dot-bg opacity-40" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={false}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-6 inline-flex">
            <Users className="w-3 h-3" />
            Target Klien SOLAKI
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Siapa yang Kami{" "}
            <span className="gradient-text-teal">Bantu?</span>
          </h2>
          <p className="text-solaki-muted text-lg max-w-2xl mx-auto font-inter leading-relaxed">
            SOLAKI fokus pada pemilik bisnis lokal dan UMKM yang ingin masuk atau mengoptimalkan pemasaran digital, namun memiliki keterbatasan anggaran atau sumber daya.
          </p>
        </motion.div>

        {/* Problem callout */}
        <motion.div
          initial={false}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-14"
        >
          <div className="bento-card p-7 max-w-3xl mx-auto" style={{ borderColor: "rgba(13,92,70,0.25)" }}>
            <p className="text-sm font-bold text-solaki-teal uppercase tracking-widest mb-4">
              Masalah yang Kami Selesaikan
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {clientProblems.map((problem, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-solaki-teal flex-shrink-0 mt-2" />
                  <p className="text-sm font-inter text-solaki-muted leading-relaxed">{problem}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Client categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {targetClients.map((client, i) => (
            <motion.div
              key={client.label}
              initial={false}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <div
                className="bento-card p-5 flex items-start gap-4"
                style={{ borderColor: client.border }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: client.bg, border: `1px solid ${client.border}` }}
                >
                  <client.icon className="w-5 h-5" style={{ color: client.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{client.label}</h3>
                  <p className="text-xs text-solaki-muted font-inter leading-relaxed">{client.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Value proposition */}
        <motion.div
          initial={false}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {[
            { word: "Understand", desc: "Memahami karakter & kebutuhan bisnis Anda secara mendalam" },
            { word: "Customize", desc: "Strategi yang disesuaikan dengan kondisi bisnis Anda" },
            { word: "Grow", desc: "Pertumbuhan berkelanjutan melalui evaluasi berbasis data" },
          ].map((val, i) => (
            <motion.div
              key={val.word}
              initial={false}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.7 + i * 0.08 }}
              className="bento-card p-5 text-center"
            >
              <div className="text-base font-black text-solaki-teal mb-2">{val.word}</div>
              <p className="text-xs text-solaki-muted font-inter leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={false}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="text-center mt-10"
        >
          <motion.button
            onClick={() => document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary mx-auto"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Apakah Ini Bisnis Anda? Hubungi Kami
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
