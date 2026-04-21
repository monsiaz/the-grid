import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildI18nMetadata } from "@/lib/i18nMetadata";
import { buildRouteAlternates } from "@/lib/routeAlternates";
import LocaleAlternatesData from "@/components/LocaleAlternatesData";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsCardsRow from "@/components/news/NewsCardsRow";
import NewsFeaturedGrid from "@/components/news/NewsFeaturedGrid";
import NewsHeading from "@/components/news/NewsHeading";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/news" });
  return buildI18nMetadata({
    locale,
    pathSegment: "/news",
    namespace: "news",
    alternatesOverride: alternates.hreflang,
    canonicalOverride: alternates.canonical,
  });
}

export type NewsCardData = {
  slug: string;
  title: string;
  image: string;
  excerpt?: string | null;
  category: "sporting" | "commercial";
};

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const [{ locale }, { filter }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);

  const activeFilter: "sporting" | "commercial" | null =
    filter === "sporting" || filter === "commercial" ? filter : null;

  const payload = await getPayloadClient();
  const siteSettings = await payload.findGlobal({ slug: "site-settings", locale });
  const news = await payload.find({
    collection: "news",
    sort: "-createdAt",
    limit: 100,
    locale,
  });

  const newsCards: NewsCardData[] = news.docs.map((n) => {
    const manualExcerpt = (n as { excerpt?: string | null }).excerpt ?? null;
    let excerpt = manualExcerpt ? manualExcerpt.trim() : "";
    const intro = (n as { introParagraphs?: string | null }).introParagraphs;
    if (!excerpt && typeof intro === "string" && intro.length > 0) {
      const firstLine = intro
        .split("\n")
        .map((s: string) => s.trim())
        .find(Boolean) || "";
      excerpt = firstLine.length > 180 ? `${firstLine.slice(0, 177).trimEnd()}…` : firstLine;
    }
    return {
      slug: n.slug,
      title: n.title,
      image: n.listImage,
      excerpt: excerpt || null,
      category: n.category as "sporting" | "commercial",
    };
  });

  const filteredCards = activeFilter
    ? newsCards.filter((c) => c.category === activeFilter)
    : newsCards;

  let featuredCards: NewsCardData[];
  let rowCards: NewsCardData[][];

  if (activeFilter) {
    featuredCards = [];
    rowCards = [];
    for (let i = 0; i < filteredCards.length; i += 4) {
      rowCards.push(filteredCards.slice(i, i + 4));
    }
  } else {
    featuredCards = filteredCards.slice(0, 6);
    rowCards = [
      filteredCards.slice(6, 10),
      filteredCards.slice(10, 14),
      filteredCards.slice(14, 18),
      filteredCards.slice(18, 22),
    ];
  }

  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/news" });

  return (
    <main id="main" className="bg-primary text-secondary w-full ">
      <Header activeItem="news" />
      <section className="mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)] pt-20 pb-24">
        <div className="grid gap-16">
          <NewsHeading activeFilter={activeFilter} />
          <div className="grid gap-7">
            <NewsFeaturedGrid cards={featuredCards} />
            {rowCards
              .filter((row) => row.length > 0)
              .map((row, index) => (
                <NewsCardsRow key={index} cards={row} />
              ))}
          </div>
        </div>
      </section>
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
