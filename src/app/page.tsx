import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import BentoServices from "@/components/BentoServices";
import SocialShowcaseSection from "@/components/SocialShowcaseSection";
import HowWeWork from "@/components/HowWeWork";
import TargetClients from "@/components/TargetClients";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-solaki-bg text-white selection:bg-solaki-teal selection:text-white">
      <Navbar />
      <Hero />
      <Philosophy />
      <BentoServices />
      <SocialShowcaseSection />
      <HowWeWork />
      <TargetClients />
      <ContactForm />
      <Footer />
    </main>
  );
}
