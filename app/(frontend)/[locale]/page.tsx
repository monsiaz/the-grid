import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildI18nMetadata, pickSeoOverrides, type SeoGroup } from "@/lib/i18nMetadata";
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
import { homeHeroTitleLayoutToCss } from "@/lib/homeHeroTitleLayout";
import type { HomeHeroTitleLayout } from "@/lib/homeHeroTitleLayout";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/" });
  const payload = await getPayloadClient();
  const homepage = await payload
    .findGlobal({ slug: "homepage", locale })
    .catch(() => null);
  const seo = pickSeoOverrides((homepage as { seo?: SeoGroup } | null)?.seo);
  return buildI18nMetadata({
    locale,
    pathSegment: "/",
    namespace: "home",
    alternatesOverride: alternates.hreflang,
    canonicalOverride: alternates.canonical,
    ...seo,
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
    payload.findGlobal({ slug: "homepage", locale, depth: 1 }),
    payload.findGlobal({ slug: "site-settings", locale }),
    getDesignSettings(),
  ]);

  type HomepageNewsItem = {
    newsSlug: string;
    title: string;
    excerpt: string;
    image: string;
    imageFocalPoint?: string | null;
  };
  type NewsDoc = {
    slug?: string;
    title?: string;
    excerpt?: string;
    listImage?: string;
    listImageFocalPoint?: string | null;
    heroImage?: string;
    heroImageFocalPoint?: string | null;
  };
  const HOME_NEWS_TARGET = 6;

  function mapNewsDocToItem(d: NewsDoc & { slug: string; title: string }): HomepageNewsItem {
    return {
      newsSlug: d.slug,
      title: d.title,
      excerpt: d.excerpt || "",
      image: d.listImage || d.heroImage || "",
      imageFocalPoint: d.listImageFocalPoint || d.heroImageFocalPoint || null,
    };
  }

  async function buildFallbackItems(exclude: Set<string>): Promise<HomepageNewsItem[]> {
    const latest = await payload.find({
      collection: "news",
      sort: "-createdAt",
      limit: HOME_NEWS_TARGET + exclude.size,
      depth: 0,
      pagination: false,
      locale,
    });
    return (latest.docs as NewsDoc[])
      .filter((d): d is NewsDoc & { slug: string; title: string } =>
        Boolean(d.slug && d.title) && !exclude.has(d.slug as string),
      )
      .map(mapNewsDocToItem)
      .filter((d) => d.image)
      .slice(0, HOME_NEWS_TARGET);
  }

  let homepageNewsItems: HomepageNewsItem[];

  const featuredDocs = (homepage.homepageFeaturedNews as NewsDoc[] | null | undefined) || [];
  const featuredItems = featuredDocs
    .filter((d): d is NewsDoc & { slug: string; title: string } =>
      Boolean(d.slug && d.title),
    )
    .map(mapNewsDocToItem)
    .filter((d) => d.image)
    .slice(0, HOME_NEWS_TARGET);

  if (featuredItems.length > 0) {
    if (featuredItems.length < HOME_NEWS_TARGET) {
      const used = new Set(featuredItems.map((i) => i.newsSlug));
      const fallback = await buildFallbackItems(used);
      homepageNewsItems = [...featuredItems, ...fallback].slice(0, HOME_NEWS_TARGET);
    } else {
      homepageNewsItems = featuredItems;
    }
  } else {
    const rawNewsItems: HomepageNewsItem[] = (homepage.homepageNewsItems as HomepageNewsItem[] | undefined) || [];
    const candidateSlugs = Array.from(
      new Set(rawNewsItems.map((i) => i.newsSlug).filter(Boolean)),
    );
    let validSlugs = new Set<string>();
    if (candidateSlugs.length > 0) {
      const existing = await payload.find({
        collection: "news",
        where: { slug: { in: candidateSlugs } },
        limit: candidateSlugs.length,
        depth: 0,
        pagination: false,
        locale,
      });
      validSlugs = new Set(
        (existing.docs as Array<{ slug?: string }>)
          .map((d) => d.slug)
          .filter((s): s is string => Boolean(s)),
      );
    }
    const curatedItems = rawNewsItems.filter((item) => validSlugs.has(item.newsSlug));
    if (curatedItems.length < HOME_NEWS_TARGET) {
      const used = new Set(curatedItems.map((i) => i.newsSlug));
      const fallback = await buildFallbackItems(used);
      homepageNewsItems = [...curatedItems, ...fallback].slice(0, HOME_NEWS_TARGET);
    } else {
      homepageNewsItems = curatedItems.slice(0, HOME_NEWS_TARGET);
    }
  }
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/" });
  const orderedSections = resolveSectionOrder(
    homepage.sectionOrder,
    ["hero", "about", "experience", "services", "news", "drivers"] as const,
  );

  const heroTitleCss = homeHeroTitleLayoutToCss(
    (homepage as { heroTitleLayout?: HomeHeroTitleLayout }).heroTitleLayout,
  );

  const sections = {
    hero: (
      <Hero
        backgroundImage={homepage.heroBackgroundImage}
        backgroundObjectPosition={homepage.heroBackgroundImageFocalPoint || undefined}
        title={renderHeroTitle(homepage.heroTitle)}
        centerContentVertically={false}
        minHeightClassName="min-h-[clamp(440px,78svh,600px)]"
        contentClassName="mb-10 max-w-[min(780px,92vw)] text-left md:mb-14 hero-content-tunable"
        titleClassName="display-hero hero-title-two-lines !flex !flex-col hero-title-tunable"
        contentStyle={heroTitleCss.contentStyle}
        titleStyle={heroTitleCss.titleStyle}
        backdropAt={heroTitleCss.backdropAt}
        skipDefaultContentMobileMargins
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
        backgroundImageFocalPoint={homepage.aboutBackgroundImageFocalPoint || null}
      />
    ),
    experience: <Experience text={homepage.experienceText} />,
    services: (
      <Services
        labels={homepage.serviceLabels?.map((s: { label: string }) => s.label) || []}
        backgroundImage={homepage.servicesBackgroundImage}
        backgroundImageFocalPoint={homepage.servicesBackgroundImageFocalPoint || null}
      />
    ),
    news: <News items={homepageNewsItems} />,
    drivers: (
      <Drivers
        heading={homepage.driversHeading || undefined}
        headingAccent={homepage.driversHeadingAccent || undefined}
        backgroundImage={homepage.driversBackgroundImage}
        backgroundImageFocalPoint={homepage.driversBackgroundImageFocalPoint || null}
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
