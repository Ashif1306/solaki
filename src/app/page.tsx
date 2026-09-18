import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

import Philosophy from "@/components/Philosophy";
import BentoServices from "@/components/BentoServices";
import HowWeWork from "@/components/HowWeWork";
import SocialShowcaseSection from "@/components/SocialShowcaseSection";
import TargetClients from "@/components/TargetClients";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <main className="relative bg-solaki-bg text-white selection:bg-solaki-teal selection:text-white">
      <Navbar />
      <Hero />

      <Philosophy />
      <BentoServices />
      <HowWeWork />
      <SocialShowcaseSection />
      <TargetClients />
      <ContactForm />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
