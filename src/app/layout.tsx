import type { Metadata } from "next";
import { siteUrl, siteName, siteTitle, siteDescription, siteKeywords } from "@/lib/seo";
import { Poppins, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s | SOLAKI" },
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "Digital Marketing",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: siteTitle,
    description: siteDescription,
    siteName,
    images: [
      {
        url: "/logo_solaki/Logo_Solaki.png",
        width: 1200,
        height: 1200,
        alt: "SOLAKI Creative Agency",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/logo_solaki/Logo_Solaki.png",
        width: 1200,
        height: 1200,
        alt: "SOLAKI Creative Agency",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
  alternates: {
    canonical: `${siteUrl}/`,
  },
  icons: {
    icon: [
      { url: "/logo_solaki/Logo_Solaki.png", sizes: "any" },
      { url: "/logo_solaki/Logo Solaki.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo_solaki/Logo_Solaki.png",
    apple: "/logo_solaki/Logo_Solaki.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('solaki_theme');
                  var theme;
                  if (stored === 'light' || stored === 'dark') {
                    theme = stored;
                  } else {
                    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                    theme = prefersDark ? 'dark' : 'light';
                  }
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} ${montserrat.variable} font-montserrat antialiased transition-colors duration-300 bg-solaki-black text-white`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
