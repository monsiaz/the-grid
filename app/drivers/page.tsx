import Footer from "@/components/Footer";
import DriversGrid from "@/components/drivers/DriversGrid";
import DriversHero from "@/components/drivers/DriversHero";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

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
  const rowMap = new Map<number, typeof drivers.docs>();
  for (const driver of drivers.docs) {
    const row = driver.gridRow || 1;
    if (!rowMap.has(row)) rowMap.set(row, []);
    rowMap.get(row)!.push(driver);
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
