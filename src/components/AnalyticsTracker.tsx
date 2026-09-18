"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackClientEvent } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    // Combine pathname and search parameters for accurate URL tracking
    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Avoid duplicate tracks for the same path in quick succession
    if (lastTrackedPath.current === fullPath) return;
    lastTrackedPath.current = fullPath;

    // Trigger pageview tracking
    trackClientEvent("pageview");
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept clicks on WhatsApp CTA buttons across the website to track conversions
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (anchor && anchor.href) {
        const href = anchor.href.toLowerCase();
        if (href.includes("wa.me") || href.includes("whatsapp.com") || href.includes("api.whatsapp.com")) {
          trackClientEvent("whatsapp_click", anchor.textContent?.trim().substring(0, 50) || "WhatsApp Link");
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return null;
}
