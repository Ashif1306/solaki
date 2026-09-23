"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  BookOpen,
  Eye,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  User,
  Tag,
  FileText,
} from "lucide-react";
import { ARTICLE_CATEGORIES, ArticleItem } from "@/lib/articles";

export default function ArticleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("/showcase/reels_kopi_enrekang.png");
  const [category, setCategory] = useState<ArticleItem["category"]>("Instagram Marketing");
  const [tagsInput, setTagsInput] = useState("");
  const [readTime, setReadTime] = useState("4 menit baca");
  const [authorName, setAuthorName] = useState("Tim Edukasi SOLAKI");
  const [authorRole, setAuthorRole] = useState("Digital Strategist");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Auto-slug from title if creating new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew || !slug) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  };

  useEffect(() => {
    if (isNew) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/articles/${id}`);
        const data = await res.json();
        if (data.article) {
          const a = data.article;
          setTitle(a.title || "");
          setSlug(a.slug || "");
          setExcerpt(a.excerpt || "");
          setContent(a.content || "");
          setCoverImage(a.coverImage || "/showcase/reels_kopi_enrekang.png");
          setCategory(a.category || "Instagram Marketing");
          setTagsInput(Array.isArray(a.tags) ? a.tags.join(", ") : "");
          setReadTime(a.readTime || "4 menit baca");
          setAuthorName(a.authorName || "Tim Edukasi SOLAKI");
          setAuthorRole(a.authorRole || "Digital Strategist");
          setIsPublished(a.isPublished ?? true);
          setIsFeatured(Boolean(a.isFeatured));
        } else {
          setError(data.error || "Artikel tidak ditemukan");
        }
      } catch (err) {
        setError("Gagal mengambil data artikel");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Judul artikel tidak boleh kosong!");
      return;
    }

    setSaving(true);
    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      readTime,
      authorName,
      authorRole,
      isPublished,
      isFeatured,
    };

    try {
      const url = isNew ? "/api/admin/articles" : `/api/admin/articles/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (res.ok) {
        router.push("/solaki/dashboard/articles");
        router.refresh();
      } else {
        setError(resData.error || "Gagal menyimpan artikel");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const PRESET_COVERS = [
    { label: "Kopi Enrekang (Reels)", url: "/showcase/reels_kopi_enrekang.png" },
    { label: "Edukasi UMKM (TikTok)", url: "/showcase/tiktok_edukasi_umkm.png" },
    { label: "Logo Solaki Square", url: "/logo_solaki/Logo_Solaki.png" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* ── Top Bar ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-solaki-border">
        <div className="flex items-center gap-3">
          <Link
            href="/solaki/dashboard/articles"
            className="p-2.5 rounded-xl border border-solaki-border bg-solaki-card text-solaki-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isNew ? "Tulis Artikel Baru" : "Edit Artikel"}
            </h1>
            <p className="text-xs text-solaki-muted font-inter mt-0.5">
              {isNew
                ? "Bagikan edukasi dan strategi digital yang bermanfaat untuk UMKM."
                : `Mengedit artikel: /blog/${slug}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "edit" ? "preview" : "edit")}
            className="px-4 py-2 rounded-xl border border-solaki-border bg-solaki-card text-xs font-semibold text-white/90 hover:text-white flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {activeTab === "edit" ? "Pratinjau Tampilan" : "Kembali ke Form"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary px-6 py-2 text-xs font-bold flex items-center gap-2 shadow-lg shadow-solaki-teal/20"
          >
            <Save className="w-4 h-4" />
            {saving ? "Menyimpan..." : "Simpan Artikel"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-inter">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-solaki-muted text-xs">
          Memuat data artikel...
        </div>
      ) : activeTab === "preview" ? (
        /* ── Live Preview Mode ───────────────────────── */
        <div className="p-6 sm:p-10 rounded-2xl bg-solaki-card border border-solaki-border space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-solaki-teal/15 text-solaki-teal border border-solaki-teal/30">
            {category}
          </div>
          <h1 className="text-3xl font-black text-white">{title || "Judul Artikel Anda"}</h1>
          <p className="text-sm text-solaki-muted font-inter">{excerpt || "Ringkasan artikel..."}</p>

          <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-solaki-darker border border-solaki-border">
            <Image src={coverImage} alt={title || "Cover"} fill className="object-cover" />
          </div>

          <div className="prose prose-invert max-w-none text-white/90 font-inter text-sm space-y-4">
            {content.split("\n\n").map((block, i) => {
              if (block.startsWith("### ")) {
                return <h3 key={i} className="text-xl font-bold text-white mt-6">{block.replace("### ", "")}</h3>;
              }
              if (block.startsWith("#### ")) {
                return <h4 key={i} className="text-lg font-semibold text-solaki-teal mt-4">{block.replace("#### ", "")}</h4>;
              }
              if (block.startsWith("> ")) {
                return <blockquote key={i} className="p-3 bg-emerald-500/10 border-l-4 border-solaki-teal text-emerald-200">{block.replace("> ", "")}</blockquote>;
              }
              return <p key={i}>{block}</p>;
            })}
          </div>
        </div>
      ) : (
        /* ── Edit Form Mode ──────────────────────────── */
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Judul & Slug */}
              <div className="p-6 rounded-2xl bg-solaki-card border border-solaki-border space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Judul Artikel *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 5 Trik Bikin Reels Instagram FYP untuk Bisnis Kuliner"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-solaki-darker border border-solaki-border rounded-xl text-white placeholder:text-solaki-subtle focus:outline-none focus:border-solaki-teal font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-solaki-muted uppercase tracking-wider mb-2">
                    Slug URL (Alamat Tautan)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-solaki-muted font-mono">/blog/</span>
                    <input
                      type="text"
                      required
                      placeholder="5-trik-reels-instagram-kuliner"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-solaki-darker border border-solaki-border rounded-lg text-white font-mono placeholder:text-solaki-subtle focus:outline-none focus:border-solaki-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Ringkasan Artikel (Excerpt)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tulis ringkasan singkat 1-2 kalimat untuk kartu artikel dan cuplikan Google..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-solaki-darker border border-solaki-border rounded-xl text-white placeholder:text-solaki-subtle focus:outline-none focus:border-solaki-teal leading-relaxed"
                  />
                </div>
              </div>

              {/* Isi Artikel (Markdown Body) */}
              <div className="p-6 rounded-2xl bg-solaki-card border border-solaki-border space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">
                    Isi Konten Artikel (Mendukung Markdown)
                  </label>
                  <span className="text-[11px] text-solaki-muted font-mono">
                    Gunakan ### untuk Judul Bagian, &gt; untuk Tips Box
                  </span>
                </div>
                <textarea
                  rows={16}
                  placeholder={`### Judul Pembahasan\n\nTulis isi paragraf di sini...\n\n#### 1. Poin Utama\n- Poin pertama\n- Poin kedua\n\n> Tips Praktis SOLAKI: Catatan penting untuk UMKM.`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-mono bg-solaki-darker border border-solaki-border rounded-xl text-white placeholder:text-solaki-subtle focus:outline-none focus:border-solaki-teal leading-relaxed"
                />
              </div>
            </div>

            {/* Sidebar Settings Column (1 col) */}
            <div className="space-y-6">
              {/* Status & Featured */}
              <div className="p-6 rounded-2xl bg-solaki-card border border-solaki-border space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-solaki-border/40 pb-3">
                  Status Publikasi
                </h3>

                <label className="flex items-center justify-between p-3 rounded-xl bg-solaki-darker border border-solaki-border/60 cursor-pointer">
                  <span className="text-xs font-semibold text-white">Tayangkan Artikel</span>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-solaki-teal accent-solaki-teal cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-solaki-darker border border-solaki-border/60 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-white block">Artikel Utama (Featured)</span>
                    <span className="text-[10px] text-solaki-muted">Tampil di banner atas blog</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-solaki-teal accent-solaki-teal cursor-pointer"
                  />
                </label>
              </div>

              {/* Kategori & Tags */}
              <div className="p-6 rounded-2xl bg-solaki-card border border-solaki-border space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-solaki-border/40 pb-3">
                  Kategori & Topik
                </h3>

                <div>
                  <label className="block text-xs font-bold text-solaki-muted mb-2">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ArticleItem["category"])}
                    className="w-full px-3 py-2 text-xs bg-solaki-darker border border-solaki-border rounded-xl text-white focus:outline-none focus:border-solaki-teal"
                  >
                    {ARTICLE_CATEGORIES.filter((c) => c !== "Semua").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-solaki-muted mb-2">Tags (Pisahkan koma)</label>
                  <input
                    type="text"
                    placeholder="Reels, Kuliner, FYP, F&B"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-solaki-darker border border-solaki-border rounded-xl text-white placeholder:text-solaki-subtle focus:outline-none focus:border-solaki-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-solaki-muted mb-2">Estimasi Waktu Baca</label>
                  <input
                    type="text"
                    placeholder="4 menit baca"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-solaki-darker border border-solaki-border rounded-xl text-white placeholder:text-solaki-subtle focus:outline-none focus:border-solaki-teal"
                  />
                </div>
              </div>

              {/* Gambar Sampul (Cover Image) */}
              <div className="p-6 rounded-2xl bg-solaki-card border border-solaki-border space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-solaki-border/40 pb-3">
                  Gambar Sampul (Cover)
                </h3>

                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-solaki-darker border border-solaki-border">
                  <Image src={coverImage} alt="Cover Preview" fill className="object-cover" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-solaki-muted mb-2">URL Gambar</label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-solaki-darker border border-solaki-border rounded-xl text-white font-mono placeholder:text-solaki-subtle focus:outline-none focus:border-solaki-teal"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-solaki-muted font-semibold block">Pilih Gambar Preset:</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COVERS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setCoverImage(preset.url)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                          coverImage === preset.url
                            ? "bg-solaki-teal text-white border-solaki-teal"
                            : "bg-solaki-darker text-solaki-muted border-solaki-border hover:text-white"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Penulis */}
              <div className="p-6 rounded-2xl bg-solaki-card border border-solaki-border space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-solaki-border/40 pb-3">
                  Profil Penulis
                </h3>
                <div>
                  <label className="block text-xs font-bold text-solaki-muted mb-1.5">Nama Penulis</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-solaki-darker border border-solaki-border rounded-xl text-white focus:outline-none focus:border-solaki-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-solaki-muted mb-1.5">Jabatan / Role</label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-solaki-darker border border-solaki-border rounded-xl text-white focus:outline-none focus:border-solaki-teal"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
