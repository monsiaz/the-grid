#!/usr/bin/env node
/**
 * Idempotent schema self-heal that runs BEFORE `next build`.
 *
 * Context:
 *   Payload is configured with `push: true`, which normally auto-migrates the
 *   Postgres schema to match collection definitions. On Vercel's serverless
 *   build environment, this auto-push has proven flaky — it can skip creating
 *   join tables for newly-added relationship fields, which then causes every
 *   static page that queries those collections to fail at build time with
 *   `relation "…_rels" does not exist`.
 *
 * Mitigation:
 *   Before `next build` runs (and therefore before any SSG render queries the
 *   DB), we connect directly with `pg` and ensure the relationship tables and
 *   columns exist. All statements are `IF NOT EXISTS`, so this is safe to run
 *   on fresh schemas, already-migrated schemas, and everything in between.
 *
 * Add new statements here whenever you add a new `relationship` field to an
 * existing collection — it's the belt-and-suspenders layer for Payload push.
 */

import pg from "pg";

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.warn(
    "[ensure-schema] DATABASE_URL not set — skipping schema self-heal (local build without DB env)",
  );
  process.exit(0);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl:
    DATABASE_URL.includes("localhost") || DATABASE_URL.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
});

const STATEMENTS = [
  // ────────────────── News tags (2026-04 migration) ──────────────────
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
  `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "news_tags_id" integer;`,
  `ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "news_tags_id" integer;`,

  // ────────────────── Driver → News relationship (detailNewsLinks) ──────
  // Payload represents hasMany relationship fields through a polymorphic
  // `<collection>_rels` table. Creating it with `news_id` covers the current
  // `detailNewsLinks → news` field; future relations on `drivers` can be
  // supported by adding more `<target>_id` columns via ALTER below.
  `CREATE TABLE IF NOT EXISTS "drivers_rels" (
     "id" serial PRIMARY KEY,
     "order" integer,
     "parent_id" integer NOT NULL REFERENCES "drivers"("id") ON DELETE CASCADE,
     "path" varchar NOT NULL,
     "news_id" integer
   );`,
  `ALTER TABLE "drivers_rels" ADD COLUMN IF NOT EXISTS "news_id" integer;`,
  `CREATE INDEX IF NOT EXISTS "drivers_rels_parent_idx" ON "drivers_rels" ("parent_id");`,
  `CREATE INDEX IF NOT EXISTS "drivers_rels_path_idx" ON "drivers_rels" ("path");`,
  `CREATE INDEX IF NOT EXISTS "drivers_rels_news_id_idx" ON "drivers_rels" ("news_id");`,

  // ────────────────── News content blocks (2026-04 migration) ───────────
  // Each block type in `blocks/newsBlocks.ts` creates a pair of Postgres
  // tables: one holding the block instance (with positioning columns
  // `_order`, `_path`, `_parent_id`, `block_name`) plus any non-localized
  // fields, and — when the block has localized fields — a `*_locales`
  // table keyed by `_locale + _parent_id`.
  //
  // Array subfields (gallery.images, stats.items) create their own
  // `*_<arrayName>` tables, with their own `_locales` counterpart for
  // localized subfields (alt, label).

  // lead
  `CREATE TABLE IF NOT EXISTS "news_blocks_lead" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY,
     "block_name" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_lead_locales" (
     "text" varchar,
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_lead"("id") ON DELETE CASCADE
   );`,

  // paragraph
  `CREATE TABLE IF NOT EXISTS "news_blocks_paragraph" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY,
     "block_name" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_paragraph_locales" (
     "text" varchar,
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_paragraph"("id") ON DELETE CASCADE
   );`,

  // heading
  `CREATE TABLE IF NOT EXISTS "news_blocks_heading" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY,
     "size" varchar DEFAULT 'h2',
     "block_name" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_heading_locales" (
     "text" varchar,
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_heading"("id") ON DELETE CASCADE
   );`,

  // image
  `CREATE TABLE IF NOT EXISTS "news_blocks_image" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY,
     "image" varchar,
     "ratio" varchar DEFAULT '16:9',
     "rounded" boolean DEFAULT true,
     "block_name" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_image_locales" (
     "caption" varchar,
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_image"("id") ON DELETE CASCADE
   );`,

  // twoColumn → Payload's Drizzle adapter snake_cases the table name.
  `CREATE TABLE IF NOT EXISTS "news_blocks_two_column" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY,
     "layout" varchar DEFAULT 'text-image',
     "image" varchar,
     "block_name" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_two_column_locales" (
     "text" varchar,
     "caption" varchar,
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_two_column"("id") ON DELETE CASCADE
   );`,

  // gallery
  `CREATE TABLE IF NOT EXISTS "news_blocks_gallery" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY,
     "columns" varchar DEFAULT '3',
     "block_name" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_gallery_images" (
     "_order" integer NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_gallery"("id") ON DELETE CASCADE,
     "id" varchar PRIMARY KEY,
     "image" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_gallery_images_locales" (
     "alt" varchar,
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_gallery_images"("id") ON DELETE CASCADE
   );`,

  // stats
  `CREATE TABLE IF NOT EXISTS "news_blocks_stats" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY,
     "columns" varchar DEFAULT '4',
     "block_name" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_stats_locales" (
     "heading" varchar,
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_stats"("id") ON DELETE CASCADE
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_stats_items" (
     "_order" integer NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_stats"("id") ON DELETE CASCADE,
     "id" varchar PRIMARY KEY,
     "value" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_stats_items_locales" (
     "label" varchar,
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_stats_items"("id") ON DELETE CASCADE
   );`,

  // quote
  `CREATE TABLE IF NOT EXISTS "news_blocks_quote" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY,
     "block_name" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_quote_locales" (
     "text" varchar,
     "author" varchar,
     "role" varchar,
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_quote"("id") ON DELETE CASCADE
   );`,

  // video
  `CREATE TABLE IF NOT EXISTS "news_blocks_video" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY,
     "url" varchar,
     "block_name" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_video_locales" (
     "caption" varchar,
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_video"("id") ON DELETE CASCADE
   );`,

  // divider
  `CREATE TABLE IF NOT EXISTS "news_blocks_divider" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY,
     "style" varchar DEFAULT 'line',
     "block_name" varchar
   );`,

  // cta
  `CREATE TABLE IF NOT EXISTS "news_blocks_cta" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY,
     "href" varchar,
     "style" varchar DEFAULT 'primary',
     "block_name" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "news_blocks_cta_locales" (
     "label" varchar,
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_blocks_cta"("id") ON DELETE CASCADE
   );`,

  // Indexes for Payload's lookup patterns on block tables (parent-lookup + order).
  `CREATE INDEX IF NOT EXISTS "news_blocks_lead_parent_idx" ON "news_blocks_lead" ("_parent_id");`,
  `CREATE INDEX IF NOT EXISTS "news_blocks_paragraph_parent_idx" ON "news_blocks_paragraph" ("_parent_id");`,
  `CREATE INDEX IF NOT EXISTS "news_blocks_heading_parent_idx" ON "news_blocks_heading" ("_parent_id");`,
  `CREATE INDEX IF NOT EXISTS "news_blocks_image_parent_idx" ON "news_blocks_image" ("_parent_id");`,
  `CREATE INDEX IF NOT EXISTS "news_blocks_two_column_parent_idx" ON "news_blocks_two_column" ("_parent_id");`,
  `CREATE INDEX IF NOT EXISTS "news_blocks_gallery_parent_idx" ON "news_blocks_gallery" ("_parent_id");`,
  `CREATE INDEX IF NOT EXISTS "news_blocks_stats_parent_idx" ON "news_blocks_stats" ("_parent_id");`,
  `CREATE INDEX IF NOT EXISTS "news_blocks_quote_parent_idx" ON "news_blocks_quote" ("_parent_id");`,
  `CREATE INDEX IF NOT EXISTS "news_blocks_video_parent_idx" ON "news_blocks_video" ("_parent_id");`,
  `CREATE INDEX IF NOT EXISTS "news_blocks_divider_parent_idx" ON "news_blocks_divider" ("_parent_id");`,
  `CREATE INDEX IF NOT EXISTS "news_blocks_cta_parent_idx" ON "news_blocks_cta" ("_parent_id");`,

  // ────────────────── Drivers detail stats cards (2026-04 migration) ──────────────────
  //
  // New generic 2×2 highlight cards for driver detail pages. Stored as a nested
  // localized array under `drivers.detail.statsCards`, which Payload persists as:
  //
  //   - drivers_detail_stats_cards          (value + order + parent_id)
  //   - drivers_detail_stats_cards_locales  (label per locale)
  //
  // If these tables are missing when the collection is queried, driver detail
  // pages can fail during build / ISR. Create them defensively here.
  `CREATE TABLE IF NOT EXISTS "drivers_detail_stats_cards" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "drivers"("id") ON DELETE CASCADE,
     "id" varchar PRIMARY KEY,
     "value" varchar
   );`,
  `CREATE TABLE IF NOT EXISTS "drivers_detail_stats_cards_locales" (
     "label" varchar,
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "drivers_detail_stats_cards"("id") ON DELETE CASCADE
   );`,
  `CREATE INDEX IF NOT EXISTS "drivers_detail_stats_cards_parent_idx" ON "drivers_detail_stats_cards" ("_parent_id");`,

  // ────────────────── Landing section order arrays (2026-04 migration) ───────────────
  //
  // Drag-and-drop order in Payload for landing-page sections. Each global gets
  // a simple array of `{ sectionId }` rows, persisted as `<global>_section_order`.
  `CREATE TABLE IF NOT EXISTS "homepage_section_order" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "homepage"("id") ON DELETE CASCADE,
     "id" varchar PRIMARY KEY,
     "section_id" varchar
   );`,
  `CREATE INDEX IF NOT EXISTS "homepage_section_order_parent_idx" ON "homepage_section_order" ("_parent_id");`,
  `CREATE TABLE IF NOT EXISTS "about_page_section_order" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "about_page"("id") ON DELETE CASCADE,
     "id" varchar PRIMARY KEY,
     "section_id" varchar
   );`,
  `CREATE INDEX IF NOT EXISTS "about_page_section_order_parent_idx" ON "about_page_section_order" ("_parent_id");`,
  `CREATE TABLE IF NOT EXISTS "services_page_section_order" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "services_page"("id") ON DELETE CASCADE,
     "id" varchar PRIMARY KEY,
     "section_id" varchar
   );`,
  `CREATE INDEX IF NOT EXISTS "services_page_section_order_parent_idx" ON "services_page_section_order" ("_parent_id");`,
  `CREATE TABLE IF NOT EXISTS "drivers_page_section_order" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "drivers_page"("id") ON DELETE CASCADE,
     "id" varchar PRIMARY KEY,
     "section_id" varchar
   );`,
  `CREATE INDEX IF NOT EXISTS "drivers_page_section_order_parent_idx" ON "drivers_page_section_order" ("_parent_id");`,
  `CREATE TABLE IF NOT EXISTS "contact_page_section_order" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "contact_page"("id") ON DELETE CASCADE,
     "id" varchar PRIMARY KEY,
     "section_id" varchar
   );`,
  `CREATE INDEX IF NOT EXISTS "contact_page_section_order_parent_idx" ON "contact_page_section_order" ("_parent_id");`,

  // ────────────────── Services page: value-section intro flip card ──────────────────
  //
  // 2026-04: the first card of the "WHERE PERFORMANCE CREATES VALUE" grid is
  // being upgraded from a plain text intro to a proper image flip card (same
  // shape as the Talent section). Two new fields are added to the global:
  //
  //   - valueIntroTitle  (localized text)   → services_page_locales.value_intro_title
  //   - valueIntroImage  (non-localized)    → services_page.value_intro_image
  //
  // If these columns don't exist when Payload runs `findGlobal`, every SELECT
  // against the services_page global throws "column does not exist", the
  // page-level `.catch(() => ({}))` fallback kicks in, and the Services page
  // renders with i18n fallbacks only (no heading accent "CREATES", no
  // description, no valueCards). Create the columns defensively here.
  `ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "value_intro_image" varchar;`,
  `ALTER TABLE "services_page_locales" ADD COLUMN IF NOT EXISTS "value_intro_title" varchar;`,
];

