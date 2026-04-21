import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

export const maxDuration = 60;

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

  // Check if Guillaume already exists as team member
  const existing = await payload.find({
    collection: "team-members",
    where: { name: { equals: "Guillaume Le Goff" } },
    limit: 1,
    overrideAccess: true,
  });

  const founderData = {
    name: "Guillaume Le Goff",
    role: "Founder & Partner",
    image: "/assets/v2/about/guillaume-le-goff.webp",
    linkedinUrl: "https://www.linkedin.com/in/glegoff/",
    bio: "With 20 years of experience in motorsport, Guillaume has worked across multiple roles in the paddock. He served as a simulation & race engineer for ART Grand Prix for six years before co-founding AOTech — a company specialising in simulators, aerodynamics, and composite parts manufacturing — in 2010. After a two-year stint at McLaren in a business development position, Guillaume went on to found Soter Analytics, a tech start-up, and The Grid Agency simultaneously in 2018. Both businesses thrived, and Guillaume chose to focus exclusively on The Grid in 2021.",
    order: 1,
  };

  let result;
  if (existing.docs.length > 0) {
    result = await payload.update({
      collection: "team-members",
      id: existing.docs[0].id,
      data: founderData,
      overrideAccess: true,
    });
    return NextResponse.json({ ok: true, action: "updated", id: result.id });
  } else {
    result = await payload.create({
      collection: "team-members",
      data: founderData,
      overrideAccess: true,
    });
    return NextResponse.json({ ok: true, action: "created", id: result.id });
  }
}
