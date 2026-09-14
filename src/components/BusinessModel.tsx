"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Repeat, Briefcase, Megaphone, CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";

interface PackageData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  priceLabel: string;
  price: string;
  period: string;
  badge?: string;
  features: string[];
  color: string;
  colorBg: string;
  colorBorder: string;
  isHighlight: boolean;
}

const defaultPackages: PackageData[] = [
  {
    id: "retainer",
    name: "Paket Retainer Bulanan",
    subtitle: "Solusi Berkelanjutan untuk UMKM",
    description:
      "Layanan bulanan komprehensif untuk mengelola media sosial dan memproduksi konten secara konsisten tanpa perlu merekrut tim tetap.",
    priceLabel: "Investasi",
    price: "Rp 2.500.000",
    period: "/ bulan",
    badge: "Paling Populer",
    features: [
      "15-20 konten feed, carousel & reels",
      "Copywriting caption & hashtag relevan",
      "Penjadwalan & publikasi teratur",
      "Manajemen interaksi pesan & komentar",
      "Laporan analitik performa bulanan",
      "Konsultasi strategi rutin bulanan",
    ],
    color: "#0D5C46",
    colorBg: "rgba(13,92,70,0.1)",
    colorBorder: "rgba(13,92,70,0.3)",
    isHighlight: true,
  },
  {
    id: "project",
    name: "Project-Based Branding",
    subtitle: "Kebutuhan Khusus & Desain Proyek",
    description:
      "Biaya berdasarkan kebutuhan proyek spesifik seperti perancangan logo, visual identity, katalog promosi, atau re-branding produk.",
    priceLabel: "Mulai dari",
    price: "Rp 1.800.000",
    period: "/ proyek",
    badge: "Fleksibel",
    features: [
      "Panduan identitas visual brand (Brand Guidelines)",
      "Paket aset grafis promosi siap pakai",
      "Desain kemasan atau materi digital khusus",
      "File master high-resolution (AI, PSD, PNG)",
      "Revisi terarah hingga hasil maksimal",
    ],
    color: "#D95338",
    colorBg: "rgba(217,83,56,0.08)",
    colorBorder: "rgba(217,83,56,0.25)",
    isHighlight: false,
  },
  {
    id: "ads",
    name: "Digital Ads Management",
    subtitle: "Pengelolaan & Optimasi Iklan",
    description:
      "Biaya jasa pengelolaan kampanye iklan digital di Meta dan TikTok dengan sistem fee transparan dan berorientasi hasil terukur.",
    priceLabel: "Management Fee",
    price: "15%",
    period: "dari ad spend (min. Rp 750k)",
    badge: "Fokus Konversi",
    features: [
      "Setup akun iklan & integrasi pixel tracking",
      "Riset target audiens & demografi potensial",
      "Pembuatan copy & materi visual iklan",
      "A/B testing untuk efisiensi biaya per klik",
      "Monitoring harian & laporan transparan",
    ],
    color: "#4F46E5",
    colorBg: "rgba(79,70,229,0.08)",
    colorBorder: "rgba(79,70,229,0.25)",
    isHighlight: false,
  },
];

