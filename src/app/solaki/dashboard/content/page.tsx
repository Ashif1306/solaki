"use client";

import { useEffect, useState, useRef } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Mail,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Eye,
  Rocket,
  Heart,
  Palette,
  TrendingUp,
} from "lucide-react";

interface ContentItem {
  key: string;
  value: string;
  label: string;
  section: string;
  type: "text" | "textarea";
}

export default function AdminContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [uploadingVision, setUploadingVision] = useState(false);
  const [uploadingMission, setUploadingMission] = useState(false);
  const [uploadingUnderstand, setUploadingUnderstand] = useState(false);
  const [uploadingCustomize, setUploadingCustomize] = useState(false);
  const [uploadingGrow, setUploadingGrow] = useState(false);
  const [uploadingSolaKi, setUploadingSolaKi] = useState(false);

  const visionFileInputRef = useRef<HTMLInputElement>(null);
  const missionFileInputRef = useRef<HTMLInputElement>(null);
  const understandFileInputRef = useRef<HTMLInputElement>(null);
  const customizeFileInputRef = useRef<HTMLInputElement>(null);
  const growFileInputRef = useRef<HTMLInputElement>(null);
  const solaKiFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.contents) {
          setItems(data.contents);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat konten");
        setLoading(false);
      });
  }, []);

  const handleChange = (key: string, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  const getItemValue = (key: string, defaultValue: string) => {
    return items.find((i) => i.key === key)?.value ?? defaultValue;
  };

  const setItemValue = (key: string, value: string, label?: string, section = "philosophy") => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.key === key);
      if (idx >= 0) {
        return prev.map((item) => (item.key === key ? { ...item, value } : item));
      }
      return [
        ...prev,
        { key, value, label: label || key, section, type: "text" },
      ];
    });
  };

  const handleUploadImage = async (
    file: File | null,
    key: string,
    setUploading: (loading: boolean) => void
  ) => {
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Gagal mengunggah gambar");
      }
      setItemValue(key, data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Gagal menyimpan perubahan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const heroItems = items.filter((i) => i.section === "hero");
  const textPhilosophyItems = items.filter(
    (i) => i.section === "philosophy" && !i.key.startsWith("vision_") && !i.key.startsWith("mission_") && !i.key.startsWith("values_") && !i.key.startsWith("solaki_card_")
  );
  const contactItems = items.filter((i) => i.section === "contact");
  const otherItems = items.filter(
    (i) => !["hero", "philosophy", "contact"].includes(i.section)
  );

  const visionMissionBgEnabled = getItemValue("vision_mission_bg_enabled", "true") === "true";
  const visionBgImage = getItemValue("vision_card_bg_image", "/vision-bg.jpg");
  const missionBgImage = getItemValue("mission_card_bg_image", "/mission-bg.jpg");

  const valuesBgEnabled = getItemValue("values_bg_enabled", "true") === "true";
  const valuesUnderstandBgImage = getItemValue("values_understand_bg_image", "/values-understand-bg.jpg");
  const valuesCustomizeBgImage = getItemValue("values_customize_bg_image", "/values-customize-bg.jpg");
  const valuesGrowBgImage = getItemValue("values_grow_bg_image", "/values-grow-bg.jpg");

  const solaKiBgEnabled = getItemValue("solaki_card_bg_enabled", "true") === "true";
  const solaKiBgImage = getItemValue("solaki_card_bg_image", "/solaki-origin-bg.jpg");

  if (loading) {
    return (
      <div className="py-20 text-center text-solaki-muted font-inter flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-solaki-teal" />
        Memuat konten website...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-solaki-border">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Kelola Konten Website</h1>
          <p className="text-sm text-solaki-muted font-inter mt-1">
            Ubah teks headline, deskripsi, latar belakang Visi & Misi, serta informasi kontak website.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary py-2.5 px-5 text-sm font-bold flex items-center gap-2 shadow-lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2.5 text-sm font-inter">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Semua perubahan berhasil disimpan ke database!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2.5 text-sm font-inter">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="bento-card p-6 sm:p-8 border-solaki-border space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-solaki-border">
          <Sparkles className="w-5 h-5 text-solaki-teal" />
          <h2 className="text-lg font-bold text-white font-inter">Bagian Hero (Halaman Depan)</h2>
        </div>

        {heroItems.map((item) => (
          <div key={item.key} className="space-y-2">
            <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider font-inter">
              {item.label}
            </label>
            {item.type === "textarea" ? (
              <textarea
                rows={3}
                value={item.value}
                onChange={(e) => handleChange(item.key, e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal font-inter transition-colors"
              />
            ) : (
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleChange(item.key, e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal font-inter transition-colors"
              />
            )}
          </div>
        ))}
      </div>

      {/* ── VISION & MISSION BACKGROUND IMAGES CONFIG ── */}
      <div className="bento-card p-6 sm:p-8 border-solaki-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-solaki-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-solaki-teal/15 border border-solaki-teal/30 flex items-center justify-center text-solaki-teal">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-inter">Background Kartu Visi &amp; Misi</h2>
              <p className="text-xs text-solaki-muted font-inter">
                Aktifkan atau ganti foto latar belakang pada kartu Visi &amp; Misi.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => {
              setItemValue(
                "vision_mission_bg_enabled",
                visionMissionBgEnabled ? "false" : "true",
                "Aktifkan Background Gambar Visi & Misi"
              );
            }}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border text-xs font-bold font-inter transition-all cursor-pointer ${
              visionMissionBgEnabled
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.2)]"
                : "bg-white/5 border-white/10 text-solaki-muted hover:text-white"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                visionMissionBgEnabled
                  ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"
                  : "bg-white/30"
              }`}
            />
            {visionMissionBgEnabled ? "Latar Gambar: AKTIF" : "Latar Gambar: NONAKTIF"}
          </button>
        </div>

        {/* Status Explanation Banner */}
        <div
          className={`p-4 rounded-xl text-xs font-inter leading-relaxed border transition-colors ${
            visionMissionBgEnabled
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
              : "bg-solaki-surface/60 border-solaki-border/60 text-solaki-muted"
          }`}
        >
          {visionMissionBgEnabled ? (
            <p>
              <strong className="text-emerald-400 font-semibold">Mode Background Gambar Aktif:</strong> Kartu Visi dan Misi pada halaman publik menampilkan foto latar belakang di bawah ini dengan lapisan gradasi tint gelap premium agar teks tetap jelas terbaca.
            </p>
          ) : (
            <p>
              <strong className="text-white font-semibold">Mode Default Aktif:</strong> Kartu Visi dan Misi saat ini menampilkan warna tema awal (bento-card hijau/merah bata tanpa background foto). Klik tombol toggle di atas untuk mengaktifkan kembali background foto.
            </p>
          )}
        </div>

        {/* Image Controls: Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          {/* 1. Vision Card Setting */}
          <div className="p-5 rounded-2xl bg-solaki-surface border border-solaki-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-solaki-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-white font-inter">
                  Latar Kartu Visi
                </span>
              </div>
              <button
                type="button"
                onClick={() => setItemValue("vision_card_bg_image", "/vision-bg.jpg")}
                className="text-[11px] text-solaki-muted hover:text-solaki-gold flex items-center gap-1 transition-colors cursor-pointer"
                title="Kembalikan ke gambar default"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Default
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-solaki-border bg-black/40 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={visionBgImage || "/vision-bg.jpg"}
                alt="Vision Background Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-medium text-white truncate max-w-full">
                  {visionBgImage}
                </span>
              </div>
            </div>

            {/* Actions: Upload & Direct URL */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={visionFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleUploadImage(e.target.files?.[0] || null, "vision_card_bg_image", setUploadingVision)
                  }
                />
                <button
                  type="button"
                  disabled={uploadingVision}
                  onClick={() => visionFileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-solaki-teal/15 hover:bg-solaki-teal/25 border border-solaki-teal/30 text-solaki-teal text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {uploadingVision ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      Upload Gambar Baru
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-solaki-muted font-inter">Atau masukkan URL / path gambar:</label>
                <input
                  type="text"
                  value={visionBgImage}
                  onChange={(e) => setItemValue("vision_card_bg_image", e.target.value)}
                  placeholder="/vision-bg.jpg atau https://..."
                  className="w-full px-3 py-2 rounded-xl bg-solaki-card border border-solaki-border text-white text-xs focus:outline-none focus:border-solaki-teal font-inter transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 2. Mission Card Setting */}
          <div className="p-5 rounded-2xl bg-solaki-surface border border-solaki-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-[#ff8066]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white font-inter">
                  Latar Kartu Misi
                </span>
              </div>
              <button
                type="button"
                onClick={() => setItemValue("mission_card_bg_image", "/mission-bg.jpg")}
                className="text-[11px] text-solaki-muted hover:text-[#ff8066] flex items-center gap-1 transition-colors cursor-pointer"
                title="Kembalikan ke gambar default"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Default
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-solaki-border bg-black/40 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={missionBgImage || "/mission-bg.jpg"}
                alt="Mission Background Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-medium text-white truncate max-w-full">
                  {missionBgImage}
                </span>
              </div>
            </div>

            {/* Actions: Upload & Direct URL */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={missionFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleUploadImage(e.target.files?.[0] || null, "mission_card_bg_image", setUploadingMission)
                  }
                />
                <button
                  type="button"
                  disabled={uploadingMission}
                  onClick={() => missionFileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#D95338]/15 hover:bg-[#D95338]/25 border border-[#D95338]/30 text-[#ff8066] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {uploadingMission ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      Upload Gambar Baru
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-solaki-muted font-inter">Atau masukkan URL / path gambar:</label>
                <input
                  type="text"
                  value={missionBgImage}
                  onChange={(e) => setItemValue("mission_card_bg_image", e.target.value)}
                  placeholder="/mission-bg.jpg atau https://..."
                  className="w-full px-3 py-2 rounded-xl bg-solaki-card border border-solaki-border text-white text-xs focus:outline-none focus:border-solaki-teal font-inter transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── OUR VALUES BACKGROUND IMAGES CONFIG ── */}
      <div className="bento-card p-6 sm:p-8 border-solaki-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-solaki-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-inter">Background Kartu Our Values</h2>
              <p className="text-xs text-solaki-muted font-inter">
                Aktifkan atau ganti foto latar belakang pada kartu Understand, Customize, dan Grow.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => {
              setItemValue(
                "values_bg_enabled",
                valuesBgEnabled ? "false" : "true",
                "Aktifkan Background Gambar Our Values"
              );
            }}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border text-xs font-bold font-inter transition-all cursor-pointer ${
              valuesBgEnabled
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.2)]"
                : "bg-white/5 border-white/10 text-solaki-muted hover:text-white"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                valuesBgEnabled
                  ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"
                  : "bg-white/30"
              }`}
            />
            {valuesBgEnabled ? "Latar Gambar: AKTIF" : "Latar Gambar: NONAKTIF"}
          </button>
        </div>

        {/* Status Explanation Banner */}
        <div
          className={`p-4 rounded-xl text-xs font-inter leading-relaxed border transition-colors ${
            valuesBgEnabled
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
              : "bg-solaki-surface/60 border-solaki-border/60 text-solaki-muted"
          }`}
        >
          {valuesBgEnabled ? (
            <p>
              <strong className="text-emerald-400 font-semibold">Mode Background Gambar Aktif:</strong> Kartu Understand, Customize, dan Grow pada halaman depan menampilkan foto latar belakang di bawah ini dengan lapisan gradasi tint gelap premium agar teks tetap jelas terbaca.
            </p>
          ) : (
            <p>
              <strong className="text-white font-semibold">Mode Default Aktif:</strong> Kartu Our Values saat ini menampilkan warna tema awal (bento-card tanpa background foto). Klik tombol toggle di atas untuk mengaktifkan kembali background foto.
            </p>
          )}
        </div>

        {/* Image Controls: 3 Values Cards */}
        <div className="grid md:grid-cols-3 gap-6 pt-2">
          {/* 1. Understand Card */}
          <div className="p-5 rounded-2xl bg-solaki-surface border border-solaki-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#34d399]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white font-inter">
                  Understand
                </span>
              </div>
              <button
                type="button"
                onClick={() => setItemValue("values_understand_bg_image", "/values-understand-bg.jpg")}
                className="text-[11px] text-solaki-muted hover:text-[#34d399] flex items-center gap-1 transition-colors cursor-pointer"
                title="Kembalikan ke gambar default"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-solaki-border bg-black/40 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={valuesUnderstandBgImage || "/values-understand-bg.jpg"}
                alt="Understand Background Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-medium text-white truncate max-w-full">
                  {valuesUnderstandBgImage}
                </span>
              </div>
            </div>

            {/* Actions: Upload & Direct URL */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={understandFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleUploadImage(e.target.files?.[0] || null, "values_understand_bg_image", setUploadingUnderstand)
                  }
                />
                <button
                  type="button"
                  disabled={uploadingUnderstand}
                  onClick={() => understandFileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {uploadingUnderstand ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      Upload Foto
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-solaki-muted font-inter">URL / path gambar:</label>
                <input
                  type="text"
                  value={valuesUnderstandBgImage}
                  onChange={(e) => setItemValue("values_understand_bg_image", e.target.value)}
                  placeholder="/values-understand-bg.jpg atau https://..."
                  className="w-full px-3 py-1.5 rounded-xl bg-solaki-card border border-solaki-border text-white text-xs focus:outline-none focus:border-solaki-teal font-inter transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 2. Customize Card */}
          <div className="p-5 rounded-2xl bg-solaki-surface border border-solaki-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#ff8066]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white font-inter">
                  Customize
                </span>
              </div>
              <button
                type="button"
                onClick={() => setItemValue("values_customize_bg_image", "/values-customize-bg.jpg")}
                className="text-[11px] text-solaki-muted hover:text-[#ff8066] flex items-center gap-1 transition-colors cursor-pointer"
                title="Kembalikan ke gambar default"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-solaki-border bg-black/40 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={valuesCustomizeBgImage || "/values-customize-bg.jpg"}
                alt="Customize Background Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-medium text-white truncate max-w-full">
                  {valuesCustomizeBgImage}
                </span>
              </div>
            </div>

            {/* Actions: Upload & Direct URL */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={customizeFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleUploadImage(e.target.files?.[0] || null, "values_customize_bg_image", setUploadingCustomize)
                  }
                />
                <button
                  type="button"
                  disabled={uploadingCustomize}
                  onClick={() => customizeFileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#D95338]/15 hover:bg-[#D95338]/25 border border-[#D95338]/30 text-[#ff8066] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {uploadingCustomize ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      Upload Foto
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-solaki-muted font-inter">URL / path gambar:</label>
                <input
                  type="text"
                  value={valuesCustomizeBgImage}
                  onChange={(e) => setItemValue("values_customize_bg_image", e.target.value)}
                  placeholder="/values-customize-bg.jpg atau https://..."
                  className="w-full px-3 py-1.5 rounded-xl bg-solaki-card border border-solaki-border text-white text-xs focus:outline-none focus:border-solaki-teal font-inter transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 3. Grow Card */}
          <div className="p-5 rounded-2xl bg-solaki-surface border border-solaki-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#a5b4fc]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white font-inter">
                  Grow
                </span>
              </div>
              <button
                type="button"
                onClick={() => setItemValue("values_grow_bg_image", "/values-grow-bg.jpg")}
                className="text-[11px] text-solaki-muted hover:text-[#a5b4fc] flex items-center gap-1 transition-colors cursor-pointer"
                title="Kembalikan ke gambar default"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-solaki-border bg-black/40 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={valuesGrowBgImage || "/values-grow-bg.jpg"}
                alt="Grow Background Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-medium text-white truncate max-w-full">
                  {valuesGrowBgImage}
                </span>
              </div>
            </div>

            {/* Actions: Upload & Direct URL */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={growFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleUploadImage(e.target.files?.[0] || null, "values_grow_bg_image", setUploadingGrow)
                  }
                />
                <button
                  type="button"
                  disabled={uploadingGrow}
                  onClick={() => growFileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {uploadingGrow ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      Upload Foto
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-solaki-muted font-inter">URL / path gambar:</label>
                <input
                  type="text"
                  value={valuesGrowBgImage}
                  onChange={(e) => setItemValue("values_grow_bg_image", e.target.value)}
                  placeholder="/values-grow-bg.jpg atau https://..."
                  className="w-full px-3 py-1.5 rounded-xl bg-solaki-card border border-solaki-border text-white text-xs focus:outline-none focus:border-solaki-teal font-inter transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy & Sola Ki Origin Section */}
      <div className="bento-card p-6 sm:p-8 border-solaki-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-solaki-border">
          <div>
            <h2 className="text-lg font-bold text-white font-inter">Filosofi &amp; Identitas Sola Ki</h2>
            <p className="text-xs text-solaki-muted font-inter">
              Atur latar gambar kartu "Sola ki'" (Bersama Kita) dan penjelasan maknanya.
            </p>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => {
              setItemValue(
                "solaki_card_bg_enabled",
                solaKiBgEnabled ? "false" : "true",
                "Aktifkan Background Gambar Kartu Sola Ki"
              );
            }}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border text-xs font-bold font-inter transition-all cursor-pointer ${
              solaKiBgEnabled
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.2)]"
                : "bg-white/5 border-white/10 text-solaki-muted hover:text-white"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                solaKiBgEnabled
                  ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"
                  : "bg-white/30"
              }`}
            />
            {solaKiBgEnabled ? "Latar Gambar: AKTIF" : "Latar Gambar: NONAKTIF"}
          </button>
        </div>

        {/* Status Explanation Banner */}
        <div
          className={`p-4 rounded-xl text-xs font-inter leading-relaxed border transition-colors ${
            solaKiBgEnabled
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
              : "bg-solaki-surface/60 border-solaki-border/60 text-solaki-muted"
          }`}
        >
          {solaKiBgEnabled ? (
            <p>
              <strong className="text-emerald-400 font-semibold">Mode Background Gambar Aktif:</strong> Kartu asal usul nama "Sola ki'" pada bagian About menampilkan foto latar belakang di bawah ini dengan lapisan gradasi tint gelap premium agar teks tetap kontras dan terbaca jelas.
            </p>
          ) : (
            <p>
              <strong className="text-white font-semibold">Mode Default Aktif:</strong> Kartu "Sola ki'" saat ini menampilkan warna tema awal (bento-card hijau tanpa background foto). Klik tombol toggle di atas untuk mengaktifkan kembali background foto.
            </p>
          )}
        </div>

        {/* Sola Ki Image Settings Box */}
        <div className="p-5 rounded-2xl bg-solaki-surface border border-solaki-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white font-inter">
              Foto Latar Kartu "Sola ki'"
            </span>
            <button
              type="button"
              onClick={() => setItemValue("solaki_card_bg_image", "/solaki-origin-bg.jpg")}
              className="text-[11px] text-solaki-muted hover:text-solaki-gold flex items-center gap-1 transition-colors cursor-pointer"
              title="Kembalikan ke gambar default"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Default
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5 items-center">
            {/* Thumbnail Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-solaki-border bg-black/40 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={solaKiBgImage || "/solaki-origin-bg.jpg"}
                alt="Sola Ki Background Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-medium text-white truncate max-w-full">
                  {solaKiBgImage}
                </span>
              </div>
            </div>

            {/* Actions: Upload & Direct URL */}
            <div className="space-y-3">
              <div>
                <input
                  type="file"
                  ref={solaKiFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleUploadImage(e.target.files?.[0] || null, "solaki_card_bg_image", setUploadingSolaKi)
                  }
                />
                <button
                  type="button"
                  disabled={uploadingSolaKi}
                  onClick={() => solaKiFileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-solaki-teal/15 hover:bg-solaki-teal/25 border border-solaki-teal/30 text-solaki-teal text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {uploadingSolaKi ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      Upload Foto Baru
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-solaki-muted font-inter">Atau masukkan URL / path gambar:</label>
                <input
                  type="text"
                  value={solaKiBgImage}
                  onChange={(e) => setItemValue("solaki_card_bg_image", e.target.value)}
                  placeholder="/solaki-origin-bg.jpg atau https://..."
                  className="w-full px-3 py-2 rounded-xl bg-solaki-card border border-solaki-border text-white text-xs focus:outline-none focus:border-solaki-teal font-inter transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="space-y-4 pt-2">
          {textPhilosophyItems.map((item) => (
            <div key={item.key} className="space-y-2">
              <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider font-inter">
                {item.label}
              </label>
              <textarea
                rows={3}
                value={item.value}
                onChange={(e) => handleChange(item.key, e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal font-inter transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bento-card p-6 sm:p-8 border-solaki-border space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-solaki-border">
          <Mail className="w-5 h-5 text-solaki-teal" />
          <h2 className="text-lg font-bold text-white font-inter">Informasi Kontak & Footer</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {contactItems.map((item) => (
            <div key={item.key} className="space-y-2">
              <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider font-inter">
                {item.label}
              </label>
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleChange(item.key, e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal font-inter transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {otherItems.length > 0 && (
        <div className="bento-card p-6 sm:p-8 border-solaki-border space-y-5">
          <h2 className="text-lg font-bold text-white font-inter pb-4 border-b border-solaki-border">
            Konten Tambahan
          </h2>
          {otherItems.map((item) => (
            <div key={item.key} className="space-y-2">
              <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider font-inter">
                {item.label}
              </label>
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleChange(item.key, e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal font-inter transition-colors"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary py-3 px-6 text-sm font-bold flex items-center gap-2 shadow-xl"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan Perubahan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Semua Perubahan
            </>
          )}
        </button>
      </div>
    </form>
  );
}
