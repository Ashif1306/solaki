import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

import Philosophy from "@/components/Philosophy";
import BentoServices from "@/components/BentoServices";
import HowWeWork from "@/components/HowWeWork";
import SocialShowcaseSection from "@/components/SocialShowcaseSection";
import TargetClients from "@/components/TargetClients";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import type { Metadata } from "next";
import {
  homeStructuredData,
  serviceStructuredData,
  faqStructuredData,
} from "@/lib/seo";
import { connection } from "next/server";
import { getPublicBrand, getPublicShowcase, getPublicTeam } from "@/lib/public-content";
import { SiteBrandProvider } from "@/context/SiteBrandContext";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  // Render current published content for each request, before hydration.
  await connection();
  const [brand, team, showcase] = await Promise.all([
    getPublicBrand(),
    getPublicTeam(),
    getPublicShowcase(),
  ]);

  return (
    <SiteBrandProvider brand={brand}>
      <main className="relative bg-solaki-bg text-white selection:bg-solaki-teal selection:text-white">
        {/* Primary structured data: Organization, LocalBusiness, WebSite, WebPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c"),
          }}
        />
        {/* Service structured data for each service offering */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceStructuredData).replace(/</g, "\\u003c"),
          }}
        />
        {/* FAQ structured data for rich results in Google Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData).replace(/</g, "\\u003c"),
          }}
        />

        <Navbar />
        <Hero />
  
        <Philosophy team={team} />
        <BentoServices />
        <HowWeWork />
        <SocialShowcaseSection items={showcase.items} loadError={showcase.loadError} />
        <TargetClients />
        <ContactForm />
        <Footer />
        <ChatBot />
      </main>
    </SiteBrandProvider>
  );
}

