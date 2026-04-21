import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

export const maxDuration = 60;

/**
 * One-shot endpoint that adds the columns for the new Talent "Performance"
 * flip-card fields when Payload's dev-only `push` didn't run them in prod.
 *
 * Idempotent — uses `IF NOT EXISTS`. Safe to call multiple times.
 * Delete this file after the schema is stable.
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  if (
    secret !== process.env.PAYLOAD_SECRET &&
    secret !== process.env.TRANSLATE_SECRET
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayloadClient();
  // Payload/Drizzle exposes the underlying node-postgres pool at payload.db.pool
  // and the drizzle instance at payload.db.drizzle.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const db = (payload as any).db;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const pool = db?.pool;
  if (!pool) {
    return NextResponse.json({ error: "No DB pool available" }, { status: 500 });
  }

  const statements = [
    // Non-localized column on the base table
    `ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "talent_intro_image" varchar;`,
    // Localized columns on the _locales table
    `ALTER TABLE "services_page_locales" ADD COLUMN IF NOT EXISTS "talent_intro_title" varchar;`,
    `ALTER TABLE "services_page_locales" ADD COLUMN IF NOT EXISTS "talent_intro_text" text;`,
  ];

  const results: { sql: string; ok: boolean; error?: string }[] = [];
  for (const sql of statements) {
    try {
      await pool.query(sql);
      results.push({ sql, ok: true });
    } catch (err) {
      results.push({ sql, ok: false, error: (err as Error).message });
    }
  }

  return NextResponse.json({ ok: results.every((r) => r.ok), results });
}
