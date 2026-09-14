"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useSiteBrand } from "@/hooks/useSiteBrand";

export default function AdminLoginPage() {
  const router = useRouter();
  const { brand } = useSiteBrand();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Login gagal. Periksa kembali email dan password.");
        setLoading(false);
        return;
      }

      router.push("/solaki/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-solaki-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(13,92,70,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bento-card p-8 sm:p-10 border border-solaki-border/80 shadow-2xl bg-solaki-card/90 backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              {brand.logoType === "image" && brand.logoImageUrl ? (
                <div
                  className={`w-14 h-14 flex items-center justify-center overflow-hidden border border-white/20 bg-white/10 shadow-lg ${
                    brand.logoShape === "circle" ? "rounded-full" : "rounded-2xl"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.logoImageUrl}
                    alt={brand.logoText}
                    className={
                      brand.logoShape === "contain"
                        ? "h-full w-auto object-contain p-1"
                        : brand.logoShape === "circle"
                        ? "w-full h-full object-cover object-center rounded-full"
                        : "w-full h-full object-cover object-center rounded-2xl"
                    }
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <svg width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="10" r="5" fill="currentColor" />
                    <circle cx="8" cy="34" r="4" fill="currentColor" />
                    <circle cx="36" cy="34" r="4" fill="currentColor" />
                    <circle cx="22" cy="26" r="3" fill="currentColor" opacity="0.7" />
                    <line x1="22" y1="15" x2="22" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="20" y1="28" x2="10" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="24" y1="28" x2="34" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">{brand.logoText || "SOLAKI"} Dashboard</h1>
            <p className="text-xs text-solaki-muted mt-1 font-inter">
              Masuk untuk mengelola konten dan data website
            </p>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-3 text-red-400 text-xs font-inter">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-2 font-inter">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-solaki-subtle">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@solaki.id"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm placeholder-solaki-subtle focus:outline-none focus:border-solaki-teal transition-colors font-inter"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-solaki-muted uppercase tracking-wider mb-2 font-inter">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-solaki-subtle">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-solaki-surface border border-solaki-border text-white text-sm placeholder-solaki-subtle focus:outline-none focus:border-solaki-teal transition-colors font-inter"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 mt-2 text-sm font-bold flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Credentials hint */}
          <div className="mt-8 p-3 rounded-xl bg-solaki-surface/60 border border-solaki-border/50 text-center">
            <p className="text-[11px] text-solaki-subtle font-inter">
              Default demo: <span className="text-white font-mono">admin@solaki.id</span> / <span className="text-white font-mono">solaki2025!</span>
            </p>
          </div>

          <div className="text-center mt-4">
            <a href="/" className="text-xs text-solaki-muted hover:text-white transition-colors font-inter">
              ← Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
