import Footer from "@/components/Footer";
import About from "@/components/About";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Services from "@/components/Services";
import News from "@/components/News";
import Drivers from "@/components/Drivers";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export default async function Home() {
  const payload = await getPayloadClient();
  const homepage = await payload.findGlobal({ slug: "homepage" });
  const siteSettings = await payload.findGlobal({ slug: "site-settings" });

  return (
    <main id="main" className="bg-primary text-secondary w-full ">
      <Hero
        backgroundImage={homepage.heroBackgroundImage}
        title={homepage.heroTitle}
      />
      <About
        text={homepage.aboutText}
        buttonLabel={homepage.aboutButtonLabel || "Explore"}
      />
      <Experience text={homepage.experienceText} />
      <Services labels={homepage.serviceLabels?.map((s: { label: string }) => s.label) || []} />
      <News items={homepage.homepageNewsItems || []} />
      <Drivers
        heading={homepage.driversHeading || "For deserving"}
        headingAccent={homepage.driversHeadingAccent || "drivers"}
      />
      <Footer
        copyright={siteSettings.footerCopyright}
        instagramUrl={siteSettings.instagramUrl}
        linkedinUrl={siteSettings.linkedinUrl}
        email={siteSettings.email}
        privacyPolicyUrl={siteSettings.privacyPolicyUrl}
      />
    </main>
  );
}
