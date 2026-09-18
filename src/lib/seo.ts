// Set SITE_URL at build time when the production domain changes.
const defaultSiteUrl = "https://www.solaki.web.id";
const rawUrl =
  process.env.SITE_URL ||
  (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
    ? process.env.NEXT_PUBLIC_APP_URL
    : defaultSiteUrl);
const configuredUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
if (!["http:", "https:"].includes(configuredUrl.protocol)) {
  throw new Error("SITE_URL must use http or https");
}

export const siteUrl = configuredUrl.origin;
export const siteName = "SOLAKI Creative Agency";
export const siteTitle = "SOLAKI | Jasa Digital Marketing & Media Sosial untuk UMKM";
export const siteDescription =
  "SOLAKI membantu UMKM tumbuh lewat konten kreatif, pengelolaan media sosial, serta Meta Ads dan TikTok Ads. Konsultasikan strategi digital bisnis Anda.";

export const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: `${siteUrl}/`,
      logo: `${siteUrl}/logo_solaki/Logo_Solaki.png`,
      description: siteDescription,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: siteName,
      inLanguage: "id-ID",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: `${siteUrl}/`,
      name: siteTitle,
      description: siteDescription,
      inLanguage: "id-ID",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
    },
  ],
};
