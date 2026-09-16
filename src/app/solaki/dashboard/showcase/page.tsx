"use client";

import ShowcaseMedia from "@/components/ShowcaseMedia";
import { safeMediaUrl, socialEmbedUrl } from "@/lib/showcase-media";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles, Plus, Trash2, Edit2, ExternalLink,
  Eye, Heart, MessageCircle, Share2, Bookmark, TrendingUp,
  Upload, Link2, CheckCircle2, X, RefreshCw, Search,
  Check, AlertCircle, Video, Zap, ChevronRight, Info,
} from "lucide-react";

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
  order: 0, platform: "instagram", title: "", caption: "",
  mediaUrl: "", postUrl: "", format: "Instagram Reels (9:16)",
  views: 0, likes: 0, comments: 0, shares: 0, saves: 0,
  engagementRate: "", reachMultiplier: "",
  hookStrategy: "", contentPillar: "Storytelling & Edukasi",
  targetAudience: "Pelaku UMKM & Gen-Z (18-35 Thn)",
  keyTakeaway: "", sentimentScore: "98% Positif",
  isActive: true, isFeatured: false,
};

function calcER(likes: number, comments: number, saves: number, shares: number, views: number): string {
  const interactions = likes + comments + saves + shares;
  const base = Math.max(views || likes, 1);
  if (interactions === 0) return "";
  return ((interactions / base) * 100).toFixed(1) + "%";
}

