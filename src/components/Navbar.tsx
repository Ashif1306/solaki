"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, Zap, Sun, Moon, ArrowUpRight, Sparkles, MessageCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSiteBrand } from "@/hooks/useSiteBrand";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Showcase", href: "#showcase" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { brand } = useSiteBrand();
  const navRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";

  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 60], [0.92, 0.98]);

  // Scroll detection for navbar background intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Precise scroll spy to track current section
  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + 200;

      // When near the top, Home is active
      if (window.scrollY < 200) {
        setActiveSection("home");
        return;
      }

      // If scrolled near bottom of page, activate last link (Contact)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        const last = navLinks[navLinks.length - 1];
        if (last) setActiveSection(last.href.replace("#", ""));
        return;
      }

      const sections = navLinks
        .map((l) => document.getElementById(l.href.replace("#", "")))
        .filter(Boolean) as HTMLElement[];

      let current = "";
      for (const section of sections) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          current = section.id;
          break;
        }
      }

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy(); // Trigger once on mount

    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    if (id === "home") {
      setActiveSection("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMobileOpen(false);
      return;
    }
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Desktop / Tablet Floating Navbar ── */}
      <motion.header
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3.5 px-4 pointer-events-none"
      >
        {/* Floating pill wrapper */}
        <motion.div
          ref={navRef}
          style={{ opacity: navOpacity }}
          className={`pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all duration-300 ${
            isDark
              ? scrolled
                ? "bg-[#080C14]/95 border-white/20 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]"
                : "bg-[#080C14]/90 border-white/15 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
              : scrolled
                ? "bg-white/98 border-slate-300/90 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.06)]"
                : "bg-white/92 border-slate-300/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
          }`}
        >
          {/* ── Logo ── */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              setActiveSection("home");
            }}
            className="flex items-center gap-2.5 px-2 py-1 rounded-xl group cursor-pointer select-none"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {brand.logoType === "image" && brand.logoImageUrl ? (
              <div
                className={`flex items-center justify-center overflow-hidden flex-shrink-0 transition-all duration-300 ${
                  brand.logoShape === "circle"
                    ? `w-8 h-8 sm:w-9 sm:h-9 rounded-full border ${
                        isDark ? "border-white/25 bg-white/10 shadow-inner" : "border-slate-300 bg-slate-900 shadow-sm"
                      }`
                    : brand.logoShape === "contain"
                    ? `h-8 sm:h-9 max-w-[130px] rounded-lg px-1 border ${
                        isDark ? "border-white/20 bg-white/5" : "border-slate-300 bg-slate-100"
                      }`
                    : `w-8 h-8 sm:w-9 sm:h-9 rounded-xl border shadow-sm ${
                        isDark ? "border-white/25 bg-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.3)]" : "border-slate-900 bg-black text-white"
                      }`
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.logoImageUrl}
                  alt={brand.logoText}
                  className={`transition-transform duration-300 group-hover:scale-105 ${
                    brand.logoShape === "contain"
                      ? "h-full w-auto object-contain"
                      : brand.logoShape === "circle"
                      ? "w-full h-full object-cover object-center rounded-full"
                      : "w-full h-full object-cover object-center rounded-xl"
                  }`}
                  style={{ imageRendering: "auto" }}
                />
              </div>
            ) : (
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm ${
                  isDark
                    ? "bg-white/10 text-white border border-white/25 shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
                    : "bg-black text-white border border-slate-900 shadow-sm"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="22" cy="10" r="5" fill="currentColor" />
                  <circle cx="8"  cy="34" r="4" fill="currentColor" />
                  <circle cx="36" cy="34" r="4" fill="currentColor" />
                  <circle cx="22" cy="26" r="3" fill="currentColor" opacity="0.75" />
                  <line x1="22" y1="15" x2="22" y2="23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="20" y1="28" x2="10" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="24" y1="28" x2="34" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            )}
            <div className="hidden sm:block text-left">
              <span
                className={`font-jakarta font-black text-base tracking-tight transition-colors duration-200 ${
                  isDark ? "text-white" : "text-slate-950"
                }`}
              >
                {brand.logoText || "SOLAKI"}
              </span>
              <p className={`text-[8px] font-inter tracking-[0.2em] uppercase leading-none font-bold ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                {brand.logoSubtitle || "Creative Agency"}
              </p>
            </div>
          </motion.a>

          {/* ── Separator ── */}
          <div className={`hidden lg:block w-px h-5 mx-1 ${isDark ? "bg-white/15" : "bg-slate-300"}`} />

          {/* ── Nav Links (desktop) ── */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              const isHovered = hoveredLink === link.href;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => { event.preventDefault(); scrollToSection(link.href); }}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative px-3.5 py-1.5 text-xs rounded-xl cursor-pointer transition-colors duration-200 group select-none ${
                    isActive
                      ? isDark
                        ? "text-white font-bold"
                        : "text-[#0D5C46] font-extrabold"
                      : isHovered
                        ? isDark
                          ? "text-white font-semibold"
                          : "text-slate-950 font-bold"
                        : isDark
                          ? "text-slate-300 font-medium"
                          : "text-slate-700 font-semibold"
                  }`}
                >
                  {/* Active pill background */}
                  {isActive && (
                    <motion.span
                      layoutId="activePill"
                      className={`absolute inset-0 rounded-xl ${
                        isDark
                          ? "bg-[#0D5C46]/35 border border-[#10B981]/50 shadow-[0_0_16px_rgba(16,185,129,0.3)]"
                          : "bg-[#0D5C46]/12 border border-[#0D5C46]/40 shadow-[0_2px_10px_rgba(13,92,70,0.18)]"
                      }`}
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}

                  {/* Hover effect for inactive tabs */}
                  {isHovered && !isActive && (
                    <motion.span
                      layoutId="hoverPill"
                      className={`absolute inset-0 rounded-xl ${
                        isDark ? "bg-white/[0.08]" : "bg-slate-100"
                      }`}
                      transition={{ duration: 0.15 }}
                    />
                  )}

                  {/* Link Content */}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.label}
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isDark ? "bg-[#10B981] shadow-[0_0_8px_#10B981]" : "bg-[#0D5C46]"
                        }`}
                      />
                    )}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* ── Separator ── */}
          <div className={`hidden lg:block w-px h-5 mx-1 ${isDark ? "bg-white/15" : "bg-slate-300"}`} />

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle button */}
            <motion.button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                isDark
                  ? "border-white/15 bg-white/[0.04] hover:bg-white/[0.1] hover:border-[#10B981]/60 text-slate-200 hover:text-white shadow-sm"
                  : "border-slate-300 bg-slate-100/90 hover:bg-slate-200 hover:border-slate-400 text-slate-800 hover:text-slate-950 shadow-sm"
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4 text-[#0D5C46]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* CTA Button / Consultation direct link */}
            <motion.a
              href={brand.whatsappUrl || "#contact"}
              target={brand.whatsappUrl ? "_blank" : undefined}
              rel={brand.whatsappUrl ? "noopener noreferrer" : undefined}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold cursor-pointer select-none relative overflow-hidden group shadow-md"
              style={{
                background: "linear-gradient(135deg, #0D5C46 0%, #12795C 100%)",
                boxShadow: isDark
                  ? "0 0 0 1px rgba(16,185,129,0.4), 0 4px 16px rgba(13,92,70,0.45)"
                  : "0 4px 16px rgba(13,92,70,0.3)",
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 0 1px rgba(16,185,129,0.7), 0 6px 24px rgba(13,92,70,0.55)",
              }}
              whileTap={{ scale: 0.96 }}
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]/20 relative z-10" />
              <span className="relative z-10">Konsultasi</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#FCEEB5]/90 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.a>

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                isDark
                  ? "border-white/15 bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 hover:text-white"
                  : "border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 shadow-sm"
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </motion.header>

      {/* â”€â”€â”€ Mobile Drawer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`fixed inset-0 z-40 lg:hidden backdrop-blur-sm ${
                isDark ? "bg-black/60" : "bg-slate-900/40"
              }`}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className={`fixed top-[68px] left-4 right-4 z-50 lg:hidden rounded-2xl border backdrop-blur-2xl overflow-hidden ${
                isDark
                  ? "border-[#243040]/80 bg-[#0B0F12]/96 shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
                  : "border-slate-200 bg-white/96 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
              }`}
            >
              {/* Brand strip */}
              <div
                className={`flex items-center gap-3 px-5 pt-4 pb-3 border-b ${
                  isDark ? "border-[#243040]/50" : "border-slate-100"
                }`}
              >
                {brand.logoType === "image" && brand.logoImageUrl ? (
                  <div
                    className={`flex items-center justify-center overflow-hidden flex-shrink-0 transition-all duration-300 ${
                      brand.logoShape === "circle"
                        ? `w-8 h-8 rounded-full border ${
                            isDark ? "border-white/20 bg-white/10" : "border-slate-300 bg-slate-900"
                          }`
                        : brand.logoShape === "contain"
                        ? `h-8 max-w-[100px] rounded-lg px-1 border ${
                            isDark ? "border-white/15 bg-white/5" : "border-slate-200 bg-slate-100"
                          }`
                        : `w-8 h-8 rounded-xl border ${
                            isDark ? "border-white/20 bg-white/10" : "border-slate-900 bg-black text-white"
                          }`
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logoImageUrl}
                      alt={brand.logoText}
                      className={
                        brand.logoShape === "contain"
                          ? "h-full w-auto object-contain"
                          : brand.logoShape === "circle"
                          ? "w-full h-full object-cover object-center rounded-full"
                          : "w-full h-full object-cover object-center rounded-xl"
                      }
                    />
                  </div>
                ) : (
                  <div className="relative w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                      <circle cx="20" cy="20" r="19" stroke="url(#nav-drawer-grad)" strokeWidth="1.5" />
                      <path
                        d="M12 20 C12 14, 18 10, 20 10 C22 10, 22 14, 20 20 C18 26, 18 30, 20 30 C22 30, 28 26, 28 20"
                        stroke="#0D5C46"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <circle cx="20" cy="20" r="3" fill="#FCEEB5" />
                      <circle cx="12" cy="20" r="2" fill="#D95338" opacity="0.85" />
                      <circle cx="28" cy="20" r="2" fill="#0D5C46" />
                      <defs>
                        <linearGradient id="nav-drawer-grad" x1="0" y1="0" x2="40" y2="40">
                          <stop stopColor="#0D5C46" />
                          <stop offset="1" stopColor="#D95338" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}
                <div>
                  <span
                    className={`font-jakarta font-extrabold text-sm tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {brand.logoText || "SOLAKI"}
                  </span>
                  <p className={`text-[8px] font-inter tracking-widest uppercase ${
                    isDark ? "text-[#8B9BB4]" : "text-slate-500"
                  }`}>
                    {brand.logoSubtitle || "Creative Agency"}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0D5C46]/10 border border-[#0D5C46]/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D5C46] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#0D5C46]">Active</span>
                </div>
              </div>

              {/* Nav links */}
              <div className="px-3 py-2.5 space-y-1">
                {navLinks.map((link, i) => {
                  const isActive = activeSection === link.href.replace("#", "");
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      onClick={(event) => { event.preventDefault(); scrollToSection(link.href); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold flex items-center justify-between cursor-pointer group ${
                        isActive
                          ? isDark
                            ? "text-white bg-[#0D5C46]/20 border border-[#0D5C46]/40 font-bold"
                            : "text-[#0D5C46] bg-[#0D5C46]/10 border border-[#0D5C46]/25 font-bold"
                          : isDark
                            ? "text-[#8B9BB4] hover:text-white hover:bg-white/[0.04]"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                      }`}
                    >
                      <span>{link.label}</span>
                      <span
                        className="w-2 h-2 rounded-full transition-transform group-hover:scale-110"
                        style={{
                          background: isActive ? "#0D5C46" : "transparent",
                          border: isActive ? "none" : isDark ? "1px solid #243040" : "1px solid #CBD5E1",
                        }}
                      />
                    </motion.a>
                  );
                })}
              </div>

              {/* Bottom actions */}
              <div
                className={`px-4 pb-4 pt-2 space-y-2.5 border-t mt-1 ${
                  isDark ? "border-[#243040]/40" : "border-slate-100"
                }`}
              >
                <div className="flex items-center justify-between px-1 py-1">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-[#8B9BB4]" : "text-slate-500"
                  }`}>
                    Mode Tampilan
                  </span>
                  <button
                    onClick={toggleTheme}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      isDark
                        ? "border-[#243040]/70 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                        : "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    {isDark ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-400" /> Mode Terang
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-[#0D5C46]" /> Mode Gelap
                      </>
                    )}
                  </button>
                </div>

                <motion.a
                  href={brand.whatsappUrl || "#contact"}
                  target={brand.whatsappUrl ? "_blank" : undefined}
                  rel={brand.whatsappUrl ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-white text-xs font-bold cursor-pointer select-none relative overflow-hidden shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #0D5C46 0%, #12795C 100%)",
                    boxShadow: "0 4px 16px rgba(13,92,70,0.35)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]/20" />
                  Konsultasi
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#FCEEB5]/80" />
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

