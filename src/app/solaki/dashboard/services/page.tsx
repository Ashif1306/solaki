"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Briefcase,
  PenTool,
  X,
} from "lucide-react";

interface ServiceItem {
  id?: string;
  _id?: string;
  order: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
  isActive: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [featuresText, setFeaturesText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
      }
    } catch {
      alert("Gagal memuat layanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService({
      order: services.length + 1,
      title: "",
      subtitle: "",
      description: "",
      features: [],
      icon: "PenTool",
      color: "#0D5C46",
      isActive: true,
    });
    setFeaturesText("");
    setModalOpen(true);
  };

  const handleOpenEdit = (svc: ServiceItem) => {
    setEditingService(svc);
    setFeaturesText(svc.features ? svc.features.join("\n") : "");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;

    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => (s.id || s._id) !== id));
      } else {
        alert("Gagal menghapus layanan");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title?.trim()) {
      alert("Judul layanan wajib diisi");
      return;
    }

    setSaving(true);
    const parsedFeatures = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      ...editingService,
      features: parsedFeatures,
    };

    try {
      const isEdit = !!(payload.id || payload._id);
      const res = await fetch("/api/admin/services", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      await fetchServices();
      setModalOpen(false);
    } catch (err) {
      alert("Terjadi kesalahan: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-solaki-border">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Kelola Layanan</h1>
          <p className="text-sm text-solaki-muted font-inter mt-1">
            Tambah, sunting, atau nonaktifkan pilar layanan digital agensi SOLAKI.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Layanan Baru
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-solaki-muted font-inter flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-solaki-teal" />
          Memuat layanan...
        </div>
      ) : services.length === 0 ? (
        <div className="bento-card p-12 text-center">
          <Briefcase className="w-12 h-12 text-solaki-subtle mx-auto mb-3 opacity-40" />
          <p className="text-white font-bold">Belum ada layanan</p>
          <button onClick={handleOpenAdd} className="btn-primary py-2 px-4 text-xs mt-4">
            Buat Layanan Pertama
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc) => {
            const svcId = svc.id || svc._id || "";
            return (
              <div
                key={svcId}
                className="bento-card p-6 flex flex-col justify-between border-solaki-border relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ background: `${svc.color || "#0D5C46"}25`, border: `1px solid ${svc.color || "#0D5C46"}50` }}
                    >
                      <PenTool className="w-5 h-5" style={{ color: svc.color }} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                          svc.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {svc.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                      <span className="text-xs font-mono text-solaki-subtle">#{svc.order}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{svc.title}</h3>
                  <p className="text-xs font-semibold text-solaki-teal mb-3">{svc.subtitle}</p>
                  <p className="text-xs text-solaki-muted font-inter leading-relaxed mb-4">
                    {svc.description}
                  </p>

                  {svc.features && svc.features.length > 0 && (
                    <ul className="space-y-1.5 mb-6 pt-3 border-t border-solaki-border/40">
                      {svc.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="text-[11px] text-solaki-subtle font-inter flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-solaki-teal flex-shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                      {svc.features.length > 4 && (
                        <li className="text-[10px] text-solaki-muted italic">
                          +{svc.features.length - 4} fitur lainnya
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-solaki-border/40">
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors font-inter"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Sunting
                  </button>
                  <button
                    onClick={() => handleDelete(svcId)}
                    className="py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-400 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bento-card bg-solaki-card border border-solaki-border w-full max-w-lg p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-solaki-border">
              <h2 className="text-lg font-bold text-white">
                {editingService?.id || editingService?._id ? "Sunting Layanan" : "Tambah Layanan Baru"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-solaki-muted hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={editingService?.order ?? 1}
                    onChange={(e) =>
                      setEditingService((prev) => ({ ...prev, order: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                    Warna Aksen
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingService?.color || "#0D5C46"}
                      onChange={(e) =>
                        setEditingService((prev) => ({ ...prev, color: e.target.value }))
                      }
                      className="w-10 h-9 p-0.5 rounded-lg bg-transparent border border-solaki-border cursor-pointer"
                    />
                    <span className="text-xs font-mono text-solaki-subtle">{editingService?.color}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                  Judul Layanan *
                </label>
                <input
                  type="text"
                  required
                  value={editingService?.title || ""}
                  onChange={(e) =>
                    setEditingService((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Contoh: Content Creator"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                  Subtitle / Fokus
                </label>
                <input
                  type="text"
                  value={editingService?.subtitle || ""}
                  onChange={(e) =>
                    setEditingService((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  placeholder="Contoh: Visual & Tulisan Relevan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                  Deskripsi Lengkap
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingService?.description || ""}
                  onChange={(e) =>
                    setEditingService((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Jelaskan apa yang ditawarkan layanan ini..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                  Daftar Fitur / Output (Satu per baris)
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Desain grafis 15 post&#10;Copywriting caption&#10;Video Reels..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingService?.isActive ?? true}
                  onChange={(e) =>
                    setEditingService((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-solaki-teal focus:ring-0"
                />
                <label htmlFor="isActive" className="text-xs text-white font-medium cursor-pointer">
                  Tampilkan layanan di website (Aktif)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-solaki-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-solaki-muted hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary py-2.5 px-5 text-xs font-bold"
                >
                  {saving ? "Menyimpan..." : "Simpan Layanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
