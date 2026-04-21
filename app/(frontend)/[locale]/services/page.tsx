import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildI18nMetadata } from "@/lib/i18nMetadata";
import { buildRouteAlternates } from "@/lib/routeAlternates";
import LocaleAlternatesData from "@/components/LocaleAlternatesData";
import Footer from "@/components/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesPartner from "@/components/services/ServicesPartner";
import ServicesTalent from "@/components/services/ServicesTalent";
import ServicesValue from "@/components/services/ServicesValue";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/services" });
  return buildI18nMetadata({
    locale,
    pathSegment: "/services",
    namespace: "services",
    alternatesOverride: alternates.hreflang,
    canonicalOverride: alternates.canonical,
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const payload = await getPayloadClient();

  // Resilient fetch: on first deploy after schema changes the DB may not
  // yet contain the new columns (Payload push runs on first admin hit).
  // Falling back to {} keeps the page renderable — it'll pick up the
  // real data on the next revalidation after the schema settles.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const servicesPage: any = await payload
    .findGlobal({ slug: "services-page", locale })
    .catch(() => ({}));
  const siteSettings: any = await payload
    .findGlobal({ slug: "site-settings", locale })
    .catch(() => ({}));
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/services" });

  return (
    <main id="main" className="bg-primary text-secondary w-full ">
      <ServicesHero
        title={servicesPage.heroTitle}
        description={servicesPage.heroDescription}
        backgroundImage={servicesPage.heroBackgroundImage}
      />
      {/* 1. Commercial — WHERE PERFORMANCE CREATES VALUE + case studies */}
      <ServicesValue
        heading={servicesPage.valueHeading}
        headingAccent={servicesPage.valueHeadingAccent}
        description={servicesPage.valueDescription}
        introText={servicesPage.valueIntroText}
        cards={servicesPage.valueCards?.map((c: { title: string; image: string; description?: string | null }) => ({
          title: c.title,
          image: c.image,
          alt: c.title.replace("\n", " "),
          description: c.description || null,
        })) || []}
        caseStudies={servicesPage.caseStudies || []}
      />
      {/* 2. Hintsa partnership — BETWEEN commercial and talent per client brief */}
      <ServicesPartner
        description={servicesPage.partnerDescription}
        backgroundImage={servicesPage.partnerBackgroundImage}
      />
      {/* 3. Talent — TALENT TAKES THE WHEEL / WE PAVE THE WAY */}
      <ServicesTalent
        heading={servicesPage.talentHeading}
        headingAccent={servicesPage.talentHeadingAccent}
        description={servicesPage.talentDescription}
        introTitle={servicesPage.talentIntroTitle}
        introText={servicesPage.talentIntroText}
        introImage={servicesPage.talentIntroImage}
        cards={servicesPage.talentCards?.map((c: { title: string; image: string; description?: string | null }) => ({
          title: c.title,
          image: c.image,
          alt: c.title,
          description: c.description || null,
        })) || []}
      />
      <LocaleAlternatesData alternates={alternates} />
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
