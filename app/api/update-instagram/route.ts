import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

const INSTAGRAM_MAP: Record<string, string> = {
  "pierre-gasly":       "https://www.instagram.com/pierregasly",
  "isack-hadjar":       "https://www.instagram.com/isackhadjar",
  "frederic-makowiecki":"https://www.instagram.com/fred.makowiecki",
  "kush-maini":         "https://www.instagram.com/kushmainiofficial",
  "alessandro-giusti":  "https://www.instagram.com/giusti_alessandro_",
  "enzo-deligny":       "https://www.instagram.com/forza.enzo",
  "andrea-dupe":        "https://www.instagram.com/andrea_dupe",
  "nathan-tye":         "https://www.instagram.com/nathantyejnr",
  "vivek-kanthan":      "https://www.instagram.com/vivekkanthan",
  "jack-iliffe":        "https://www.instagram.com/jack.iliffe",
  "jack-illiffe":       "https://www.instagram.com/jack.iliffe",
  "alex-truchot":       "https://www.instagram.com/sandrotruchot",
  "fred-makowiecki":    "https://www.instagram.com/fred.makowiecki",
  "louis-cochet":       "https://www.instagram.com/louis_cochet_official",
  "luka-scelles":       "https://www.instagram.com/lukascelles",
  "alessandro-truchot": "https://www.instagram.com/sandrotruchot",
  "stan-ratajski":      "https://www.instagram.com/magicstan01",
};

export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (secret !== process.env.PAYLOAD_SECRET && secret !== process.env.TRANSLATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "drivers", limit: 200, depth: 0 });
  const results: string[] = [];
  for (const driver of docs) {
    const slug = (driver as { slug?: string }).slug;
    if (!slug) continue;
    const instagramUrl = INSTAGRAM_MAP[slug];
    if (!instagramUrl) { results.push(`skip:${slug}`); continue; }
    await payload.update({ collection: "drivers", id: (driver as { id: number }).id, data: { instagramUrl } });
    results.push(`updated:${slug}:${instagramUrl}`);
  }
  return NextResponse.json({ ok: true, results });
}
