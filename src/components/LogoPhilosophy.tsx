"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { Sparkles, Layers, Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type LogoPart = "all" | "s" | "o" | "l";

interface PartInfo {
  id: LogoPart;
  title: string;
  badge: string;
  headline: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
  glowColorDark: string;
  glowColorLight: string;
  textColorDark: string;
  textColorLight: string;
}

const SEQUENCE: LogoPart[] = ["all", "s", "o", "l"];

const partsData: Record<LogoPart, PartInfo> = {
  all: {
    id: "all",
    title: "Logo Utuh SOLAKI",
    badge: "Filosofi Kesatuan Tiga Simbol",
    headline: "Solusi Agensi Kreatif dan Inovasi Digital",
    subtitle: "Harmoni Sempurna Antara Strategi, Kreativitas, dan Teknologi",
    description:
      "Logo SOLAKI merupakan integrasi organik dari tiga simbol utama: S, L, dan O yang saling mengunci dan mengalir tanpa batas. Sebuah simbol bahwa agensi kami hadir mendampingi bisnis Anda secara menyeluruh.",
    image: "/logo_solaki/solaki_full.png",
    color: "#0D5C46",
    glowColorDark: "rgba(13,92,70,0.6)",
    glowColorLight: "rgba(13,92,70,0.2)",
    textColorDark: "#2DD4BF",
    textColorLight: "#0D5C46",
  },
  s: {
    id: "s",
    title: "Huruf S",
    badge: "Elemen Pertama",
    headline: "Solusi",
    subtitle: "Aliran Solusi Digital yang Tepat Sasaran",
    description:
      'Membentuk huruf S yang merepresentasikan "Solusi" — komitmen SOLAKI menghadirkan solusi digital yang mengalir fleksibel dan menjawab kebutuhan spesifik setiap klien secara tepat.',
    image: "/logo_solaki/solaki_s.png",
    color: "#0D5C46",
    glowColorDark: "rgba(13,92,70,0.7)",
    glowColorLight: "rgba(13,92,70,0.25)",
    textColorDark: "#2DD4BF",
    textColorLight: "#0D5C46",
  },
  o: {
    id: "o",
    title: "Huruf O",
    badge: "Elemen Kedua",
    headline: "Inovasi Digital",
    subtitle: "Siklus Pembaharuan Berkelanjutan",
    description:
      'Membentuk huruf O yang merepresentasikan "Inovasi Digital" — siklus inovasi yang terus berputar, beradaptasi, dan berkembang mengikuti dinamika transformasi dunia digital.',
    image: "/logo_solaki/solaki_o.png",
    color: "#10B981",
    glowColorDark: "rgba(16,185,129,0.65)",
    glowColorLight: "rgba(16,185,129,0.25)",
    textColorDark: "#34D399",
    textColorLight: "#047857",
  },
  l: {
    id: "l",
    title: "Huruf L",
    badge: "Elemen Ketiga",
    headline: "Agensi Kreatif",
    subtitle: "Simbol Keterhubungan (Link) & Kemitraan",
    description:
      'Membentuk huruf L yang merepresentasikan "Agensi Kreatif" — simbol keterhubungan (link) erat antara agensi dan klien dalam setiap layanan kreatif dan desain visual yang dihadirkan.',
    image: "/logo_solaki/solaki_l.png",
    color: "#D95338",
    glowColorDark: "rgba(217,83,56,0.65)",
    glowColorLight: "rgba(217,83,56,0.25)",
    textColorDark: "#FB7185",
    textColorLight: "#C2410C",
  },
};

