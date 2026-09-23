"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  RefreshCw,
} from "lucide-react";
import { ArticleItem } from "@/lib/articles";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/articles");
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleTogglePublish = async (article: ArticleItem) => {
    try {
      setActionLoading(article.id);
      const nextStatus = !article.isPublished;
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: nextStatus }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? { ...a, isPublished: nextStatus } : a))
        );
      }
    } catch (err) {
      console.error("Toggle publish failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      return;
    }

    try {
      setActionLoading(id);
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Delete article failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = articles.filter((a) => {
    const matchCat = categoryFilter === "Semua" || a.category === categoryFilter;
    const matchSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalViews = articles.reduce((sum, a) => sum + (a.viewCount || 0), 0);
  const totalPublished = articles.filter((a) => a.isPublished).length;

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-solaki-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solaki-teal/10 border border-solaki-teal/20 text-solaki-teal text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            KONTEN EDUKASI & BLOG
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Pusat Edukasi UMKM
          </h1>
          <p className="text-sm text-solaki-muted font-inter mt-1">
            Kelola artikel panduan digital marketing, trik Reels viral, dan strategi Meta Ads untuk UMKM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchArticles}
            className="p-2.5 rounded-xl border border-solaki-border bg-solaki-card text-solaki-muted hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/solaki/dashboard/articles/new"
            className="btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tulis Artikel Baru
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-solaki-card border border-solaki-border">
          <p className="text-xs font-semibold text-solaki-muted">Total Artikel</p>
          <p className="text-2xl font-black text-white mt-1">{articles.length}</p>
          <p className="text-[11px] text-emerald-400 mt-1 font-inter">{totalPublished} Tayang Aktif</p>
        </div>
        <div className="p-5 rounded-2xl bg-solaki-card border border-solaki-border">
          <p className="text-xs font-semibold text-solaki-muted">Total Pembaca</p>
          <p className="text-2xl font-black text-solaki-teal mt-1">{totalViews.toLocaleString()}</p>
          <p className="text-[11px] text-solaki-muted mt-1 font-inter">Akumulasi tayangan artikel</p>
        </div>
        <div className="p-5 rounded-2xl bg-solaki-card border border-solaki-border">
          <p className="text-xs font-semibold text-solaki-muted">Kategori Konten</p>
          <p className="text-2xl font-black text-purple-400 mt-1">4</p>
          <p className="text-[11px] text-solaki-muted mt-1 font-inter">Reels, Ads, UMKM, Branding</p>
        </div>
        <div className="p-5 rounded-2xl bg-solaki-card border border-solaki-border">
          <p className="text-xs font-semibold text-solaki-muted">Kesiapan SEO</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">100%</p>
          <p className="text-[11px] text-emerald-300 mt-1 font-inter">JSON-LD Schema + Sitemap</p>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ─────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-solaki-card border border-solaki-border">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {["Semua", "Instagram Marketing", "Meta Ads", "Tips UMKM", "Branding & Konten"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-solaki-teal text-white shadow-sm"
                  : "text-solaki-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-solaki-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-solaki-darker border border-solaki-border rounded-xl text-white placeholder:text-solaki-subtle focus:outline-none focus:border-solaki-teal"
          />
        </div>
      </div>

      {/* ── Articles Table / List ───────────────────── */}
      <div className="rounded-2xl border border-solaki-border bg-solaki-card overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <RefreshCw className="w-8 h-8 mx-auto text-solaki-teal animate-spin mb-3" />
            <p className="text-xs text-solaki-muted">Memuat daftar artikel...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <BookOpen className="w-10 h-10 mx-auto text-solaki-subtle mb-3" />
            <p className="text-sm font-bold text-white mb-1">Tidak Ada Artikel</p>
            <p className="text-xs text-solaki-muted mb-4">
              {searchQuery ? "Tidak ada artikel yang cocok dengan filter Anda." : "Belum ada artikel yang ditambahkan."}
            </p>
            <Link
              href="/solaki/dashboard/articles/new"
              className="btn-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Tulis Sekarang
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-solaki-border/60 bg-solaki-darker/50 text-[11px] font-bold uppercase tracking-wider text-solaki-muted">
                  <th className="py-3.5 px-4">Artikel</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4 text-center">Pembaca</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-solaki-border/40 text-xs">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3.5 max-w-md">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-solaki-darker relative flex-shrink-0 border border-solaki-border/50">
                          <Image
                            src={item.coverImage}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white truncate block hover:text-solaki-teal transition-colors">
                              {item.title}
                            </span>
                            {item.isFeatured && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-solaki-teal/20 text-solaki-teal border border-solaki-teal/30 flex-shrink-0">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-solaki-muted font-mono truncate mt-0.5">
                            /blog/{item.slug}
                          </p>
                          <p className="text-[11px] text-solaki-subtle flex items-center gap-2 mt-1">
                            <span>{item.authorName}</span>
                            <span>•</span>
                            <span>{item.readTime}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/5 border border-white/10 text-white/90">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-white/90">
                        <Eye className="w-3.5 h-3.5 text-solaki-muted" />
                        {item.viewCount || 0}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        disabled={actionLoading === item.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          item.isPublished
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                        }`}
                        title="Klik untuk ubah status"
                      >
                        {item.isPublished ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Tayang
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Draft
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.isPublished && (
                          <Link
                            href={`/blog/${item.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-solaki-muted hover:text-white transition-colors"
                            title="Buka di Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/solaki/dashboard/articles/${item.id}`}
                          className="p-2 rounded-lg bg-solaki-teal/10 hover:bg-solaki-teal/20 text-solaki-teal transition-colors"
                          title="Edit Artikel"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={actionLoading === item.id}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
