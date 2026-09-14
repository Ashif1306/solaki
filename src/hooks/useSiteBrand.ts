"use client";

import { useState, useEffect } from "react";

export type LogoShapeType = "square" | "contain" | "circle";

export interface SiteBrandData {
  logoType: "svg" | "image";
  logoImageUrl: string;
  logoShape: LogoShapeType;
  logoText: string;
  logoSubtitle: string;
  whatsapp: string;
  whatsappMessage: string;
  whatsappUrl: string;
  socialInstagram: string;
  socialTiktok: string;
  socialLinkedin: string;
  contactEmail: string;
  contactAddress: string;
}

const defaultBrand: SiteBrandData = {
  logoType: "svg",
  logoImageUrl: "",
  logoShape: "square",
  logoText: "SOLAKI",
  logoSubtitle: "Creative Agency",
  whatsapp: "6285255443322",
  whatsappMessage: "Halo SOLAKI, saya tertarik untuk konsultasi strategi digital untuk bisnis/UMKM saya.",
  whatsappUrl: "https://wa.me/6285255443322?text=Halo%20SOLAKI%2C%20saya%20tertarik%20untuk%20konsultasi%20strategi%20digital%20untuk%20bisnis%2FUMKM%20saya.",
  socialInstagram: "https://instagram.com/solaki.agency",
  socialTiktok: "https://tiktok.com/@solaki.id",
  socialLinkedin: "https://linkedin.com/company/solaki",
  contactEmail: "hello@solaki.id",
  contactAddress: "Enrekang / Makassar, Sulawesi Selatan, Indonesia",
};

export function useSiteBrand() {
  const [brand, setBrand] = useState<SiteBrandData>(defaultBrand);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchBrand() {
      try {
        const res = await fetch("/api/admin/content");
        if (res.ok) {
          const data = await res.json();
          if (data.contents && Array.isArray(data.contents)) {
            const map: Record<string, string> = {};
            data.contents.forEach((c: { key: string; value: string }) => {
              map[c.key] = c.value;
            });

            const waNum = (map["contact_whatsapp"] || defaultBrand.whatsapp).replace(/[^0-9]/g, "");
            const waMsg = map["contact_whatsapp_message"] || defaultBrand.whatsappMessage;
            const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`;

            if (isMounted) {
              setBrand({
                logoType: (map["logo_type"] as "svg" | "image") || "svg",
                logoImageUrl: map["logo_image_url"] || "",
                logoShape: (map["logo_shape"] as LogoShapeType) || "square",
                logoText: map["logo_text"] || "SOLAKI",
                logoSubtitle: map["logo_subtitle"] || "Creative Agency",
                whatsapp: waNum,
                whatsappMessage: waMsg,
                whatsappUrl: waUrl,
                socialInstagram: map["social_instagram"] || defaultBrand.socialInstagram,
                socialTiktok: map["social_tiktok"] || defaultBrand.socialTiktok,
                socialLinkedin: map["social_linkedin"] || defaultBrand.socialLinkedin,
                contactEmail: map["contact_email"] || defaultBrand.contactEmail,
                contactAddress: map["contact_address"] || defaultBrand.contactAddress,
              });
            }
          }
        }
      } catch (err) {
        // Fallback to default
      } finally {
        if (isMounted) setLoaded(true);
      }
    }

    fetchBrand();
    return () => {
      isMounted = false;
    };
  }, []);

  return { brand, loaded };
}
