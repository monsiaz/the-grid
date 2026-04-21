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

  const result = await payload.find({
    collection: "drivers",
    where: { slug: { equals: name } },
    limit: 1,
    locale,
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
  };

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
  };

  return (
    <>
      <LocaleAlternatesData alternates={alternates} />
      <DriverDetailPage driver={driver} detail={detail} />
    </>
  );
}
