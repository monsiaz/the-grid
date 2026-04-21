#!/usr/bin/env node
/**
 * Run full translations for production in sequence (to avoid timeouts).
 * 6 locales × (6 globals + 3 collections) = 54 calls
 */

const BASE = process.env.TRANSLATE_TARGET || "https://the-grid-sa.vercel.app";
const SECRET = "791a98805d94c41c3449503402bd590e01653fa168091192bb38665c4439f229";
const LOCALES = ["fr", "es", "de", "it", "nl", "zh"];
const GLOBALS = ["homepage", "about-page", "services-page", "drivers-page", "contact-page", "site-settings"];
const COLLECTIONS = ["drivers", "news", "team-members"];

let ok = 0, fail = 0;

async function callTranslate(params) {
  const url = new URL(`${BASE}/api/translate-payload`);
  url.searchParams.set("secret", SECRET);
  url.searchParams.set("force", "1");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  
  try {
    const r = await fetch(url.toString(), { 
      signal: AbortSignal.timeout(290_000),
      headers: { "x-translate-secret": SECRET }
    });
    const text = await r.text();
    if (!text) return { ok: true, empty: true };
    const d = JSON.parse(text);
    return d;
  } catch (e) {
    return { error: String(e) };
  }
}

// Translate each global per locale
for (const global_ of GLOBALS) {
  for (const locale of LOCALES) {
    const d = await callTranslate({ scope: "globals", global: global_, locale });
    if (d.error) {
      console.error(`❌ global ${global_} ${locale}: ${d.error}`);
      fail++;
    } else {
      console.log(`✅ global ${global_} ${locale}: translated=${d.translated ?? '?'}`);
      ok++;
    }
  }
}

// Translate each collection per locale
for (const col of COLLECTIONS) {
  for (const locale of LOCALES) {
    const d = await callTranslate({ scope: "collections", collection: col, locale });
    if (d.error) {
      console.error(`❌ col ${col} ${locale}: ${d.error}`);
      fail++;
    } else {
      console.log(`✅ col ${col} ${locale}: translated=${d.translated ?? '?'}`);
      ok++;
    }
  }
}

console.log(`\nDone: ${ok} ok, ${fail} fail`);
