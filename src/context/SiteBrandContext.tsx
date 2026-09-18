"use client";

import { createContext } from "react";
import type { SiteBrandData } from "@/lib/site-brand";

export const SiteBrandContext = createContext<SiteBrandData | null>(null);

export function SiteBrandProvider({ brand, children }: {
  brand: SiteBrandData;
  children: React.ReactNode;
}) {
  return <SiteBrandContext.Provider value={brand}>{children}</SiteBrandContext.Provider>;
}
