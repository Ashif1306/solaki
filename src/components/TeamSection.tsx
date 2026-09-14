"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Crown, Palette, Target, HeartHandshake, CheckCircle2, Sparkles } from "lucide-react";

// Inline SVG brand icons
const LinkedinIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const defaultTeam = [
  {
    id: 1,
    name: "Muhammad Nur Zikri",
    role: "Founder & Brand Strategist",
    icon: Crown,
    initials: "MNZ",
    color: "#0D5C46",
    colorBg: "rgba(13,92,70,0.15)",
    description:
      "Bertanggung jawab atas arah strategis agensi, positioning brand, pengembangan model bisnis, serta membina hubungan kolaboratif erat dengan klien utama.",
    skills: ["Brand Strategy", "Market Positioning", "Business Development", "Client Relations"],
    socials: {
      instagram: "#",
      linkedin: "#",
    },
    gradient: "from-emerald-950/40 to-solaki-dark",
    accentGlow: "rgba(13,92,70,0.2)",
  },
  {
    id: 2,
    name: "Ifan Tri Yandies",
    role: "Social Media & Design Specialist",
    icon: Palette,
    initials: "ITY",
    color: "#D95338",
    colorBg: "rgba(217,83,56,0.15)",
    description:
      "Mengelola ekosistem konten media sosial, produksi desain grafis berdaya pikat tinggi, dan menjaga konsistensi identitas visual brand mitra.",
    skills: ["Content Creation", "Graphic Design", "Brand Aesthetics", "Visual Consistency"],
    socials: {
      instagram: "#",
      linkedin: "#",
    },
    gradient: "from-red-950/40 to-solaki-dark",
    accentGlow: "rgba(217,83,56,0.2)",
  },
  {
    id: 3,
    name: "Kasman Muh. Ashif",
    role: "Digital Advertising & Client Relation Officer",
    icon: Target,
    initials: "KMA",
    color: "#4F46E5",
    colorBg: "rgba(79,70,229,0.15)",
    description:
      "Menangani eksekusi dan optimasi digital advertising (Meta & TikTok Ads) dengan alokasi budget efisien, serta koordinasi komunikasi aktif dengan mitra.",
    skills: ["Digital Advertising", "Meta & TikTok Ads", "Campaign Optimization", "Client Relations"],
    socials: {
      instagram: "#",
      linkedin: "#",
    },
    gradient: "from-indigo-950/40 to-solaki-dark",
    accentGlow: "rgba(79,70,229,0.2)",
  },
];

const brandCores = [
  {
    keyword: "Personal",
    desc: "Memahami bisnis klien secara mendalam, bukan sekadar formula generik.",
  },
  {
    keyword: "Creative",
    desc: "Menghasilkan konten yang segar, relevan, dan menarik perhatian audiens.",
  },
  {
    keyword: "Affordable",
    desc: "Menyediakan solusi bernilai tinggi yang dapat dijangkau kapasitas UMKM.",
  },
  {
    keyword: "Data-Driven",
    desc: "Menggunakan evaluasi data berkala untuk mengoptimalkan strategi nyata.",
  },
  {
    keyword: "Partner",
    desc: "Bekerja bersama klien sebagai mitra bertumbuh, bukan sekadar vendor jasa.",
  },
];

