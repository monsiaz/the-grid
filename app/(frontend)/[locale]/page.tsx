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
    return (
      <>
        {title.slice(0, matchTo)}
        <br />
        {title.slice(matchTo + 1)}
      </>
    );
  }
  const words = title.trim().split(/\s+/);
  if (words.length >= 4) {
    const mid = Math.ceil(words.length / 2);
    return (
      <>
        {words.slice(0, mid).join(" ")}
        <br />
        {words.slice(mid).join(" ")}
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
  const homepage = await payload.findGlobal({ slug: "homepage", locale });
  const siteSettings = await payload.findGlobal({ slug: "site-settings", locale });
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/" });

  return (
    <main id="main" className="bg-primary text-secondary w-full ">
      <Hero
        backgroundImage={homepage.heroBackgroundImage}
        title={renderHeroTitle(homepage.heroTitle)}
        contentClassName="my-32 max-w-[820px] text-left"
        titleClassName="font-[var(--font-league-spartan)] text-[64px] leading-[1.05] font-bold uppercase drop-shadow-[4px_4px_8px_rgba(0,0,0,0.1)] max-[1200px]:text-[clamp(40px,5.2vw,60px)] whitespace-nowrap max-[600px]:whitespace-normal max-[600px]:text-[clamp(32px,10vw,44px)]"
      />
      <About
        text={homepage.aboutText}
        buttonLabel={homepage.aboutButtonLabel || undefined}
      />
      <Experience text={homepage.experienceText} />
      <Services labels={homepage.serviceLabels?.map((s: { label: string }) => s.label) || []} />
      <News items={homepage.homepageNewsItems || []} />
      <Drivers
        heading={homepage.driversHeading || undefined}
        headingAccent={homepage.driversHeadingAccent || undefined}
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