function MetricInput({ icon, label, value, placeholder, borderColor, onChange }: {
  icon: React.ReactNode; label: string; value: number;
  placeholder: string; borderColor: string; onChange: (v: number) => void;
}) {
  return (
    <div className={`p-3 rounded-xl border bg-white/[0.025] ${borderColor} space-y-2`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{label}</span>
      </div>
      <input
        type="number" min="0" placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-white/30 placeholder:text-white/20"
      />
    </div>
  );
}

export default function AdminShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "instagram" | "tiktok">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ShowcaseItem, "id">>(emptyForm);
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [syncingIg, setSyncingIg] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [igStatus, setIgStatus] = useState<{
    configured: boolean; valid?: boolean;
    account?: { username: string; mediaCount: number };
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4500);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/showcase");
      const data = await res.json();
      if (data.items) setItems(data.items);
    } catch (err) { console.error(err); showAlert("error", "Gagal memuat data showcase."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); checkIgStatus(); }, []); // eslint-disable-line



  const checkIgStatus = async () => {
    try {
      const res = await fetch("/api/admin/showcase/sync-instagram");
      setIgStatus(await res.json());
    } catch { setIgStatus(null); }
  };

  const handleSyncInstagram = async () => {
    setSyncingIg(true);
    try {
      const res = await fetch("/api/admin/showcase/sync-instagram", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.error) { showAlert("error", data.error || "Gagal sinkronisasi."); return; }
      showAlert("success", data.message || "Sinkronisasi berhasil!");
      fetchItems();
    } catch (err) { showAlert("error", (err as Error).message); }
    finally { setSyncingIg(false); }
  };

  const handleRefreshMetrics = async (item: ShowcaseItem) => {
    if (refreshingId) return;
    setRefreshingId(item.id);
    try {
      const res = await fetch("/api/admin/showcase/update-metrics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await res.json();
      if (data.success) { showAlert("success", "Metrik diperbarui dari Instagram!"); fetchItems(); }
      else showAlert("error", data.error || "Gagal memperbarui metrik.");
    } catch (err) { showAlert("error", (err as Error).message); }
    finally { setRefreshingId(null); }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, order: items.length + 1 });
    setFormStep(1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ShowcaseItem) => {
    setEditingId(item.id);
    setFormData({
      order: item.order, platform: item.platform, title: item.title,
      caption: item.caption, mediaUrl: item.mediaUrl, postUrl: item.postUrl || "",
      format: item.format, views: item.views, likes: item.likes,
      comments: item.comments, shares: item.shares, saves: item.saves,
      engagementRate: item.engagementRate, reachMultiplier: item.reachMultiplier,
      hookStrategy: item.hookStrategy, contentPillar: item.contentPillar,
      targetAudience: item.targetAudience, keyTakeaway: item.keyTakeaway,
      sentimentScore: item.sentimentScore, isActive: item.isActive, isFeatured: item.isFeatured,
    });
    setFormStep(1);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Gagal mengunggah");
      setFormData((prev) => ({ ...prev, mediaUrl: json.url }));
      showAlert("success", "Media berhasil diunggah!");
    } catch (err) { showAlert("error", (err as Error).message); }
    finally { setUploading(false); }
  };

  const handleFetchMetadata = async () => {
    if (!formData.postUrl) { showAlert("error", "Masukkan URL postingan terlebih dahulu."); return; }
    setFetchingMeta(true);
    try {
      const res = await fetch("/api/admin/showcase/fetch-meta", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.postUrl }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Gagal menarik data");
      setFormData((prev) => ({
        ...prev, platform: json.platform || prev.platform,
        title: json.title || prev.title, caption: json.caption || prev.caption,
        format: json.format || prev.format, mediaUrl: json.mediaUrl || prev.mediaUrl,
      }));
      showAlert("success", "Metadata berhasil ditarik otomatis!");
    } catch (err) { showAlert("error", (err as Error).message); }
    finally { setFetchingMeta(false); }
  };

  const updateMetric = (field: keyof Omit<ShowcaseItem, "id">, value: number) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      const auto = calcER(next.likes, next.comments, next.saves, next.shares, next.views);
      return { ...next, engagementRate: auto || next.engagementRate };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { showAlert("error", "Judul konten wajib diisi."); return; }
    if (!safeMediaUrl(formData.mediaUrl.trim()) && !socialEmbedUrl(formData.postUrl?.trim())) { showAlert("error", "Masukkan gambar/video atau tautan postingan Instagram/TikTok lengkap (bukan profil atau tautan pendek)."); return; }
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { ...formData, id: editingId } : formData;
      const res = await fetch("/api/admin/showcase", {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Gagal menyimpan");
      showAlert("success", editingId ? "Konten berhasil diperbarui!" : "Konten baru berhasil ditambahkan!");
      setIsModalOpen(false);
      fetchItems();
    } catch (err) { showAlert("error", (err as Error).message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/showcase?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Gagal menghapus");
      showAlert("success", "Konten berhasil dihapus.");
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) { showAlert("error", (err as Error).message); }
  };

  const handleToggleActive = async (item: ShowcaseItem) => {
    const newStatus = !item.isActive;
    const res = await fetch("/api/admin/showcase", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isActive: newStatus }),
    });
    if (res.ok) setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isActive: newStatus } : i)));
  };

  const filteredItems = items.filter((item) => {
    const matchP = activeFilter === "all" || item.platform === activeFilter;
    const matchS = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contentPillar.toLowerCase().includes(searchQuery.toLowerCase());
    return matchP && matchS;
  });

  const totalViews = items.reduce((a, c) => a + (c.views || 0), 0);
  const totalLikes = items.reduce((a, c) => a + (c.likes || 0), 0);
  const autoER = calcER(formData.likes, formData.comments, formData.saves, formData.shares, formData.views);

  const steps = [
    { n: 1 as const, label: "URL & Media" },
    { n: 2 as const, label: "Metrik" },
    { n: 3 as const, label: "Analisis" },
  ];

  return (
    <div className="space-y-8">
      {alert && (
        <div className={`fixed top-6 right-6 z-[100] p-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-lg border pointer-events-auto ${alert.type === "success" ? "bg-emerald-950/95 border-emerald-500/80 text-emerald-100 ring-1 ring-emerald-500/30" : "bg-red-950/95 border-red-500/80 text-red-100 ring-1 ring-red-500/30"}`}>
          {alert.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
          <span className="text-sm font-medium">{alert.message}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-solaki-teal/20 text-solaki-teal text-xs font-bold uppercase tracking-wider">Showcase Media Sosial</span>
            <span className="text-xs text-solaki-muted">&bull; Instagram & TikTok</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Katalog Konten & Analisis Strategis</h1>
          <p className="text-solaki-muted text-sm mt-1 max-w-2xl font-inter">Kelola karya media sosial, lengkap dengan metrik jangkauan dan analisis hook.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchItems} className="p-2.5 rounded-xl border border-solaki-border bg-solaki-surface text-solaki-muted hover:text-white hover:border-solaki-teal transition-colors" title="Muat Ulang">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-solaki-teal" : ""}`} />
          </button>
          <button onClick={handleOpenAdd} className="btn-primary py-2.5 px-4 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-solaki-teal/30">
            <Plus className="w-4 h-4" /><span>Tambah Konten</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Konten", value: items.length, sub: "Instagram & TikTok", icon: <Video className="w-4 h-4 text-solaki-teal" /> },
          { label: "Akumulasi Views", value: totalViews.toLocaleString("id-ID"), sub: "Jangkauan tayangan", icon: <Eye className="w-4 h-4 text-blue-400" /> },
          { label: "Total Interaksi", value: totalLikes.toLocaleString("id-ID"), sub: "Likes & apresiasi", icon: <Heart className="w-4 h-4 text-rose-400" /> },
          { label: "Konten Aktif", value: items.filter((i) => i.isActive).length, sub: "Tampil di website", icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
        ].map((s) => (
          <div key={s.label} className="bento-card p-5">
            <div className="flex items-center justify-between text-solaki-muted mb-2"><span className="text-xs font-semibold">{s.label}</span>{s.icon}</div>
            <div className="text-2xl font-black text-white">{s.value}</div>
            <span className="text-[11px] text-solaki-subtle font-inter">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="bento-card p-5 border-solaki-border bg-gradient-to-r from-purple-950/30 to-pink-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex-shrink-0">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">Sinkronisasi Otomatis Instagram</h3>
                {igStatus?.configured && igStatus?.valid ? <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Terhubung</span>
                  : igStatus?.configured ? <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">Token Error</span>
                  : <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">Belum dikonfigurasi</span>}
              </div>
              {igStatus?.valid && igStatus.account
                ? <p className="text-xs text-solaki-muted mt-0.5 font-inter">@{igStatus.account.username} &bull; {igStatus.account.mediaCount} postingan &bull; Tarik reach, saves, shares & video_views otomatis</p>
                : <p className="text-xs text-solaki-muted mt-0.5 font-inter">Tambahkan <code className="bg-white/10 px-1 rounded text-pink-300">INSTAGRAM_ACCESS_TOKEN</code> & <code className="bg-white/10 px-1 rounded text-pink-300">INSTAGRAM_USER_ID</code> di <code className="bg-white/10 px-1 rounded text-white">.env.local</code></p>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!igStatus?.configured && (
              <a href="https://developers.facebook.com/docs/instagram-basic-display-api" target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 rounded-xl border border-solaki-border text-xs font-semibold text-solaki-muted hover:text-white transition-colors flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />Panduan Setup
              </a>
            )}
            <button onClick={handleSyncInstagram} disabled={syncingIg || !igStatus?.valid} className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 shadow-lg shadow-pink-500/25">
              <RefreshCw className={`w-3.5 h-3.5 ${syncingIg ? "animate-spin" : ""}`} />{syncingIg ? "Menyinkronkan..." : "Sync Sekarang"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-solaki-surface/60 p-3.5 rounded-2xl border border-solaki-border">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {([
            { id: "all" as const, label: `Semua (${items.length})`, cls: "bg-solaki-teal text-white shadow-md shadow-solaki-teal/30" },
            { id: "instagram" as const, label: `IG (${items.filter(i => i.platform === "instagram").length})`, cls: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md" },
            { id: "tiktok" as const, label: `TikTok (${items.filter(i => i.platform === "tiktok").length})`, cls: "bg-black text-white border border-white/30 shadow-md" },
          ]).map((tab) => (
            <button key={tab.id} onClick={() => setActiveFilter(tab.id)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeFilter === tab.id ? tab.cls : "text-solaki-muted hover:text-white"}`}>{tab.label}</button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-solaki-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Cari judul, pilar, caption..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-solaki-bg border border-solaki-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-solaki-teal" />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-solaki-muted"><RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-solaki-teal" /><p className="text-sm">Memuat koleksi showcase...</p></div>
      ) : filteredItems.length === 0 ? (
        <div className="bento-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-solaki-muted"><Video className="w-8 h-8" /></div>
          <h3 className="text-lg font-bold text-white mb-1">Belum Ada Konten Showcase</h3>
          <p className="text-sm text-solaki-muted max-w-md mx-auto mb-6">Mulai pamerkan video Reels Instagram atau TikTok karya agensi Anda.</p>
          <button onClick={handleOpenAdd} className="btn-primary py-2.5 px-5 rounded-xl text-sm font-bold inline-flex items-center gap-2"><Plus className="w-4 h-4" /><span>Tambah Konten Pertama</span></button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className={`bento-card overflow-hidden flex flex-col justify-between group transition-all duration-300 ${!item.isActive ? "opacity-60 border-dashed" : "border-solaki-border hover:border-solaki-teal/50"}`}>
              <div className="relative aspect-[4/3] bg-black/60 overflow-hidden">
                <ShowcaseMedia mediaUrl={item.mediaUrl} postUrl={item.postUrl} title={item.title} />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg ${item.platform === "instagram" ? "bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white border border-pink-400/30" : "bg-black/90 text-white border border-white/20"}`}>{item.platform === "instagram" ? "Instagram" : "TikTok"}</span>
                  {item.isFeatured && <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase bg-amber-500/90 text-black shadow-md flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" />Unggulan</span>}
                </div>
                <button onClick={() => handleToggleActive(item)} className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[11px] font-semibold backdrop-blur-md transition-colors ${item.isActive ? "bg-emerald-500/80 text-white border border-emerald-400/40" : "bg-black/80 text-solaki-muted border border-white/20 hover:text-white"}`}>{item.isActive ? "Aktif" : "Draft"}</button>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-6 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-1 font-semibold"><Eye className="w-3.5 h-3.5 text-blue-400" />{item.views > 0 ? item.views.toLocaleString("id-ID") : "—"}</span>
                    <span className="flex items-center gap-1 font-semibold"><Heart className="w-3.5 h-3.5 text-rose-400" />{item.likes > 0 ? item.likes.toLocaleString("id-ID") : "—"}</span>
                    <span className="flex items-center gap-1 font-semibold"><Bookmark className="w-3.5 h-3.5 text-cyan-400" />{item.saves > 0 ? item.saves.toLocaleString("id-ID") : "—"}</span>
                  </div>
                  <span className="text-[11px] font-bold text-solaki-glow bg-solaki-teal/30 px-2 py-0.5 rounded border border-solaki-teal/40">ER {item.engagementRate || "—"}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-solaki-teal font-semibold uppercase tracking-wider mb-1"><span>{item.format}</span><span>&bull;</span><span className="text-solaki-muted truncate">{item.contentPillar}</span></div>
                  <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-solaki-glow transition-colors">{item.title}</h3>
                  <p className="text-xs text-solaki-muted mt-1.5 line-clamp-2 font-inter leading-relaxed">{item.caption || "Tidak ada deskripsi."}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs font-inter">
                  {item.hookStrategy && <div><span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Hook 3 Detik:</span><p className="text-slate-300 line-clamp-2 mt-0.5">{item.hookStrategy}</p></div>}
                  {item.keyTakeaway && <div><span className="text-[10px] font-bold text-solaki-teal uppercase tracking-wider block">Dampak Bisnis:</span><p className="text-slate-300 line-clamp-2 mt-0.5">{item.keyTakeaway}</p></div>}
                  {!item.hookStrategy && !item.keyTakeaway && <p className="text-solaki-subtle text-center text-[10px]">Belum ada analisis strategi</p>}
                </div>
                <div className="pt-3 border-t border-solaki-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.postUrl && <a href={item.postUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-solaki-muted hover:text-white transition-colors" title="Buka Postingan Asli"><ExternalLink className="w-4 h-4" /></a>}
                    {igStatus?.valid && item.platform === "instagram" && (
                      <button onClick={() => handleRefreshMetrics(item)} disabled={refreshingId === item.id} className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50" title="Refresh metrik dari Instagram API">
                        <RefreshCw className={`w-4 h-4 ${refreshingId === item.id ? "animate-spin" : ""}`} />
                      </button>
                    )}
                    <span className="text-[11px] text-solaki-subtle font-mono">#{item.order}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg bg-white/5 hover:bg-solaki-teal/20 text-solaki-muted hover:text-solaki-glow transition-colors cursor-pointer" title="Edit"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id, item.title)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-solaki-muted hover:text-red-400 transition-colors cursor-pointer" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 bg-[#0D0D0D] border border-white/10 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-white/[0.07] flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base font-black text-white">{editingId ? "Edit Konten Showcase" : "Tambah Konten Showcase Baru"}</h3>
                <p className="text-xs text-white/40 mt-0.5">Isi langkah demi langkah — semua bisa diedit kapan saja</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex items-center gap-0 px-5 py-3 border-b border-white/[0.07] flex-shrink-0 bg-white/[0.02]">
              {steps.map((s, i) => (
                <div key={s.n} className="flex items-center">
                  <button type="button" onClick={() => setFormStep(s.n)} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${formStep === s.n ? "bg-solaki-teal text-white" : formStep > s.n ? "text-solaki-glow" : "text-white/30"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border ${formStep > s.n ? "bg-solaki-teal/30 border-solaki-teal text-solaki-glow" : formStep === s.n ? "bg-white text-black border-white" : "border-white/20 text-white/30"}`}>{formStep > s.n ? <Check className="w-3 h-3" /> : s.n}</span>
                    {s.label}
                  </button>
                  {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-white/15 mx-1" />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5">
                {formStep === 1 && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-2">Platform</label>
                      <div className="flex gap-2">
                        {([{ id: "instagram" as const, label: "Instagram", ac: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105" }, { id: "tiktok" as const, label: "TikTok", ac: "bg-black text-white border border-white/30 shadow-lg scale-105" }]).map((p) => (
                          <button key={p.id} type="button" onClick={() => setFormData({ ...formData, platform: p.id, format: p.id === "instagram" ? "Instagram Reels (9:16)" : "TikTok Video / FYP" })} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${formData.platform === p.id ? p.ac : "bg-white/5 text-white/40 hover:text-white"}`}>{p.label}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-2">Link Postingan (opsional)</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Link2 className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input type="url" placeholder="Tempel link Instagram Reels atau TikTok..." value={formData.postUrl} onChange={(e) => setFormData({ ...formData, postUrl: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-solaki-teal" />
                        </div>
                        <button type="button" onClick={handleFetchMetadata} disabled={fetchingMeta || !formData.postUrl} className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white disabled:opacity-40 transition-colors flex items-center gap-1.5 flex-shrink-0">
                          <Zap className={`w-3.5 h-3.5 ${fetchingMeta ? "animate-pulse text-yellow-400" : ""}`} />{fetchingMeta ? "Menarik..." : "Auto-Fetch"}
                        </button>
                      </div>
                      <p className="text-[11px] text-white/25 mt-1.5 font-inter">Tempel link postingan lengkap untuk preview otomatis. Video MP4/WebM menampilkan frame tanpa thumbnail tambahan. Embed mengikuti ketersediaan postingan publik.</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-2">Foto / Video <span className="text-white/30">(opsional jika ada link postingan)</span></label>
                      <div className="grid grid-cols-12 gap-4 items-start">
                        <div className="col-span-4 aspect-[9/12] rounded-xl bg-black border border-white/10 overflow-hidden relative flex items-center justify-center">
                          <ShowcaseMedia key={formData.mediaUrl + formData.postUrl} mediaUrl={formData.mediaUrl} postUrl={formData.postUrl} title="Preview konten" controls />
                        </div>
                        <div className="col-span-8 space-y-3">
                          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/mp4,video/webm" className="hidden" />
                          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 w-full justify-center"><Upload className="w-3.5 h-3.5" />{uploading ? "Mengunggah..." : "Unggah Foto / Video"}</button>
                          <input type="text" placeholder="URL foto atau video MP4 / WebM..." value={formData.mediaUrl} onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-solaki-teal" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs font-bold text-white/60 block mb-1.5">Judul Konten <span className="text-rose-400">*</span></label><input type="text" required placeholder="Reels: Strategi Rebranding Kopi Lokal" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-solaki-teal" /></div>
                      <div><label className="text-xs font-bold text-white/60 block mb-1.5">Format</label><input type="text" placeholder="Instagram Reels (9:16)" value={formData.format} onChange={(e) => setFormData({ ...formData, format: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-solaki-teal" /></div>
                    </div>
                    <div><label className="text-xs font-bold text-white/60 block mb-1.5">Caption / Deskripsi</label><textarea rows={2} placeholder="Salinan caption atau latar belakang konten..." value={formData.caption} onChange={(e) => setFormData({ ...formData, caption: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-solaki-teal resize-none" /></div>
                  </>
                )}

                {formStep === 2 && (
                  <>
                    <div className="p-3 rounded-xl bg-blue-500/[0.07] border border-blue-500/20 flex items-start gap-2 text-xs text-blue-300">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Buka Instagram/TikTok Insights pada postingan, lalu salin angkanya ke sini. <strong>Engagement Rate dihitung otomatis</strong> dari angka yang Anda isi.</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <MetricInput icon={<Eye className="w-3.5 h-3.5 text-blue-400" />} label="Views / Reach" value={formData.views} placeholder="124500" borderColor="border-blue-500/20" onChange={(v) => updateMetric("views", v)} />
                      <MetricInput icon={<Heart className="w-3.5 h-3.5 text-rose-400" />} label="Likes" value={formData.likes} placeholder="8900" borderColor="border-rose-500/20" onChange={(v) => updateMetric("likes", v)} />
                      <MetricInput icon={<MessageCircle className="w-3.5 h-3.5 text-violet-400" />} label="Komentar" value={formData.comments} placeholder="430" borderColor="border-violet-500/20" onChange={(v) => updateMetric("comments", v)} />
                      <MetricInput icon={<Bookmark className="w-3.5 h-3.5 text-cyan-400" />} label="Saves" value={formData.saves} placeholder="1200" borderColor="border-cyan-500/20" onChange={(v) => updateMetric("saves", v)} />
                      <MetricInput icon={<Share2 className="w-3.5 h-3.5 text-amber-400" />} label="Shares" value={formData.shares} placeholder="650" borderColor="border-amber-500/20" onChange={(v) => updateMetric("shares", v)} />
                      <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] space-y-1">
                        <div className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /><span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">ER Auto</span></div>
                        <div className="text-2xl font-black text-emerald-400 tabular-nums">{autoER || formData.engagementRate || "—"}</div>
                        <p className="text-[9px] text-emerald-400/60">(likes+cmt+saves+shares) / views</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs font-bold text-white/60 block mb-1.5">Engagement Rate (edit manual)</label><input type="text" placeholder="9.8%" value={autoER || formData.engagementRate} onChange={(e) => setFormData({ ...formData, engagementRate: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-solaki-teal" /></div>
                      <div><label className="text-xs font-bold text-white/60 block mb-1.5">Reach Multiplier / Label</label><input type="text" placeholder="5.4x Organic Reach" value={formData.reachMultiplier} onChange={(e) => setFormData({ ...formData, reachMultiplier: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-solaki-teal" /></div>
                    </div>
                  </>
                )}

                {formStep === 3 && (
                  <>
                    <div className="p-4 rounded-xl bg-solaki-teal/[0.07] border border-solaki-teal/20 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-solaki-teal uppercase tracking-wider"><TrendingUp className="w-3.5 h-3.5" /><span>Analisis Konten & Strategi</span></div>
                      <div><label className="text-xs font-bold text-white/60 block mb-1.5">Hook 3 Detik Pertama</label><textarea rows={2} placeholder="Contoh: Blind test kemasan lama vs baru menciptakan visual pattern-interrupt..." value={formData.hookStrategy} onChange={(e) => setFormData({ ...formData, hookStrategy: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-solaki-teal resize-none" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs font-bold text-white/60 block mb-1.5">Pilar Konten</label><input type="text" placeholder="Storytelling / Brand Transformation" value={formData.contentPillar} onChange={(e) => setFormData({ ...formData, contentPillar: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-solaki-teal" /></div>
                        <div><label className="text-xs font-bold text-white/60 block mb-1.5">Target Audiens</label><input type="text" placeholder="Pecinta Kopi & Anak Muda 18-35 Thn" value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-solaki-teal" /></div>
                      </div>
                      <div><label className="text-xs font-bold text-white/60 block mb-1.5">Key Takeaway / Dampak Nyata</label><textarea rows={2} placeholder="Peningkatan pesanan WhatsApp 185% dalam 7 hari pasca video..." value={formData.keyTakeaway} onChange={(e) => setFormData({ ...formData, keyTakeaway: e.target.value })} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-solaki-teal resize-none" /></div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/[0.07] text-xs">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 rounded focus:ring-0 cursor-pointer" /><span className="text-white/70 font-semibold">Tampilkan di Website</span></label>
                        <label className="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 rounded focus:ring-0 cursor-pointer" /><span className="text-white/70 font-semibold">Tandai Unggulan</span></label>
                      </div>
                      <div className="flex items-center gap-2"><span className="text-white/40">Urutan:</span><input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-16 bg-white/[0.04] border border-white/10 rounded-lg px-2 py-1 text-center text-sm text-white" /></div>
                    </div>
                  </>
                )}
              </div>

              <div className="px-6 py-4 border-t border-white/[0.07] flex items-center justify-between gap-3 flex-shrink-0 bg-white/[0.02]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/5 transition-colors">Batal</button>
                <div className="flex items-center gap-2">
                  {formStep > 1 && <button type="button" onClick={() => setFormStep((s) => (s - 1) as 1 | 2 | 3)} className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] text-white hover:bg-white/[0.10] transition-colors">Kembali</button>}
                  {formStep < 3
                    ? <button type="button" onClick={() => setFormStep((s) => (s + 1) as 1 | 2 | 3)} className="btn-primary py-2 px-5 rounded-xl text-sm font-bold flex items-center gap-2"><span>Lanjut</span><ChevronRight className="w-4 h-4" /></button>
                    : <button type="submit" disabled={saving} className="btn-primary py-2 px-5 rounded-xl text-sm font-bold flex items-center gap-2">{saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}<span>{saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Publikasikan Showcase"}</span></button>}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
