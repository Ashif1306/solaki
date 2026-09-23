import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getArticles, ARTICLE_CATEGORIES, ArticleItem } from "@/lib/articles";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogClientCatalog from "./BlogClientCatalog";
import { Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pusat Edukasi & Blog Digital Marketing UMKM",
  description:
    "Kumpulan artikel, tips, dan strategi praktis seputar Instagram Reels, Meta Ads, copywriting jualan, dan branding visual untuk membantu UMKM Indonesia bertumbuh.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: `Pusat Edukasi & Blog Digital Marketing UMKM | ${siteName}`,
    description:
      "Kumpulan artikel, tips, dan panduan taktis digital marketing untuk UMKM: Instagram Reels, Meta Ads, Copywriting, dan Visual Branding.",
    url: `${siteUrl}/blog`,
    type: "website",
  },
};

export default async function BlogPage() {
  const articles = await getArticles();

  const featured = articles.find((a) => a.isFeatured) || articles[0];
  const listArticles = articles.filter((a) => a.id !== featured?.id);

  return (
    <div className="min-h-screen bg-solaki-black text-white selection:bg-solaki-teal/30 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-20">
        {/* ── Background Glow ──────────────────────── */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(13,92,70,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* ── Page Header ─────────────────────────── */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solaki-teal/10 border border-solaki-teal/30 text-solaki-teal text-xs font-bold tracking-wider uppercase mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              SOLAKI KNOWLEDGE HUB • PUSAT EDUKASI UMKM
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Strategi & Wawasan Digital untuk{" "}
              <span className="bg-gradient-to-r from-teal-300 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                UMKM Naik Kelas
              </span>
            </h1>
            <p className="text-base sm:text-lg text-solaki-muted font-inter leading-relaxed">
              Panduan praktis, taktik Instagram Reels viral, cara beriklan Meta Ads tanpa boncos, hingga teknik copywriting jualan yang siap diterapkan langsung pada bisnis Anda.
            </p>
          </div>

          {/* ── Client Interactive Filter & Catalog ── */}
          <BlogClientCatalog
            initialArticles={articles}
            featured={featured}
            categories={ARTICLE_CATEGORIES as unknown as string[]}
          />

          {/* ── Consultation CTA Banner ─────────────── */}
          <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-solaki-teal/30 bg-gradient-to-br from-solaki-card via-solaki-darker to-solaki-card shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-solaki-teal/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Kemitraan Pertumbuhan Digital
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Ingin Strategi Ini Diterapkan Langsung pada Bisnis Anda?
                </h3>
                <p className="text-sm sm:text-base text-solaki-muted font-inter leading-relaxed">
                  Tim SOLAKI siap membantu merancang konten visual, mengelola akun media sosial, dan menjalankan kampanye iklan Meta Ads terarah khusus untuk brand Anda.
                </p>
              </div>

              <div className="flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <a
                  href="https://wa.me/6285255443322?text=Halo%20SOLAKI,%20saya%20tertarik%20konsultasi%20strategi%20digital%20marketing%20setelah%20membaca%20Pusat%20Edukasi%20Anda."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-8 py-3.5 text-sm font-bold shadow-lg shadow-solaki-teal/20 text-center flex items-center justify-center gap-2"
                >
                  Konsultasi Gratis via WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/#services"
                  className="px-6 py-3.5 rounded-xl border border-solaki-border text-sm font-semibold text-white/90 hover:text-white hover:bg-white/5 transition-all text-center"
                >
                  Lihat Paket Layanan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
