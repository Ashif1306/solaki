"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2, Sparkles, Mail } from "lucide-react";

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
  const philosophyItems = items.filter((i) => i.section === "philosophy");
  const contactItems = items.filter((i) => i.section === "contact");
  const otherItems = items.filter(
    (i) => !["hero", "philosophy", "contact"].includes(i.section)
  );

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
            Ubah teks headline, deskripsi, filosofi nama, dan informasi kontak website.
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

      {/* Philosophy Section */}
      <div className="bento-card p-6 sm:p-8 border-solaki-border space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-solaki-border">
          <h2 className="text-lg font-bold text-white font-inter">Filosofi & Identitas Sola Ki</h2>
        </div>

        {philosophyItems.map((item) => (
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
