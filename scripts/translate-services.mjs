#!/usr/bin/env node
/**
 * Translate services-page global into all locales.
 * Runs against production by default (or BASE_URL).
 */

const BASE = process.env.BASE_URL || "https://the-grid-sa.vercel.app";
const SECRET = process.env.TRANSLATE_SECRET || "791a98805d94c41c3449503402bd590e01653fa168091192bb38665c4439f229";

const LOCALES = ["fr", "es", "de", "it", "nl", "zh"];

async function run() {
  // 1. Seed English content
  console.log("Seeding EN content…");
  const seed = await fetch(`${BASE}/api/seed-services?secret=${SECRET}`, {
    method: "POST",
  });
  if (!seed.ok) {
    console.error("Seed failed:", seed.status, await seed.text());
    return;
  }
  console.log("✅ EN seeded");

  // 2. Trigger translations for each locale
  for (const locale of LOCALES) {
    console.log(`Translating ${locale}…`);
    const r = await fetch(
      `${BASE}/api/translate-payload?secret=${SECRET}&scope=globals&locale=${locale}`,
      { method: "POST" },
    );
    if (!r.ok) {
      const t = await r.text();
      console.error(`❌ ${locale}:`, t.slice(0, 200));
    } else {
      const d = await r.json();
      console.log(`✅ ${locale}:`, d.translated ?? d.ok ?? "done");
    }
  }
  console.log("\n✅ All services translations done.");
}

run().catch(console.error);
