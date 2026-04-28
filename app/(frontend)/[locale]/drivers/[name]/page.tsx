import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import DriverDetailPage from "@/components/drivers/detail/DriverDetailPage";
import LocaleAlternatesData from "@/components/LocaleAlternatesData";
import { buildI18nMetadata } from "@/lib/i18nMetadata";
import { buildRouteAlternates } from "@/lib/routeAlternates";
import { detectTranslatedLocales } from "@/lib/docTranslations";
import { getPayloadClient } from "@/lib/payload";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";

export const revalidate = 60;

type DriverDetailRouteProps = {
  params: Promise<{ name: string; locale: Locale }>;
};

const DRIVER_PROBE_FIELDS = [
  "name",
  "role",
  "detail.profileParagraphs",
  "detail.careerParagraphs",
  "detail.agencyParagraphs",
  "detail.profileTitle",
];

export async function generateMetadata({ params }: DriverDetailRouteProps): Promise<Metadata> {
  const { name, locale } = await params;
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "drivers",
    where: { slug: { equals: name } },
    limit: 1,
    locale,
  });
  const driver = result.docs[0];
  if (!driver) {
    return buildI18nMetadata({
      locale,
      pathSegment: `/drivers/${name}`,
      namespace: "drivers",
    });
  }

  const { translatedLocales } = await detectTranslatedLocales({
    payload,
    collection: "drivers",
    docId: driver.id,
    probeFields: DRIVER_PROBE_FIELDS,
  });

  const alternates = buildRouteAlternates({
    currentLocale: locale,
    pathSegment: `/drivers/${name}`,
    translatedLocales,
    fallbackListPath: "/drivers",
  });

  const title = driver?.name ? `${driver.name}` : undefined;
  const description = driver?.role || undefined;
  const ogImage = driver?.image || undefined;
  return buildI18nMetadata({
    locale,
    pathSegment: `/drivers/${name}`,
    namespace: "drivers",
    titleOverride: title,
    descriptionOverride: description,
    ogImage,
    alternatesOverride: alternates.hreflang,
    canonicalOverride: alternates.canonical,
  });
}

