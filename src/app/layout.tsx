import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SOLAKI Creative Agency — Solusi Pemasaran Digital Terintegrasi",
  description:
    "SOLAKI adalah agensi pemasaran digital yang berakar pada filosofi lokal Enrekang 'Sola ki' — Bersama Kita. Kami hadir sebagai mitra internal yang mendampingi pertumbuhan bisnis melalui konten kreatif, media sosial strategis, dan iklan berbasis data.",
  keywords: [
    "agensi digital",
    "SOLAKI",
    "pemasaran digital",
    "UMKM",
    "social media management",
    "content creation",
    "digital advertising",
    "Meta Ads",
    "TikTok Ads",
    "Enrekang",
    "Indonesia",
  ],
  authors: [{ name: "SOLAKI Creative Agency", url: "https://solaki.id" }],
  creator: "SOLAKI Creative Agency",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://solaki.id",
    title: "SOLAKI Creative Agency — Solusi Pemasaran Digital Terintegrasi",
    description:
      "Mitra internal bisnis & UMKM Anda. Tumbuh bersama lewat strategi konten, media sosial, dan iklan berbasis data.",
    siteName: "SOLAKI Creative Agency",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOLAKI Creative Agency",
    description: "Mitra Digital Internal untuk Pertumbuhan Bisnis & UMKM",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/logo_solaki/Logo_Solaki_transparent.png", sizes: "any" },
      { url: "/logo_solaki/Logo Solaki_clean.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo_solaki/Logo_Solaki_transparent.png",
    apple: "/logo_solaki/Logo_Solaki_transparent.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('solaki_theme');
                  if (stored === 'light' || stored === 'dark') {
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add(stored);
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${inter.variable} font-jakarta antialiased transition-colors duration-300 bg-solaki-black text-white`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
