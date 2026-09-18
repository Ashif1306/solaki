"use client";

import { useContext, useState, useEffect } from "react";
import { SiteBrandContext } from "@/context/SiteBrandContext";
import { defaultBrand, resolveSiteBrand } from "@/lib/site-brand";
export type { LogoShapeType, SiteBrandData } from "@/lib/site-brand";

export function useSiteBrand() {
  const serverBrand = useContext(SiteBrandContext);
  const [brand, setBrand] = useState(defaultBrand);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Public pages already receive identical data in server HTML and hydration.
    if (serverBrand) return;

    // Preserve standalone usage on dashboard and login screens.
    const controller = new AbortController();
    async function fetchBrand() {
      try {
        const response = await fetch("/api/admin/content", { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        if (!controller.signal.aborted && Array.isArray(data.contents)) {
          setBrand(resolveSiteBrand(data.contents));
        }
      } catch {
        // Retain default branding if the request fails.
      } finally {
        if (!controller.signal.aborted) setLoaded(true);
      }
    }
    void fetchBrand();
    return () => controller.abort();
  }, [serverBrand]);

  return { brand: serverBrand ?? brand, loaded: serverBrand !== null || loaded };
}
