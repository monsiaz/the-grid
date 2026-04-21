#!/usr/bin/env node
/**
 * mass-translate-50workers.mjs
 *
 * Translates ALL Payload CMS content (globals + collections) into 6 languages
 * using up to 50 concurrent OpenAI workers via the translate-payload API endpoint.
 *
 * Each task = one (scope, slug, locale) triple → one API call → one OpenAI batch call.
 * 6 globals × 6 locales = 36 tasks
 * 3 collections × 6 locales = 18 tasks
 * Total: 54 tasks, 50 run concurrently (4 queue behind).
 */

const BASE_URL = "http://localhost:3000";
const SECRET = "791a98805d94c41c3449503402bd590e01653fa168091192bb38665c4439f229";
const CONCURRENCY = 50;
const FORCE = "1"; // retranslate even if value already exists

const LOCALES = ["fr", "es", "de", "it", "nl", "zh"];

const GLOBALS = [
  "homepage",
  "about-page",
  "services-page",
  "drivers-page",
  "contact-page",
  "site-settings",
];

const COLLECTIONS = ["drivers", "news", "team-members"];

// ─── Semaphore ────────────────────────────────────────────────────────────────

async function runConcurrent(tasks, concurrency, fn) {
  const results = new Array(tasks.length);
  let cursor = 0;

  async function worker() {
    while (cursor < tasks.length) {
      const idx = cursor++;
      try {
        results[idx] = await fn(tasks[idx], idx);
      } catch (err) {
        results[idx] = { error: String(err), task: tasks[idx] };
      }
    }
  }

  const pool = Array.from({ length: Math.min(concurrency, tasks.length) }, worker);
  await Promise.all(pool);
  return results;
}

// ─── Task runner ─────────────────────────────────────────────────────────────

async function translateTask(task, idx) {
  const { type, slug, locale } = task;
  const label = `[${String(idx + 1).padStart(2, "0")}] ${type}/${slug} → ${locale}`;

  const params = new URLSearchParams({ force: FORCE, locale });
  if (type === "global") {
    params.set("scope", "globals");
    params.set("global", slug);
  } else {
    params.set("scope", "collections");
    params.set("collection", slug);
  }

  const url = `${BASE_URL}/api/translate-payload/?${params}`;

  const start = Date.now();
  process.stdout.write(`  ⏳ ${label} …\n`);

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "x-translate-secret": SECRET,
        "Content-Type": "application/json",
      },
      // Give each request up to 5 minutes
      signal: AbortSignal.timeout(300_000),
    });
  } catch (fetchErr) {
    const msg = `FETCH ERROR: ${fetchErr.message}`;
    process.stdout.write(`  ❌ ${label} — ${msg}\n`);
    return { task, error: msg };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    const text = await res.text().catch(() => "(no body)");
    const msg = `JSON parse error (${res.status}): ${text.slice(0, 200)}`;
    process.stdout.write(`  ❌ ${label} — ${msg}\n`);
    return { task, error: msg };
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  if (!res.ok || data.error) {
    const msg = data.message || data.error || `HTTP ${res.status}`;
    process.stdout.write(`  ❌ ${label} — ${msg} (${elapsed}s)\n`);
    return { task, error: msg, data };
  }

  const updates = (data.log || []).filter((l) => l.includes("updated")).length;
  process.stdout.write(`  ✅ ${label} — ${updates} field(s) updated (${elapsed}s)\n`);
  return { task, success: true, updates, log: data.log || [] };
}

// ─── Build task list ──────────────────────────────────────────────────────────

const tasks = [];
for (const slug of GLOBALS) {
  for (const locale of LOCALES) {
    tasks.push({ type: "global", slug, locale });
  }
}
for (const slug of COLLECTIONS) {
  for (const locale of LOCALES) {
    tasks.push({ type: "collection", slug, locale });
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log(`\n🚀  Mass translation — ${tasks.length} tasks, concurrency=${CONCURRENCY}`);
console.log(`    Globals : ${GLOBALS.join(", ")}`);
console.log(`    Collections: ${COLLECTIONS.join(", ")}`);
console.log(`    Locales : ${LOCALES.join(", ")}\n`);

const t0 = Date.now();
const results = await runConcurrent(tasks, CONCURRENCY, translateTask);
const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

// ─── Summary ──────────────────────────────────────────────────────────────────

const ok = results.filter((r) => r.success);
const failed = results.filter((r) => r.error);
const totalUpdates = ok.reduce((s, r) => s + (r.updates || 0), 0);

console.log("\n─────────────────────────────────────────────────────");
console.log(`✅  Completed: ${ok.length}/${tasks.length} tasks succeeded`);
console.log(`📝  Total field updates: ${totalUpdates}`);
console.log(`⏱️   Wall-clock time: ${elapsed}s`);

if (failed.length > 0) {
  console.log(`\n❌  ${failed.length} task(s) failed:`);
  for (const r of failed) {
    const t = r.task || {};
    console.log(`    ${t.type}/${t.slug} → ${t.locale}: ${r.error}`);
  }
}

// Per-scope summary
console.log("\n📊  Per-scope breakdown:");
const byScope = {};
for (const r of ok) {
  const key = `${r.task.type}/${r.task.slug}`;
  if (!byScope[key]) byScope[key] = { locales: 0, fields: 0 };
  byScope[key].locales++;
  byScope[key].fields += r.updates || 0;
}
for (const [key, val] of Object.entries(byScope)) {
  console.log(`    ${key}: ${val.locales} locale(s), ${val.fields} field(s) updated`);
}

console.log("");
process.exit(failed.length > 0 ? 1 : 0);
