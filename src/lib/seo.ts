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

// ── Additional SEO keywords for meta tags ──
export const siteKeywords = [
  "digital marketing UMKM",
  "jasa social media management",
  "content creator Indonesia",
  "Meta Ads UMKM",
  "TikTok Ads UMKM",
  "jasa kelola instagram",
  "jasa kelola tiktok",
  "digital agency Makassar",
  "digital agency Enrekang",
  "strategi digital UMKM",
  "konten kreatif bisnis",
  "jasa iklan digital",
  "pengelolaan media sosial",
  "SOLAKI",
  "solaki agency",
];

// ── Structured Data (JSON-LD) ──
export const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: `${siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo_solaki/Logo_Solaki.png`,
        width: 1200,
        height: 1200,
      },
      description: siteDescription,
      sameAs: [
        "https://instagram.com/solaki.agency",
        "https://tiktok.com/@solaki.id",
        "https://linkedin.com/company/solaki",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+62-852-5544-3322",
        contactType: "customer service",
        availableLanguage: ["Indonesian", "English"],
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      name: siteName,
      description: siteDescription,
      url: `${siteUrl}/`,
      telephone: "+62-852-5544-3322",
      email: "hello@solaki.id",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Enrekang",
        addressRegion: "Sulawesi Selatan",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -3.57,
        longitude: 119.98,
      },
      image: `${siteUrl}/logo_solaki/Logo_Solaki.png`,
      priceRange: "$$",
      openingHours: "Mo-Sa 09:00-18:00",
      areaServed: {
        "@type": "Country",
        name: "Indonesia",
      },
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
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".hero-subtitle", ".section-heading"],
      },
    },
  ],
};

// ── Service Structured Data ──
export const serviceStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Content Creator",
    description:
      "Merancang konten visual dan tulisan yang menarik, relevan, dan konsisten dengan identitas brand Anda — mulai dari desain grafis, carousel, caption, hingga short-form video.",
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: { "@type": "Country", name: "Indonesia" },
    serviceType: "Content Creation",
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Social Media Management",
    description:
      "Mengelola media sosial dari perencanaan konten hingga interaksi langsung dengan audiens — memastikan brand Anda aktif, relevan, dan membangun komunitas yang loyal.",
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: { "@type": "Country", name: "Indonesia" },
    serviceType: "Social Media Management",
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Digital Advertising",
    description:
      "Menjalankan dan mengoptimalkan kampanye iklan berbayar di Meta (Instagram & Facebook) dan TikTok Ads — dengan target audiens yang presisi dan fokus pada hasil nyata.",
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: { "@type": "Country", name: "Indonesia" },
    serviceType: "Digital Advertising",
  },
];

// ── FAQ Structured Data ──
export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Apa itu SOLAKI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SOLAKI (Solusi Agency Kreatif & Inovasi Digital) adalah agensi digital marketing yang membantu UMKM tumbuh melalui konten kreatif, pengelolaan media sosial, dan iklan digital (Meta Ads & TikTok Ads).",
      },
    },
    {
      "@type": "Question",
      name: "Layanan apa saja yang ditawarkan SOLAKI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SOLAKI menyediakan 3 layanan utama: Content Creator (desain grafis, copywriting, short-form video), Social Media Management (perencanaan konten, pengelolaan Instagram/TikTok/Facebook), dan Digital Advertising (Meta Ads & TikTok Ads).",
      },
    },
    {
      "@type": "Question",
      name: "Apakah SOLAKI melayani UMKM?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya, SOLAKI secara khusus dirancang untuk melayani UMKM dan bisnis lokal di seluruh Indonesia dengan layanan yang profesional dan terjangkau.",
      },
    },
    {
      "@type": "Question",
      name: "Bagaimana cara menghubungi SOLAKI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Anda bisa menghubungi SOLAKI melalui WhatsApp di 0852-5544-3322, email di hello@solaki.id, atau melalui formulir kontak di website www.solaki.web.id.",
      },
    },
    {
      "@type": "Question",
      name: "Di mana lokasi SOLAKI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SOLAKI berlokasi di Enrekang dan Makassar, Sulawesi Selatan, Indonesia. Namun kami melayani klien dari seluruh Indonesia secara online.",
      },
    },
  ],
};
