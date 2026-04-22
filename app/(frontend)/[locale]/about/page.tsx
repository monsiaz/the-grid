import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildI18nMetadata } from "@/lib/i18nMetadata";
import { buildRouteAlternates } from "@/lib/routeAlternates";
import LocaleAlternatesData from "@/components/LocaleAlternatesData";
import Footer from "@/components/Footer";
import AboutAccelereBanner from "@/components/about/AboutAccelereBanner";
import AboutAccelereFollow from "@/components/about/AboutAccelereFollow";
import AboutCoreTeam from "@/components/about/AboutCoreTeam";
import AboutHero from "@/components/about/AboutHero";
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
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/about" });
  return buildI18nMetadata({
    locale,
    pathSegment: "/about",
    namespace: "about",
    alternatesOverride: alternates.hreflang,
    canonicalOverride: alternates.canonical,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const payload = await getPayloadClient();
  const [aboutPage, siteSettings, designSettings] = await Promise.all([
    payload.findGlobal({ slug: "about-page", locale }),
    payload.findGlobal({ slug: "site-settings", locale }),
    getDesignSettings(),
  ]);
  const teamMembers = await payload.find({ collection: "team-members", sort: "order", locale });
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/about" });
  const aboutInstagramUrl =
    typeof aboutPage.instagramUrl === "string" &&
    aboutPage.instagramUrl.trim() &&
    aboutPage.instagramUrl.trim() !== "https://instagram.com"
      ? aboutPage.instagramUrl.trim()
      : siteSettings.instagramUrl;
  const orderedSections = resolveSectionOrder(
    aboutPage.sectionOrder,
    ["hero", "coreTeam", "accelereBanner", "accelereFollow"] as const,
  );

  const sections = {
    hero: (
      <AboutHero
        title={aboutPage.heroTitle}
        description={aboutPage.heroDescription}
        backgroundImage={aboutPage.heroBackgroundImage}
        heroCta={designSettings.heroCta}
        stickyHeader={designSettings.stickyHeader}
        menuStyle={designSettings.headerMenuStyle}
        menuTextSize={designSettings.headerMenuTextSize}
        heroTextBackdropOpacity={designSettings.heroTextBackdropOpacity}
        heroTextBackdropBlur={designSettings.heroTextBackdropBlur}
      />
    ),
    coreTeam: (
      <AboutCoreTeam
        coreIntroText={aboutPage.coreIntroText}
        coreAreas={aboutPage.coreAreas || []}
        founderBio={aboutPage.founderBio}
        founderName={aboutPage.founderName || "Guillaume Le Goff"}
        founderRole={aboutPage.founderRole || "Founder & Partner"}
        founderImage="/assets/v2/about/guillaume-le-goff.webp"
        founderLinkedinUrl={
          aboutPage.founderLinkedinUrl || "https://www.linkedin.com/in/glegoff/"
        }
        teamMembers={teamMembers.docs.map((m) => ({
          name: m.name,
          role: m.role,
          image: m.image,
          bio: (m as { bio?: string | null }).bio ?? null,
          linkedinUrl: (m as { linkedinUrl?: string | null }).linkedinUrl ?? null,
        }))}
      />
    ),
    accelereBanner: <AboutAccelereBanner bannerImage={aboutPage.accelereBannerImage} />,
    accelereFollow: (
      <AboutAccelereFollow
        description={aboutPage.accelereDescription}
        quote={aboutPage.accelereQuote}
        quoteAuthor={aboutPage.accelereQuoteAuthor}
        quoteRole={aboutPage.accelereQuoteRole}
        quoteTitle={aboutPage.accelereQuoteTitle}
        instagramHandle={aboutPage.instagramHandle}
        instagramUrl={aboutInstagramUrl}
        instagramImages={aboutPage.instagramImages?.map((i: { image: string }) => i.image) || []}
        portraitImage={aboutPage.accelerePortraitImage}
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
