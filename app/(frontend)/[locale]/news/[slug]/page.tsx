import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import NewsDetailPage from "@/components/news/detail/NewsDetailPage";
import LocaleAlternatesData from "@/components/LocaleAlternatesData";
import { buildI18nMetadata, pickSeoOverrides, type SeoGroup } from "@/lib/i18nMetadata";
import { buildRouteAlternates } from "@/lib/routeAlternates";
import { detectTranslatedLocales } from "@/lib/docTranslations";
import { getPayloadClient } from "@/lib/payload";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";

export const revalidate = 60;

type NewsDetailRouteProps = {
  params: Promise<{ slug: string; locale: Locale }>;
};

const NEWS_PROBE_FIELDS = ["title", "introParagraphs", "bodyParagraphs", "excerpt"];

function formatNewsDate(iso: string | null, locale: Locale): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // Locale-aware: e.g. "FEB 17, 2026" (en) / "17 FÉVR. 2026" (fr).
  return d
    .toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export async function generateMetadata({ params }: NewsDetailRouteProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "news",
    where: { slug: { equals: slug } },
    limit: 1,
    locale,
  });
  const news = result.docs[0];
  if (!news) {
    return buildI18nMetadata({
      locale,
      pathSegment: `/news/${slug}`,
      namespace: "news",
    });
  }

  const { translatedLocales } = await detectTranslatedLocales({
    payload,
    collection: "news",
    docId: news.id,
    probeFields: NEWS_PROBE_FIELDS,
  });

  const alternates = buildRouteAlternates({
    currentLocale: locale,
    pathSegment: `/news/${slug}`,
    translatedLocales,
    fallbackListPath: "/news",
  });

  const seoOverrides = pickSeoOverrides((news as { seo?: SeoGroup } | undefined)?.seo);

  const fallbackTitle = news?.title || undefined;
  let fallbackDescription: string | undefined;
  const manualExcerpt = (news as { excerpt?: string | null } | undefined)?.excerpt ?? null;
  if (manualExcerpt && manualExcerpt.trim()) {
    fallbackDescription = manualExcerpt.trim();
  } else if (news?.introParagraphs) {
    const first = news.introParagraphs.split("\n").map((s: string) => s.trim()).find(Boolean) || "";
    fallbackDescription = first.length > 180 ? `${first.slice(0, 177).trimEnd()}…` : first;
  }
  const fallbackOgImage = news?.heroImage || news?.listImage || undefined;
  return buildI18nMetadata({
    locale,
    pathSegment: `/news/${slug}`,
    namespace: "news",
    titleOverride: seoOverrides.titleOverride ?? fallbackTitle,
    descriptionOverride: seoOverrides.descriptionOverride ?? fallbackDescription,
    keywordsExtra: [
      ...(seoOverrides.keywordsExtra ?? []),
      ...[fallbackTitle].filter(
        (keyword): keyword is string => typeof keyword === "string" && keyword.length > 0,
      ),
    ],
    ogImage: seoOverrides.ogImage ?? fallbackOgImage,
    alternatesOverride: alternates.hreflang,
    canonicalOverride: alternates.canonical,
  });
}

export default async function NewsDetailRoute({ params }: NewsDetailRouteProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const payload = await getPayloadClient();
  const siteSettings = await payload.findGlobal({ slug: "site-settings", locale });

  const result = await payload.find({
    collection: "news",
    where: { slug: { equals: slug } },
    limit: 1,
    locale,
  });

  if (result.docs.length === 0) {
    notFound();
  }

  const newsDoc = result.docs[0];

  const { translatedLocales } = await detectTranslatedLocales({
    payload,
    collection: "news",
    docId: newsDoc.id,
    probeFields: NEWS_PROBE_FIELDS,
  });

  const alternates = buildRouteAlternates({
    currentLocale: locale,
    pathSegment: `/news/${slug}`,
    translatedLocales,
    fallbackListPath: "/news",
  });

  const contentBlocks = Array.isArray(newsDoc.content)
    ? (newsDoc.content as Array<Record<string, unknown>>)
        .filter((block) => typeof block?.blockType === "string")
        .map((block) => block as unknown)
    : [];

  const detail = {
    slug: newsDoc.slug,
    title: newsDoc.title,
    date: formatNewsDate(
      (newsDoc as { displayDate?: string | null }).displayDate ??
        (newsDoc as { publishedAt?: string | null }).publishedAt ??
        null,
      locale,
    ),
    heroImage: newsDoc.heroImage || newsDoc.listImage,
    heroImageFocalPoint: newsDoc.heroImageFocalPoint || newsDoc.listImageFocalPoint || null,
    heroImageCredit: (newsDoc as { heroImageCredit?: string | null }).heroImageCredit || null,
    introParagraphs: newsDoc.introParagraphs?.split("\n") || [],
    bodyParagraphs: newsDoc.bodyParagraphs?.split("\n") || [],
    galleryImages: newsDoc.galleryImages?.map((g: { image: string; imageFocalPoint?: string | null; credit?: string | null }) => ({
      image: g.image,
      imageFocalPoint: g.imageFocalPoint ?? null,
      credit: g.credit ?? null,
    })) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contentBlocks: contentBlocks as any,
  };

  return (
    <>
      <LocaleAlternatesData alternates={alternates} />
      <NewsDetailPage
        detail={detail}
        siteProps={{
          instagramUrl: siteSettings.instagramUrl,
          linkedinUrl: siteSettings.linkedinUrl,
          copyright: siteSettings.footerCopyright,
          privacyPolicyUrl: siteSettings.privacyPolicyUrl,
        }}
      />
    </>
  );
}
