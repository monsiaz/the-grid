import Footer from "@/components/Footer";
import DriversGrid from "@/components/drivers/DriversGrid";
import type { DriverCardData, DriverCountryCode } from "@/components/drivers/driversData";
import DriversHero from "@/components/drivers/DriversHero";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

type DriverRowData = DriverCardData & {
  gridRow: number;
};

const DRIVER_COUNTRY_CODES: readonly DriverCountryCode[] = ["FR", "IN", "GB", "US", "PL"];

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
  const instagramUrl = candidate.instagramUrl;
  const flags = candidate.flags;

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
    flags,
    instagramUrl,
    gridRow,
  };
}

export default async function DriversPage() {
  const payload = await getPayloadClient();
  const driversPage = await payload.findGlobal({ slug: "drivers-page" });
  const siteSettings = await payload.findGlobal({ slug: "site-settings" });
  const drivers = await payload.find({
    collection: "drivers",
    sort: "order",
    limit: 100,
  });

  // Group drivers into grid rows
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

  return (
    <main className="bg-primary text-secondary w-full ">
      <DriversHero
        title={driversPage.heroTitle}
        description={driversPage.heroDescription}
        backgroundImage={driversPage.heroBackgroundImage}
      />
      <DriversGrid gridRows={gridRows} />
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
