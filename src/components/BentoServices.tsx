"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PenTool, Share2, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";

const services = [
  {
    id: "content",
    order: "01",
    icon: PenTool,
    title: "Content Creator",
    subtitle: "Konten yang Bicara ke Audiens",
    description:
      "Merancang konten visual dan tulisan yang menarik, relevan, dan konsisten dengan identitas brand Anda — mulai dari desain grafis, carousel, caption, hingga short-form video.",
    features: [
      "Desain grafis & template brand",
      "Copywriting & caption strategy",
      "Short-form video (Reels & TikTok)",
      "Kalender konten editorial 30 hari",
      "Konsistensi visual & brand voice",
    ],
    color: "#0D5C46",
    bg: "rgba(13,92,70,0.08)",
    border: "rgba(13,92,70,0.2)",
    glow: "rgba(13,92,70,0.12)",
  },
  {
    id: "socmed",
    order: "02",
    icon: Share2,
    title: "Social Media Management",
    subtitle: "Kehadiran Digital yang Konsisten",
    description:
      "Mengelola media sosial dari perencanaan konten hingga interaksi langsung dengan audiens — memastikan brand Anda aktif, relevan, dan membangun komunitas yang loyal.",
    features: [
      "Perencanaan & penjadwalan konten",
      "Pengelolaan Instagram, TikTok, Facebook",
      "Interaksi komunitas & respons DM/komentar",
      "Optimasi profil & bio",
      "Laporan performa bulanan",
    ],
    color: "#D95338",
    bg: "rgba(217,83,56,0.08)",
    border: "rgba(217,83,56,0.2)",
    glow: "rgba(217,83,56,0.10)",
  },
  {
    id: "ads",
    order: "03",
    icon: TrendingUp,
    title: "Digital Advertising",
    subtitle: "Iklan yang Menghasilkan Konversi",
    description:
      "Menjalankan dan mengoptimalkan kampanye iklan berbayar di Meta (Instagram & Facebook) dan TikTok Ads — dengan target audiens yang presisi dan fokus pada hasil nyata.",
    features: [
      "Setup & manajemen Meta Ads",
      "Setup & manajemen TikTok Ads",
      "Targeting audience & lookalike",
      "A/B testing iklan & kreatif",
      "Laporan konversi & efisiensi iklan",
    ],
    color: "#4F46E5",
    bg: "rgba(79,70,229,0.08)",
    border: "rgba(79,70,229,0.2)",
    glow: "rgba(79,70,229,0.10)",
  },
];

export default function BentoServices() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const scrollToContact = () => {
    document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-28 relative overflow-hidden bg-solaki-bg"
    >
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-6 inline-flex">
            <PenTool className="w-3 h-3" />
            Layanan SOLAKI
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Solusi Digital{" "}
            <span className="gradient-text-teal">Lengkap & Terintegrasi</span>
          </h2>
          <p className="text-solaki-muted text-lg max-w-2xl mx-auto font-inter leading-relaxed">
            Tiga layanan utama yang kami hadirkan untuk membantu bisnis Anda hadir, relevan, dan berkembang di dunia digital.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="group"
            >
              <div
                className="bento-card p-7 h-full flex flex-col"
                style={{ borderColor: svc.border }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: svc.bg, border: `1px solid ${svc.border}` }}
                  >
                    <svc.icon className="w-7 h-7" style={{ color: svc.color }} />
                  </div>
                  <span
                    className="text-4xl font-black opacity-20 select-none"
                    style={{ color: svc.color }}
                  >
                    {svc.order}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-1">{svc.title}</h3>
                <p className="text-sm font-semibold mb-4" style={{ color: svc.color }}>
                  {svc.subtitle}
                </p>

                {/* Description */}
                <p className="text-solaki-muted text-sm font-inter leading-relaxed mb-6 flex-grow">
                  {svc.description}
                </p>

                {/* Divider */}
                <div className="h-px mb-5" style={{ background: svc.border }} />

                {/* Features */}
                <ul className="space-y-2.5 mb-7">
                  {svc.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: svc.color }}
                      />
                      <span className="text-xs font-inter text-solaki-muted">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  onClick={scrollToContact}
                  className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 group/btn transition-all duration-300 cursor-pointer"
                  style={{
                    background: svc.bg,
                    color: svc.color,
                    border: `1px solid ${svc.border}`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Tanya Harga
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center bento-card p-6 max-w-2xl mx-auto"
        >
          <p className="text-solaki-muted text-sm font-inter">
            💬{" "}
            <span className="text-white font-semibold">
              Butuh lebih dari satu layanan?
            </span>{" "}
            Kami siap berkolaborasi secara fleksibel sesuai dengan kebutuhan dan visi perkembangan bisnis Anda.{" "}
            <button
              onClick={scrollToContact}
              className="text-solaki-teal underline underline-offset-2 hover:text-solaki-glow transition-colors font-semibold cursor-pointer"
            >
              Diskusikan dengan kami →
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
