"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useSiteBrand } from "@/hooks/useSiteBrand";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

/* ─── Solaki logo mark (fallback) ─── */
const SolakiLogo = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Solaki Logo"
  >
    <circle cx="22" cy="10" r="5" fill="currentColor" />
    <circle cx="8"  cy="34" r="4" fill="currentColor" />
    <circle cx="36" cy="34" r="4" fill="currentColor" />
    <circle cx="22" cy="26" r="3" fill="currentColor" opacity="0.7" />
    <line x1="22" y1="15" x2="22" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="28" x2="10" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="28" x2="34" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ─── Decorative curved underline (SVG) ─── */
const CurvedUnderline = () => (
  <svg
    viewBox="0 0 260 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ width: "100%", maxWidth: "260px", height: "14px", display: "block", marginTop: "4px" }}
  >
    <path
      d="M4 10 Q65 2 130 8 Q195 14 256 6"
      stroke="#dec83a"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M10 13 Q70 7 130 11 Q190 15 250 9"
      stroke="#dec83a"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.4"
    />
  </svg>
);

/* ─── Service Card SVG Icons (matching stroke 2.2, round linecap/join) ─── */
const VideoCameraIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <rect x="2" y="5" width="14" height="14" rx="3" />
    <polygon points="22 8 16 12 22 16 22 8" fill="currentColor" stroke="none" />
    <circle cx="6.5" cy="9.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

/* Instagram official icon for Social Media Management */
const InstagramIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
  </svg>
);

const TargetArrowIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    {/* Outer target ring */}
    <circle cx="11" cy="13" r="8" />
    {/* Inner bullseye ring */}
    <circle cx="11" cy="13" r="4.2" />
    {/* Center bullseye mark */}
    <circle cx="11" cy="13" r="1.3" fill="currentColor" stroke="none" />
    {/* Arrow striking center from upper right */}
    <path d="M21 3l-7.5 7.5" />
    <path d="M21 3v4.5" />
    <path d="M21 3h-4.5" />
  </svg>
);

/* ─── 3 Service Cards on the Right of Megaphone ─── */
const heroServiceCards = [
  {
    id: "content-creator",
    label: <span className="whitespace-nowrap">Content Creator</span>,
    icon: VideoCameraIcon,
    circleStyle: {
      backgroundColor: "#013e37",
      boxShadow:
        "0 3px 10px rgba(1, 62, 55, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.25), inset 0 -1px 2px rgba(0, 0, 0, 0.2)",
    },
    iconColor: "#dec83a",
    cardDelay: 0.22,
    iconDelay: 0.32,
    launchDesktop: { x: -44, y: -14, rotate: -5, scale: 0.85 },
    iconRotate: -15,
  },
  {
    id: "social-media",
    label: (
      <>
        Social Media
        <br />
        Management
      </>
    ),
    icon: InstagramIcon,
    circleStyle: {
      backgroundColor: "#dec83a",
      boxShadow:
        "0 3px 10px rgba(222, 200, 58, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5), inset 0 -1px 2px rgba(160, 140, 20, 0.25)",
    },
    iconColor: "#013e37",
    cardDelay: 0.36,
    iconDelay: 0.46,
    launchDesktop: { x: -52, y: 0, rotate: 0, scale: 0.85 },
    iconRotate: 15,
  },
  {
    id: "digital-advertising",
    label: <span className="whitespace-nowrap">Digital Advertising</span>,
    icon: TargetArrowIcon,
    circleStyle: {
      backgroundColor: "#013e37",
      boxShadow:
        "0 3px 10px rgba(1, 62, 55, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.25), inset 0 -1px 2px rgba(0, 0, 0, 0.2)",
    },
    iconColor: "#dec83a",
    cardDelay: 0.50,
    iconDelay: 0.60,
    launchDesktop: { x: -44, y: 14, rotate: 5, scale: 0.85 },
    iconRotate: -15,
  },
];

/* ─── Marquee items ─── */
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