export default function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [teamMembers, setTeamMembers] = useState(defaultTeam);

  useEffect(() => {
    fetch("/api/admin/team")
      .then((res) => res.json())
      .then((data) => {
        if (data.team && data.team.length > 0) {
          const activeMembers = data.team.filter((m: { isActive: boolean }) => m.isActive);
          if (activeMembers.length > 0) {
            setTeamMembers(
              activeMembers.map((m: {
                _id: string;
                name: string;
                role: string;
                description: string;
                skills: string[];
                initials: string;
                color: string;
                instagram?: string;
                linkedin?: string;
              }, idx: number) => ({
                id: idx + 1,
                name: m.name,
                role: m.role,
                icon: idx === 0 ? Crown : idx === 1 ? Palette : Target,
                initials: m.initials || "SOL",
                color: m.color || (idx === 0 ? "#0D5C46" : idx === 1 ? "#D95338" : "#4F46E5"),
                colorBg: `${m.color || "#0D5C46"}20`,
                description: m.description,
                skills: m.skills || [],
                socials: {
                  instagram: m.instagram || "#",
                  linkedin: m.linkedin || "#",
                },
                gradient: idx === 0 ? "from-emerald-950/40 to-solaki-dark" : idx === 1 ? "from-red-950/40 to-solaki-dark" : "from-indigo-950/40 to-solaki-dark",
                accentGlow: `${m.color || "#0D5C46"}25`,
              }))
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="tim" ref={sectionRef} className="py-32 relative overflow-hidden bg-solaki-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(13,92,70,0.06)_0%,transparent_70%)]" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-6 inline-flex">
            <Users className="w-3 h-3" />
            Tim & Kolektif SOLAKI
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Kolektif Kreatif &{" "}
            <span className="gradient-text-teal">Strategi Brand</span>
          </h2>
          <p className="text-solaki-muted text-lg max-w-2xl mx-auto font-inter leading-relaxed">
            Ditenagai oleh talenta berdedikasi yang memadukan strategi brand, estetika visual, dan eksekusi pemasaran digital terarah untuk kemajuan UMKM.
          </p>
        </motion.div>

        {/* Team Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {teamMembers.map((member, index) => {
            const IconComponent = member.icon;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="group relative"
              >
                <div
                  className="bento-card overflow-hidden h-full flex flex-col justify-between transition-all duration-300 group-hover:border-solaki-teal/40 group-hover:shadow-2xl"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  {/* Top Banner / Avatar Header */}
                  <div
                    className={`h-40 bg-gradient-to-br ${member.gradient} relative flex items-center justify-center border-b border-white/5 overflow-hidden`}
                  >
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${member.accentGlow}, transparent 70%)`,
                      }}
                    />

                    {/* Initials badge */}
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl tracking-widest text-white relative z-10 border border-white/20 shadow-xl"
                      style={{ background: member.colorBg }}
                    >
                      {member.initials}
                    </div>

                    {/* Role pill */}
                    <div
                      className="absolute bottom-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full font-inter"
                      style={{
                        background: "rgba(10,10,10,0.8)",
                        color: member.color,
                        border: `1px solid ${member.color}40`,
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {member.role}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-solaki-teal transition-colors">
                        {member.name}
                      </h3>
                      <IconComponent className="w-4 h-4 text-solaki-subtle" />
                    </div>

                    <p className="text-solaki-muted text-xs font-inter leading-relaxed mb-6 flex-grow">
                      {member.description}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {member.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="text-[11px] px-2.5 py-1 rounded-lg font-medium font-inter"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            color: "#E2E8F0",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Socials & Agency tag */}
                    <div className="flex items-center justify-between pt-4 border-t border-solaki-border/40">
                      <div className="flex items-center gap-2">
                        <a
                          href={member.socials.instagram}
                          className="w-8 h-8 rounded-lg bg-solaki-card border border-solaki-border/50 flex items-center justify-center text-solaki-muted hover:text-white hover:border-solaki-teal transition-all"
                          aria-label="Instagram"
                        >
                          <InstagramIcon />
                        </a>
                        <a
                          href={member.socials.linkedin}
                          className="w-8 h-8 rounded-lg bg-solaki-card border border-solaki-border/50 flex items-center justify-center text-solaki-muted hover:text-white hover:border-solaki-teal transition-all"
                          aria-label="LinkedIn"
                        >
                          <LinkedinIcon />
                        </a>
                      </div>
                      <span className="text-[11px] text-solaki-subtle font-mono">SOLAKI Team</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Inti Brand SOLAKI (5 Pillars from PDF - Authentic, No Fake Stats) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="bento-card p-8 sm:p-10 border border-solaki-border/80 relative overflow-hidden"
        >
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-solaki-teal uppercase tracking-widest font-inter">
              Komitmen Kami
            </span>
            <h3 className="text-2xl font-black text-white mt-1">Inti Brand SOLAKI</h3>
            <p className="text-xs text-solaki-muted font-inter mt-1.5">
              Prinsip fundamental yang memandu bagaimana kami bekerja bersama setiap mitra bisnis.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {brandCores.map((core, i) => (
              <div
                key={core.keyword}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-solaki-teal/10 border border-solaki-teal/20 text-solaki-teal flex items-center justify-center mx-auto mb-2 text-xs font-bold">
                    0{i + 1}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{core.keyword}</h4>
                </div>
                <p className="text-[11px] text-solaki-muted font-inter leading-relaxed mt-1">
                  {core.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
