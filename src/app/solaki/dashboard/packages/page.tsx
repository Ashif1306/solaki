"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Loader2, CreditCard, X } from "lucide-react";

interface PackageItem {
  id?: string;
  _id?: string;
  order: number;
  name: string;
  modelType: string;
  subtitle: string;
  description: string;
  price: string;
  period: string;
  badge?: string;
  features: string[];
  isHighlight: boolean;
  isActive: boolean;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Partial<PackageItem> | null>(null);
  const [featuresText, setFeaturesText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/admin/packages");
      const data = await res.json();
      if (data.packages) {
        setPackages(data.packages);
      }
    } catch {
      alert("Gagal memuat paket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenAdd = () => {
    setEditingPkg({
      order: packages.length + 1,
      name: "",
      modelType: "retainer",
      subtitle: "",
      description: "",
      price: "Rp 2.500.000",
      period: "/ bulan",
      badge: "",
      features: [],
      isHighlight: false,
      isActive: true,
    });
    setFeaturesText("");
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg: PackageItem) => {
    setEditingPkg(pkg);
    setFeaturesText(pkg.features ? pkg.features.join("\n") : "");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket harga ini?")) return;

    try {
      const res = await fetch(`/api/admin/packages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPackages((prev) => prev.filter((p) => (p.id || p._id) !== id));
      } else {
        alert("Gagal menghapus paket");
      }
    } catch {
      alert("Terjadi kesalahan");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg?.name?.trim() || !editingPkg?.price?.trim()) {
      alert("Nama paket dan harga wajib diisi");
      return;
    }

    setSaving(true);
    const parsedFeatures = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      ...editingPkg,
      features: parsedFeatures,
    };

    try {
      const isEdit = !!(payload.id || payload._id);
      const res = await fetch("/api/admin/packages", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan paket");

      await fetchPackages();
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
          <h1 className="text-3xl font-black text-white tracking-tight">Kelola Model & Paket Harga</h1>
          <p className="text-sm text-solaki-muted font-inter mt-1">
            Atur paket Retainer bulanan, Project Fee, dan Ad Fee pengelolaan iklan.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Paket Baru
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-solaki-muted font-inter flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-solaki-teal" />
          Memuat paket harga...
        </div>
      ) : packages.length === 0 ? (
        <div className="bento-card p-12 text-center">
          <CreditCard className="w-12 h-12 text-solaki-subtle mx-auto mb-3 opacity-40" />
          <p className="text-white font-bold">Belum ada paket terdaftar</p>
          <button onClick={handleOpenAdd} className="btn-primary py-2 px-4 text-xs mt-4">
            Buat Paket Pertama
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => {
            const pkgId = pkg.id || pkg._id || "";
            return (
              <div
                key={pkgId}
                className={`bento-card p-6 flex flex-col justify-between relative ${
                  pkg.isHighlight
                    ? "border-solaki-teal shadow-xl shadow-solaki-teal/10"
                    : "border-solaki-border"
                }`}
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">
                        {pkg.modelType}
                      </span>
                      {pkg.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-solaki-teal/20 text-solaki-teal border border-solaki-teal/30">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-solaki-subtle">#{pkg.order}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-0.5">{pkg.name}</h3>
                  <p className="text-xs font-semibold text-solaki-teal mb-3">{pkg.subtitle}</p>

                  {/* Price Display */}
                  <div className="mb-4 pb-4 border-b border-solaki-border/50">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">{pkg.price}</span>
                      <span className="text-xs text-solaki-muted font-inter">{pkg.period}</span>
                    </div>
                  </div>

                  <p className="text-xs text-solaki-muted font-inter leading-relaxed mb-4">
                    {pkg.description}
                  </p>

                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="space-y-1.5 mb-6">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="text-[11px] text-solaki-subtle font-inter flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-solaki-teal flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-solaki-border/40">
                  <button
                    onClick={() => handleOpenEdit(pkg)}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors font-inter"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Sunting
                  </button>
                  <button
                    onClick={() => handleDelete(pkgId)}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bento-card bg-solaki-card border border-solaki-border w-full max-w-lg p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-solaki-border">
              <h2 className="text-lg font-bold text-white">
                {editingPkg?.id || editingPkg?._id ? "Sunting Paket Harga" : "Tambah Paket Harga Baru"}
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
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={editingPkg?.order ?? 1}
                    onChange={(e) =>
                      setEditingPkg((prev) => ({ ...prev, order: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                    Model Biaya
                  </label>
                  <select
                    value={editingPkg?.modelType || "retainer"}
                    onChange={(e) =>
                      setEditingPkg((prev) => ({
                        ...prev,
                        modelType: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                  >
                    <option value="retainer">Retainer (Bulanan)</option>
                    <option value="project_fee">Project Fee (Per Proyek)</option>
                    <option value="ad_fee">Ad Fee (% Ad Spend)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                  Nama Paket *
                </label>
                <input
                  type="text"
                  required
                  value={editingPkg?.name || ""}
                  onChange={(e) =>
                    setEditingPkg((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Contoh: Paket Retainer Bulanan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                    Nominal Harga *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPkg?.price || ""}
                    onChange={(e) =>
                      setEditingPkg((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="Contoh: Rp 2.500.000 / 15%"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                    Satuan Periode
                  </label>
                  <input
                    type="text"
                    value={editingPkg?.period || ""}
                    onChange={(e) =>
                      setEditingPkg((prev) => ({ ...prev, period: e.target.value }))
                    }
                    placeholder="Contoh: / bulan / dari ad spend"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                    Subtitle / Fokus
                  </label>
                  <input
                    type="text"
                    value={editingPkg?.subtitle || ""}
                    onChange={(e) =>
                      setEditingPkg((prev) => ({ ...prev, subtitle: e.target.value }))
                    }
                    placeholder="Contoh: Solusi Berkelanjutan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                    Badge Khusus
                  </label>
                  <input
                    type="text"
                    value={editingPkg?.badge || ""}
                    onChange={(e) =>
                      setEditingPkg((prev) => ({ ...prev, badge: e.target.value }))
                    }
                    placeholder="Contoh: Paling Populer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                  Deskripsi Paket
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingPkg?.description || ""}
                  onChange={(e) =>
                    setEditingPkg((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Ringkasan paket..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                  Fitur / Deliverables (Satu per baris)
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="15-20 konten feed & reels&#10;Copywriting caption&#10;Laporan bulanan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isHighlight"
                    checked={editingPkg?.isHighlight ?? false}
                    onChange={(e) =>
                      setEditingPkg((prev) => ({ ...prev, isHighlight: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-solaki-teal focus:ring-0"
                  />
                  <label htmlFor="isHighlight" className="text-xs text-white font-medium cursor-pointer">
                    Sorot Paket (Highlight / Featured)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pkgActive"
                    checked={editingPkg?.isActive ?? true}
                    onChange={(e) =>
                      setEditingPkg((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-solaki-teal focus:ring-0"
                  />
                  <label htmlFor="pkgActive" className="text-xs text-white font-medium cursor-pointer">
                    Aktif
                  </label>
                </div>
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
                  {saving ? "Menyimpan..." : "Simpan Paket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
