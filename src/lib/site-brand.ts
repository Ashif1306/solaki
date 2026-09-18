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

export const defaultBrand: SiteBrandData = {
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


export const publicBrandKeys = [
  "logo_type", "logo_image_url", "logo_shape", "logo_text", "logo_subtitle",
  "contact_whatsapp", "contact_whatsapp_message", "contact_email", "contact_address",
  "social_instagram", "social_tiktok", "social_linkedin",
];

export function resolveSiteBrand(contents: { key: string; value: string }[]): SiteBrandData {
  const map = Object.fromEntries(contents.map(({ key, value }) => [key, value]));
  const whatsapp = (map.contact_whatsapp || defaultBrand.whatsapp).replace(/[^0-9]/g, "");
  const whatsappMessage = map.contact_whatsapp_message || defaultBrand.whatsappMessage;
  const shape = map.logo_shape;
  return {
    logoType: map.logo_type === "image" ? "image" : "svg",
    logoImageUrl: map.logo_image_url || "",
    logoShape: shape === "circle" || shape === "contain" ? shape : "square",
    logoText: map.logo_text || defaultBrand.logoText,
    logoSubtitle: map.logo_subtitle || defaultBrand.logoSubtitle,
    whatsapp,
    whatsappMessage,
    whatsappUrl: "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(whatsappMessage),
    socialInstagram: map.social_instagram || defaultBrand.socialInstagram,
    socialTiktok: map.social_tiktok || defaultBrand.socialTiktok,
    socialLinkedin: map.social_linkedin || defaultBrand.socialLinkedin,
    contactEmail: map.contact_email || defaultBrand.contactEmail,
    contactAddress: map.contact_address || defaultBrand.contactAddress,
  };
}