/* ═══════════════════════════════════════════════════════════════ */
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { brand } = useSiteBrand();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const scrollToContact = () => {
    const el =
      document.getElementById("contact") ||
      document.getElementById("kontak");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.location.hash = "#contact";
  };

  const scrollToServices = () => {
    const el =
      document.getElementById("services") ||
      document.getElementById("layanan");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.location.hash = "#services";
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex flex-col bg-solaki-bg"
      style={{ overflowX: "hidden" }}
    >
      {/* ── Background: dot grid + accent blobs ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 dot-bg opacity-30" />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-solaki-green opacity-[0.08]" />
        <div className="absolute -bottom-10 -left-10 w-[300px] h-[300px] rounded-full bg-solaki-green opacity-[0.05]" />
      </div>

      {/* ── MAIN CONTENT: two-column balanced grid (aligned with sections below) ── */}
      <div
        className="
          relative z-10 grid grid-cols-1 lg:grid-cols-[48%_52%]
          items-center justify-center
          max-w-6xl mx-auto w-full
          px-4 sm:px-6 lg:px-8
          pt-20 sm:pt-24 lg:pt-24
          pb-8 lg:pb-12 gap-8 lg:gap-6 flex-1
        "
      >
        {/* ════ LEFT COLUMN: Copy ════ */}
        <div className="flex flex-col items-start w-full max-w-xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-3 sm:mb-3.5"
          >
            <div className="section-badge">
              {brand.logoType === "image" && brand.logoImageUrl ? (
                <div
                  className={`overflow-hidden flex items-center justify-center flex-shrink-0 ${
                    brand.logoShape === "circle" ? "rounded-full" : "rounded"
                  }`}
                  style={{ width: 12, height: 12 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.logoImageUrl}
                    alt={brand.logoText}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ) : (
                <SolakiLogo size={12} />
              )}
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Digital Growth Partner
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
            style={{ lineHeight: 1.1 }}
            className={`text-[2.5rem] sm:text-[3rem] lg:text-[3.1rem] xl:text-[3.5rem] font-black tracking-tight mb-1 transition-colors duration-200 ${
              isDark ? "text-white" : "text-[#1c2421]"
            }`}
          >
            Strategi Digital
            <br />
            yang Personal
            <br />
            {/* Gold accent line with decorative underline */}
            <span className="inline-block relative" style={{ color: "#dec83a" }}>
              &amp; Terukur
              <span className="absolute left-0" style={{ bottom: "-14px", width: "100%" }}>
                <CurvedUnderline />
              </span>
            </span>
          </motion.h1>

          {/* Spacer for decorative underline */}
          <div style={{ height: 32 }} />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className={`text-[0.92rem] sm:text-base font-inter leading-relaxed mb-8 max-w-[420px] transition-colors duration-200 ${
              isDark ? "text-solaki-muted" : "text-[#4b5563]"
            }`}
          >
            {brand.logoText || "SOLAKI"} hadir sebagai mitra bisnis, bukan sekadar
            vendor jasa. Kami mendampingi UMKM dan bisnis lokal tumbuh melalui
            konten kreatif, pengelolaan media sosial, dan iklan digital yang
            benar-benar sesuai kebutuhan Anda.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
          >
            {/* Primary button */}
            {brand.whatsappUrl ? (
              <motion.a
                href={brand.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-cta-primary"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:opacity-90"
                style={{ background: "#013e37", color: "#FFFFFF", border: "1px solid #dec83a" }}
              >
                <span className="force-text-white font-bold">Konsultasi Sekarang</span>
                <span
                  className="flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{ width: 24, height: 24, background: "#dec83a" }}
                >
                  <ChevronRight style={{ width: 14, height: 14, color: "#212121" }} strokeWidth={3} />
                </span>
              </motion.a>
            ) : (
              <motion.a
                href="#contact"
                id="hero-cta-primary"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToContact();
                }}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm cursor-pointer transition-all duration-300 hover:opacity-90"
                style={{ background: "#013e37", color: "#FFFFFF", border: "1px solid #dec83a" }}
              >
                <span className="force-text-white font-bold">Konsultasi Gratis</span>
                <span
                  className="flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{ width: 24, height: 24, background: "#dec83a" }}
                >
                  <ChevronRight style={{ width: 14, height: 14, color: "#212121" }} strokeWidth={3} />
                </span>
              </motion.a>
            )}

            {/* Secondary button */}
            <motion.a
              href="#services"
              id="hero-cta-secondary"
              onClick={(e) => {
                e.preventDefault();
                scrollToServices();
              }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm cursor-pointer transition-all duration-300 btn-secondary"
              style={{ borderRadius: "9999px" }}
            >
              <span>Lihat Layanan Kami</span>
              <span
                className="flex items-center justify-center flex-shrink-0 rounded-full"
                style={{ width: 24, height: 24, border: "1px solid currentColor", opacity: 0.7 }}
              >
                <ChevronRight style={{ width: 14, height: 14 }} strokeWidth={2.5} />
              </span>
            </motion.a>
          </motion.div>
        </div>

        {/* ════ RIGHT COLUMN: 3D Megaphone + 3 Service Cards ════ */}
        <div className="relative flex-shrink-0 w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4 xl:gap-7">
          
          {/* Megaphone Stage with Organic Blob & Sparkles */}
          <div className="relative flex items-center justify-center flex-shrink-0">
            {/* Organic background blob behind megaphone */}
            <div
              aria-hidden="true"
              className="absolute pointer-events-none rounded-[48%_52%_62%_38%/45%_55%_45%_55%]"
              style={{
                width: "128%",
                height: "122%",
                left: "48%",
                top: "48%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(ellipse at 40% 45%, rgba(1,62,55,0.12) 0%, rgba(222,200,58,0.06) 50%, rgba(1,62,55,0.01) 75%, transparent 100%)",
                border: "1px solid rgba(1,62,55,0.04)",
              }}
            />

            {/* Subtle decorative dot cluster at top-left of megaphone */}
            <div
              aria-hidden="true"
              className="absolute -top-4 -left-4 w-16 h-16 pointer-events-none opacity-45"
              style={{
                backgroundImage: "radial-gradient(#013e37 1.5px, transparent 1.5px)",
                backgroundSize: "11px 11px",
              }}
            />

            {/* Decorative accent sparkles in Solaki tones */}
            <div
              aria-hidden="true"
              className="absolute -top-3 right-10 text-[#dec83a] text-lg font-bold pointer-events-none opacity-60 select-none"
            >
              ✦
            </div>
            <div
              aria-hidden="true"
              className="absolute bottom-6 -left-3 text-[#013e37] text-sm font-bold pointer-events-none opacity-30 select-none"
            >
              ✕
            </div>

            {/* 3D Megaphone Image with Float */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[280px] sm:w-[320px] lg:w-[350px] xl:w-[390px] aspect-[747/818]"
            >
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src="/megaphone-solaki.png"
                  alt="Megafon 3D Solaki — Digital Growth Partner"
                  fill
                  sizes="(max-width: 768px) 300px, (max-width: 1200px) 380px, 420px"
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Contact Shadow under the Handle */}
              <motion.div
                aria-hidden="true"
                animate={{ scale: [1, 0.92, 1], opacity: [0.75, 0.55, 0.75] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: "22%",
                  bottom: "2%",
                  width: "130px",
                  height: "24px",
                  background:
                    "radial-gradient(ellipse at center, rgba(1,62,55,0.45) 0%, rgba(1,62,55,0.18) 50%, transparent 75%)",
                  filter: "blur(6px)",
                }}
              />
            </motion.div>
          </div>

          {/* 3 Service Cards Column (Vertically Centered with Megaphone) */}
          <div className="relative flex flex-col justify-center gap-3.5 w-[220px] sm:w-[226px] mx-auto lg:mx-0">
            {/* Animated vertical dashed line behind icon circles (visible only in gaps between cards) */}
            <svg
              aria-hidden="true"
              className="absolute left-[34px] top-[32px] pointer-events-none z-0"
              width="2"
              height="156"
              viewBox="0 0 2 156"
              fill="none"
              style={{
                filter: isDark ? "drop-shadow(0 0 3px rgba(222,200,58,0.45))" : "none",
              }}
            >
              <motion.line
                x1="1"
                y1="0"
                x2="1"
                y2="156"
                stroke="#dec83a"
                strokeWidth="2"
                strokeDasharray="3.5 3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.75, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>

            {heroServiceCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="relative z-10 w-full h-[64px]"
                >
                  {/* Entrance Motion Wrapper (kinetic burst from megaphone) */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: card.launchDesktop.x,
                      y: card.launchDesktop.y,
                      scale: card.launchDesktop.scale,
                      rotate: card.launchDesktop.rotate,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      scale: 1,
                      rotate: 0,
                    }}
                    transition={{
                      duration: 0.65,
                      delay: card.cardDelay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-full h-full"
                  >
                    {/* Interactive Card (Hover lift & dual theme adaptation) */}
                    <motion.div
                      whileHover={{ y: -3, scale: 1.015 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className={`group flex items-center h-full px-3.5 gap-3 rounded-[18px] cursor-default transition-all duration-300 select-none ${
                        isDark
                          ? "bg-[#1d2724]/90 backdrop-blur-md border border-white/[0.12] shadow-[0_6px_22px_rgba(0,0,0,0.45)] hover:border-[#dec83a]/40 hover:shadow-[0_10px_28px_rgba(0,0,0,0.65)]"
                          : "bg-white/95 backdrop-blur-md border border-[#013e37]/10 shadow-[0_6px_18px_rgba(1,62,55,0.06),0_2px_6px_rgba(0,0,0,0.03)] hover:border-[#013e37]/25 hover:shadow-[0_10px_24px_rgba(1,62,55,0.12)]"
                      }`}
                    >
                      {/* Icon Circle Container with spring entrance & hover rotate */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6, rotate: card.iconRotate }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: card.iconDelay,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        className="flex-shrink-0"
                      >
                        <motion.div
                          whileHover={{ rotate: 10, scale: 1.05 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="flex items-center justify-center rounded-full w-[40px] h-[40px]"
                          style={card.circleStyle}
                        >
                          <Icon
                            style={{ width: 20, height: 20, color: card.iconColor }}
                          />
                        </motion.div>
                      </motion.div>

                      {/* Service Label (Adjusts dynamically for light and dark mode) */}
                      <div className="flex flex-col justify-center text-left">
                        <span
                          className={`text-[13px] sm:text-[13.5px] font-semibold leading-[1.22] tracking-[-0.01em] transition-colors duration-200 ${
                            isDark ? "text-white" : "text-[#013e37]"
                          }`}
                        >
                          {card.label}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Marquee strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="w-full relative z-10"
      >
        <div className="border-y border-solaki-border py-3 bg-solaki-surface/40 backdrop-blur-sm overflow-hidden">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-solaki-muted mx-7 whitespace-nowrap"
              >
                {item}
                <span className="ml-7 text-solaki-gold">·</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