export default function LogoPhilosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.25 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const activePart = SEQUENCE[stepIndex];
  const current = partsData[activePart];

  const activeTextColor = isDark ? current.textColorDark : current.textColorLight;
  const activeGlowColor = isDark ? current.glowColorDark : current.glowColorLight;

  const stepDuration = activePart === "all" ? 6000 : 4800;

  // Auto-cycle through the sequence when in view and playing
  useEffect(() => {
    if (!isPlaying || !isInView) return;

    const timer = setTimeout(() => {
      setStepIndex((prev) => (prev + 1) % SEQUENCE.length);
    }, stepDuration);

    return () => clearTimeout(timer);
  }, [isPlaying, isInView, stepIndex, stepDuration]);

  const handleSelect = (idx: number) => {
    setIsPlaying(false);
    setStepIndex(idx);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setStepIndex((stepIndex + 1) % SEQUENCE.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setStepIndex((stepIndex - 1 + SEQUENCE.length) % SEQUENCE.length);
  };

  return (
    <section ref={containerRef} className="relative py-2 sm:py-6 md:py-8">
      {/* ── Ambient Radial Studio Glow ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            background: `radial-gradient(ellipse at 35% 50%, ${activeGlowColor} 0%, transparent 65%)`,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[600px] pointer-events-none blur-3xl ${
            isDark ? "opacity-40" : "opacity-25"
          }`}
        />
      </div>

      {/* ── Section Header & Timeline Selector ── */}
      <motion.div
        initial={false}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center relative z-10 mb-4 sm:mb-8 md:mb-10"
      >
        <div className="section-badge mb-2 sm:mb-3 inline-flex items-center gap-1.5 sm:gap-2 text-xs py-1 px-3 sm:py-0.5 sm:px-2.5">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-solaki-teal animate-pulse" />
          <span>Filosofi & Makna Visual</span>
        </div>

        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight px-2">
          Makna di Balik <span className="gradient-text-teal">Bentuk SOLAKI</span>
        </h3>
        <p className="text-solaki-muted text-xs sm:text-sm md:text-base font-inter max-w-xl mx-auto mt-2 leading-relaxed px-4">
          Evolusi dan filosofi anatomi simbol huruf S, O, dan L yang menyatu membentuk visi digital kami.
        </p>

        {/* ── Auto-Play Controls & Switcher Pills ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6 px-2">
          {/* Pills Container */}
          <div className="inline-flex p-1 sm:p-1.5 rounded-full bg-white/[0.04] border border-solaki-border backdrop-blur-md gap-1 sm:gap-1.5 shadow-xl">
            {SEQUENCE.map((part, idx) => {
              const isActive = idx === stepIndex;
              return (
                <button
                  key={part}
                  onClick={() => handleSelect(idx)}
                  className={`relative px-3.5 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-1.5 sm:gap-2 z-10 min-h-[38px] sm:min-h-0 ${
                    isActive
                      ? "force-text-white font-extrabold"
                      : "text-solaki-muted hover:text-white"
                  }`}
                >
                  {/* Framer Motion Liquid Active Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-solaki-teal to-[#087355] shadow-lg shadow-solaki-teal/40 -z-10"
                    />
                  )}

                  {part === "all" ? (
                    <>
                      <Layers className="w-3.5 h-3.5" />
                      <span>SOLAKI</span>
                    </>
                  ) : part === "s" ? (
                    <span className="px-1 sm:px-1.5">S</span>
                  ) : part === "o" ? (
                    <span className="px-1 sm:px-1.5">O</span>
                  ) : (
                    <span className="px-1 sm:px-1.5">L</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 sm:p-1.5 rounded-full border border-solaki-border text-solaki-muted backdrop-blur-md shadow-xl">
            <button
              onClick={handlePrev}
              title="Elemen Sebelumnya"
              className="p-2 sm:p-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Jeda Otomatis" : "Putar Otomatis"}
              className="p-2 sm:p-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-solaki-teal" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={handleNext}
              title="Elemen Berikutnya"
              className="p-2 sm:p-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Main Showcase Canvas (Cardless & Seamless) ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-6 lg:gap-14 items-center">
          
          {/* ── Left: Interactive Framer-Motion Anatomy Stage ── */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center py-2 sm:py-0">
            <div className="relative w-64 h-64 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center select-none">
              
              {/* Studio Pedestal Disc with Deep Vignette (Consistent Dark Stage for #FFFFFF Logo Visibility) */}
              <div className="absolute inset-2 sm:inset-3 lg:inset-4 rounded-full bg-gradient-to-b from-[#161f2e] via-[#0d1420] to-[#060a12] border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl" />

              {/* Luminous Orbital Cosmic Rings */}
              <div className="absolute inset-0 rounded-full border border-white/[0.08] animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-3 sm:inset-6 rounded-full border border-dashed border-white/15 animate-[spin_90s_linear_infinite_reverse]" />
              <div className="absolute inset-6 sm:inset-12 rounded-full border border-white/[0.06]" />

              {/* ── ANIMATED LOGO CONTAINER (Smooth Unified Framer Motion) ── */}
              <div
                className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-60 md:h-60 lg:w-72 lg:h-72 flex items-center justify-center z-20 cursor-pointer group"
                onClick={handleNext}
                title="Klik untuk beralih ke elemen berikutnya"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePart}
                    initial={{ opacity: 0, scale: 0.85, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -6, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 140, damping: 18 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      <Image
                        src={current.image}
                        alt={current.title}
                        fill
                        priority
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                        style={{
                          filter: `drop-shadow(0 8px 20px rgba(0,0,0,0.95)) drop-shadow(0 0 20px ${activeGlowColor})`,
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Interactive Floating Badge Anchors around Stage (Guaranteed High Contrast in All Modes) ── */}
              <button
                onClick={() => handleSelect(1)}
                style={{
                  background: activePart === "s" ? "#FFFFFF" : "rgba(11, 16, 27, 0.92)",
                  border: activePart === "s" ? "1px solid #FFFFFF" : "1px solid rgba(255, 255, 255, 0.25)",
                  boxShadow: activePart === "s" ? "0 0 12px rgba(255,255,255,0.75)" : undefined,
                }}
                className={`absolute top-1 left-1 sm:top-3 sm:left-3 lg:top-4 lg:left-4 z-20 px-3 py-1.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-[11px] font-bold tracking-wide backdrop-blur-md transition-all duration-300 shadow-md min-h-[32px] sm:min-h-0 flex items-center ${
                  activePart === "s" ? "force-text-dark scale-105 sm:scale-110" : "force-text-light hover:force-text-white hover:border-white/60"
                }`}
              >
                S &bull; Solusi
              </button>

              <button
                onClick={() => handleSelect(2)}
                style={{
                  background: activePart === "o" ? "#FFFFFF" : "rgba(11, 16, 27, 0.92)",
                  border: activePart === "o" ? "1px solid #FFFFFF" : "1px solid rgba(255, 255, 255, 0.25)",
                  boxShadow: activePart === "o" ? "0 0 12px rgba(255,255,255,0.75)" : undefined,
                }}
                className={`absolute top-1 right-1 sm:top-3 sm:right-3 lg:top-4 lg:right-4 z-20 px-3 py-1.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-[11px] font-bold tracking-wide backdrop-blur-md transition-all duration-300 shadow-md min-h-[32px] sm:min-h-0 flex items-center ${
                  activePart === "o" ? "force-text-dark scale-105 sm:scale-110" : "force-text-light hover:force-text-white hover:border-white/60"
                }`}
              >
                O &bull; Inovasi
              </button>

              <button
                onClick={() => handleSelect(3)}
                style={{
                  background: activePart === "l" ? "#FFFFFF" : "rgba(11, 16, 27, 0.92)",
                  border: activePart === "l" ? "1px solid #FFFFFF" : "1px solid rgba(255, 255, 255, 0.25)",
                  boxShadow: activePart === "l" ? "0 0 12px rgba(255,255,255,0.75)" : undefined,
                }}
                className={`absolute bottom-1 left-1 sm:bottom-3 sm:left-4 lg:bottom-4 lg:left-6 z-20 px-3 py-1.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-[11px] font-bold tracking-wide backdrop-blur-md transition-all duration-300 shadow-md min-h-[32px] sm:min-h-0 flex items-center ${
                  activePart === "l" ? "force-text-dark scale-105 sm:scale-110" : "force-text-light hover:force-text-white hover:border-white/60"
                }`}
              >
                L &bull; Kreatif
              </button>

              {activePart !== "all" ? (
                <button
                  onClick={() => handleSelect(0)}
                  className="force-text-white absolute bottom-1 right-1 sm:bottom-3 sm:right-4 lg:bottom-4 lg:right-6 z-20 px-3 py-1.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-[11px] font-bold tracking-wide backdrop-blur-md transition-all duration-300 bg-solaki-teal hover:bg-[#094837] border border-solaki-teal flex items-center gap-1 sm:gap-1 shadow-lg shadow-solaki-teal/40 hover:scale-105 min-h-[32px] sm:min-h-0"
                >
                  <RotateCcw className="w-3 h-3 text-white" />
                  <span>Logo Utuh</span>
                </button>
              ) : (
                <button
                  onClick={() => handleSelect(0)}
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.12)", border: "1px solid rgba(255, 255, 255, 0.25)" }}
                  className="force-text-white absolute bottom-1 right-1 sm:bottom-3 sm:right-4 lg:bottom-4 lg:right-6 z-20 px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs sm:text-[11px] font-bold tracking-wide backdrop-blur-md transition-all duration-300 flex items-center gap-1 sm:gap-1 shadow-sm hover:border-white/50 min-h-[32px] sm:min-h-0"
                >
                  <Layers className="w-3 h-3 text-solaki-glow" />
                  <span>Logo Lengkap</span>
                </button>
              )}
            </div>
          </div>

          {/* ── Right: Seamless Philosophy Storytelling (Universal Contrast) ── */}
          <div className="lg:col-span-7 flex flex-col justify-center mt-2 sm:mt-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activePart}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-3 sm:space-y-3.5"
              >
                {/* Headline & Subtitle */}
                <div>
                  <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                    &ldquo;{current.headline}&rdquo;
                  </h4>
                  <p
                    className="font-bold text-xs sm:text-sm mt-1 font-inter"
                    style={{ color: activeTextColor }}
                  >
                    {current.subtitle}
                  </p>
                </div>

                {/* Description Card Box */}
                <div
                  className="bento-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 relative overflow-hidden"
                  style={{
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(13, 92, 70, 0.04)",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(13, 92, 70, 0.12)",
                    borderLeftWidth: "4px",
                    borderLeftColor: activeTextColor,
                  }}
                >
                  <p className="text-solaki-muted text-xs sm:text-sm md:text-base font-inter leading-relaxed max-w-xl">
                    {current.description}
                  </p>
                </div>

                {/* Brand Color Specification */}
                <div className="pt-2 sm:pt-3 border-t border-solaki-border flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-inter text-solaki-muted">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFFFFF] border border-solaki-border shadow-sm" />
                    <span className="font-mono text-white font-semibold">#FFFFFF</span>
                    <span className="text-[10px] sm:text-[11px] text-solaki-subtle">(Bentuk Luar)</span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#2B2B2B] border border-solaki-border shadow-sm" />
                    <span className="font-mono text-white font-semibold">#2B2B2B</span>
                    <span className="text-[10px] sm:text-[11px] text-solaki-subtle">(Simpul Tengah)</span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#0D5C46] border border-solaki-border shadow-sm" />
                    <span className="font-mono font-semibold" style={{ color: isDark ? "#2DD4BF" : "#0D5C46" }}>
                      #0D5C46
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-solaki-subtle">(Aksen Brand)</span>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