export default function BusinessModel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [packagesList, setPackagesList] = useState<PackageData[]>(defaultPackages);

  useEffect(() => {
    fetch("/api/admin/packages")
      .then((res) => res.json())
      .then((data) => {
        if (data.packages && data.packages.length > 0) {
          const activeList = data.packages.filter((p: { isActive: boolean }) => p.isActive);
          if (activeList.length > 0) {
            setPackagesList(
              activeList.map((p: {
                _id: string;
                name: string;
                subtitle: string;
                description: string;
                price: string;
                period: string;
                badge?: string;
                features: string[];
                isHighlight: boolean;
                modelType: string;
              }, idx: number) => ({
                id: p._id,
                name: p.name,
                subtitle: p.subtitle,
                description: p.description,
                priceLabel: p.modelType === "ad_fee" ? "Management Fee" : "Investasi",
                price: p.price,
                period: p.period,
                badge: p.badge,
                features: p.features || [],
                color: idx === 0 ? "#0D5C46" : idx === 1 ? "#D95338" : "#4F46E5",
                colorBg: idx === 0 ? "rgba(13,92,70,0.1)" : idx === 1 ? "rgba(217,83,56,0.08)" : "rgba(79,70,229,0.08)",
                colorBorder: idx === 0 ? "rgba(13,92,70,0.3)" : idx === 1 ? "rgba(217,83,56,0.25)" : "rgba(79,70,229,0.25)",
                isHighlight: p.isHighlight,
              }))
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  const scrollToContact = (packageName?: string) => {
    const el = document.getElementById("kontak");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="paket-layanan"
      ref={sectionRef}
      className="py-28 relative overflow-hidden bg-solaki-surface"
    >
      <div className="absolute inset-0 grid-bg opacity-35" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-6 inline-flex">
            <Briefcase className="w-3 h-3" />
            Model Kemitraan SOLAKI
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Paket Layanan{" "}
            <span className="gradient-text-teal">Transparan & Fleksibel</span>
          </h2>
          <p className="text-solaki-muted text-lg max-w-2xl mx-auto font-inter leading-relaxed">
            Pilih skema kerjasama yang paling sesuai dengan kebutuhan dan alokasi anggaran bisnis Anda. Semua paket dirancang terjangkau dan berorientasi hasil.
          </p>
        </motion.div>

        {/* Packages Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-14 items-stretch">
          {packagesList.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="relative flex"
            >
              <div
                className={`bento-card p-7 w-full flex flex-col justify-between relative transition-all duration-300 hover:shadow-2xl ${
                  pkg.isHighlight
                    ? "border-solaki-teal shadow-xl shadow-solaki-teal/10"
                    : "border-solaki-border"
                }`}
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    {pkg.badge ? (
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full font-inter"
                        style={{
                          background: pkg.colorBg,
                          color: pkg.color,
                          border: `1px solid ${pkg.colorBorder}`,
                        }}
                      >
                        {pkg.badge}
                      </span>
                    ) : (
                      <span />
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-black text-white mb-1">{pkg.name}</h3>
                  <p className="text-xs font-semibold mb-4" style={{ color: pkg.color }}>
                    {pkg.subtitle}
                  </p>

                  {/* Price */}
                  <div className="mb-5 pb-5 border-b border-solaki-border/50">
                    <p className="text-[11px] text-solaki-subtle font-inter mb-0.5">{pkg.priceLabel}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-white">{pkg.price}</span>
                      <span className="text-xs text-solaki-muted font-inter">{pkg.period}</span>
                    </div>
                  </div>

                  {/* Desc */}
                  <p className="text-xs text-solaki-muted font-inter leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: pkg.color }}
                        />
                        <span className="text-xs font-inter text-solaki-subtle leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => scrollToContact(pkg.name)}
                  className={`w-full py-3 rounded-xl text-xs font-bold font-inter flex items-center justify-center gap-2 transition-all ${
                    pkg.isHighlight
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                >
                  Pilih Paket Ini
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Consultation Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bento-card p-6 sm:p-8 text-center max-w-3xl mx-auto border-solaki-border"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="text-base font-bold text-white mb-1">
                Butuh Skema Khusus Sesuai Skala Bisnis Anda?
              </h4>
              <p className="text-xs text-solaki-muted font-inter">
                Kami siap merancang paket modular yang disesuaikan dengan kapasitas anggaran UMKM Anda.
              </p>
            </div>
            <button
              onClick={() => scrollToContact()}
              className="btn-secondary whitespace-nowrap text-xs py-2.5 px-4 font-bold flex items-center gap-2 flex-shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Konsultasi Bebas
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
