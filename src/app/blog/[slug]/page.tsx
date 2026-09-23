import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButtons from "./ShareButtons";
import { Clock, Eye, Calendar, ArrowLeft, ArrowRight, Sparkles, CheckCircle2, ChevronRight, BookOpen } from "lucide-react";
import { siteName, siteUrl } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  const title = `${article.title} | Blog Edukasi SOLAKI`;
  const url = `${siteUrl}/blog/${article.slug}`;

  return {
    title,
    description: article.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: article.excerpt,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.authorName],
      images: [
        {
          url: article.coverImage.startsWith("http")
            ? article.coverImage
            : `${siteUrl}${article.coverImage}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(slug, article.category, 3);

  // Structured Data (Schema.org / JSON-LD for Google Rich Results)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage.startsWith("http") ? article.coverImage : `${siteUrl}${article.coverImage}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.authorName,
      jobTitle: article.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo_solaki/Logo_Solaki.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${article.slug}`,
    },
  };

  const publishDateFormatted = new Date(article.publishedAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-solaki-black text-white selection:bg-solaki-teal/30 selection:text-white flex flex-col">
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* ── Breadcrumb & Back ──────────────────── */}
          <div className="flex items-center justify-between gap-4 text-xs text-solaki-muted">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 hover:text-solaki-teal transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Pusat Edukasi
            </Link>

            <nav className="hidden sm:flex items-center gap-1.5">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <ChevronRight className="w-3.5 h-3.5 text-solaki-subtle" />
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <ChevronRight className="w-3.5 h-3.5 text-solaki-subtle" />
              <span className="text-solaki-teal font-semibold">{article.category}</span>
            </nav>
          </div>

          {/* ── Article Header ──────────────────────── */}
          <header className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-solaki-teal/15 text-solaki-teal border border-solaki-teal/30">
              <BookOpen className="w-3.5 h-3.5" />
              {article.category}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-solaki-muted font-inter leading-relaxed">
              {article.excerpt}
            </p>

            {/* Author & Meta Row */}
            <div className="pt-4 border-t border-solaki-border/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-solaki-darker relative overflow-hidden border border-white/10">
                  <Image
                    src={article.authorAvatar}
                    alt={article.authorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{article.authorName}</p>
                  <p className="text-xs text-solaki-muted font-inter">{article.authorRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-solaki-muted font-inter">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {publishDateFormatted}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  {article.readTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  {article.viewCount} pembaca
                </span>
              </div>
            </div>
          </header>

          {/* ── Cover Image ─────────────────────────── */}
          <div className="relative w-full h-64 sm:h-96 md:h-[450px] rounded-3xl overflow-hidden border border-solaki-border bg-solaki-darker shadow-2xl">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>

          {/* ── Article Content Body ────────────────── */}
          <article className="prose prose-invert max-w-none space-y-6 text-white/90 font-inter leading-relaxed text-sm sm:text-base">
            {article.content.split("\n\n").map((block, idx) => {
              const trimmed = block.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-xl sm:text-2xl font-black text-white tracking-tight mt-8 mb-4 border-b border-solaki-border/50 pb-2">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }

              if (trimmed.startsWith("#### ")) {
                return (
                  <h4 key={idx} className="text-lg sm:text-xl font-bold text-solaki-teal mt-6 mb-3">
                    {trimmed.replace("#### ", "")}
                  </h4>
                );
              }

              if (trimmed.startsWith("> ")) {
                return (
                  <div key={idx} className="my-6 p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border-l-4 border-solaki-teal text-emerald-200 text-sm leading-relaxed">
                    {trimmed.replace("> ", "")}
                  </div>
                );
              }

              if (trimmed.startsWith("---")) {
                return <hr key={idx} className="my-8 border-solaki-border/40" />;
              }

              if (trimmed.startsWith("- ") || trimmed.startsWith("1. ")) {
                const lines = trimmed.split("\n");
                return (
                  <ul key={idx} className="space-y-2 my-4 pl-4 sm:pl-6 list-disc marker:text-solaki-teal">
                    {lines.map((line, lIdx) => (
                      <li key={lIdx} className="text-white/85">
                        {line.replace(/^[-*]\s+|\d+\.\s+/, "")}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={idx} className="text-white/85 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </article>

          {/* ── Tags & Social Share ─────────────────── */}
          <div className="pt-8 border-t border-solaki-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-solaki-muted mr-1">Topik Terkait:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs bg-solaki-card border border-solaki-border text-white/80"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <ShareButtons title={article.title} slug={article.slug} />
          </div>

          {/* ── Sticky WhatsApp Consultation Box ───── */}
          <div className="rounded-3xl p-6 sm:p-8 border border-solaki-teal/30 bg-gradient-to-r from-solaki-card via-solaki-darker to-solaki-card shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Sparkles className="w-4 h-4" />
                Dukungan Penuh SOLAKI
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Ingin Bisnis Anda Dikelola oleh Tim Ahli?
              </h3>
              <p className="text-xs sm:text-sm text-solaki-muted font-inter">
                Diskusikan kebutuhan konten dan kampanye iklan bisnis Anda bersama tim kami secara gratis.
              </p>
            </div>

            <a
              href={`https://wa.me/6285255443322?text=Halo%20SOLAKI,%20saya%20baru%20saja%20membaca%20artikel%20"${encodeURIComponent(article.title)}"%20dan%20ingin%20konsultasi%20untuk%20bisnis%20saya.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-6 py-3 text-xs sm:text-sm font-bold shadow-lg shadow-solaki-teal/20 text-center whitespace-nowrap flex items-center justify-center gap-2 flex-shrink-0"
            >
              Konsultasi WhatsApp Sekarang
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* ── Related Articles Section ────────────── */}
          {relatedArticles.length > 0 && (
            <div className="pt-10 border-t border-solaki-border/50 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white tracking-tight">
                  Artikel Edukasi Terkait
                </h3>
                <Link
                  href="/blog"
                  className="text-xs font-bold text-solaki-teal hover:underline flex items-center gap-1"
                >
                  Lihat Semua
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group rounded-2xl overflow-hidden bg-solaki-card border border-solaki-border hover:border-solaki-teal/40 transition-all p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="relative h-36 w-full rounded-xl overflow-hidden bg-solaki-darker">
                      <Image
                        src={rel.coverImage}
                        alt={rel.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-solaki-teal uppercase tracking-wider">
                        {rel.category}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-solaki-teal transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-solaki-muted flex items-center gap-1 pt-1 border-t border-solaki-border/30">
                      <Clock className="w-3 h-3" />
                      {rel.readTime}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
