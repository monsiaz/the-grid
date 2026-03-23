import Footer from "@/components/Footer";
import AboutAccelereBanner from "@/components/about/AboutAccelereBanner";
import AboutAccelereFollow from "@/components/about/AboutAccelereFollow";
import AboutCoreTeam from "@/components/about/AboutCoreTeam";
import AboutHero from "@/components/about/AboutHero";

export default function AboutPage() {
  return (
    <main className="bg-primary text-secondary w-full ">
      <AboutHero />
      <AboutCoreTeam />
      <AboutAccelereBanner />
      <AboutAccelereFollow />
      <Footer />
    </main>
  );
}
