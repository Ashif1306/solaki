"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { isVideoUrl, safeMediaUrl, socialEmbedUrl } from "@/lib/showcase-media";

export default function ShowcaseMedia({ mediaUrl = "", postUrl = "", title, controls = false }: {
  mediaUrl?: string; postUrl?: string; title: string; controls?: boolean;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  const source = safeMediaUrl(mediaUrl);
  const embed = socialEmbedUrl(postUrl) || socialEmbedUrl(mediaUrl);
  if (source && failed !== source && !socialEmbedUrl(source) && !(controls && embed && !isVideoUrl(source))) {
    if (isVideoUrl(source)) return <video key={source} src={`${source}${source.includes("#") ? "" : "#t=0.1"}`} className="absolute inset-0 h-full w-full object-contain bg-black" preload="metadata" muted playsInline controls={controls} aria-label={title} onLoadedMetadata={(event) => { if (!controls) event.currentTarget.currentTime = Math.min(0.1, event.currentTarget.duration / 2 || 0); }} onError={() => setFailed(source)} />;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={source} alt={title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" onError={() => setFailed(source)} />;
  }
  if (embed) return <iframe src={embed} title={title} loading="lazy" allow="fullscreen; encrypted-media; picture-in-picture" allowFullScreen className={`absolute inset-0 h-full w-full border-0 bg-white ${controls ? "" : "pointer-events-none"}`} tabIndex={controls ? 0 : -1} />;
  return <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-950 p-6 text-center"><ImageIcon className="h-9 w-9 text-emerald-300/50" /><span className="text-xs text-white/60">Preview belum tersedia</span></div>;
}