/** Neon/serverless Postgres often returns transient errors during Vercel build (cold compute, OOM, connection limits). */
const RETRIABLE_SQL =
  /connect|compute|timeout|ECONNREFUSED|ETIMEDOUT|ECONNRESET|EPIPE|XX000|too many connections|out of memory|couldn'?t connect|server closed the connection/i;

const MAX_ATTEMPTS = 4;

async function queryStatement(sql) {
  let lastErr;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      await pool.query(sql);
      return { ok: true };
    } catch (err) {
      lastErr = err;
      const msg = err?.message || String(err);
      if (attempt < MAX_ATTEMPTS - 1 && RETRIABLE_SQL.test(msg)) {
        const waitMs = 1500 * (attempt + 1);
        console.warn(`[ensure-schema] transient (${attempt + 1}/${MAX_ATTEMPTS}), retry in ${waitMs}ms: ${msg.slice(0, 120)}`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      return { ok: false, err: msg };
    }
  }
  return { ok: false, err: lastErr?.message || String(lastErr) };
}

async function main() {
  const ran = [];
  const errors = [];
  for (const s of STATEMENTS) {
    const { ok, err } = await queryStatement(s);
    if (ok) {
      ran.push(s.split("\n")[0].slice(0, 80));
    } else {
      errors.push(`${s.split("\n")[0].slice(0, 80)} — ${err}`);
    }
  }

  console.log(`[ensure-schema] ran ${ran.length} statements`);
  if (errors.length) {
    console.warn(`[ensure-schema] ${errors.length} soft errors:`);
    for (const e of errors) console.warn(`  · ${e}`);
  }
  await pool.end();
}

main().catch((err) => {
  console.error("[ensure-schema] FATAL", err);
  process.exit(1);
});
