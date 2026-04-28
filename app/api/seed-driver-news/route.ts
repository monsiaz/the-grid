import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

export const maxDuration = 60;

/**
 * Seeds the new `detailNewsLinks` relationship on driver documents with real
 * News articles that already exist in the CMS. Idempotent — running it again
 * simply overwrites the relation with the same list.
 *
 * Admin can always override from the BO afterwards.
 */
const DRIVER_NEWS_MAP: Record<string, string[]> = {
  "pierre-gasly": [
    "pierre-gasly-abu-dhabi-special-helmet",
    "special-helmet-design-for-pierre-gasly-in-brazil",
    "alpine-reveals-a526-livery-as-gasly-prepares-for-2026",
  ],
  "isack-hadjar": [
    "isack-hadjar-to-race-for-red-bull-in-2026",
    "isack-hadjar-spotlighted-on-gq-middle-east-hype-cover",
    "isack-hadjar-on-the-cover-of-esses-mag-issue-4",
  ],
};

export async function POST(request: Request) {
  const secret =
    new URL(request.url).searchParams.get("secret") ||
    request.headers.get("x-translate-secret");
  if (
    secret !== process.env.PAYLOAD_SECRET &&
    secret !== process.env.TRANSLATE_SECRET
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayloadClient();
  const report: Record<
    string,
    { driverId: number | string | null; linked: string[]; missing: string[] }
  > = {};

  for (const [driverSlug, newsSlugs] of Object.entries(DRIVER_NEWS_MAP)) {
    const driverResult = await payload.find({
      collection: "drivers",
      where: { slug: { equals: driverSlug } },
      limit: 1,
      depth: 0,
    });

    const driverDoc = driverResult.docs[0] as { id: number | string } | undefined;
    if (!driverDoc) {
      report[driverSlug] = { driverId: null, linked: [], missing: newsSlugs };
      continue;
    }

    const linkedIds: (number | string)[] = [];
    const missing: string[] = [];

    for (const newsSlug of newsSlugs) {
      const newsResult = await payload.find({
        collection: "news",
        where: { slug: { equals: newsSlug } },
        limit: 1,
        depth: 0,
      });
      const newsDoc = newsResult.docs[0] as { id: number | string } | undefined;
      if (newsDoc) {
        linkedIds.push(newsDoc.id);
      } else {
        missing.push(newsSlug);
      }
    }

    await payload.update({
      collection: "drivers",
      id: driverDoc.id,
      data: { detailNewsLinks: linkedIds } as unknown as Record<string, unknown>,
      overrideAccess: true,
    });

    report[driverSlug] = {
      driverId: driverDoc.id,
      linked: newsSlugs.filter((_, i) => !missing.includes(newsSlugs[i])),
      missing,
    };
  }

  return NextResponse.json({ ok: true, report });
}
