import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildI18nMetadata } from "@/lib/i18nMetadata";
import { buildRouteAlternates } from "@/lib/routeAlternates";
import LocaleAlternatesData from "@/components/LocaleAlternatesData";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsCardsRow from "@/components/news/NewsCardsRow";
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

type TagDoc = {
  id: string | number;
  name?: string;
  slug?: string;
  order?: number;
  accent?: boolean;
};

export type NewsCardData = {
  slug: string;
  title: string;
  image: string;
  imageFocalPoint?: string | null;
  excerpt?: string | null;
  tag?: { label: string; accent?: boolean } | null;
  tagSlug?: string | null;
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

  const payload = await getPayloadClient();
  const siteSettings = await payload.findGlobal({ slug: "site-settings", locale });

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const tagsResult: any = await payload
    .find({
      collection: "news-tags",
      limit: 50,
      sort: "order",
      locale,
    })
    .catch(() => ({ docs: [] }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const tagDocs: TagDoc[] = (tagsResult.docs || []) as TagDoc[];

  const tagBySlug = new Map<string, TagDoc>();
  for (const td of tagDocs) {
    if (td.slug) tagBySlug.set(td.slug, td);
  }

  const activeFilter: string | null =
    filter && tagBySlug.has(filter) ? filter : null;

  // fallbackLocale: false prevents Payload from returning content in a different
  // locale when the requested locale has no translation. Without this, an article
  // only entered in NL would surface its NL title on the EN page.
  const news = await payload.find({
    collection: "news",
    sort: "-createdAt",
    limit: 100,
    locale,
    depth: 1,
    fallbackLocale: false,
  } as Parameters<typeof payload.find>[0]);

  const newsCards: NewsCardData[] = [];
  for (const n of news.docs) {
    const raw = n as unknown as {
      slug: string;
      title: string;
      listImage: string;
      listImageFocalPoint?: string | null;
      excerpt?: string | null;
      introParagraphs?: string | null;
      category?: string | null;
      tag?: TagDoc | string | number | null;
    };

    // Drop articles with no title in the requested locale.
    if (!raw.title || !raw.title.trim()) continue;

    const manualExcerpt = raw.excerpt ?? null;
    let excerpt = manualExcerpt ? manualExcerpt.trim() : "";
    const intro = raw.introParagraphs;
    if (!excerpt && typeof intro === "string" && intro.length > 0) {
      const firstLine = intro
        .split("\n")
        .map((s: string) => s.trim())
        .find(Boolean) || "";
      excerpt = firstLine.length > 180 ? `${firstLine.slice(0, 177).trimEnd()}…` : firstLine;
    }

    let resolved: TagDoc | null = null;
    if (raw.tag && typeof raw.tag === "object" && "slug" in raw.tag) {
      resolved = raw.tag as TagDoc;
    } else if (raw.category && tagBySlug.has(raw.category)) {
      resolved = tagBySlug.get(raw.category) || null;
    }

    newsCards.push({
      slug: raw.slug,
      title: raw.title,
      image: raw.listImage,
      imageFocalPoint: raw.listImageFocalPoint ?? null,
      excerpt: excerpt || null,
      tagSlug: resolved?.slug || null,
      tag: resolved
        ? { label: resolved.name || resolved.slug || "", accent: !!resolved.accent }
        : null,
    });
  }

  const filteredCards = activeFilter
    ? newsCards.filter((c) => c.tagSlug === activeFilter)
    : newsCards;

  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/news" });

  const headingTags = tagDocs
    .filter((td) => td.slug && td.name)
    .map((td) => ({ slug: td.slug as string, label: td.name as string }));

  return (
    <main id="main" className="bg-primary text-secondary w-full ">
      <Header activeItem="news" />
      <section className="mx-auto w-full max-w-[1344px] px-[clamp(20px,4vw,48px)] pt-16 pb-20">
        <div className="grid gap-10">
          <NewsHeading activeFilter={activeFilter} tags={headingTags} />
          <NewsCardsRow cards={filteredCards} variant="magazine" />
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
