import Footer from "@/components/Footer";
import AboutAccelereBanner from "@/components/about/AboutAccelereBanner";
import AboutAccelereFollow from "@/components/about/AboutAccelereFollow";
import AboutCoreTeam from "@/components/about/AboutCoreTeam";
import AboutHero from "@/components/about/AboutHero";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export default async function AboutPage() {
  const payload = await getPayloadClient();
  const aboutPage = await payload.findGlobal({ slug: "about-page" });
  const siteSettings = await payload.findGlobal({ slug: "site-settings" });
  const teamMembers = await payload.find({ collection: "team-members", sort: "order" });

  return (
    <main className="bg-primary text-secondary w-full ">
      <AboutHero
        title={aboutPage.heroTitle}
        description={aboutPage.heroDescription}
        backgroundImage={aboutPage.heroBackgroundImage}
      />
      <AboutCoreTeam
        coreIntroText={aboutPage.coreIntroText}
        coreAreas={aboutPage.coreAreas || []}
        founderBio={aboutPage.founderBio}
        teamMembers={teamMembers.docs.map((m) => ({
          name: m.name,
          role: m.role,
          image: m.image,
        }))}
      />
      <AboutAccelereBanner />
      <AboutAccelereFollow
        description={aboutPage.accelereDescription}
        quote={aboutPage.accelereQuote}
        quoteAuthor={aboutPage.accelereQuoteAuthor}
        quoteRole={aboutPage.accelereQuoteRole}
        quoteTitle={aboutPage.accelereQuoteTitle}
        instagramHandle={aboutPage.instagramHandle}
        instagramUrl={aboutPage.instagramUrl}
        instagramImages={aboutPage.instagramImages?.map((i: { image: string }) => i.image) || []}
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
