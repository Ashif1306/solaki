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
import { homeStructuredData } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="relative bg-solaki-bg text-white selection:bg-solaki-teal selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <Hero />

      <Philosophy />
      <BentoServices />
      <HowWeWork />
      <SocialShowcaseSection />
      <TargetClients />
      <ContactForm />
      <Footer />
      <ChatBot />
    </main>
  );
}