export default async function DriverDetailRoutePage({ params }: DriverDetailRouteProps) {
  const { name, locale } = await params;
  setRequestLocale(locale);
  const payload = await getPayloadClient();
  const siteSettings = await payload.findGlobal({ slug: "site-settings", locale });

  const result = await payload.find({
    collection: "drivers",
    where: { slug: { equals: name } },
    limit: 1,
    locale,
    // Populate `detailNewsLinks` → news docs so we can build /news/<slug>/ links.
    depth: 2,
  });

  if (result.docs.length === 0) {
    notFound();
  }

  const driverDoc = result.docs[0];

  const { translatedLocales } = await detectTranslatedLocales({
    payload,
    collection: "drivers",
    docId: driverDoc.id,
    probeFields: DRIVER_PROBE_FIELDS,
  });

  const alternates = buildRouteAlternates({
    currentLocale: locale,
    pathSegment: `/drivers/${name}`,
    translatedLocales,
    fallbackListPath: "/drivers",
  });

  const driver = {
    slug: driverDoc.slug,
    name: driverDoc.name,
    role: driverDoc.role,
    image: driverDoc.image,
    flags: driverDoc.flags as ("FR" | "IN" | "GB" | "US" | "PL")[],
    instagramUrl: driverDoc.instagramUrl,
    teamLogo:
      typeof (driverDoc as { teamLogo?: unknown }).teamLogo === "string" &&
      ((driverDoc as { teamLogo?: string }).teamLogo?.trim() ?? "")
        ? (driverDoc as { teamLogo?: string }).teamLogo ?? null
        : null,
  };

  /**
   * Latest news for the driver.
   *
   * Preferred source: `detailNewsLinks` (relationship → news). Each linked
   * article becomes a clickable card that goes to /news/<slug>/ with the
   * article's own title and list image.
   *
   * Fallback: the legacy `detailNews` array (hand-entered {title, image}
   * pairs). Rendered non-clickable so old data keeps working until admins
   * migrate every driver over to the relationship field.
   */
  type LinkedNews = {
    slug?: string | null;
    title: string;
    image: string;
  };

  const linkedRaw = Array.isArray(driverDoc.detailNewsLinks)
    ? (driverDoc.detailNewsLinks as unknown[])
    : [];

  const linkedNews: LinkedNews[] = linkedRaw
    .map((item): LinkedNews | null => {
      if (!item || typeof item !== "object") return null;
      const doc = item as {
        slug?: unknown;
        title?: unknown;
        listImage?: unknown;
      };
      const slug = typeof doc.slug === "string" ? doc.slug.trim() : "";
      const title = typeof doc.title === "string" ? doc.title.trim() : "";
      const image =
        typeof doc.listImage === "string" ? doc.listImage.trim() : "";
      if (!slug || !title || !image) return null;
      return { slug, title, image };
    })
    .filter((n): n is LinkedNews => n !== null);

  const legacyNews: LinkedNews[] = Array.isArray(driverDoc.detailNews)
    ? (driverDoc.detailNews as { title?: string; image?: string | null }[])
        .map((item): LinkedNews | null => {
          if (!item) return null;
          const title = typeof item.title === "string" ? item.title.trim() : "";
          const image = typeof item.image === "string" ? item.image.trim() : "";
          if (!title || !image) return null;
          return { slug: null, title, image };
        })
        .filter((n): n is LinkedNews => n !== null)
    : [];

  const curatedNews = linkedNews.length > 0 ? linkedNews : legacyNews;

  const fallbackNewsDocs =
    curatedNews.length >= 3
      ? []
      : (
          await payload.find({
            collection: "news",
            sort: "-createdAt",
            limit: 6,
            locale,
            depth: 0,
          })
        ).docs;

  const fallbackNews: LinkedNews[] = fallbackNewsDocs
    .map((item): LinkedNews | null => {
      if (!item || typeof item !== "object") return null;
      const doc = item as {
        slug?: unknown;
        title?: unknown;
        listImage?: unknown;
      };
      const slug = typeof doc.slug === "string" ? doc.slug.trim() : "";
      const title = typeof doc.title === "string" ? doc.title.trim() : "";
      const image = typeof doc.listImage === "string" ? doc.listImage.trim() : "";
      if (!slug || !title || !image) return null;
      return { slug, title, image };
    })
    .filter((n): n is LinkedNews => n !== null);

  const relatedNews: LinkedNews[] = [];
  const seenNewsKeys = new Set<string>();

  for (const item of [...curatedNews, ...fallbackNews]) {
    const key = item.slug?.trim() || item.title.trim().toLowerCase();
    if (!key || seenNewsKeys.has(key)) continue;
    seenNewsKeys.add(key);
    relatedNews.push(item);
    if (relatedNews.length === 3) break;
  }

  const detail = {
    slug: driverDoc.slug,
    profileTitle: driverDoc.detail?.profileTitle || "Career Overview and Driver Profile",
    profileParagraphs: driverDoc.detail?.profileParagraphs?.split("\n") || [],
    careerTitle: driverDoc.detail?.careerTitle || `${driverDoc.name}'s Career Snapshot`,
    careerParagraphs: driverDoc.detail?.careerParagraphs?.split("\n") || [],
    transitionTitle: driverDoc.detail?.transitionTitle || "Career Development",
    transitionParagraph: driverDoc.detail?.transitionParagraph || "",
    agencyTitle: driverDoc.detail?.agencyTitle || `${driverDoc.name} and The Grid Agency`,
    agencyParagraphs: driverDoc.detail?.agencyParagraphs?.split("\n") || [],
    highestFinish: driverDoc.detail?.highestFinish || "--",
    careerPoints: driverDoc.detail?.careerPoints || "--",
    grandPrixEntered: driverDoc.detail?.grandPrixEntered || "--",
    careerPodiums: driverDoc.detail?.careerPodiums || "--",
    profileImage: driverDoc.detail?.profileImage || null,
    careerImage: driverDoc.detail?.careerImage || null,
    agencyImage: driverDoc.detail?.agencyImage || null,
    galleryLeft: driverDoc.detail?.galleryLeft || null,
    galleryCenter: driverDoc.detail?.galleryCenter || null,
    galleryRight: driverDoc.detail?.galleryRight || null,
    relatedNews,
    statsCards: Array.isArray(driverDoc.detail?.statsCards)
      ? (driverDoc.detail.statsCards as unknown[])
          .map((item: unknown) => {
            const stat = item as { value?: unknown; label?: unknown } | null;
            const value = typeof stat?.value === "string" ? stat.value.trim() : "";
            const label = typeof stat?.label === "string" ? stat.label.trim() : "";
            if (!value || !label) return null;
            return { value, label };
          })
          .filter((item): item is { value: string; label: string } => item !== null)
      : [],
  };

  return (
    <>
      <LocaleAlternatesData alternates={alternates} />
      <DriverDetailPage
        driver={driver}
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
