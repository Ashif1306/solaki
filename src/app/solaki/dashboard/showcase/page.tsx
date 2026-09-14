"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Upload,
  Link2,
  CheckCircle2,
  X,
  RefreshCw,
  Search,
  Filter,
  Check,
  AlertCircle,
  BarChart3,
  Video,
} from "lucide-react";
import Image from "next/image";

interface ShowcaseItem {
  id: string;
  order: number;
  platform: "instagram" | "tiktok";
  title: string;
  caption: string;
  mediaUrl: string;
  postUrl?: string;
  format: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: string;
  reachMultiplier: string;
  hookStrategy: string;
  contentPillar: string;
  targetAudience: string;
  keyTakeaway: string;
  sentimentScore: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt?: string;
}

const emptyForm: Omit<ShowcaseItem, "id"> = {
  order: 0,
  platform: "instagram",
  title: "",
  caption: "",
  mediaUrl: "",
  postUrl: "",
  format: "Instagram Reels (9:16)",
  views: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  saves: 0,
  engagementRate: "8.5%",
  reachMultiplier: "4.2x",
  hookStrategy: "",
  contentPillar: "Storytelling & Edukasi",
  targetAudience: "Pelaku UMKM & Gen-Z (18-35 Thn)",
  keyTakeaway: "",
  sentimentScore: "98% Positif",
  isActive: true,
  isFeatured: false,
};

