import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildI18nMetadata } from "@/lib/i18nMetadata";
import { buildRouteAlternates } from "@/lib/routeAlternates";
import LocaleAlternatesData from "@/components/LocaleAlternatesData";
import Footer from "@/components/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesCaseStudies from "@/components/services/ServicesCaseStudies";
import ServicesPartner from "@/components/services/ServicesPartner";
import ServicesTalent from "@/components/services/ServicesTalent";
import ServicesValue from "@/components/services/ServicesValue";
import { getPayloadClient } from "@/lib/payload";
import { resolveSectionOrder } from "@/lib/sectionOrder";
import { getDesignSettings } from "@/lib/designSettings";

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
  const designSettings = await getDesignSettings().catch(() => ({
    heroCta: "large" as const,
    stickyHeader: false,
    headerMenuStyle: "default" as const,
    headerMenuTextSize: "large" as const,
    heroTextBackdropOpacity: 1,
    heroTextBackdropBlur: 56,
    servicesArrowStyle: "default" as const,
    sliderSpeed: 0.5,
    accentColor: "red" as const,
    parallaxIntensity: 15,
    cardHoverStyle: "zoom" as const,
    cardBorderRadius: "default" as const,
    sectionSpacing: "normal" as const,
    heroGradientIntensity: 1,
    heroTitleSize: "normal" as const,
    globalFont: "spartan" as const,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/services" });
  const orderedSections = resolveSectionOrder(
    servicesPage.sectionOrder,
    ["hero", "value", "caseStudies", "talent", "partner"] as const,
  );

  const sections = {
    hero: (
      <ServicesHero
        title={servicesPage.heroTitle}
        description={servicesPage.heroDescription}
        backgroundImage={servicesPage.heroBackgroundImage}
        heroCta={designSettings.heroCta}
        stickyHeader={designSettings.stickyHeader}
        menuStyle={designSettings.headerMenuStyle}
        menuTextSize={designSettings.headerMenuTextSize}
        heroTextBackdropOpacity={designSettings.heroTextBackdropOpacity}
        heroTextBackdropBlur={designSettings.heroTextBackdropBlur}
        parallaxIntensity={designSettings.parallaxIntensity}
        heroGradientIntensity={designSettings.heroGradientIntensity}
      />
    ),
    value: (
      <ServicesValue
        heading={servicesPage.valueHeading}
        headingAccent={servicesPage.valueHeadingAccent}
        description={servicesPage.valueDescription}
        introTitle={servicesPage.valueIntroTitle || "STRATEGY\n& POSITIONING"}
        introText={servicesPage.valueIntroText}
        introImage={servicesPage.valueIntroImage || "/assets/v2/services/value-strategy.webp"}
        servicesArrowStyle={designSettings.servicesArrowStyle}
        cards={servicesPage.valueCards?.map((c: { title: string; image: string; description?: string | null }) => ({
          title: c.title,
          image: c.image,
          alt: c.title.replace("\n", " "),
          description: c.description || null,
        })) || []}
      />
    ),
    partner: (
      <ServicesPartner
        description={servicesPage.partnerDescription}
        backgroundImage={servicesPage.partnerBackgroundImage}
      />
    ),
    talent: (
      <ServicesTalent
        heading={servicesPage.talentHeading}
        headingAccent={servicesPage.talentHeadingAccent}
        description={servicesPage.talentDescription}
        introTitle={servicesPage.talentIntroTitle}
        introText={servicesPage.talentIntroText}
        introImage={servicesPage.talentIntroImage}
        servicesArrowStyle={designSettings.servicesArrowStyle}
        cards={servicesPage.talentCards?.map((c: { title: string; image: string; description?: string | null }) => ({
          title: c.title,
          image: c.image,
          alt: c.title,
          description: c.description || null,
        })) || []}
      />
    ),
    caseStudies: (
      <ServicesCaseStudies
        caseStudies={(servicesPage.caseStudies || []).map(
          (c: { title?: string | null; image: string; imageFocalPoint?: string | null; description?: string | null; dimmed?: boolean | null }) => ({
            title: c.title,
            image: c.image,
            imageFocalPoint: c.imageFocalPoint || null,
            description: c.description,
            dimmed: c.dimmed,
          }),
        )}
        sliderSpeed={designSettings.sliderSpeed}
      />
    ),
  } as const;

  return (
    <main id="main" className="bg-primary text-secondary w-full ">
      {orderedSections.map((sectionId) => (
        <div key={sectionId}>{sections[sectionId]}</div>
      ))}
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
