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
    const el = document.getElementById("contact") || document.getElementById("kontak");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "#contact";
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById("services") || document.getElementById("layanan");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "#services";
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-solaki-bg dot-bg pt-28 sm:pt-32 md:pt-36 pb-16"
    >
      {/* ===== BACKGROUND PREMIUM ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* Base aurora gradient */}
        <div className="absolute inset-0 hero-base-gradient" />

        {/* Aurora layer 1 — teal center pulse (mouse-follow) */}
        <motion.div
          className="absolute w-[900px] h-[900px] rounded-full"
          style={{
            top: "40%", left: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(10,122,94,0.45) 0%, rgba(1,62,55,0.22) 38%, transparent 65%)",
            x: glowX, y: glowY,
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Aurora layer 2 — gold top-right */}
        <motion.div
          className="absolute -top-40 -right-20 w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(222,200,58,0.28) 0%, rgba(222,200,58,0.08) 45%, transparent 70%)",
            filter: "blur(70px)",
          }}
          animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Aurora layer 3 — deep green bottom-left */}
        <motion.div
          className="absolute -bottom-32 -left-32 w-[650px] h-[650px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(1,62,55,0.55) 0%, rgba(1,62,55,0.18) 45%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ x: [0, 50, 0], y: [0, -40, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Aurora layer 4 — amber bottom-right */}
        <motion.div
          className="absolute bottom-10 right-10 w-[380px] h-[380px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(217,119,6,0.22) 0%, rgba(217,119,6,0.06) 50%, transparent 70%)",
            filter: "blur(50px)",
          }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Aurora layer 5 — cyan left-mid */}
        <motion.div
          className="absolute top-1/3 -left-20 w-[350px] h-[350px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(8,145,178,0.18) 0%, transparent 65%)",
            filter: "blur(55px)",
          }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />

        {/* Horizontal aurora band */}
        <motion.div
          className="absolute left-0 right-0"
          style={{
            top: "30%",
            height: "180px",
            background: "linear-gradient(180deg, transparent, rgba(10,122,94,0.08) 50%, transparent)",
            filter: "blur(30px)",
          }}
          animate={{ y: [-20, 20, -20], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles */}
        {[
          { x: "15%", y: "20%", size: 3, color: "rgba(222,200,58,0.7)", dur: 6, delay: 0 },
          { x: "80%", y: "15%", size: 2, color: "rgba(10,122,94,0.8)", dur: 7, delay: 1 },
          { x: "25%", y: "70%", size: 4, color: "rgba(222,200,58,0.5)", dur: 5, delay: 2 },
          { x: "70%", y: "60%", size: 2, color: "rgba(10,122,94,0.6)", dur: 8, delay: 0.5 },
          { x: "90%", y: "40%", size: 3, color: "rgba(217,119,6,0.7)", dur: 6.5, delay: 1.5 },
          { x: "5%",  y: "50%", size: 2, color: "rgba(8,145,178,0.6)", dur: 7.5, delay: 3 },
          { x: "50%", y: "85%", size: 3, color: "rgba(222,200,58,0.6)", dur: 5.5, delay: 2.5 },
          { x: "60%", y: "10%", size: 2, color: "rgba(10,122,94,0.7)", dur: 9,   delay: 0.3 },
          { x: "35%", y: "40%", size: 1.5, color: "rgba(222,200,58,0.4)", dur: 4, delay: 4 },
          { x: "85%", y: "80%", size: 2.5, color: "rgba(1,62,55,0.8)", dur: 7, delay: 1.8 },
          { x: "45%", y: "55%", size: 2, color: "rgba(217,119,6,0.5)", dur: 6, delay: 3.5 },
          { x: "10%", y: "90%", size: 3, color: "rgba(8,145,178,0.5)", dur: 8, delay: 0.7 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.x, top: p.y,
              width: p.size * 4,
              height: p.size * 4,
              background: p.color,
              boxShadow: `0 0 ${p.size * 6}px ${p.color}`,
            }}
            animate={{
              y: [-12, 12, -12],
              x: [-6, 6, -6],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}

        {/* Mesh grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-20" />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />


      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        {/* Badge */}
        <motion.div
          initial={false}
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
          initial={false}
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
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg text-solaki-muted font-inter leading-relaxed max-w-2xl mx-auto mb-10"
        >
          {brand.logoText || "SOLAKI"} hadir sebagai mitra bisnis — bukan sekadar vendor jasa. Kami mendampingi UMKM dan bisnis lokal tumbuh melalui konten kreatif, pengelolaan media sosial, dan iklan digital yang benar-benar sesuai kebutuhan Anda.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={false}
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
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToContact();
              }}
              className="btn-primary text-sm flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Konsultasi Gratis
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          )}

          <motion.a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              scrollToServices();
            }}
            className="btn-secondary text-sm flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Lihat Layanan Kami
          </motion.a>
        </motion.div>

        {/* Service Pills */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          {services.map((svc, i) => (
            <motion.div
              key={svc.label}
              initial={false}
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
        initial={false}
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