export default function AdminShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [fetchingMeta, setFetchingMeta] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const [activeFilter, setActiveFilter] = useState<"all" | "instagram" | "tiktok">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ShowcaseItem, "id">>(emptyForm);

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/showcase");
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal memuat data showcase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      order: items.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ShowcaseItem) => {
    setEditingId(item.id);
    setFormData({
      order: item.order,
      platform: item.platform,
      title: item.title,
      caption: item.caption,
      mediaUrl: item.mediaUrl,
      postUrl: item.postUrl || "",
      format: item.format,
      views: item.views,
      likes: item.likes,
      comments: item.comments,
      shares: item.shares,
      saves: item.saves,
      engagementRate: item.engagementRate,
      reachMultiplier: item.reachMultiplier,
      hookStrategy: item.hookStrategy,
      contentPillar: item.contentPillar,
      targetAudience: item.targetAudience,
      keyTakeaway: item.keyTakeaway,
      sentimentScore: item.sentimentScore,
      isActive: item.isActive,
      isFeatured: item.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Gagal mengunggah file");
      }

      setFormData((prev) => ({ ...prev, mediaUrl: json.url }));
      showAlert("success", "Gambar media berhasil diunggah!");
    } catch (err) {
      showAlert("error", (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleFetchMetadata = async () => {
    if (!formData.postUrl) {
      showAlert("error", "Harap masukkan URL postingan Instagram atau TikTok terlebih dahulu.");
      return;
    }

    try {
      setFetchingMeta(true);
      const res = await fetch("/api/admin/showcase/fetch-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.postUrl }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Gagal menarik data");
      }

      setFormData((prev) => ({
        ...prev,
        platform: json.platform || prev.platform,
        title: json.title || prev.title,
        caption: json.caption || prev.caption,
        format: json.format || prev.format,
        mediaUrl: json.mediaUrl ? json.mediaUrl : prev.mediaUrl,
      }));

      showAlert("success", "Metadata konten berhasil ditarik otomatis!");
    } catch (err) {
      showAlert("error", (err as Error).message);
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showAlert("error", "Judul konten wajib diisi.");
      return;
    }
    if (!formData.mediaUrl.trim()) {
      showAlert("error", "Gambar/Media konten wajib diunggah atau diisi URL-nya.");
      return;
    }

    try {
      setSaving(true);
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { ...formData, id: editingId } : formData;

      const res = await fetch("/api/admin/showcase", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Gagal menyimpan konten");
      }

      showAlert("success", editingId ? "Konten berhasil diperbarui!" : "Konten showcase baru berhasil ditambahkan!");
      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      showAlert("error", (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus konten "${title}" dari showcase?`)) return;

    try {
      const res = await fetch(`/api/admin/showcase?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Gagal menghapus");
      }

      showAlert("success", "Konten berhasil dihapus.");
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      showAlert("error", (err as Error).message);
    }
  };

  const handleToggleActive = async (item: ShowcaseItem) => {
    try {
      const newStatus = !item.isActive;
      const res = await fetch("/api/admin/showcase", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, isActive: newStatus }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isActive: newStatus } : i))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered items
  const filteredItems = items.filter((item) => {
    const matchesPlatform = activeFilter === "all" || item.platform === activeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contentPillar.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const totalViews = items.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLikes = items.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  return (
    <div className="space-y-8">
      {/* Alert message */}
      {alert && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-lg border transition-all ${
            alert.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : "bg-red-950/90 border-red-500/50 text-red-200"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{alert.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-solaki-teal/20 text-solaki-teal text-xs font-bold uppercase tracking-wider">
              Showcase Media Sosial
            </span>
            <span className="text-xs text-solaki-muted">• Instagram & TikTok</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Katalog Konten & Analisis Strategis
          </h1>
          <p className="text-solaki-muted text-sm mt-1 max-w-2xl font-inter">
            Kelola karya media sosial yang dipamerkan di website, lengkap dengan metrik jangkauan dan analisis hook yang membuktikan keahlian agensi Anda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchItems}
            className="p-2.5 rounded-xl border border-solaki-border bg-solaki-surface text-solaki-muted hover:text-white hover:border-solaki-teal transition-colors"
            title="Muat Ulang"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-solaki-teal" : ""}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="btn-primary py-2.5 px-4 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-solaki-teal/30"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Konten</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bento-card p-5">
          <div className="flex items-center justify-between text-solaki-muted mb-2">
            <span className="text-xs font-semibold">Total Konten</span>
            <Video className="w-4 h-4 text-solaki-teal" />
          </div>
          <div className="text-2xl font-black text-white">{items.length}</div>
          <span className="text-[11px] text-solaki-subtle font-inter">Instagram & TikTok terdaftar</span>
        </div>

        <div className="bento-card p-5">
          <div className="flex items-center justify-between text-solaki-muted mb-2">
            <span className="text-xs font-semibold">Akumulasi Views</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalViews.toLocaleString("id-ID")}</div>
          <span className="text-[11px] text-solaki-subtle font-inter">Jangkauan tayangan video</span>
        </div>

        <div className="bento-card p-5">
          <div className="flex items-center justify-between text-solaki-muted mb-2">
            <span className="text-xs font-semibold">Total Interaksi</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalLikes.toLocaleString("id-ID")}</div>
          <span className="text-[11px] text-solaki-subtle font-inter">Likes & apresiasi audiens</span>
        </div>

        <div className="bento-card p-5">
          <div className="flex items-center justify-between text-solaki-muted mb-2">
            <span className="text-xs font-semibold">Konten Aktif</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {items.filter((i) => i.isActive).length}
          </div>
          <span className="text-[11px] text-solaki-subtle font-inter">Tampil di halaman depan</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-solaki-surface/60 p-3.5 rounded-2xl border border-solaki-border">
        {/* Platform tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-solaki-teal text-white shadow-md shadow-solaki-teal/30"
                : "text-solaki-muted hover:text-white"
            }`}
          >
            Semua ({items.length})
          </button>
          <button
            onClick={() => setActiveFilter("instagram")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "instagram"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "text-solaki-muted hover:text-white"
            }`}
          >
            <span>Instagram</span>
            <span className="text-[10px] opacity-80">
              ({items.filter((i) => i.platform === "instagram").length})
            </span>
          </button>
          <button
            onClick={() => setActiveFilter("tiktok")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === "tiktok"
                ? "bg-black text-white border border-white/30 shadow-md"
                : "text-solaki-muted hover:text-white"
            }`}
          >
            <span>TikTok</span>
            <span className="text-[10px] opacity-80">
              ({items.filter((i) => i.platform === "tiktok").length})
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-solaki-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul, pilar, caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-solaki-bg border border-solaki-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-solaki-teal"
          />
        </div>
      </div>

      {/* Grid of Showcase Items */}
      {loading ? (
        <div className="py-20 text-center text-solaki-muted">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-solaki-teal" />
          <p className="text-sm">Memuat koleksi showcase...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bento-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-solaki-muted">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Belum Ada Konten Showcase</h3>
          <p className="text-sm text-solaki-muted max-w-md mx-auto mb-6">
            Mulai pamerkan video Reels Instagram atau TikTok karya agensi Anda beserta analisis strategi mendalam.
          </p>
          <button
            onClick={handleOpenAdd}
            className="btn-primary py-2.5 px-5 rounded-xl text-sm font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Konten Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bento-card overflow-hidden flex flex-col justify-between group transition-all duration-300 ${
                !item.isActive ? "opacity-60 border-dashed" : "border-solaki-border hover:border-solaki-teal/50"
              }`}
            >
              {/* Media Thumbnail & Badges */}
              <div className="relative aspect-[4/3] bg-black/60 overflow-hidden">
                {item.mediaUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-solaki-muted">
                    <Video className="w-10 h-10 opacity-30" />
                  </div>
                )}

                {/* Platform Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg ${
                      item.platform === "instagram"
                        ? "bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white border border-pink-400/30"
                        : "bg-black/90 text-white border border-white/20"
                    }`}
                  >
                    {item.platform === "instagram" ? "Instagram" : "TikTok"}
                  </span>

                  {item.isFeatured && (
                    <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/90 text-black shadow-md flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Unggulan
                    </span>
                  )}
                </div>

                {/* Status Switcher Button */}
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[11px] font-semibold backdrop-blur-md transition-colors ${
                    item.isActive
                      ? "bg-emerald-500/80 text-white border border-emerald-400/40"
                      : "bg-black/80 text-solaki-muted border border-white/20 hover:text-white"
                  }`}
                  title={item.isActive ? "Klik untuk sembunyikan dari web" : "Klik untuk tampilkan di web"}
                >
                  {item.isActive ? "Aktif" : "Draft"}
                </button>

                {/* Metrics ribbon overlay at bottom of thumbnail */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-6 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      {item.views > 0 ? item.views.toLocaleString("id-ID") : "—"}
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      {item.likes > 0 ? item.likes.toLocaleString("id-ID") : "—"}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-solaki-glow bg-solaki-teal/30 px-2 py-0.5 rounded border border-solaki-teal/40">
                    ER {item.engagementRate || "—"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-solaki-teal font-semibold uppercase tracking-wider mb-1">
                    <span>{item.format}</span>
                    <span>•</span>
                    <span className="text-solaki-muted truncate">{item.contentPillar}</span>
                  </div>
                  <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-solaki-glow transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-solaki-muted mt-1.5 line-clamp-2 font-inter leading-relaxed">
                    {item.caption || "Tidak ada deskripsi caption."}
                  </p>
                </div>

                {/* Content Analysis Highlight Snippet */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs font-inter">
                  {item.hookStrategy && (
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                        Strategi Hook 3 Detik:
                      </span>
                      <p className="text-slate-300 line-clamp-2 mt-0.5">{item.hookStrategy}</p>
                    </div>
                  )}

                  {item.keyTakeaway && (
                    <div>
                      <span className="text-[10px] font-bold text-solaki-teal uppercase tracking-wider block">
                        Dampak Bisnis (Key Takeaway):
                      </span>
                      <p className="text-slate-300 line-clamp-2 mt-0.5">{item.keyTakeaway}</p>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-solaki-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.postUrl && (
                      <a
                        href={item.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-solaki-muted hover:text-white transition-colors"
                        title="Buka Postingan Asli"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <span className="text-[11px] text-solaki-subtle font-mono">Urutan #{item.order}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-solaki-teal/20 text-solaki-muted hover:text-solaki-glow transition-colors cursor-pointer"
                      title="Edit Konten & Analisis"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-solaki-muted hover:text-red-400 transition-colors cursor-pointer"
                      title="Hapus Konten"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL: TAMBAH / EDIT SHOWCASE ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 bg-solaki-surface border border-solaki-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-solaki-border flex items-center justify-between bg-solaki-bg">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-solaki-teal/20 text-solaki-teal">
                  <Video className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingId ? "Edit Showcase Media Sosial" : "Tambah Konten Showcase Baru"}
                  </h3>
                  <p className="text-xs text-solaki-muted">
                    Masukkan gambar media sosial, link postingan, serta analisis performa strategis.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-solaki-muted hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
              {/* 1. Platform & URL Quick Fetch */}
              <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Platform & Link Konten
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, platform: "instagram", format: "Instagram Reels (9:16)" })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        formData.platform === "instagram"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm"
                          : "bg-white/5 text-solaki-muted hover:text-white"
                      }`}
                    >
                      Instagram
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, platform: "tiktok", format: "TikTok Video / FYP" })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        formData.platform === "tiktok"
                          ? "bg-black text-white border border-white/30 shadow-sm"
                          : "bg-white/5 text-solaki-muted hover:text-white"
                      }`}
                    >
                      TikTok
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="w-4 h-4 text-solaki-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="Tempelkan link postingan Instagram Reels atau TikTok (opsional)..."
                      value={formData.postUrl}
                      onChange={(e) => setFormData({ ...formData, postUrl: e.target.value })}
                      className="w-full bg-solaki-bg border border-solaki-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-solaki-subtle focus:outline-none focus:border-solaki-teal"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchMetadata}
                    disabled={fetchingMeta || !formData.postUrl}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white disabled:opacity-40 transition-colors flex items-center gap-1.5 flex-shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${fetchingMeta ? "animate-spin text-solaki-teal" : ""}`} />
                    <span>{fetchingMeta ? "Menarik..." : "Tarik Data URL"}</span>
                  </button>
                </div>
              </div>

              {/* 2. Media Image Upload & Preview */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Media / Gambar Konten <span className="text-rose-400">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Thumbnail Preview */}
                  <div className="sm:col-span-4 aspect-[4/3] rounded-xl bg-black border border-solaki-border overflow-hidden relative flex items-center justify-center">
                    {formData.mediaUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.mediaUrl}
                        alt="Preview"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="text-center p-3 text-solaki-muted">
                        <Video className="w-8 h-8 mx-auto opacity-30 mb-1" />
                        <span className="text-[11px] block">Belum ada gambar</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="sm:col-span-8 space-y-2.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn-primary py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploading ? "Mengunggah..." : "Unggah Gambar"}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Atau tempel URL gambar langsung (misal: /showcase/reels.png atau https://...)"
                        value={formData.mediaUrl}
                        onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                        className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-2 text-xs text-white placeholder:text-solaki-subtle focus:outline-none focus:border-solaki-teal"
                      />
                    </div>
                    <span className="text-[11px] text-solaki-subtle block font-inter">
                      Rekomendasi rasio: 9:16 (Vertikal Video/Reels/TikTok) atau 1:1 / 4:5 (Feed Carousel).
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Judul Konten <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Reels: Strategi Rebranding Kopi Lokal"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-solaki-teal"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Format Konten
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Instagram Reels (9:16) / TikTok FYP"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-solaki-teal"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Deskripsi / Intisari Caption
                </label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan latar belakang postingan atau salinan caption kunci..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-solaki-teal"
                />
              </div>

              {/* 4. Performance Metrics */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-solaki-glow uppercase tracking-wider">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Metrik Performa Konten</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-solaki-muted block mb-1">Total Views</label>
                    <input
                      type="number"
                      placeholder="124500"
                      value={formData.views || ""}
                      onChange={(e) => setFormData({ ...formData, views: Number(e.target.value) })}
                      className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-solaki-teal"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-solaki-muted block mb-1">Likes</label>
                    <input
                      type="number"
                      placeholder="8900"
                      value={formData.likes || ""}
                      onChange={(e) => setFormData({ ...formData, likes: Number(e.target.value) })}
                      className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-solaki-teal"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-solaki-muted block mb-1">Comments</label>
                    <input
                      type="number"
                      placeholder="430"
                      value={formData.comments || ""}
                      onChange={(e) => setFormData({ ...formData, comments: Number(e.target.value) })}
                      className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-solaki-teal"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-solaki-muted block mb-1">Shares & Saves</label>
                    <input
                      type="number"
                      placeholder="1500"
                      value={formData.shares || ""}
                      onChange={(e) => setFormData({ ...formData, shares: Number(e.target.value) })}
                      className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-solaki-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] text-solaki-muted block mb-1">Engagement Rate (ER)</label>
                    <input
                      type="text"
                      placeholder="Contoh: 9.8%"
                      value={formData.engagementRate}
                      onChange={(e) => setFormData({ ...formData, engagementRate: e.target.value })}
                      className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-solaki-teal"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-solaki-muted block mb-1">Reach Multiplier</label>
                    <input
                      type="text"
                      placeholder="Contoh: 5.4x Organic Reach"
                      value={formData.reachMultiplier}
                      onChange={(e) => setFormData({ ...formData, reachMultiplier: e.target.value })}
                      className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-solaki-teal"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Strategic Content Analysis */}
              <div className="p-4 rounded-xl bg-solaki-teal/[0.06] border border-solaki-teal/20 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-solaki-teal uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Analisis Konten & Strategi Agensi</span>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    Analisis Hook 3 Detik Pertama
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Menampilkan blind test perbandingan kemasan lama vs baru untuk menciptakan visual pattern-interrupt..."
                    value={formData.hookStrategy}
                    onChange={(e) => setFormData({ ...formData, hookStrategy: e.target.value })}
                    className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-solaki-teal"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Pilar Konten</label>
                    <input
                      type="text"
                      placeholder="Contoh: Storytelling / Brand Transformation"
                      value={formData.contentPillar}
                      onChange={(e) => setFormData({ ...formData, contentPillar: e.target.value })}
                      className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-solaki-teal"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Target Audiens</label>
                    <input
                      type="text"
                      placeholder="Contoh: Pecinta Kopi & Anak Muda 18-35 Thn"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-solaki-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    Dampak Nyata / Key Takeaway bagi Klien
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Peningkatan pesanan langsung via WhatsApp sebesar 185% dalam 7 hari pasca peluncuran video..."
                    value={formData.keyTakeaway}
                    onChange={(e) => setFormData({ ...formData, keyTakeaway: e.target.value })}
                    className="w-full bg-solaki-bg border border-solaki-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-solaki-teal"
                  />
                </div>
              </div>

              {/* 6. Settings (Active, Featured, Order) */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-solaki-border text-xs">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-solaki-teal focus:ring-0 cursor-pointer"
                    />
                    <span className="text-slate-300 font-semibold">Tampilkan di Website</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-slate-300 font-semibold">Tandai Unggulan</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-solaki-muted">Nomor Urutan:</span>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-16 bg-solaki-bg border border-solaki-border rounded-lg px-2 py-1 text-center text-xs text-white"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-solaki-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-solaki-muted hover:text-white hover:bg-white/5 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary py-2 px-5 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Publikasikan Showcase"}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
