export function safeMediaUrl(value = "") {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch { return ""; }
}

export function isVideoUrl(value = "") {
  return /\.(mp4|webm|mov|m4v|ogv)(?:[?#]|$)/i.test(value);
}

export function socialEmbedUrl(value = "") {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return "";
    if (/^(www\.)?instagram\.com$/.test(url.hostname)) {
      const match = url.pathname.match(/^\/(p|reel|reels)\/([\w-]+)\/?$/);
      if (match) return `https://www.instagram.com/p/${match[2]}/embed/`;
    }
    if (/^(www\.)?tiktok\.com$/.test(url.hostname)) {
      const match = url.pathname.match(/^\/@[^/]+\/(?:video|photo)\/(\d+)\/?$/);
      if (match) return `https://www.tiktok.com/player/v1/${match[1]}`;
    }
  } catch { /* Not a supported post URL. */ }
  return "";
}

export function showcaseKind(item: { format?: string; mediaUrl?: string }) {
  return isVideoUrl(item.mediaUrl) || /reel|video|fyp/i.test(item.format || "") ? "video" : "photo";
}
