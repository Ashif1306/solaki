"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  Eye,
  Rocket,
  Heart,
  CheckCircle2,
  Crown,
  Palette,
  Target,
  TrendingUp,
  ExternalLink,
  Link2,
} from "lucide-react";
import LogoPhilosophy from "./LogoPhilosophy";

const missions = [
  "Menyediakan layanan digital marketing yang profesional dan terjangkau.",
  "Mengembangkan strategi konten dan iklan yang sesuai target pasar.",
  "Membantu UMKM beradaptasi dengan perkembangan digital.",
  "Mengutamakan hasil yang terukur melalui data dan evaluasi.",
];

const values = [
  {
    keyword: "Understand",
    desc: "Kami mulai dengan mendengar — memahami bisnis, audiens, dan tujuan Anda secara mendalam sebelum menyusun strategi.",
    icon: Heart,
    color: "#0D5C46",
    bg: "rgba(13,92,70,0.08)",
    border: "rgba(13,92,70,0.25)",
  },
  {
    keyword: "Customize",
    desc: "Tidak ada solusi satu ukuran untuk semua. Setiap strategi, konten, dan kampanye kami rancang khusus untuk bisnis Anda.",
    icon: Palette,
    color: "#D95338",
    bg: "rgba(217,83,56,0.08)",
    border: "rgba(217,83,56,0.25)",
  },
  {
    keyword: "Grow",
    desc: "Kami berorientasi pada pertumbuhan nyata — bukan sekadar engagement, tetapi dampak yang dirasakan oleh bisnis Anda.",
    icon: TrendingUp,
    color: "#4F46E5",
    bg: "rgba(79,70,229,0.08)",
    border: "rgba(79,70,229,0.25)",
  },
];

const defaultTeam = [
  {
    id: "1",
    name: "Muhammad Nur Zikri",
    role: "Founder & Brand Strategist",
    initials: "MNZ",
    color: "#0D5C46",
    description: "Bertanggung jawab atas arah strategis agensi, positioning brand, dan membina hubungan kolaboratif erat dengan klien.",
    skills: ["Brand Strategy", "Market Positioning", "Business Development"],
    photo: "",
    instagram: "#",
    linkedin: "#",
    isActive: true,
    order: 1,
  },
  {
    id: "2",
    name: "Ifan Tri Yandies",
    role: "Social Media & Design Specialist",
    initials: "ITY",
    color: "#D95338",
    description: "Mengelola ekosistem konten media sosial dan produksi desain grafis yang menjaga konsistensi identitas visual brand.",
    skills: ["Content Creation", "Graphic Design", "Visual Consistency"],
    photo: "",
    instagram: "#",
    linkedin: "#",
    isActive: true,
    order: 2,
  },
  {
    id: "3",
    name: "Kasman Muh. Ashif",
    role: "Digital Advertising & Client Relation",
    initials: "KMA",
    color: "#4F46E5",
    description: "Menangani eksekusi digital advertising (Meta & TikTok Ads) dengan optimasi budget efisien dan koordinasi aktif bersama mitra.",
    skills: ["Digital Advertising", "Meta & TikTok Ads", "Campaign Optimization"],
    photo: "",
    instagram: "#",
    linkedin: "#",
    isActive: true,
    order: 3,
  },
];

const iconForIndex = (i: number) => (i === 0 ? Crown : i === 1 ? Palette : Target);
const colorForIndex = (i: number) =>
  i === 0 ? "#0D5C46" : i === 1 ? "#D95338" : "#4F46E5";

