import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import NewsDetailPage from "@/components/news/detail/NewsDetailPage";
import LocaleAlternatesData from "@/components/LocaleAlternatesData";
import { buildI18nMetadata } from "@/lib/i18nMetadata";
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

  const title = news?.title || undefined;
  let description: string | undefined;
  const manualExcerpt = (news as { excerpt?: string | null } | undefined)?.excerpt ?? null;
  if (manualExcerpt && manualExcerpt.trim()) {
    description = manualExcerpt.trim();
  } else if (news?.introParagraphs) {
    const first = news.introParagraphs.split("\n").map((s: string) => s.trim()).find(Boolean) || "";
    description = first.length > 180 ? `${first.slice(0, 177).trimEnd()}…` : first;
  }
  const ogImage = news?.heroImage || news?.listImage || undefined;
  return buildI18nMetadata({
    locale,
    pathSegment: `/news/${slug}`,
    namespace: "news",
    titleOverride: title,
    descriptionOverride: description,
    keywordsExtra: [title].filter(
      (keyword): keyword is string => typeof keyword === "string" && keyword.length > 0,
    ),
    ogImage,
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
    date: newsDoc.date || "",
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
