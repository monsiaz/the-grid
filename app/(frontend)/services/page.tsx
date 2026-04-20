import Footer from "@/components/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesPartner from "@/components/services/ServicesPartner";
import ServicesTalent from "@/components/services/ServicesTalent";
import ServicesValue from "@/components/services/ServicesValue";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export default async function ServicesPage() {
  const payload = await getPayloadClient();
  const servicesPage = await payload.findGlobal({ slug: "services-page" });
  const siteSettings = await payload.findGlobal({ slug: "site-settings" });

  return (
    <main id="main" className="bg-primary text-secondary w-full ">
      <ServicesHero
        title={servicesPage.heroTitle}
        description={servicesPage.heroDescription}
        backgroundImage={servicesPage.heroBackgroundImage}
      />
      <ServicesTalent
        heading={servicesPage.talentHeading}
        headingAccent={servicesPage.talentHeadingAccent}
        description={servicesPage.talentDescription}
        introText={servicesPage.talentIntroText}
        cards={servicesPage.talentCards?.map((c: { title: string; image: string }) => ({
          title: c.title,
          image: c.image,
          alt: c.title,
        })) || []}
      />
      <ServicesPartner description={servicesPage.partnerDescription} />
      <ServicesValue
        heading={servicesPage.valueHeading}
        headingAccent={servicesPage.valueHeadingAccent}
        description={servicesPage.valueDescription}
        introText={servicesPage.valueIntroText}
        cards={servicesPage.valueCards?.map((c: { title: string; image: string }) => ({
          title: c.title,
          image: c.image,
          alt: c.title.replace("\n", " "),
        })) || []}
        caseStudies={servicesPage.caseStudies || []}
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
