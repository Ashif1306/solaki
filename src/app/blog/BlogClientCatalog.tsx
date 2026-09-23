"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArticleItem } from "@/lib/articles";
import { Search, Clock, ArrowRight, Eye, Calendar, Tag, Sparkles } from "lucide-react";

interface Props {
  initialArticles: ArticleItem[];
  featured?: ArticleItem;
  categories: string[];
}

export default function BlogClientCatalog({ initialArticles, featured, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchCat =
        selectedCategory === "Semua" ||
        article.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [initialArticles, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* ── Search & Category Filter Toolbar ───────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-solaki-card/70 border border-solaki-border backdrop-blur-md">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-solaki-teal text-white shadow-md shadow-solaki-teal/25"
                    : "text-solaki-muted hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 flex-shrink-0">
          <Search className="w-4 h-4 text-solaki-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari artikel, reels, ads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-solaki-darker border border-solaki-border rounded-xl text-white placeholder:text-solaki-subtle focus:outline-none focus:border-solaki-teal/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-solaki-muted hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Featured Article (Shown when no search & "Semua" selected) ── */}
      {featured && selectedCategory === "Semua" && !searchQuery && (
        <div className="group relative rounded-3xl overflow-hidden border border-solaki-border bg-solaki-card hover:border-solaki-teal/40 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image side */}
            <div className="relative lg:col-span-6 h-64 sm:h-80 lg:h-auto min-h-[300px] overflow-hidden bg-solaki-darker">
              <Image
                src={featured.coverImage}
                alt={featured.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-solaki-card via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-solaki-teal text-white shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                Artikel Utama
              </div>
            </div>

            {/* Content side */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-semibold text-solaki-muted">
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-solaki-teal">
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featured.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-solaki-teal transition-colors tracking-tight leading-tight">
                  <Link href={`/blog/${featured.slug}`}>
                    {featured.title}
                  </Link>
                </h2>

                <p className="text-sm text-solaki-muted font-inter line-clamp-3 leading-relaxed">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-solaki-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-solaki-darker overflow-hidden border border-white/10 relative">
                    <Image
                      src={featured.authorAvatar}
                      alt={featured.authorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{featured.authorName}</p>
                    <p className="text-[11px] text-solaki-muted">{featured.authorRole}</p>
                  </div>
                </div>

                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-solaki-teal hover:text-teal-300 transition-colors"
                >
                  Baca Panduan
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Articles Grid ──────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Daftar Artikel</span>
            <span className="text-xs font-normal text-solaki-muted">
              ({filteredArticles.length} artikel tersedia)
            </span>
          </h3>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-solaki-card/50 border border-solaki-border">
            <Search className="w-10 h-10 mx-auto text-solaki-subtle mb-3" />
            <h4 className="text-base font-bold text-white mb-1">Tidak Ada Artikel yang Cocok</h4>
            <p className="text-xs text-solaki-muted max-w-sm mx-auto">
              Tidak ditemukan artikel untuk kata kunci &ldquo;{searchQuery}&rdquo;. Silakan coba topik lain atau pilih kategori &ldquo;Semua&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-solaki-card border border-solaki-border hover:border-solaki-teal/40 transition-all duration-300 hover:shadow-xl hover:shadow-solaki-teal/5"
              >
                {/* Thumbnail */}
                <Link href={`/blog/${article.slug}`} className="relative h-48 w-full overflow-hidden bg-solaki-darker block">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-solaki-black/80 backdrop-blur-md text-solaki-teal border border-solaki-teal/30">
                    {article.category}
                  </div>
                </Link>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-[11px] text-solaki-muted font-inter">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.viewCount} pembaca
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-solaki-teal transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h4>

                    <p className="text-xs text-solaki-muted font-inter line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-solaki-border/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-solaki-darker relative overflow-hidden border border-white/10">
                        <Image
                          src={article.authorAvatar}
                          alt={article.authorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-white/80">{article.authorName}</span>
                    </div>

                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-solaki-teal group-hover:text-teal-300 transition-colors"
                    >
                      Baca
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
