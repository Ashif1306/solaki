"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Edit2, Trash2, Loader2, Users, X, Upload, UserCircle2 } from "lucide-react";
import Image from "next/image";

interface TeamItem {
  id?: string;
  _id?: string;
  order: number;
  name: string;
  role: string;
  description: string;
  skills: string[];
  initials: string;
  color: string;
  photo?: string;
  instagram: string;
  linkedin: string;
  isActive: boolean;
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (data.team) {
        setTeam(data.team);
      }
    } catch {
      alert("Gagal memuat data tim");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenAdd = () => {
    setEditingMember({
      order: team.length + 1,
      name: "",
      role: "",
      description: "",
      skills: [],
      initials: "",
      color: "#0D5C46",
      photo: "",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (member: TeamItem) => {
    setEditingMember({
      ...member,
      id: member.id || member._id,
      photo: member.photo || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus anggota tim ini?")) return;
    try {
      const res = await fetch(`/api/admin/team?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setTeam((prev) => prev.filter((m) => (m.id || m._id) !== id));
      } else {
        alert("Gagal menghapus anggota: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + (err as Error).message);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) {
        // Fallback to base64 Data URL if server upload endpoint returned error
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setEditingMember((prev) => ({ ...prev, photo: reader.result as string }));
          }
        };
        reader.readAsDataURL(file);
      } else {
        const data = await res.json();
        if (data.url) {
          setEditingMember((prev) => ({ ...prev, photo: data.url }));
        }
      }
    } catch {
      // Fallback to base64 Data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setEditingMember((prev) => ({ ...prev, photo: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name?.trim() || !editingMember?.role?.trim()) {
      alert("Nama dan role jabatan wajib diisi");
      return;
    }

    setSaving(true);
    const payload = {
      ...editingMember,
      id: editingMember.id || editingMember._id,
      description: editingMember.description || "",
      skills: [],
      photo: editingMember.photo || "",
    };

    try {
      const isEdit = !!payload.id;
      const res = await fetch("/api/admin/team", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resData.error || "Gagal menyimpan perubahan");
      }

      await fetchTeam();
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
          <h1 className="text-3xl font-black text-white tracking-tight">Kelola Tim & Kolektif</h1>
          <p className="text-sm text-solaki-muted font-inter mt-1">
            Sunting profil pendiri, spesialis, dan peran kepemimpinan agensi SOLAKI.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Anggota Tim
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-solaki-muted font-inter flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-solaki-teal" />
          Memuat tim...
        </div>
      ) : team.length === 0 ? (
        <div className="bento-card p-12 text-center">
          <Users className="w-12 h-12 text-solaki-subtle mx-auto mb-3 opacity-40" />
          <p className="text-white font-bold">Belum ada anggota tim</p>
          <button onClick={handleOpenAdd} className="btn-primary py-2 px-4 text-xs mt-4">
            Tambah Anggota Pertama
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((member) => {
            const memberId = member.id || member._id || "";
            return (
              <div
                key={memberId}
                className="bento-card overflow-hidden flex flex-col justify-between border-solaki-border"
              >
                {/* Photo preview banner */}
                <div
                  className="h-32 relative flex items-center justify-center"
                  style={{
                    background: member.photo
                      ? "transparent"
                      : `linear-gradient(135deg, ${member.color || "#0D5C46"}20, rgba(8,12,20,0.8))`,
                  }}
                >
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      sizes="300px"
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg"
                      style={{
                        background: `${member.color || "#0D5C46"}25`,
                        border: `1px solid ${member.color || "#0D5C46"}50`,
                        color: member.color || "#0D5C46",
                      }}
                    >
                      {member.initials || "SOL"}
                    </div>
                  )}
                  {/* Gradient bottom overlay */}
                  {member.photo && (
                    <div className="absolute inset-0 bg-gradient-to-t from-solaki-card/80 to-transparent" />
                  )}
                  {/* Status badge */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        member.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {member.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-base font-bold text-white">{member.name}</h3>
                    <span className="text-xs font-mono text-solaki-subtle ml-2">#{member.order}</span>
                  </div>
                  <p className="text-xs font-semibold mb-3" style={{ color: member.color || "#0D5C46" }}>
                    {member.role}
                  </p>

                  {/* Social links preview */}
                  <div className="flex items-center gap-2 mb-4 text-xs text-solaki-muted">
                    {member.instagram && member.instagram !== "#" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-[11px] font-inter border border-white/5 text-solaki-muted">
                        IG: {member.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, "@").slice(0, 15)}
                      </span>
                    )}
                    {member.linkedin && member.linkedin !== "#" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-[11px] font-inter border border-white/5 text-solaki-muted">
                        LinkedIn ✓
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 mt-auto border-t border-solaki-border/40">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors font-inter"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Sunting
                    </button>
                    <button
                      onClick={() => handleDelete(memberId)}
                      className="py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-400 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                {editingMember?.id || editingMember?._id ? "Sunting Anggota Tim" : "Tambah Anggota Tim"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-solaki-muted hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-solaki-muted uppercase mb-2">
                  Foto Profil
                </label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div
                    className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center relative"
                    style={{
                      background: editingMember?.photo
                        ? "transparent"
                        : `${editingMember?.color || "#0D5C46"}15`,
                      border: `1px solid ${editingMember?.color || "#0D5C46"}40`,
                    }}
                  >
                    {editingMember?.photo ? (
                      <Image
                        src={editingMember.photo}
                        alt="Preview"
                        fill
                        className="object-cover object-top"
                        sizes="80px"
                      />
                    ) : (
                      <UserCircle2
                        className="w-10 h-10"
                        style={{ color: editingMember?.color || "#0D5C46" }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="team-photo-upload"
                    />
                    <label
                      htmlFor="team-photo-upload"
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        uploading
                          ? "border-solaki-teal/40 text-solaki-teal bg-solaki-teal/5 cursor-not-allowed"
                          : "border-solaki-border text-solaki-muted hover:border-solaki-teal/50 hover:text-solaki-teal bg-solaki-surface hover:bg-solaki-teal/5"
                      }`}
                    >
                      {uploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      {uploading ? "Mengunggah..." : "Upload Foto"}
                    </label>
                    {editingMember?.photo && (
                      <button
                        type="button"
                        onClick={() => setEditingMember((prev) => ({ ...prev, photo: "" }))}
                        className="w-full mt-1.5 py-1 rounded-lg text-[11px] text-red-400/80 hover:text-red-400 transition-colors text-center border border-red-500/20 bg-red-500/5"
                      >
                        Hapus foto
                      </button>
                    )}
                    <p className="text-[10px] text-solaki-subtle mt-1.5 font-inter">
                      JPG / PNG / WebP · Maks 5MB · Disarankan foto portrait
                    </p>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div className="mt-2.5">
                  <label className="block text-[11px] font-semibold text-solaki-subtle uppercase mb-1">
                    Atau Masukkan URL Gambar Langsung
                  </label>
                  <input
                    type="text"
                    value={editingMember?.photo || ""}
                    onChange={(e) => setEditingMember((prev) => ({ ...prev, photo: e.target.value }))}
                    placeholder="https://... atau /uploads/..."
                    className="w-full px-3 py-1.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={editingMember?.order ?? 1}
                    onChange={(e) =>
                      setEditingMember((prev) => ({ ...prev, order: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                    Inisial Singkat
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={editingMember?.initials || ""}
                    onChange={(e) =>
                      setEditingMember((prev) => ({
                        ...prev,
                        initials: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="Contoh: MNZ"
                    className="w-full px-3 py-2 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember?.name || ""}
                  onChange={(e) =>
                    setEditingMember((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Contoh: Muhammad Nur Zikri"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                  Jabatan / Peran *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember?.role || ""}
                  onChange={(e) =>
                    setEditingMember((prev) => ({ ...prev, role: e.target.value }))
                  }
                  placeholder="Contoh: Founder & Brand Strategist"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                  Warna Aksen
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editingMember?.color || "#0D5C46"}
                    onChange={(e) =>
                      setEditingMember((prev) => ({ ...prev, color: e.target.value }))
                    }
                    className="w-10 h-10 rounded-lg border border-solaki-border cursor-pointer bg-transparent"
                  />
                  <span className="text-xs text-solaki-muted font-mono">{editingMember?.color || "#0D5C46"}</span>
                  <div className="flex gap-2 ml-2">
                    {["#0D5C46", "#D95338", "#4F46E5", "#D97706", "#9333EA"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditingMember((prev) => ({ ...prev, color: c }))}
                        className="w-5 h-5 rounded-full border-2 transition-all"
                        style={{
                          background: c,
                          borderColor: editingMember?.color === c ? "white" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={editingMember?.instagram || ""}
                    onChange={(e) =>
                      setEditingMember((prev) => ({ ...prev, instagram: e.target.value }))
                    }
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-solaki-muted uppercase mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={editingMember?.linkedin || ""}
                    onChange={(e) =>
                      setEditingMember((prev) => ({ ...prev, linkedin: e.target.value }))
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="teamActive"
                  checked={editingMember?.isActive ?? true}
                  onChange={(e) =>
                    setEditingMember((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-solaki-teal focus:ring-0"
                />
                <label htmlFor="teamActive" className="text-xs text-white font-medium cursor-pointer">
                  Tampilkan di profil tim (Aktif)
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
                  disabled={saving || uploading}
                  className="btn-primary py-2.5 px-5 text-xs font-bold"
                >
                  {saving ? "Menyimpan..." : "Simpan Anggota"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
