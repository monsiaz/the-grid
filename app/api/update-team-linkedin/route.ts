import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

const LINKEDIN_MAP: Record<string, string> = {
  "Jérémy Satis": "https://www.linkedin.com/in/j%C3%A9r%C3%A9my-satis-7a386294/",
  "Jeremy Satis": "https://www.linkedin.com/in/j%C3%A9r%C3%A9my-satis-7a386294/",
  "Laura Fredel": "https://www.linkedin.com/in/laura-fredel-35b27a1b8/",
  "Guillaume Le Goff": "https://www.linkedin.com/in/glegoff/",
};

const GUILLAUME = {
  name: "Guillaume Le Goff",
  role: "Founder & Partner",
  image: "/assets/v2/about/guillaume-le-goff.webp",
  linkedinUrl: "https://www.linkedin.com/in/glegoff/",
  bio: "With 20 years of experience in motorsport, Guillaume has worked across multiple roles in the paddock. He served as a simulation & race engineer for ART Grand Prix for six years before co-founding AOTech — a company specialising in simulators, aerodynamics, and composite parts manufacturing — in 2010. After a two-year stint at McLaren in a business development position, Guillaume went on to found Soter Analytics, a tech start-up, and The Grid Agency simultaneously in 2018. Both businesses thrived, and Guillaume chose to focus exclusively on The Grid in 2021.",
  order: 1,
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

  // Ensure Guillaume exists as a team member
  const existing = await payload.find({
    collection: "team-members",
    where: { name: { equals: "Guillaume Le Goff" } },
    limit: 1,
    overrideAccess: true,
  });
  if (existing.docs.length > 0) {
    await payload.update({
      collection: "team-members",
      id: existing.docs[0].id,
      data: GUILLAUME,
      overrideAccess: true,
    });
    results.push(`✅ Guillaume Le Goff updated (id: ${existing.docs[0].id})`);
  } else {
    const created = await payload.create({
      collection: "team-members",
      data: GUILLAUME,
      overrideAccess: true,
    });
    results.push(`✅ Guillaume Le Goff created (id: ${created.id})`);
  }

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
