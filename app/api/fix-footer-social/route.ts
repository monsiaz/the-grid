import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

export const maxDuration = 30;

/**
 * One-shot endpoint to force-set the footer social URLs on the production
 * site-settings global. Earlier the global had `defaultValue: "#"` which
 * stuck in the DB and produced empty <a href="#"> links in the footer.
 */
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

  const data = {
    instagramUrl: "https://www.instagram.com/thegrid.agency",
    linkedinUrl: "https://www.linkedin.com/company/the-grid-agency/",
  };

  await payload.updateGlobal({
    slug: "site-settings",
    data,
    overrideAccess: true,
  });

  return NextResponse.json({ ok: true, ...data });
}
