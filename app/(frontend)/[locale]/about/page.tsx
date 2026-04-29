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
  const founderName = (aboutPage.founderName as string | undefined) || "Guillaume Le Goff";
  // Prefer the bio stored in the team-member record (editable per-locale in the admin)
  // so editors don't have to maintain two separate bio fields.
  const founderTeamMember = (teamMembers.docs as Array<{ name?: string | null; bio?: string | null }>)
    .find((m) => typeof m.name === "string" && m.name.trim().toLowerCase() === founderName.trim().toLowerCase());
  const resolvedFounderBio = founderTeamMember?.bio ?? (aboutPage.founderBio as string | null | undefined);
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
        backgroundImageFocalPoint={aboutPage.heroBackgroundImageFocalPoint || null}
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
        founderBio={resolvedFounderBio}
        founderName={founderName}
        founderRole={aboutPage.founderRole || "Founder & Partner"}
        founderImage="/assets/v2/about/guillaume-le-goff.webp"
        founderLinkedinUrl={
          aboutPage.founderLinkedinUrl || "https://www.linkedin.com/in/glegoff/"
        }
        teamMembers={teamMembers.docs.map((m) => ({
          name: m.name,
          role: m.role,
          image: m.image,
          imageFocalPoint: (m as { imageFocalPoint?: string | null }).imageFocalPoint ?? null,
          bio: (m as { bio?: string | null }).bio ?? null,
          linkedinUrl: (m as { linkedinUrl?: string | null }).linkedinUrl ?? null,
        }))}
      />
    ),
    accelereBanner: (
      <AboutAccelereBanner
        bannerImage={aboutPage.accelereBannerImage}
        bannerImageFocalPoint={aboutPage.accelereBannerImageFocalPoint || null}
      />
    ),
    accelereFollow: (
      <AboutAccelereFollow
        description={aboutPage.accelereDescription}
        quote={aboutPage.accelereQuote}
        quoteAuthor={aboutPage.accelereQuoteAuthor}
        quoteRole={aboutPage.accelereQuoteRole}
        quoteTitle={aboutPage.accelereQuoteTitle}
        instagramHandle={aboutPage.instagramHandle}
        instagramUrl={aboutInstagramUrl}
        instagramImages={aboutPage.instagramImages?.map((i: { image: string; imageFocalPoint?: string | null }) => ({
          image: i.image,
          imageFocalPoint: i.imageFocalPoint ?? null,
        })) || []}
        portraitImage={aboutPage.accelerePortraitImage}
        portraitImageFocalPoint={aboutPage.accelerePortraitImageFocalPoint || null}
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