type TeamMember = typeof defaultTeam[number];

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TeamCard({
  member,
  index,
  isInView,
}: {
  member: TeamMember;
  index: number;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const color = member.color || colorForIndex(index);
  const hasPhoto = !!member.photo && member.photo.trim().length > 0;
  
  // Center card (index 1) has text at TOP and image slides DOWN from top
  // Side cards (index 0, 2, etc.) have text at BOTTOM and image slides UP from bottom
  const isCenter = index === 1;

  // Slanted clip path for the parallelogram shape (leaning right / slanted top-right & bottom-left)
  const clipPathStyle = "polygon(14% 0%, 100% 0%, 86% 100%, 0% 100%)";

  return (
    <div
      className={`relative flex flex-col items-center justify-between ${
        isCenter ? "md:-mt-8" : "mt-0"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── TOP TEXT (for Center card) ── */}
      {isCenter && (
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: 0.15,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center mb-4 z-20 w-full px-2"
        >
          <h4 className="text-lg md:text-xl font-black text-white tracking-tight mb-1 drop-shadow-md">
            {member.name}
          </h4>
          <p className="text-solaki-muted text-xs md:text-sm font-medium font-inter tracking-wide mb-2.5">
            {member.role}
          </p>

          {/* Social Icons directly under job title */}
          <div className="flex items-center justify-center gap-2">
            {member.instagram && member.instagram !== "#" ? (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} Instagram`}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 text-solaki-muted hover:text-white hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}80`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${color}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-solaki-subtle/50"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </span>
            )}

            {member.linkedin && member.linkedin !== "#" ? (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} LinkedIn`}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 text-solaki-muted hover:text-white hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}80`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${color}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-solaki-subtle/50"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* ── SLANTED CARD CONTAINER WITH ANIMATION ── */}
      <motion.div
        initial={{
          opacity: 0,
          y: isCenter ? -60 : 60, // Center slides DOWN from TOP, side cards slide UP from BOTTOM
          scale: 0.94,
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                y: 0,
                scale: 1,
              }
            : {}
        }
        transition={{
          delay: 0.1 + index * 0.1,
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative w-full max-w-[230px] sm:max-w-[250px] md:max-w-[260px] mx-auto py-1.5 group cursor-pointer"
      >
        {/* Accent Backdrop Ribbon (Red/Teal/Indigo polygon offset matching the reference image) */}
        <div
          className={`absolute inset-0 transition-transform duration-500 ease-out pointer-events-none ${
            index === 0
              ? "-translate-x-3.5 -translate-y-2 group-hover:-translate-x-5 group-hover:-translate-y-3"
              : index === 1
              ? "-translate-x-3 translate-y-3 group-hover:-translate-x-4 group-hover:translate-y-4"
              : "translate-x-3.5 -translate-y-2 group-hover:translate-x-5 group-hover:-translate-y-3"
          }`}
          style={{
            clipPath: clipPathStyle,
            background: `linear-gradient(135deg, ${color} 0%, ${color}99 70%, rgba(8,12,20,0.8) 100%)`,
            opacity: hovered ? 1 : 0.85,
            filter: `drop-shadow(0 10px 25px ${color}40)`,
          }}
        />

        {/* Secondary subtle shadow layer */}
        <div
          className={`absolute inset-0 transition-transform duration-700 pointer-events-none ${
            index === 0
              ? "-translate-x-1.5 translate-y-1.5"
              : index === 1
              ? "translate-x-1.5 -translate-y-1.5"
              : "translate-x-1.5 translate-y-1.5"
          }`}
          style={{
            clipPath: clipPathStyle,
            background: `${color}25`,
            opacity: 0.5,
          }}
        />

        {/* Main Photo Card (Directly clipped parallelogram frame) */}
        <div
          className={`relative w-full overflow-hidden transition-all duration-500 z-10 ${
            isCenter ? "h-[320px] md:h-[355px]" : "h-[295px] md:h-[330px]"
          }`}
          style={{
            clipPath: clipPathStyle,
            background: "linear-gradient(175deg, #161F2E 0%, #080C14 100%)",
            boxShadow: hovered
              ? `0 20px 50px -10px ${color}55`
              : "0 12px 30px -5px rgba(0,0,0,0.6)",
          }}
        >
          {/* Subtle grid pattern inside */}
          <div className="absolute inset-0 dot-bg opacity-10 pointer-events-none" />

          {/* Glowing gradient aura */}
          <div
            className="absolute inset-0 opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${color}45 0%, transparent 70%)`,
            }}
          />

          {/* Photo directly filling the card */}
          {hasPhoto ? (
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={member.photo!}
                alt={member.name}
                fill
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* Bottom gradient shade to enhance contrast */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, rgba(8,12,20,0.85) 0%, rgba(8,12,20,0.15) 40%, transparent 75%)`,
                }}
              />
              {/* Color tint on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
                style={{ background: color }}
              />
            </div>
          ) : (
            /* Full-bleed stylized portrait silhouette fallback */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              {/* Studio lighting top glow */}
              <div
                className="w-full h-full absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 35%, ${color}35 0%, transparent 65%), linear-gradient(180deg, ${color}15 0%, #080C14 100%)`,
                }}
              />

              {/* Large Monogram filling center */}
              <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${color}35 0%, ${color}15 100%)`,
                    border: `1.5px solid ${color}70`,
                    boxShadow: `0 12px 35px ${color}30`,
                  }}
                >
                  <span
                    className="text-4xl font-black tracking-widest drop-shadow-md"
                    style={{ color }}
                  >
                    {member.initials || "SOL"}
                  </span>
                </div>
                <div className="w-10 h-0.5 rounded-full mx-auto" style={{ background: color }} />
              </div>
            </div>
          )}

          {/* Diagonal Glass Edge Shine */}
          <div
            className="absolute top-0 left-0 right-0 h-full w-full pointer-events-none opacity-20 group-hover:opacity-45 transition-opacity duration-500"
            style={{
              background: `linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.4) 48%, transparent 52%)`,
            }}
          />

          {/* Border contour outline */}
          <div
            className="absolute inset-0 pointer-events-none border border-white/10 group-hover:border-white/25 transition-colors"
            style={{
              clipPath: clipPathStyle,
            }}
          />
        </div>
      </motion.div>

      {/* ── BOTTOM TEXT (for Left, Right, & default cards) ── */}
      {!isCenter && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: 0.15 + index * 0.1,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center mt-4 z-20 w-full px-2"
        >
          <h4 className="text-lg md:text-xl font-black text-white tracking-tight mb-1 drop-shadow-md">
            {member.name}
          </h4>
          <p className="text-solaki-muted text-xs md:text-sm font-medium font-inter tracking-wide mb-2.5">
            {member.role}
          </p>

          {/* Social Icons directly under job title */}
          <div className="flex items-center justify-center gap-2">
            {member.instagram && member.instagram !== "#" ? (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} Instagram`}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 text-solaki-muted hover:text-white hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}80`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${color}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-solaki-subtle/50"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </span>
            )}

            {member.linkedin && member.linkedin !== "#" ? (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} LinkedIn`}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 text-solaki-muted hover:text-white hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}80`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${color}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-solaki-subtle/50"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MobileTeamCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  const color = member.color || colorForIndex(index);
  const hasPhoto = !!member.photo && member.photo.trim().length > 0;
  const clipPathStyle = "polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)";

  return (
    <div className="w-[230px] flex-shrink-0 flex flex-col items-center select-none py-1.5 px-2">
      {/* ── Slanted Card Frame ── */}
      <div className="relative w-full max-w-[200px] mx-auto py-1">
        {/* Accent Backdrop Ribbon */}
        <div
          className="absolute inset-0 -translate-x-2.5 -translate-y-1.5 pointer-events-none"
          style={{
            clipPath: clipPathStyle,
            background: `linear-gradient(135deg, ${color} 0%, ${color}99 70%, rgba(8,12,20,0.8) 100%)`,
            opacity: 0.9,
            filter: `drop-shadow(0 8px 18px ${color}35)`,
          }}
        />

        {/* Main Photo Card */}
        <div
          className="relative w-full h-[255px] overflow-hidden z-10"
          style={{
            clipPath: clipPathStyle,
            background: "linear-gradient(175deg, #161F2E 0%, #080C14 100%)",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
          }}
        >
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 dot-bg opacity-10 pointer-events-none" />

          {/* Glowing gradient aura */}
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${color}45 0%, transparent 70%)`,
            }}
          />

          {/* Photo */}
          {hasPhoto ? (
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={member.photo!}
                alt={member.name}
                fill
                className="object-cover object-top"
                sizes="230px"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, rgba(8,12,20,0.85) 0%, rgba(8,12,20,0.15) 40%, transparent 75%)`,
                }}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <div
                className="w-full h-full absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 35%, ${color}35 0%, transparent 65%), linear-gradient(180deg, ${color}15 0%, #080C14 100%)`,
                }}
              />
              <div className="relative z-10">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${color}35 0%, ${color}15 100%)`,
                    border: `1.5px solid ${color}70`,
                    boxShadow: `0 10px 30px ${color}30`,
                  }}
                >
                  <span className="text-3xl font-black tracking-widest drop-shadow-md" style={{ color }}>
                    {member.initials || "SOL"}
                  </span>
                </div>
                <div className="w-8 h-0.5 rounded-full mx-auto" style={{ background: color }} />
              </div>
            </div>
          )}

          {/* Diagonal Glass Edge Shine */}
          <div
            className="absolute top-0 left-0 right-0 h-full w-full pointer-events-none opacity-25"
            style={{
              background: `linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.4) 48%, transparent 52%)`,
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none border border-white/10"
            style={{ clipPath: clipPathStyle }}
          />
        </div>
      </div>

      {/* ── Bottom Text & Socials ── */}
      <div className="text-center mt-2.5 z-20 w-full px-1">
        <h4 className="text-base font-black text-white tracking-tight mb-0.5 drop-shadow-md truncate">
          {member.name}
        </h4>
        <p className="text-solaki-muted text-xs font-medium font-inter tracking-wide mb-2 line-clamp-1">
          {member.role}
        </p>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-2">
          {member.instagram && member.instagram !== "#" ? (
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} Instagram`}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 text-solaki-muted hover:text-white"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          ) : null}

          {member.linkedin && member.linkedin !== "#" ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn`}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 text-solaki-muted hover:text-white"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MobileTeamMarquee({ team }: { team: TeamMember[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const resumeTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll loop using requestAnimationFrame
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let animId: number;
    const speed = 0.8; // smooth ~50px/sec

    const tick = () => {
      if (!isInteracting.current && el) {
        el.scrollLeft += speed;
        // Seamless loop wrap when 1 set of items scrolled
        const oneSetWidth = el.scrollWidth / 4;
        if (oneSetWidth > 0) {
          if (el.scrollLeft >= oneSetWidth * 2) {
            el.scrollLeft -= oneSetWidth;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft += oneSetWidth;
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleTouchStart = () => {
    isInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  const handleTouchEnd = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 1400);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isInteracting.current = true;
    isDragging.current = true;
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeftStart.current = containerRef.current?.scrollLeft || 0;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5; // Drag sensitivity
    containerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 1400);
  };

  // Multiplied team list for smooth infinite drag in both directions
  const marqueeItems = [...team, ...team, ...team, ...team];

  return (
    <div className="block md:hidden relative -mx-4 sm:-mx-6 overflow-hidden py-2 select-none">
      {/* Ambient edge shadow fades */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-solaki-surface to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-solaki-surface to-transparent z-20 pointer-events-none" />

      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex gap-4 overflow-x-auto py-2 cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {marqueeItems.map((member, idx) => (
          <MobileTeamCard
            key={`${member.id || member.name}-${idx}`}
            member={member}
            index={idx % team.length}
          />
        ))}
      </div>
    </div>
  );
}

const stagger = (i: number) => ({
  delay: 0.15 + i * 0.12,
  duration: 0.65,
  ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
});

export default function Philosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const isTeamInView = useInView(teamRef, { once: true, margin: "-80px" });
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam);

  useEffect(() => {
    fetch("/api/admin/team")
      .then((r) => r.json())
      .then((data) => {
        if (data.team && data.team.length > 0) {
          const active = data.team
            .filter((m: TeamMember & { isActive: boolean }) => m.isActive)
            .sort((a: TeamMember, b: TeamMember) => a.order - b.order);
          if (active.length > 0) setTeam(active);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-14 sm:py-20 md:py-28 relative overflow-hidden bg-solaki-surface"
    >
      {/* Backgrounds */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(13,92,70,0.08)_0%,transparent_70%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(217,83,56,0.04)_0%,transparent_70%)]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16 md:space-y-20">

        {/* ── SECTION 1: Intro ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="section-badge mb-5 inline-flex">
              <MapPin className="w-3 h-3" />
              About SOLAKI
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Mitra Digital untuk{" "}
              <span className="gradient-text-teal">Bisnis Lokal</span>
            </h2>

            <p className="text-lg text-solaki-muted font-inter leading-relaxed max-w-3xl mx-auto">
              Kami hadir untuk mengubah ide bisnis Anda menjadi kisah sukses melalui pemasaran digital yang cerdas.{" "}
              <strong className="text-white">SOLAKI</strong> adalah{" "}
              <span className="text-solaki-glow font-semibold">digital marketing & creative agency</span>{" "}
              yang membantu UMKM dan bisnis lokal tumbuh secara berkelanjutan.
            </p>
          </motion.div>

          {/* Name Origin Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.65 }}
            className="max-w-2xl mx-auto"
          >
            <div
              className="bento-card p-8 text-center relative overflow-hidden"
              style={{ borderColor: "rgba(13,92,70,0.35)" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(13,92,70,0.08)_0%,transparent_70%)]" />
              <div className="relative z-10">
                <div className="text-5xl font-black text-solaki-teal mb-3 tracking-tight">"Sola ki'"</div>
                <p className="text-white font-bold text-2xl mb-1">Bersama Kita</p>
                <p className="text-solaki-muted text-sm font-inter mb-5">
                  Ungkapan lokal Enrekang, Sulawesi Selatan
                </p>
                <div className="flex items-center justify-center gap-3 mb-5">
                  <div className="w-12 h-px bg-solaki-border" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-solaki-subtle">Asal Nama SOLAKI</span>
                  <div className="w-12 h-px bg-solaki-border" />
                </div>
                <p className="text-solaki-muted text-sm font-inter leading-relaxed max-w-md mx-auto">
                  Filosofi ini bukan sekadar nama. Kami percaya bahwa agency bukan sekadar vendor,
                  tetapi{" "}
                  <strong className="text-white">mitra yang berjalan bersama bisnis</strong>{" "}
                  untuk mencapai tujuan yang sama.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── SECTION: Logo Philosophy ── */}
        <LogoPhilosophy />

        {/* ── SECTION 2: Vision & Mission ── */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={stagger(0)}
          >
            <div className="bento-card p-8 h-full" style={{ borderColor: "rgba(13,92,70,0.25)" }}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "rgba(13,92,70,0.12)", border: "1px solid rgba(13,92,70,0.3)" }}
              >
                <Eye className="w-6 h-6 text-solaki-teal" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-solaki-teal mb-2">Vision</div>
              <h3 className="text-xl font-bold text-white mb-4 leading-snug">
                Menjadi Agency Pilihan UMKM Indonesia
              </h3>
              <p className="text-solaki-muted text-sm font-inter leading-relaxed">
                Menjadi digital marketing agency terpercaya yang membantu bisnis lokal dan UMKM tumbuh secara berkelanjutan melalui strategi kreatif dan berbasis data.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={stagger(1)}
          >
            <div className="bento-card p-8 h-full" style={{ borderColor: "rgba(217,83,56,0.2)" }}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "rgba(217,83,56,0.08)", border: "1px solid rgba(217,83,56,0.25)" }}
              >
                <Rocket className="w-6 h-6 text-[#D95338]" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D95338] mb-2">Mission</div>
              <h3 className="text-xl font-bold text-white mb-5 leading-snug">
                Komitmen Kami untuk Bisnis Anda
              </h3>
              <ul className="space-y-3">
                {missions.map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-solaki-teal mt-0.5 flex-shrink-0" />
                    <span className="text-solaki-muted text-sm font-inter leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* ── SECTION 3: Values ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-solaki-subtle mb-3">Our Values</div>
            <h3 className="text-3xl md:text-4xl font-black text-white">
              Understand —{" "}
              <span className="gradient-text-teal">Customize</span>{" "}
              — Grow
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.keyword}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={stagger(i)}
              >
                <div className="bento-card p-7 h-full flex flex-col" style={{ borderColor: v.border }}>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: v.bg, border: `1px solid ${v.border}` }}
                  >
                    <v.icon className="w-6 h-6" style={{ color: v.color }} />
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: v.color }}>
                    {v.keyword}
                  </div>
                  <p className="text-solaki-muted text-sm font-inter leading-relaxed flex-grow">
                    {v.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── SECTION 4: Team (slanted diagonal photo cards with interactive mobile horizontal marquee) ── */}
        <div ref={teamRef} className="pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-center mb-10 md:mb-16"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-solaki-subtle mb-3">Meet The Team</div>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Orang-Orang di Balik{" "}
              <span className="gradient-text-teal">SOLAKI</span>
            </h3>
            <p className="text-solaki-muted text-sm md:text-base font-inter max-w-xl mx-auto">
              Tim kreatif dan strategis yang berdedikasi membawa bisnis Anda melesat di dunia digital.
            </p>

            {/* Mobile Interaction Hint */}
            <div className="flex md:hidden items-center justify-center gap-1.5 text-[10px] text-solaki-muted/70 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-solaki-glow animate-ping" />
              <span>Geser bebas ke kiri &amp; kanan &bull; Tahan untuk jeda</span>
            </div>
          </motion.div>

          {/* ── DESKTOP VIEW (Slanted 3-column Grid) ── */}
          <div className="hidden md:grid grid-cols-3 gap-8 lg:gap-10 items-center justify-center max-w-5xl mx-auto">
            {team.map((member, i) => (
              <TeamCard
                key={member.id || member.name}
                member={member}
                index={i}
                isInView={isTeamInView}
              />
            ))}
          </div>

          {/* ── MOBILE VIEW (Horizontal Draggable & Auto-scrolling Track) ── */}
          <MobileTeamMarquee team={team} />
        </div>

      </div>
    </section>
  );
}
