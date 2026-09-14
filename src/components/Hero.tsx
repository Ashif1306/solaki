"use client";

import { useRef } from "react";
import { motion, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, PenTool, Share2, TrendingUp, MessageCircle } from "lucide-react";
import { useSiteBrand } from "@/hooks/useSiteBrand";

// Logo SVG — Solaki abstrak hitam-putih
const SolakiLogo = ({ size = 44 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Solaki Logo"
  >
    {/* Abstract connected nodes — represents "Bersama Kita" / network / growth */}
    <circle cx="22" cy="10" r="5" fill="currentColor" />
    <circle cx="8"  cy="34" r="4" fill="currentColor" />
    <circle cx="36" cy="34" r="4" fill="currentColor" />
    <circle cx="22" cy="26" r="3" fill="currentColor" opacity="0.7" />
    {/* Connecting lines */}
    <line x1="22" y1="15" x2="22" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="28" x2="10" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="28" x2="34" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const services = [
  {
    icon: PenTool,
    label: "Content Creator",
    desc: "Visual & tulisan kreatif",
    color: "#0D5C46",
    delay: 0,
  },
  {
    icon: Share2,
    label: "Social Media",
    desc: "Management & growth",
    color: "#D95338",
    delay: 0.2,
  },
  {
    icon: TrendingUp,
    label: "Digital Ads",
    desc: "Meta & TikTok Ads",
    color: "#4F46E5",
    delay: 0.4,
  },
];

const marqueeItems = [
  "Content Creator",
  "Social Media Management",
  "Meta & TikTok Ads",
  "Brand Strategy",
  "Digital Marketing",
  "UMKM Growth",
  "Konten Kreatif",
  "Pertumbuhan Digital",
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { brand } = useSiteBrand();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 });

  const glowX = useTransform(springX, (v) => v * 0.5);
  const glowY = useTransform(springY, (v) => v * 0.5);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set((e.clientX - rect.left - rect.width / 2) / 25);
      mouseY.set((e.clientY - rect.top - rect.height / 2) / 25);
    }
  };

  const scrollToContact = () => {
    document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    document.getElementById("layanan")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-solaki-bg dot-bg pt-28 sm:pt-32 md:pt-36 pb-16"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(13,92,70,0.12) 0%, transparent 65%)",
            x: glowX,
            y: glowY,
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 mt-0"
        >
          <div className="section-badge flex items-center gap-2 shadow-sm">
            {brand.logoType === "image" && brand.logoImageUrl ? (
              <div
                className={`w-4 h-4 overflow-hidden flex items-center justify-center flex-shrink-0 ${
                  brand.logoShape === "circle" ? "rounded-full" : "rounded"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.logoImageUrl}
                  alt={brand.logoText}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ) : (
              <SolakiLogo size={14} />
            )}
            <span>Solusi Agency Kreatif & Inovasi Digital</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
        >
          Strategi Digital
          <br />
          <span className="gradient-text-teal">Personal & Terukur</span>
          <br />
          untuk UMKM
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg text-solaki-muted font-inter leading-relaxed max-w-2xl mx-auto mb-10"
        >
          {brand.logoText || "SOLAKI"} hadir sebagai mitra bisnis — bukan sekadar vendor jasa. Kami mendampingi UMKM dan bisnis lokal tumbuh melalui konten kreatif, pengelolaan media sosial, dan iklan digital yang benar-benar sesuai kebutuhan Anda.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {brand.whatsappUrl ? (
            <motion.a
              href={brand.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm flex items-center gap-2"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]/20" />
              Konsultasi Sekarang
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          ) : (
            <motion.button
              onClick={scrollToContact}
              className="btn-primary text-sm"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Konsultasi Gratis
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            onClick={scrollToServices}
            className="btn-secondary text-sm"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Lihat Layanan Kami
          </motion.button>
        </motion.div>

        {/* Service Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          {services.map((svc, i) => (
            <motion.div
              key={svc.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + svc.delay, duration: 0.5 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border"
              style={{
                background: `${svc.color}10`,
                borderColor: `${svc.color}25`,
              }}
            >
              <svc.icon className="w-4 h-4" style={{ color: svc.color }} />
              <div className="text-left">
                <p className="text-sm font-bold text-white leading-none">{svc.label}</p>
                <p className="text-[11px] font-inter mt-0.5" style={{ color: svc.color }}>
                  {svc.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Marquee strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full mt-12 mb-2"
      >
        <div className="border-y border-solaki-border py-3.5 bg-solaki-surface/40 backdrop-blur-sm overflow-hidden">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-solaki-muted mx-8 whitespace-nowrap"
              >
                {item}
                <span className="ml-8 text-solaki-teal">·</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
