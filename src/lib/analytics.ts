"use client";

export type EventType = "pageview" | "whatsapp_click" | "chatbot_open" | "lead_submit";

const VISITOR_STORAGE_KEY = "solaki_vid";

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let vid = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!vid) {
      vid = "v_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
      localStorage.setItem(VISITOR_STORAGE_KEY, vid);
    }
    return vid;
  } catch {
    return "anon_" + Date.now().toString(36);
  }
}

export function parseReferrer(ref = ""): string {
  if (!ref || !ref.trim()) return "Direct";
  try {
    const url = new URL(ref);
    const host = url.hostname.toLowerCase();
    if (host.includes("localhost") || host === window.location.hostname.toLowerCase()) {
      return "Direct";
    }
    if (host.includes("instagram.com")) return "Instagram";
    if (host.includes("tiktok.com")) return "TikTok";
    if (host.includes("google.")) return "Google Search";
    if (host.includes("facebook.") || host.includes("fb.")) return "Facebook";
    if (host.includes("twitter.com") || host.includes("x.com") || host.includes("t.co")) return "Twitter / X";
    if (host.includes("whatsapp.") || host.includes("wa.me")) return "WhatsApp";
    if (host.includes("linkedin.com")) return "LinkedIn";
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "YouTube";
    return host.replace(/^www\./, "");
  } catch {
    return "Direct";
  }
}

export function detectDevice(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    ) ||
    window.innerWidth < 768
  ) {
    return "mobile";
  }
  return "desktop";
}

export function detectBrowser(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (/Edg/i.test(ua)) return "Edge";
  if (/Chrome/i.test(ua) && !/Chromium|Edg/i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/Firefox/i.test(ua)) return "Firefox";
  if (/Opera|OPR/i.test(ua)) return "Opera";
  return "Other";
}

export function trackClientEvent(type: EventType = "pageview", metadata: string = "") {
  if (typeof window === "undefined") return;

  const path = window.location.pathname + window.location.hash;
  // Ignore dashboard and admin paths to avoid contaminating analytics data
  if (path.startsWith("/solaki/dashboard") || path.startsWith("/admin")) {
    return;
  }

  const payload = {
    type,
    path: path || "/",
    referrer: parseReferrer(document.referrer),
    device: detectDevice(),
    browser: detectBrowser(),
    visitorId: getOrCreateVisitorId(),
    metadata,
  };

  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics/track", blob);
  } else {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}
