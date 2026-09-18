"use client";

import { Mail, MapPin, Phone, MessageCircle, ArrowUpRight } from "lucide-react";
import { useSiteBrand } from "@/hooks/useSiteBrand";

// Inline SVG brand icons
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4.5"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.83 1.53V6.75a4.85 4.85 0 0 1-1.06-.06z"/>
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const footerLinks = {
  layanan: [
    { label: "Content Creator", href: "#services" },
    { label: "Social Media Management", href: "#services" },
    { label: "Digital Advertising (Meta & TikTok)", href: "#services" },
    { label: "Brand Strategy & Positioning", href: "#services" },
    { label: "Creative Media Production", href: "#services" },
  ],
  navigasi: [
    { label: "About & Identity", href: "#about" },
    { label: "Showcase & Proses", href: "#showcase" },
    { label: "Konsultasi & Kontak", href: "#contact" },
  ],
};

export default function Footer() {
  const { brand } = useSiteBrand();

  return (
    <footer className="relative bg-solaki-black border-t border-solaki-border/40 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_100%,rgba(13,92,70,0.06)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer */}
        <div className="py-14 sm:py-18 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              {brand.logoType === "image" && brand.logoImageUrl ? (
                <div
                  className={`flex items-center justify-center overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    brand.logoShape === "circle"
                      ? "w-10 h-10 rounded-full border border-white/20 bg-white/10 shadow-sm"
                      : brand.logoShape === "contain"
                      ? "h-10 max-w-[140px] rounded-lg px-1 border border-white/15 bg-white/5"
                      : "w-10 h-10 rounded-xl border border-white/20 bg-white/10 shadow-sm"
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
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="10" r="5" fill="currentColor" />
                    <circle cx="8" cy="34" r="4" fill="currentColor" />
                    <circle cx="36" cy="34" r="4" fill="currentColor" />
                    <circle cx="22" cy="26" r="3" fill="currentColor" opacity="0.75" />
                    <line x1="22" y1="15" x2="22" y2="23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="20" y1="28" x2="10" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="24" y1="28" x2="34" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
              <div>
                <span className="font-jakarta font-black text-xl text-white tracking-wide">
                  {brand.logoText || "SOLAKI"}
                </span>
                <p className="text-[10px] text-solaki-teal font-semibold tracking-widest uppercase leading-none">
                  {brand.logoSubtitle || "Creative Agency"}
                </p>
              </div>
            </div>

            <p className="text-solaki-muted text-xs font-inter leading-relaxed mb-6 max-w-md">
              Diambil dari frasa lokal Enrekang, Sulawesi Selatan: <em>&ldquo;Sola ki&rdquo;</em> yang berarti <strong>&ldquo;Bersama Kita&rdquo;</strong>. SOLAKI mendampingi UMKM dan bisnis lokal mengembangkan pemasaran digital melalui strategi yang personal, kreatif, terjangkau, dan terukur.
            </p>

            {/* Direct Contacts & WhatsApp */}
            <div className="space-y-2.5 text-xs text-solaki-subtle font-inter mb-6">
              {brand.whatsapp && (
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                  <a
                    href={brand.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-solaki-teal transition-colors font-medium flex items-center gap-1 group"
                  >
                    <span>WhatsApp: +{brand.whatsapp}</span>
                    <ArrowUpRight className="w-3 h-3 text-[#25D366] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-solaki-teal flex-shrink-0" />
                <a href={`mailto:${brand.contactEmail}`} className="hover:text-white transition-colors">
                  {brand.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-solaki-teal flex-shrink-0" />
                <span>{brand.contactAddress}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              {brand.socialInstagram && (
                <a
                  href={brand.socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Solaki"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 flex items-center justify-center text-solaki-muted hover:text-pink-400 transition-all shadow-sm"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {brand.socialTiktok && (
                <a
                  href={brand.socialTiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok Solaki"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-400/50 flex items-center justify-center text-solaki-muted hover:text-teal-400 transition-all shadow-sm"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              )}
              {brand.socialLinkedin && (
                <a
                  href={brand.socialLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Solaki"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 flex items-center justify-center text-solaki-muted hover:text-blue-400 transition-all shadow-sm"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-inter">
              Layanan Utama
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.layanan.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-solaki-muted hover:text-white transition-colors font-inter text-left"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigasi & Fast Consultation */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-inter">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2.5 mb-6">
              {footerLinks.navigasi.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-solaki-muted hover:text-white transition-colors font-inter text-left"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-xl bg-solaki-teal/10 border border-solaki-teal/25">
              <p className="text-xs font-semibold text-white mb-1">Konsultasi Cepat?</p>
              <p className="text-[11px] text-solaki-muted font-inter mb-3 leading-relaxed">
                Tanyakan strategi digital untuk UMKM Anda langsung lewat WhatsApp.
              </p>
              <a
                href={brand.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-black text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Hubungi Kami</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-solaki-border/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-solaki-subtle font-inter">
          <p>© {new Date().getFullYear()} {brand.logoText || "SOLAKI"} {brand.logoSubtitle || "Creative Agency"}. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-1">
            <span>Tumbuh Berkelanjutan Bersama UMKM Indonesia</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
