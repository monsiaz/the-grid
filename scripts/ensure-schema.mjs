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

  // ────────────────── Homepage: heroTitleLayout group (2026-04 migration) ───────────
  //
  // The heroTitleLayout group adds fine-grained CMS controls for the hero title's
  // position (clamp margins), size (desktop + mobile), letter-spacing, line-height,
  // and backdrop gradient position. All fields are non-localized numbers stored as
  // columns on the `homepage` table.
  //
  // IMPORTANT: these columns must exist before `push: false` is enforced.
  // Previously, `push: true` would try to add them at every serverless cold-start,
  // causing AccessExclusiveLock contention between parallel Vercel function instances
  // → deadlock → HTTP 500 on ALL Payload API calls (not just homepage). Pre-creating
  // them here (idempotent ALTER TABLE IF NOT EXISTS) fixes the root cause.
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_margin_top_min_px" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_margin_top_mid_vh" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_margin_top_max_px" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_backdrop_x_percent" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_backdrop_y_percent" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_line_height" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_line_gap_em" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_tracking_em" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_font_size_min_px" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_font_size_mid_vw" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_font_size_max_px" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_margin_top_mobile_min_px" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_margin_top_mobile_mid_vh" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_margin_top_mobile_max_px" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_font_size_mobile_min_px" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_font_size_mobile_mid_vw" numeric;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_title_layout_font_size_mobile_max_px" numeric;`,

  // ────────────────── Services page: case study focal point (2026-04 migration) ────
  //
  // New `imageFocalPoint` text field on the `caseStudies` array. Payload stores
  // array items for the `services-page` global in `services_page_case_studies`.
  // We must pre-create the column here so Payload's `push: true` sync finds nothing
  // to ALTER at cold-start (prevents lock contention and HTTP 500 on admin).
  `ALTER TABLE "services_page_case_studies" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,

  // ────────────────── Image focal point controls (2026-04 migration) ───────────────
  //
  // Admin-wide focal point text fields added next to editable image fields. Payload
  // includes these columns in SELECTs as soon as the fields exist in config, so the
  // columns must be present before serverless functions query globals/collections.
  `ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "list_image_focal_point" varchar;`,
  `ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "hero_image_focal_point" varchar;`,
  `ALTER TABLE "news_gallery_images" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,
  `ALTER TABLE "news_blocks_image" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,
  `ALTER TABLE "news_blocks_two_column" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,
  `ALTER TABLE "news_blocks_gallery_images" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,

  `ALTER TABLE "drivers" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,
  `ALTER TABLE "drivers" ADD COLUMN IF NOT EXISTS "detail_profile_image_focal_point" varchar;`,
  `ALTER TABLE "drivers" ADD COLUMN IF NOT EXISTS "detail_career_image_focal_point" varchar;`,
  `ALTER TABLE "drivers" ADD COLUMN IF NOT EXISTS "detail_agency_image_focal_point" varchar;`,
  `ALTER TABLE "drivers" ADD COLUMN IF NOT EXISTS "detail_gallery_left_focal_point" varchar;`,
  `ALTER TABLE "drivers" ADD COLUMN IF NOT EXISTS "detail_gallery_center_focal_point" varchar;`,
  `ALTER TABLE "drivers" ADD COLUMN IF NOT EXISTS "detail_gallery_right_focal_point" varchar;`,
  `ALTER TABLE "drivers_detail_news" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,

  `ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,

  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "hero_background_image_focal_point" varchar;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "about_background_image_focal_point" varchar;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "services_background_image_focal_point" varchar;`,
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "drivers_background_image_focal_point" varchar;`,
  `ALTER TABLE "homepage_homepage_news_items" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,

  `ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "hero_background_image_focal_point" varchar;`,
  `ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "accelere_banner_image_focal_point" varchar;`,
  `ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "accelere_portrait_image_focal_point" varchar;`,
  `UPDATE "about_page"
   SET "accelere_banner_image" = '/assets/v2/about/accelere.webp'
   WHERE "accelere_banner_image" IS NULL OR trim("accelere_banner_image") = '';`,
  `ALTER TABLE "about_page_core_areas" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,
  `ALTER TABLE "about_page_instagram_images" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,

  // Founder content now lives only in the Team Members collection. Keep the
  // About global schema clean so the BO no longer exposes or stores duplicate
  // founder fields.
  `ALTER TABLE "about_page" DROP COLUMN IF EXISTS "founder_name";`,
  `ALTER TABLE "about_page" DROP COLUMN IF EXISTS "founder_linkedin_url";`,
  `ALTER TABLE "about_page_locales" DROP COLUMN IF EXISTS "founder_bio";`,
  `ALTER TABLE "about_page_locales" DROP COLUMN IF EXISTS "founder_role";`,

  `ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "hero_background_image_focal_point" varchar;`,
  `ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "value_intro_image_focal_point" varchar;`,
  `ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "partner_background_image_focal_point" varchar;`,
  `ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "talent_intro_image_focal_point" varchar;`,
  `ALTER TABLE "services_page_value_cards" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,
  `ALTER TABLE "services_page_talent_cards" ADD COLUMN IF NOT EXISTS "image_focal_point" varchar;`,

  `ALTER TABLE "drivers_page" ADD COLUMN IF NOT EXISTS "hero_background_image_focal_point" varchar;`,
  `ALTER TABLE "contact_page" ADD COLUMN IF NOT EXISTS "hero_background_image_focal_point" varchar;`,

  // ────────────────── Drivers: teamLogo field (2026-04 migration) ─────────────────────
  //
  // New `teamLogo` text field added via `logoField()` helper in Drivers collection.
  // Stores the public URL of the team logo (SVG or PNG).
  `ALTER TABLE "drivers" ADD COLUMN IF NOT EXISTS "team_logo" varchar;`,

  // ────────────────── news.category nullable (2026-04 fix) ──────────────────────────
  //
  // The `category` column was created as NOT NULL (from original Payload push) but the
  // field is `required: false` in the collection definition. Creating a new article
  // without selecting a category sends NULL → violates the NOT NULL constraint → 500.
  // Drop the NOT NULL so optional selects can be left empty.
  `ALTER TABLE "news" ALTER COLUMN "category" DROP NOT NULL;`,

  // ────────────────── Drivers flags enum: add CN + ES (2026-05 migration) ────────────
  //
  // Postgres enum `enum_drivers_flags` was created with FR/IN/GB/US/PL. The Drivers
  // collection now also accepts CN and ES — without ALTER TYPE the INSERTs fail.
  `ALTER TYPE "enum_drivers_flags" ADD VALUE IF NOT EXISTS 'CN';`,
  `ALTER TYPE "enum_drivers_flags" ADD VALUE IF NOT EXISTS 'ES';`,

  // ────────────────── Photo credit fields (2026-05 migration) ─────────────────────────
  //
  // Localized `credit` text added to Media + News heroImage + legacy galleryImages
  // + every image-bearing news content block. Required so figcaption "©Photographer"
  // can render under each image without breaking SQL queries.
  //
  // `media_locales` and `news_gallery_images_locales` did not exist before this
  // migration (Media.alt and gallery.image were both non-localized). Create them.
  `CREATE TABLE IF NOT EXISTS "media_locales" (
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "media"("id") ON DELETE CASCADE,
     "credit" varchar
   );`,
  `CREATE INDEX IF NOT EXISTS "media_locales_parent_idx" ON "media_locales" ("_parent_id");`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "media_locales_locale_parent_idx" ON "media_locales" ("_locale", "_parent_id");`,
  `ALTER TABLE "media_locales" ADD COLUMN IF NOT EXISTS "credit" varchar;`,

  `CREATE TABLE IF NOT EXISTS "news_gallery_images_locales" (
     "id" serial PRIMARY KEY,
     "_locale" varchar NOT NULL,
     "_parent_id" varchar NOT NULL REFERENCES "news_gallery_images"("id") ON DELETE CASCADE,
     "credit" varchar
   );`,
  `CREATE INDEX IF NOT EXISTS "news_gallery_images_locales_parent_idx" ON "news_gallery_images_locales" ("_parent_id");`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "news_gallery_images_locales_locale_parent_idx" ON "news_gallery_images_locales" ("_locale", "_parent_id");`,
  `ALTER TABLE "news_gallery_images_locales" ADD COLUMN IF NOT EXISTS "credit" varchar;`,

  `ALTER TABLE "news_locales" ADD COLUMN IF NOT EXISTS "hero_image_credit" varchar;`,
  `ALTER TABLE "news_blocks_image_locales" ADD COLUMN IF NOT EXISTS "credit" varchar;`,
  `ALTER TABLE "news_blocks_two_column_locales" ADD COLUMN IF NOT EXISTS "credit" varchar;`,
  `ALTER TABLE "news_blocks_gallery_images_locales" ADD COLUMN IF NOT EXISTS "credit" varchar;`,

  // ────────────────── Drivers: teamLogos array (2026-05 migration) ──────────────────
  //
  // Migration teamLogo (single text) → teamLogos (array of {logo: text}, max 3).
  // Legacy `team_logo` column is kept; new array stored in dedicated child table.
  `CREATE TABLE IF NOT EXISTS "drivers_team_logos" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "drivers"("id") ON DELETE CASCADE,
     "id" varchar PRIMARY KEY,
     "logo" varchar
   );`,
  `CREATE INDEX IF NOT EXISTS "drivers_team_logos_parent_idx" ON "drivers_team_logos" ("_parent_id");`,

  // ────────────────── Drivers: detail.galleryImages array (2026-05 migration) ───────
  //
  // Migration of detail.galleryLeft/Center/Right (3 fixed text fields) →
  // detail.galleryImages (array of {image, focalPoint}, max 12). Lives inside
  // the `detail` group so the table is `drivers_detail_gallery_images`.
  `CREATE TABLE IF NOT EXISTS "drivers_detail_gallery_images" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL REFERENCES "drivers"("id") ON DELETE CASCADE,
     "id" varchar PRIMARY KEY,
     "image" varchar,
     "focal_point" varchar
   );`,
  `CREATE INDEX IF NOT EXISTS "drivers_detail_gallery_images_parent_idx" ON "drivers_detail_gallery_images" ("_parent_id");`,

  // ────────────────── Homepage: featured news relationship (2026-05 migration) ──────
  //
  // New `homepageFeaturedNews` (relationship hasMany news, max 6). Payload stores
  // hasMany relationships in a polymorphic `<global>_rels` table.
  `CREATE TABLE IF NOT EXISTS "homepage_rels" (
     "id" serial PRIMARY KEY,
     "order" integer,
     "parent_id" integer NOT NULL REFERENCES "homepage"("id") ON DELETE CASCADE,
     "path" varchar NOT NULL,
     "news_id" integer
   );`,
  `CREATE INDEX IF NOT EXISTS "homepage_rels_parent_idx" ON "homepage_rels" ("parent_id");`,
  `CREATE INDEX IF NOT EXISTS "homepage_rels_news_idx" ON "homepage_rels" ("news_id");`,

  // ────────────────── SEO group: editable title + meta per page (2026-05) ──────────
  //
  // `fields/seoField.ts` adds a localized `seo` group (metaTitle, metaDescription,
  // keywords + non-localized ogImage) to every page-global plus News + Drivers.
  // Localized text fields land in `<table>_locales` as `seo_meta_title` /
  // `seo_meta_description` / `seo_keywords`. The ogImage is a plain text URL
  // stored on the parent table as `seo_og_image`.
  //
  // Without these columns the admin still renders, but every save attempt against
  // a page-global throws "column does not exist" until Payload's push catches up
  // — defensive pre-creation here keeps prod admin alive.

  // Globals — non-localized ogImage column on parent table
  `ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "seo_og_image" varchar;`,
  `ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "seo_og_image" varchar;`,
  `ALTER TABLE "services_page" ADD COLUMN IF NOT EXISTS "seo_og_image" varchar;`,
  `ALTER TABLE "contact_page" ADD COLUMN IF NOT EXISTS "seo_og_image" varchar;`,
  `ALTER TABLE "drivers_page" ADD COLUMN IF NOT EXISTS "seo_og_image" varchar;`,
  `ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "seo_og_image" varchar;`,
  `ALTER TABLE "drivers" ADD COLUMN IF NOT EXISTS "seo_og_image" varchar;`,

  // Globals — localized metaTitle/metaDescription/keywords in <table>_locales
  `ALTER TABLE "homepage_locales" ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar;`,
  `ALTER TABLE "homepage_locales" ADD COLUMN IF NOT EXISTS "seo_meta_description" varchar;`,
  `ALTER TABLE "homepage_locales" ADD COLUMN IF NOT EXISTS "seo_keywords" varchar;`,

  `ALTER TABLE "about_page_locales" ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar;`,
  `ALTER TABLE "about_page_locales" ADD COLUMN IF NOT EXISTS "seo_meta_description" varchar;`,
  `ALTER TABLE "about_page_locales" ADD COLUMN IF NOT EXISTS "seo_keywords" varchar;`,

  `ALTER TABLE "services_page_locales" ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar;`,
  `ALTER TABLE "services_page_locales" ADD COLUMN IF NOT EXISTS "seo_meta_description" varchar;`,
  `ALTER TABLE "services_page_locales" ADD COLUMN IF NOT EXISTS "seo_keywords" varchar;`,

  `ALTER TABLE "contact_page_locales" ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar;`,
  `ALTER TABLE "contact_page_locales" ADD COLUMN IF NOT EXISTS "seo_meta_description" varchar;`,
  `ALTER TABLE "contact_page_locales" ADD COLUMN IF NOT EXISTS "seo_keywords" varchar;`,

  `ALTER TABLE "drivers_page_locales" ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar;`,
  `ALTER TABLE "drivers_page_locales" ADD COLUMN IF NOT EXISTS "seo_meta_description" varchar;`,
  `ALTER TABLE "drivers_page_locales" ADD COLUMN IF NOT EXISTS "seo_keywords" varchar;`,

  `ALTER TABLE "news_locales" ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar;`,
  `ALTER TABLE "news_locales" ADD COLUMN IF NOT EXISTS "seo_meta_description" varchar;`,
  `ALTER TABLE "news_locales" ADD COLUMN IF NOT EXISTS "seo_keywords" varchar;`,

  `ALTER TABLE "drivers_locales" ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar;`,
  `ALTER TABLE "drivers_locales" ADD COLUMN IF NOT EXISTS "seo_meta_description" varchar;`,
  `ALTER TABLE "drivers_locales" ADD COLUMN IF NOT EXISTS "seo_keywords" varchar;`,

  // ────────────────── News: publishedAt + lockedLocales (2026-05 migration) ─────────
  //
  // `publishedAt` (real timestamp, replaces the legacy localized text `date` for sorting
  // and admin date-picker UX). The legacy `date` column stays — it remains an optional
  // display-format override per locale.
  //
  // `lockedLocales` (Payload select hasMany, non-localized) lets editors mark a locale
  // as "do not auto-retranslate". Stored in a child table per Payload conventions.
  `ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "published_at" timestamp(3) with time zone;`,
  `DO $$ BEGIN
     CREATE TYPE "enum_news_locked_locales" AS ENUM ('fr','es','de','it','nl','zh');
   EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  `CREATE TABLE IF NOT EXISTS "news_locked_locales" (
     "order" integer NOT NULL,
     "parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE,
     "value" "enum_news_locked_locales"
   );`,
  `CREATE INDEX IF NOT EXISTS "news_locked_locales_parent_idx" ON "news_locked_locales" ("parent_id");`,
  `CREATE INDEX IF NOT EXISTS "news_locked_locales_order_idx" ON "news_locked_locales" ("order");`,
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
