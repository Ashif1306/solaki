"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Star, Zap, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 30,
    suffix: "+",
    label: "Klien Aktif",
    sub: "Bisnis lokal yang kami dampingi",
    color: "#0D5C46",
    bg: "rgba(13,92,70,0.08)",
    border: "rgba(13,92,70,0.2)",
    glow: "rgba(13,92,70,0.35)",
  },
  {
    icon: Star,
    value: 98,
    suffix: "%",
    label: "Kepuasan Klien",
    sub: "Berdasarkan feedback yang kami terima",
    color: "#D95338",
    bg: "rgba(217,83,56,0.08)",
    border: "rgba(217,83,56,0.2)",
    glow: "rgba(217,83,56,0.35)",
  },
  {
    icon: Zap,
    value: 3,
    suffix: "x",
    label: "Rata-rata ROAS",
    sub: "Return on ad spend rata-rata klien",
    color: "#4F46E5",
    bg: "rgba(79,70,229,0.08)",
    border: "rgba(79,70,229,0.2)",
    glow: "rgba(79,70,229,0.35)",
  },
  {
    icon: TrendingUp,
    value: 200,
    suffix: "+",
    label: "Konten Diproduksi",
    sub: "Konten kreatif yang telah kami buat",
    color: "#D97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.2)",
    glow: "rgba(217,119,6,0.35)",
  },
];

function AnimatedNumber({
  target,
  suffix,
  isInView,
}: {
  target: number;
  suffix: string;
  isInView: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isInView || startedRef.current) return;
    startedRef.current = true;

    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <span>
      {current}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden bg-solaki-bg"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(13,92,70,0.06)_0%,transparent_70%)]" />

      {/* Animated glowing orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(13,92,70,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(217,83,56,0.06) 0%, transparent 70%)" }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-4 inline-flex">
            <TrendingUp className="w-3 h-3" />
            Angka yang Berbicara
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mt-4">
            Dampak Nyata untuk{" "}
            <span className="gradient-text-teal">Bisnis Lokal</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: i * 0.1,
                duration: 0.7,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <div
                className="bento-card p-6 md:p-7 flex flex-col items-center text-center relative group"
                style={{ borderColor: stat.border }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `0 0 40px ${stat.glow}` }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: stat.bg,
                    border: `1px solid ${stat.border}`,
                  }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>

                {/* Number */}
                <div
                  className="text-4xl md:text-5xl font-black mb-2 tabular-nums"
                  style={{ color: stat.color }}
                >
                  <AnimatedNumber
                    target={stat.value}
                    suffix={stat.suffix}
                    isInView={isInView}
                  />
                </div>

                {/* Label */}
                <p className="text-sm font-bold text-white mb-1">{stat.label}</p>
                <p className="text-xs text-solaki-muted font-inter leading-relaxed">
                  {stat.sub}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-3/4 transition-all duration-500 rounded-full"
                  style={{ background: stat.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
