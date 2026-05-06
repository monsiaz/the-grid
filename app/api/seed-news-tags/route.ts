import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

export const maxDuration = 60;

/**
 * Belt-and-suspenders schema migration using Payload's own pg pool.
 * Payload's `push: true` normally creates new tables/columns on cold start,
 * but on Vercel serverless we've seen it race during build → runtime. We
 * reuse the adapter's pool to ALTER TABLE ... IF NOT EXISTS so this
 * endpoint can also self-heal.
 */
async function ensureSchema(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
): Promise<{ ran: string[]; errors: string[] }> {
  const ran: string[] = [];
  const errors: string[] = [];
  const pool = payload?.db?.pool;
  if (!pool || typeof pool.query !== "function") {
    errors.push("payload.db.pool unavailable — skipping schema self-heal");
    return { ran, errors };
  }
  const statements = [
    `CREATE TABLE IF NOT EXISTS "news_tags" (
       "id" serial PRIMARY KEY,
       "slug" varchar NOT NULL UNIQUE,
       "order" numeric NOT NULL DEFAULT 10,
       "accent" boolean DEFAULT false,
       "updated_at" timestamptz DEFAULT now(),
       "created_at" timestamptz DEFAULT now()
     );`,
    `CREATE TABLE IF NOT EXISTS "news_tags_locales" (
       "id" serial PRIMARY KEY,
       "_locale" varchar NOT NULL,
       "_parent_id" integer NOT NULL REFERENCES "news_tags"("id") ON DELETE CASCADE,
       "name" varchar
     );`,
    `ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "tag_id" integer;`,
    /**
     * Payload keeps polymorphic relationship join tables for locked docs &
     * user preferences; adding a new collection means we also have to expose
     * a <collection>_id column in each _rels table the admin uses.
     */
    `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "news_tags_id" integer;`,
    `ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "news_tags_id" integer;`,
  ];
  for (const s of statements) {
    try {
      await pool.query(s);
      ran.push(s.split("\n")[0].slice(0, 80));
    } catch (e) {
      errors.push(`${s.slice(0, 60)}: ${(e as Error).message}`);
    }
  }
  return { ran, errors };
}

type TagSeed = {
  slug: string;
  order: number;
  accent: boolean;
  names: Record<string, string>;
};

const TAGS: TagSeed[] = [
  {
    slug: "sporting",
    order: 1,
    accent: false,
    names: {
      en: "Sporting",
      fr: "Sportif",
      es: "Deportivo",
      de: "Sport",
      it: "Sportivo",
      nl: "Sportief",
      zh: "体育",
    },
  },
  {
    slug: "features",
    order: 2,
    accent: false,
    names: {
      en: "Features",
      fr: "Parutions",
      es: "Apariciones",
      de: "Erscheinungen",
      it: "Apparizioni",
      nl: "Verschijningen",
      zh: "刊登",
    },
  },
  {
    slug: "commercial",
    order: 3,
    accent: true,
    names: {
      en: "Commercial",
      fr: "Commercial",
      es: "Comercial",
      de: "Kommerziell",
      it: "Commerciale",
      nl: "Commercieel",
      zh: "商业",
    },
  },
];

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

  /** 0. Ensure schema (news_tags table + news.tag_id column) exists. */
  const schema = await ensureSchema(payload);
  const report: {
    schema: { ran: string[]; errors: string[] };
    tags: Array<{ slug: string; id: string | number; action: string }>;
    backfilled: Array<{ slug: string; tag: string }>;
    skipped: Array<{ slug: string; reason: string }>;
  } = { schema, tags: [], backfilled: [], skipped: [] };

  /** 1. Upsert each tag (EN base record) and ensure localized names. */
  const slugToId = new Map<string, string | number>();

  for (const t of TAGS) {
    const existing = await payload.find({
      collection: "news-tags",
      where: { slug: { equals: t.slug } },
      limit: 1,
      locale: "en",
      overrideAccess: true,
    });

    let id: string | number;
    if (existing.docs.length > 0) {
      id = existing.docs[0].id;
      await payload.update({
        collection: "news-tags",
        id,
        locale: "en",
        data: { name: t.names.en, slug: t.slug, order: t.order, accent: t.accent },
        overrideAccess: true,
      });
      report.tags.push({ slug: t.slug, id, action: "updated" });
    } else {
      const created = await payload.create({
        collection: "news-tags",
        locale: "en",
        data: { name: t.names.en, slug: t.slug, order: t.order, accent: t.accent },
        overrideAccess: true,
      });
      id = created.id;
      report.tags.push({ slug: t.slug, id, action: "created" });
    }

    slugToId.set(t.slug, id);

    // Write localised names for every locale in one pass.
    for (const locale of Object.keys(t.names)) {
      if (locale === "en") continue;
      await payload.update({
        collection: "news-tags",
        id,
        locale: locale as "fr" | "es" | "de" | "it" | "nl" | "zh",
        data: { name: t.names[locale] },
        overrideAccess: true,
      });
    }
  }

  /** 2. Backfill existing news records: set tag from legacy category. */
  const news = await payload.find({
    collection: "news",
    limit: 500,
    locale: "en",
    overrideAccess: true,
    depth: 0,
  });

  for (const n of news.docs) {
    const doc = n as unknown as {
      id: string | number;
      slug?: string;
      category?: string | null;
      tag?: string | number | { id: string | number } | null;
    };

    // Skip if tag already set
    const currentTagId =
      typeof doc.tag === "object" && doc.tag ? doc.tag.id : doc.tag || null;
    if (currentTagId) {
      report.skipped.push({ slug: doc.slug || String(doc.id), reason: "already-tagged" });
      continue;
    }

    const targetSlug =
      doc.category === "commercial" || doc.category === "sporting"
        ? doc.category
        : "sporting"; // sensible default
    const targetId = slugToId.get(targetSlug);
    if (!targetId) {
      report.skipped.push({ slug: doc.slug || String(doc.id), reason: "tag-missing" });
      continue;
    }

    await payload.update({
      collection: "news",
      id: doc.id,
      data: { tag: targetId } as unknown as Record<string, unknown>,
      overrideAccess: true,
    });
    report.backfilled.push({ slug: doc.slug || String(doc.id), tag: targetSlug });
  }

  return NextResponse.json({ ok: true, ...report });
}
