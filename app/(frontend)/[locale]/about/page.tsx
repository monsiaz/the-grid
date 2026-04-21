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
  const aboutPage = await payload.findGlobal({ slug: "about-page", locale });
  const siteSettings = await payload.findGlobal({ slug: "site-settings", locale });
  const teamMembers = await payload.find({ collection: "team-members", sort: "order", locale });
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/about" });

  return (
    <main id="main" className="bg-primary text-secondary w-full ">
      <AboutHero
        title={aboutPage.heroTitle}
        description={aboutPage.heroDescription}
        backgroundImage={aboutPage.heroBackgroundImage}
      />
      <AboutCoreTeam
        coreIntroText={aboutPage.coreIntroText}
        coreAreas={aboutPage.coreAreas || []}
        founderBio={aboutPage.founderBio}
        founderName={aboutPage.founderName || "Guillaume Le Goff"}
        founderRole={aboutPage.founderRole || "Founder"}
        founderLinkedinUrl={
          aboutPage.founderLinkedinUrl || "https://www.linkedin.com/in/glegoff/"
        }
        teamMembers={teamMembers.docs.map((m) => ({
          name: m.name,
          role: m.role,
          image: m.image,
          linkedinUrl: (m as { linkedinUrl?: string | null }).linkedinUrl ?? null,
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
