"use client";

import { useState } from "react";
import { Share2, Check, Copy, MessageCircle } from "lucide-react";

interface Props {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://www.solaki.web.id/blog/${slug}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const text = `Baca artikel menarik ini: "${title}" di ${getUrl()}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`,
      "_blank"
    );
  };

  const shareToTwitter = () => {
    const text = `Wawasan baru untuk bisnis: "${title}" via @solaki_agency`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getUrl())}`,
      "_blank"
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-solaki-muted flex items-center gap-1 font-medium">
        <Share2 className="w-3.5 h-3.5" />
        Bagikan:
      </span>

      {/* WhatsApp */}
      <button
        onClick={shareToWhatsApp}
        className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
        title="Bagikan ke WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>

      {/* LinkedIn */}
      <button
        onClick={shareToLinkedIn}
        className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors"
        title="Bagikan ke LinkedIn"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.91 0-1.64.73-1.64 1.64s.73 1.64 1.64 1.64 1.64-.73 1.64-1.64-.73-1.64-1.64-1.64Z" />
        </svg>
      </button>

      {/* Twitter/X */}
      <button
        onClick={shareToTwitter}
        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        title="Bagikan ke X (Twitter)"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
          copied
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
            : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white"
        }`}
        title="Salin Link Artikel"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            Tersalin
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Salin Link
          </>
        )}
      </button>
    </div>
  );
}
