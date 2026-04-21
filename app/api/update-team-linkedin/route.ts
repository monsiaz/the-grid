import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

const LINKEDIN_MAP: Record<string, string> = {
  "Jérémy Satis": "https://www.linkedin.com/in/j%C3%A9r%C3%A9my-satis-7a386294/",
  "Jeremy Satis": "https://www.linkedin.com/in/j%C3%A9r%C3%A9my-satis-7a386294/",
  "Laura Fredel": "https://www.linkedin.com/in/laura-fredel-35b27a1b8/",
  "Guillaume Le Goff": "https://www.linkedin.com/in/glegoff/",
};

const SITE_INSTAGRAM = "https://www.instagram.com/thegrid.agency";
const SITE_LINKEDIN = "https://www.linkedin.com/company/the-grid-agency/";

export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (secret !== process.env.PAYLOAD_SECRET && secret !== process.env.TRANSLATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayloadClient();
  const results: string[] = [];

  // Update team member LinkedIn URLs
  const members = await payload.find({
    collection: "team-members",
    limit: 20,
    depth: 0,
    overrideAccess: true,
  });

  for (const member of members.docs) {
    const linkedinUrl = LINKEDIN_MAP[member.name as string];
    if (linkedinUrl) {
      await payload.update({
        collection: "team-members",
        id: member.id,
        data: { linkedinUrl },
        overrideAccess: true,
      });
      results.push(`✅ ${member.name} → ${linkedinUrl}`);
    }
  }

  // Update site settings Instagram + LinkedIn URLs
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      instagramUrl: SITE_INSTAGRAM,
      linkedinUrl: SITE_LINKEDIN,
    },
    overrideAccess: true,
  });
  results.push(`✅ site-settings → instagram + linkedin updated`);

  return NextResponse.json({ ok: true, results });
}
