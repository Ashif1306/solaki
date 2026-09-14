"use client";

import { useEffect, useState, useRef } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  Image as ImageIcon,
  MessageCircle,
  Share2,
  ExternalLink,
  Crop,
  Square,
  Maximize2,
  Circle,
  Sparkles,
} from "lucide-react";

// Inline brand SVGs for social icons
const InstagramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4.5"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.83 1.53V6.75a4.85 4.85 0 0 1-1.06-.06z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Default SVG Logo Component
const DefaultLogoSvg = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="10" r="5" fill="currentColor" />
    <circle cx="8" cy="34" r="4" fill="currentColor" />
    <circle cx="36" cy="34" r="4" fill="currentColor" />
    <circle cx="22" cy="26" r="3" fill="currentColor" opacity="0.75" />
    <line x1="22" y1="15" x2="22" y2="23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="20" y1="28" x2="10" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="28" x2="34" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export default function AdminSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [logoType, setLogoType] = useState<"svg_default" | "image">("svg_default");
  const [logoImageUrl, setLogoImageUrl] = useState("");
  const [logoShape, setLogoShape] = useState<"square" | "contain" | "circle">("square");
  const [logoText, setLogoText] = useState("SOLAKI");
  const [logoSubtitle, setLogoSubtitle] = useState("Creative Agency");

  const [whatsappNumber, setWhatsappNumber] = useState("6285255557890");
  const [whatsappMessage, setWhatsappMessage] = useState(
    "Halo SOLAKI Creative Agency, saya ingin konsultasi mengenai strategi pemasaran digital untuk bisnis saya."
  );

  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com/solaki.agency");
  const [tiktokUrl, setTiktokUrl] = useState("https://tiktok.com/@solaki.id");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/company/solaki");
  const [contactEmail, setContactEmail] = useState("hello@solaki.id");
  const [contactAddress, setContactAddress] = useState("Enrekang / Makassar, Sulawesi Selatan, Indonesia");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing settings
  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.contents && Array.isArray(data.contents)) {
          const map = new Map<string, string>();
          data.contents.forEach((c: { key: string; value: string }) => map.set(c.key, c.value));

          if (map.has("logo_type")) setLogoType(map.get("logo_type") as "svg_default" | "image");
          if (map.has("logo_image_url")) setLogoImageUrl(map.get("logo_image_url") || "");
          if (map.has("logo_shape")) setLogoShape(map.get("logo_shape") as "square" | "contain" | "circle");
          if (map.has("logo_text")) setLogoText(map.get("logo_text") || "SOLAKI");
          if (map.has("logo_subtitle")) setLogoSubtitle(map.get("logo_subtitle") || "Creative Agency");

          if (map.has("contact_whatsapp")) setWhatsappNumber(map.get("contact_whatsapp") || "6285255557890");
          if (map.has("contact_whatsapp_message")) setWhatsappMessage(map.get("contact_whatsapp_message") || "");

          if (map.has("social_instagram")) setInstagramUrl(map.get("social_instagram") || "");
          if (map.has("social_tiktok")) setTiktokUrl(map.get("social_tiktok") || "");
          if (map.has("social_linkedin")) setLinkedinUrl(map.get("social_linkedin") || "");

          if (map.has("contact_email")) setContactEmail(map.get("contact_email") || "hello@solaki.id");
          if (map.has("contact_address")) setContactAddress(map.get("contact_address") || "");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat pengaturan");
        setLoading(false);
      });
  }, []);

  // Handle Logo File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah gambar logo");
      }

      setLogoImageUrl(data.url);
      setLogoType("image");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    // Clean WA number
    const cleanWA = whatsappNumber.replace(/[^0-9]/g, "");

    const items = [
      { key: "logo_type", value: logoType, label: "Tipe Logo", section: "branding", type: "text" },
      { key: "logo_image_url", value: logoImageUrl, label: "URL Gambar Logo", section: "branding", type: "text" },
      { key: "logo_shape", value: logoShape, label: "Bentuk & Rasio Potong Logo", section: "branding", type: "text" },
      { key: "logo_text", value: logoText, label: "Teks Nama Logo", section: "branding", type: "text" },
      { key: "logo_subtitle", value: logoSubtitle, label: "Subjudul Logo", section: "branding", type: "text" },
      { key: "contact_whatsapp", value: cleanWA, label: "Nomor WhatsApp", section: "branding", type: "text" },
      { key: "contact_whatsapp_message", value: whatsappMessage, label: "Template Pesan WA", section: "branding", type: "textarea" },
      { key: "social_instagram", value: instagramUrl, label: "Instagram URL", section: "branding", type: "text" },
      { key: "social_tiktok", value: tiktokUrl, label: "TikTok URL", section: "branding", type: "text" },
      { key: "social_linkedin", value: linkedinUrl, label: "LinkedIn URL", section: "branding", type: "text" },
      { key: "contact_email", value: contactEmail, label: "Email Kontak", section: "contact", type: "text" },
      { key: "contact_address", value: contactAddress, label: "Alamat Kantor", section: "contact", type: "text" },
    ];

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });

      if (!res.ok) throw new Error("Gagal menyimpan ke database");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Generate WhatsApp live test link
  const cleanWA = whatsappNumber.replace(/[^0-9]/g, "");
  const waTestUrl = `https://wa.me/${cleanWA}?text=${encodeURIComponent(whatsappMessage)}`;

  if (loading) {
    return (
      <div className="py-20 text-center text-solaki-muted font-inter flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-solaki-teal" />
        Memuat pengaturan brand & media sosial...
      </div>
    );
  }

  // Render Image Helper with exact shape crop
  const renderPreviewLogoImage = (className: string) => {
    if (logoType === "image" && logoImageUrl) {
      if (logoShape === "square") {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoImageUrl}
            alt="Logo Preview"
            className="w-full h-full object-cover object-center rounded-xl"
          />
        );
      }
      if (logoShape === "circle") {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoImageUrl}
            alt="Logo Preview"
            className="w-full h-full object-cover object-center rounded-full"
          />
        );
      }
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoImageUrl}
          alt="Logo Preview"
          className="w-full h-full object-contain p-1"
        />
      );
    }
    return <DefaultLogoSvg size={24} />;
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-solaki-border">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Pengaturan Brand & Logo</h1>
          <p className="text-sm text-solaki-muted font-inter mt-1">
            Ubah logo website, atur pemotongan kotak/persegi, link media sosial, dan nomor WhatsApp konsultasi.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-primary py-2.5 px-5 text-sm font-bold flex items-center gap-2 shadow-lg cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Pengaturan
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2.5 text-sm font-inter animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Pengaturan logo, pemotongan kotak, media sosial & WhatsApp berhasil diperbarui di seluruh website!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2.5 text-sm font-inter">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. LOGO SETTINGS */}
      <div className="bento-card p-6 sm:p-8 border-solaki-border space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-solaki-border">
          <ImageIcon className="w-5 h-5 text-solaki-teal" />
          <h2 className="text-lg font-bold text-white font-inter">Manajemen Logo & Potongan Bentuk</h2>
        </div>

        {/* Live Preview Box */}
        <div>
          <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-2 font-inter">
            Live Preview Tampilan Navbar & Halaman
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Dark Mode Preview */}
            <div className="p-4 rounded-2xl bg-solaki-black border border-white/10 flex items-center gap-3.5 shadow-md">
              <div
                className={`w-10 h-10 flex items-center justify-center text-white overflow-hidden flex-shrink-0 border transition-all duration-300 ${
                  logoShape === "circle"
                    ? "rounded-full bg-white/10 border-white/20"
                    : "rounded-xl bg-white/10 border-white/20 shadow-sm"
                }`}
              >
                {renderPreviewLogoImage("dark")}
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-white text-base tracking-tight block truncate">
                  {logoText || "SOLAKI"}
                </span>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold leading-none">
                  {logoSubtitle || "Creative Agency"}
                </p>
              </div>
              <span className="ml-auto text-[10px] text-solaki-subtle font-mono px-2 py-1 rounded bg-white/5">Mode Gelap</span>
            </div>

            {/* Light Mode Preview */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-md">
              <div
                className={`w-10 h-10 flex items-center justify-center text-white overflow-hidden flex-shrink-0 border transition-all duration-300 ${
                  logoShape === "circle"
                    ? "rounded-full bg-black border-black"
                    : "rounded-xl bg-black border-slate-900 shadow-sm"
                }`}
              >
                {renderPreviewLogoImage("light")}
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-slate-900 text-base tracking-tight block truncate">
                  {logoText || "SOLAKI"}
                </span>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold leading-none">
                  {logoSubtitle || "Creative Agency"}
                </p>
              </div>
              <span className="ml-auto text-[10px] text-slate-500 font-mono px-2 py-1 rounded bg-slate-100">Mode Terang</span>
            </div>
          </div>
        </div>

        {/* Logo Type Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider font-inter">
            Pilihan Sumber Logo
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setLogoType("svg_default")}
              className={`p-4 rounded-xl border text-left transition-all font-inter cursor-pointer ${
                logoType === "svg_default"
                  ? "border-solaki-teal bg-solaki-teal/10 text-white"
                  : "border-solaki-border bg-solaki-surface/60 text-solaki-muted hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3.5 h-3.5 rounded-full border border-solaki-teal flex items-center justify-center">
                  {logoType === "svg_default" && <div className="w-2 h-2 rounded-full bg-solaki-teal" />}
                </div>
                <strong className="text-white text-sm">Logo Vektor Standar SOLAKI (B&W)</strong>
              </div>
              <p className="text-xs text-solaki-muted ml-5">
                Ikon geometris abstrak node terhubung (*Bersama Kita*) warna hitam-putih presisi.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setLogoType("image")}
              className={`p-4 rounded-xl border text-left transition-all font-inter cursor-pointer ${
                logoType === "image"
                  ? "border-solaki-teal bg-solaki-teal/10 text-white"
                  : "border-solaki-border bg-solaki-surface/60 text-solaki-muted hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3.5 h-3.5 rounded-full border border-solaki-teal flex items-center justify-center">
                  {logoType === "image" && <div className="w-2 h-2 rounded-full bg-solaki-teal" />}
                </div>
                <strong className="text-white text-sm">Upload Gambar Logo Kustom</strong>
              </div>
              <p className="text-xs text-solaki-muted ml-5">
                Unggah file gambar logo format PNG (transparan), JPG, WEBP, atau SVG kustom agensi Anda.
              </p>
            </button>
          </div>
        </div>

        {/* Logo Shape & Crop Selector (When image is selected) */}
        {logoType === "image" && (
          <div className="p-5 rounded-xl bg-solaki-surface/80 border border-solaki-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider font-inter flex items-center gap-2">
                  <Crop className="w-4 h-4 text-solaki-teal" />
                  Opsi Potong & Bentuk Logo (Crop Fit Mode)
                </label>
                <p className="text-xs text-solaki-muted font-inter mt-0.5">
                  Jika logo berukuran panjang (horizontal), pilih <strong>Potong Kotak (1:1)</strong> agar otomatis di-crop tengah dan proporsional.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {/* Option 1: Square Crop */}
              <button
                type="button"
                onClick={() => setLogoShape("square")}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  logoShape === "square"
                    ? "border-solaki-teal bg-solaki-teal/15 text-white shadow-sm"
                    : "border-solaki-border bg-solaki-card/60 text-solaki-muted hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Square className="w-4 h-4 text-solaki-teal flex-shrink-0" />
                  <strong className="text-xs text-white">Potong Kotak (1:1 Square)</strong>
                </div>
                <p className="text-[11px] text-solaki-muted leading-relaxed">
                  Otomatis potong logo panjang menjadi rasio persegi 1:1 di tengah dengan radius halus (*Rekomendasi*).
                </p>
              </button>

              {/* Option 2: Original Contain */}
              <button
                type="button"
                onClick={() => setLogoShape("contain")}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  logoShape === "contain"
                    ? "border-solaki-teal bg-solaki-teal/15 text-white shadow-sm"
                    : "border-solaki-border bg-solaki-card/60 text-solaki-muted hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Maximize2 className="w-4 h-4 text-solaki-teal flex-shrink-0" />
                  <strong className="text-xs text-white">Asli / Proporsional (Contain)</strong>
                </div>
                <p className="text-[11px] text-solaki-muted leading-relaxed">
                  Menampilkan seluruh proporsi gambar asli tanpa dipotong (cocok jika logo sudah berupa ikon kotak).
                </p>
              </button>

              {/* Option 3: Circle Crop */}
              <button
                type="button"
                onClick={() => setLogoShape("circle")}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  logoShape === "circle"
                    ? "border-solaki-teal bg-solaki-teal/15 text-white shadow-sm"
                    : "border-solaki-border bg-solaki-card/60 text-solaki-muted hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Circle className="w-4 h-4 text-solaki-teal flex-shrink-0" />
                  <strong className="text-xs text-white">Lingkaran (Circle 1:1)</strong>
                </div>
                <p className="text-[11px] text-solaki-muted leading-relaxed">
                  Memotong logo menjadi lingkaran bulat penuh 1:1 di bagian tengah.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Upload File Input (if image selected) */}
        {logoType === "image" && (
          <div className="p-5 rounded-xl bg-solaki-surface border border-solaki-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider font-inter">
                  Unggah Berkas Gambar Logo
                </span>
                <p className="text-xs text-solaki-muted font-inter mt-0.5">
                  Mendukung format PNG transparan, SVG, WEBP, JPG (Maks. 5MB)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-2 flex-shrink-0 cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-solaki-teal" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-solaki-teal" />
                    Pilih File Gambar
                  </>
                )}
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-1 font-inter">
                Atau Masukkan URL / Path Logo Manual
              </label>
              <input
                type="text"
                value={logoImageUrl}
                onChange={(e) => setLogoImageUrl(e.target.value)}
                placeholder="/uploads/logo.png atau https://domain.com/logo.png"
                className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-card border border-solaki-border text-white text-sm font-mono text-xs focus:outline-none focus:border-solaki-teal"
              />
            </div>
          </div>
        )}

        {/* Logo Text & Subtitle */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-1 font-inter">
              Teks Nama Brand
            </label>
            <input
              type="text"
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              placeholder="SOLAKI"
              className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal font-inter"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-1 font-inter">
              Subjudul Logo
            </label>
            <input
              type="text"
              value={logoSubtitle}
              onChange={(e) => setLogoSubtitle(e.target.value)}
              placeholder="Creative Agency"
              className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal font-inter"
            />
          </div>
        </div>
      </div>

      {/* 2. WHATSAPP DIRECT LINK SETTINGS */}
      <div className="bento-card p-6 sm:p-8 border-solaki-border space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-solaki-border">
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white font-inter">Pengaturan WhatsApp Konsultasi</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-1 font-inter">
              Nomor WhatsApp Agensi (Format Internasional: 628xxx)
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="6285255557890"
              className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm font-mono focus:outline-none focus:border-solaki-teal"
            />
            <p className="text-[11px] text-solaki-subtle mt-1 font-inter">
              Gunakan awalan <strong>62</strong> tanpa spasi atau tanda hubung.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-1 font-inter">
              Email Resmi
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="hello@solaki.id"
              className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-1 font-inter">
            Template Pesan Otomatis WhatsApp
          </label>
          <textarea
            rows={3}
            value={whatsappMessage}
            onChange={(e) => setWhatsappMessage(e.target.value)}
            placeholder="Pesan yang otomatis tertulis saat calon klien menekan tombol WhatsApp di website..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal font-inter"
          />
        </div>

        {/* Live WA Test Link */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Uji Link Chat WhatsApp</p>
              <p className="text-[11px] text-emerald-400 font-mono truncate max-w-sm sm:max-w-md">
                {waTestUrl}
              </p>
            </div>
          </div>
          <a
            href={waTestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors flex-shrink-0 shadow-md cursor-pointer"
          >
            Buka Chat WhatsApp
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 3. SOCIAL MEDIA & ADDRESS */}
      <div className="bento-card p-6 sm:p-8 border-solaki-border space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-solaki-border">
          <Share2 className="w-5 h-5 text-solaki-teal" />
          <h2 className="text-lg font-bold text-white font-inter">Link Media Sosial & Alamat</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-1 font-inter flex items-center gap-1.5">
              <InstagramIcon />
              Instagram
            </label>
            <input
              type="text"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/solaki.agency"
              className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-1 font-inter flex items-center gap-1.5">
              <TikTokIcon />
              TikTok
            </label>
            <input
              type="text"
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              placeholder="https://tiktok.com/@solaki.id"
              className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-1 font-inter flex items-center gap-1.5">
              <LinkedinIcon />
              LinkedIn
            </label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/company/solaki"
              className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-1 font-inter">
            Alamat / Lokasi Kantor
          </label>
          <input
            type="text"
            value={contactAddress}
            onChange={(e) => setContactAddress(e.target.value)}
            placeholder="Enrekang / Makassar, Sulawesi Selatan, Indonesia"
            className="w-full px-3.5 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm focus:outline-none focus:border-solaki-teal font-inter"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-primary py-3 px-6 text-sm font-bold flex items-center gap-2 shadow-xl cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan Perubahan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Semua Pengaturan
            </>
          )}
        </button>
      </div>
    </form>
  );
}
