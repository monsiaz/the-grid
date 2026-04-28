import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildI18nMetadata } from "@/lib/i18nMetadata";
import { buildRouteAlternates } from "@/lib/routeAlternates";
import LocaleAlternatesData from "@/components/LocaleAlternatesData";
import Footer from "@/components/Footer";
import About from "@/components/About";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Services from "@/components/Services";
import News from "@/components/News";
import Drivers from "@/components/Drivers";
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
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/" });
  return buildI18nMetadata({
    locale,
    pathSegment: "/",
    namespace: "home",
    alternatesOverride: alternates.hreflang,
    canonicalOverride: alternates.canonical,
  });
}

function renderHeroTitle(title: string): React.ReactNode {
  if (!title) return title;
  const matchTo = title.toLowerCase().indexOf(" to ");
  if (matchTo > 0) {
    const line1 = title.slice(0, matchTo).trimEnd();
    const line2 = title.slice(matchTo + 1).trimStart();
    return (
      <>
        <span className="hero-title-line block">{line1}</span>
        <span className="hero-title-line block">{line2}</span>
      </>
    );
  }
  const words = title.trim().split(/\s+/);
  if (words.length >= 4) {
    const mid = Math.ceil(words.length / 2);
    return (
      <>
        <span className="hero-title-line block">{words.slice(0, mid).join(" ")}</span>
        <span className="hero-title-line block">{words.slice(mid).join(" ")}</span>
      </>
    );
  }
  return title;
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const payload = await getPayloadClient();
  const [homepage, siteSettings, designSettings] = await Promise.all([
    payload.findGlobal({ slug: "homepage", locale }),
    payload.findGlobal({ slug: "site-settings", locale }),
    getDesignSettings(),
  ]);
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/" });
  const orderedSections = resolveSectionOrder(
    homepage.sectionOrder,
    ["hero", "about", "experience", "services", "news", "drivers"] as const,
  );

  const sections = {
    hero: (
      <Hero
        backgroundImage={homepage.heroBackgroundImage}
        title={renderHeroTitle(homepage.heroTitle)}
        contentClassName="my-32 max-w-[820px] text-left"
        titleClassName="display-hero hero-title-two-lines !text-[clamp(38px,6vw,84px)] max-[600px]:!text-[clamp(30px,9vw,42px)]"
        stickyHeader={designSettings.stickyHeader}
        menuStyle={designSettings.headerMenuStyle}
        menuTextSize={designSettings.headerMenuTextSize}
        backdropOpacity={designSettings.heroTextBackdropOpacity}
        backdropBlur={designSettings.heroTextBackdropBlur}
        parallaxIntensity={designSettings.parallaxIntensity}
        heroGradientIntensity={designSettings.heroGradientIntensity}
      />
    ),
    about: (
      <About
        text={homepage.aboutText}
        buttonLabel={homepage.aboutButtonLabel || undefined}
        backgroundImage={homepage.aboutBackgroundImage}
      />
    ),
    experience: <Experience text={homepage.experienceText} />,
    services: (
      <Services
        labels={homepage.serviceLabels?.map((s: { label: string }) => s.label) || []}
        backgroundImage={homepage.servicesBackgroundImage}
      />
    ),
    news: <News items={homepage.homepageNewsItems || []} />,
    drivers: (
      <Drivers
        heading={homepage.driversHeading || undefined}
        headingAccent={homepage.driversHeadingAccent || undefined}
        backgroundImage={homepage.driversBackgroundImage}
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
