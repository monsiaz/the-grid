import Footer from "@/components/Footer";
import AboutHeroFrame from "@/components/about/AboutHeroFrame";
import AboutCoreTeamFrame from "@/components/about/AboutCoreTeamFrame";
import AboutAccelereBannerFrame from "@/components/about/AboutAccelereBannerFrame";
import AboutAccelereFollowFrame from "@/components/about/AboutAccelereFollowFrame";

export default function AboutPage() {
  return (
    <main className="bg-primary text-secondary w-full overflow-x-hidden">
      <AboutHeroFrame />
      <AboutCoreTeamFrame />
      <AboutAccelereBannerFrame />
      <AboutAccelereFollowFrame />
      <Footer />
    </main>
  );
}
