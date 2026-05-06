import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { buildI18nMetadata } from "@/lib/i18nMetadata";
import { buildRouteAlternates } from "@/lib/routeAlternates";
import LocaleAlternatesData from "@/components/LocaleAlternatesData";
import Footer from "@/components/Footer";
import DriversGrid from "@/components/drivers/DriversGrid";
import type { DriverCardData, DriverCountryCode } from "@/components/drivers/driversData";
import DriversHero from "@/components/drivers/DriversHero";
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
  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/drivers" });
  return buildI18nMetadata({
    locale,
    pathSegment: "/drivers",
    namespace: "drivers",
    alternatesOverride: alternates.hreflang,
    canonicalOverride: alternates.canonical,
  });
}

type DriverRowData = DriverCardData & {
  gridRow: number;
};

const DRIVER_COUNTRY_CODES: readonly DriverCountryCode[] = ["FR", "IN", "GB", "US", "PL", "CN", "ES"];

function isDriverCountryCode(value: string): value is DriverCountryCode {
  return DRIVER_COUNTRY_CODES.includes(value as DriverCountryCode);
}

function normalizeDriver(doc: unknown): DriverRowData | null {
  if (!doc || typeof doc !== "object") return null;

  const candidate = doc as Record<string, unknown>;
  const slug = candidate.slug;
  const name = candidate.name;
  const role = candidate.role;
  const image = candidate.image;
  const imageFocalPoint =
    typeof candidate.imageFocalPoint === "string" && candidate.imageFocalPoint.trim()
      ? candidate.imageFocalPoint
      : null;
  const instagramUrl = candidate.instagramUrl;
  const flags = candidate.flags;
  const teamLogo =
    typeof candidate.teamLogo === "string" && candidate.teamLogo.trim()
      ? candidate.teamLogo
      : null;

  const teamLogos = Array.isArray(candidate.teamLogos)
    ? (candidate.teamLogos as unknown[])
        .filter(
          (entry): entry is { logo: string } =>
            !!entry &&
            typeof entry === "object" &&
            typeof (entry as Record<string, unknown>).logo === "string" &&
            Boolean((entry as Record<string, unknown>).logo),
        )
    : null;

  if (
    typeof slug !== "string" ||
    typeof name !== "string" ||
    typeof role !== "string" ||
    typeof image !== "string" ||
    typeof instagramUrl !== "string" ||
    !Array.isArray(flags) ||
    flags.some((flag) => typeof flag !== "string" || !isDriverCountryCode(flag))
  ) {
    return null;
  }

  const gridRow =
    typeof candidate.gridRow === "number" &&
    Number.isFinite(candidate.gridRow) &&
    candidate.gridRow > 0
      ? Math.floor(candidate.gridRow)
      : 1;

  return {
    slug,
    name,
    role,
    image,
    imageFocalPoint,
    flags,
    instagramUrl,
    teamLogo,
    teamLogos: teamLogos && teamLogos.length > 0 ? teamLogos : null,
    gridRow,
  };
}

export default async function DriversPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const payload = await getPayloadClient();
  const [driversPage, siteSettings, designSettings] = await Promise.all([
    payload.findGlobal({ slug: "drivers-page", locale }),
    payload.findGlobal({ slug: "site-settings", locale }),
    getDesignSettings(),
  ]);
  const drivers = await payload.find({
    collection: "drivers",
    sort: "order",
    limit: 100,
    locale,
  });

  const rowMap = new Map<number, DriverCardData[]>();
  for (const driver of drivers.docs) {
    const normalizedDriver = normalizeDriver(driver);
    if (!normalizedDriver) continue;

    const { gridRow: row, ...driverData } = normalizedDriver;
    if (!rowMap.has(row)) rowMap.set(row, []);
    rowMap.get(row)!.push(driverData);
  }
  const gridRows = Array.from(rowMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, docs]) => docs);

  const alternates = buildRouteAlternates({ currentLocale: locale, pathSegment: "/drivers" });
  const orderedSections = resolveSectionOrder(
    driversPage.sectionOrder,
    ["hero", "grid"] as const,
  );

  const sections = {
    hero: (
      <DriversHero
        title={driversPage.heroTitle}
        description={driversPage.heroDescription}
        backgroundImage={driversPage.heroBackgroundImage}
        backgroundImageFocalPoint={driversPage.heroBackgroundImageFocalPoint || null}
        heroCta={designSettings.heroCta}
        stickyHeader={designSettings.stickyHeader}
        menuStyle={designSettings.headerMenuStyle}
        menuTextSize={designSettings.headerMenuTextSize}
        heroTextBackdropOpacity={designSettings.heroTextBackdropOpacity}
        heroTextBackdropBlur={designSettings.heroTextBackdropBlur}
      />
    ),
    grid: <DriversGrid gridRows={gridRows} />,
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
