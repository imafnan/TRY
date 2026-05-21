import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/sections/HeroSection";
import { AboutSection } from "@/sections/AboutSection";
import { AboutSection2 } from "@/sections/AboutSection2";
import { CertificateSection } from "@/sections/CertificateSection";
// import Certificate2 from "../../Anan";

export const metadata: Metadata = {
  title: "Swapnopuri Properties and Developments",
  description:
    "Trusted real estate and property development company in Bangladesh.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <TopBar />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <AboutSection2 />
      <CertificateSection />
      <Footer />
      {/* <Certificate2 /> */}
    </main>
  );
}
