#!/usr/bin/env node
/**
 * Translate messages/en.json into all target locales using OpenAI (gpt-5.4-nano).
 *
 * Usage:
 *   node scripts/translate-messages.mjs           # translate only missing keys
 *   node scripts/translate-messages.mjs --force   # retranslate everything
 *
 * Requires OPENAI_API_KEY env var.
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import OpenAI from "openai";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const MESSAGES_DIR = path.join(ROOT, "messages");
const SOURCE_FILE = path.join(MESSAGES_DIR, "en.json");
const MODEL = process.env.OPENAI_TRANSLATOR_MODEL || "gpt-5.4-nano";

const LOCALES = {
  fr: { label: "French (France)", culture: "France" },
  es: { label: "Spanish (Spain)", culture: "Spain" },
  de: { label: "German (Germany)", culture: "Germany" },
  it: { label: "Italian (Italy)", culture: "Italy" },
  nl: { label: "Dutch (Netherlands)", culture: "Netherlands" },
  zh: { label: "Simplified Chinese (China)", culture: "China" },
};

const FORCE = process.argv.includes("--force");

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Missing OPENAI_API_KEY env var");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function flatten(obj, prefix = "") {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value)) {
      Object.assign(out, flatten(value, full));
    } else {
      out[full] = value;
    }
  }
  return out;
}

function unflatten(flat) {
  const result = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let node = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!isPlainObject(node[p])) node[p] = {};
      node = node[p];
    }
    node[parts[parts.length - 1]] = value;
  }
  return result;
}

async function readJson(file) {
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw);
}

async function writeJson(file, data) {
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

const SYSTEM_PROMPT = `You are a senior marketing translator for a premium 360° motorsport agency called "The Grid".
You translate short UI strings, SEO metadata, marketing copy and accessibility labels.
Hard rules:
- Preserve ICU placeholders like {name}, {title}, {index}, {count} exactly as-is.
- Preserve any inline HTML, <span>, <strong>, <br>, and bracket tags like [highlight]...[/highlight].
- Preserve brand names: The Grid, The Grid Agency, ACCÉLÈRE, Pierre Gasly, Isack Hadjar, Hintsa, BWT Alpine F1 Team, COMe Maison Financière, Formula 1, Formula 2, Formula 3.
- Keep "motorsport" spelled correctly in each target language.
- Do not add quotes or commentary.
- Preserve casing intent: if source is UPPERCASE, keep output UPPERCASE (natural for each language).
- Natural idiomatic tone, premium & editorial. Keep strings short.
- For Chinese (zh), use Simplified Chinese, no extra spaces around CJK characters.
- Translate punctuation to target locale conventions (e.g. French non-breaking space before : ; ! ?).
- Never translate URLs, email addresses, file paths, or slugs.`;

async function translateBatch(entries, targetLocale) {
  const { label } = LOCALES[targetLocale];
  const payload = Object.fromEntries(entries);
  const user = `Translate the values of this JSON object from English to ${label}.
Return a STRICT JSON object with the same keys and translated values only. No extra keys, no commentary.

INPUT:
${JSON.stringify(payload, null, 2)}`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error(`Empty response for locale ${targetLocale}`);
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON for locale ${targetLocale}: ${error instanceof Error ? error.message : String(error)}`);
  }
  for (const [key] of entries) {
    if (!(key in parsed) || typeof parsed[key] !== "string") {
      throw new Error(`Missing translated key ${key} for locale ${targetLocale}`);
    }
  }
  return parsed;
}

function chunkEntries(entries, chunkSize = 40) {
  const chunks = [];
  for (let i = 0; i < entries.length; i += chunkSize) {
    chunks.push(entries.slice(i, i + chunkSize));
  }
  return chunks;
}

async function translateLocale(targetLocale, sourceFlat) {
  const targetFile = path.join(MESSAGES_DIR, `${targetLocale}.json`);
  let existing = {};
  try {
    existing = await readJson(targetFile);
  } catch {
    existing = {};
  }
  const existingFlat = flatten(existing);

  const entriesToTranslate = Object.entries(sourceFlat).filter(([key, value]) => {
    if (typeof value !== "string") return false;
    if (FORCE) return true;
    return existingFlat[key] === undefined || existingFlat[key] === value;
  });

  if (entriesToTranslate.length === 0) {
    console.log(`[${targetLocale}] nothing to do`);
    return;
  }

  console.log(`[${targetLocale}] translating ${entriesToTranslate.length} keys via ${MODEL}`);

  const batches = chunkEntries(entriesToTranslate, 40);
  const merged = { ...existingFlat };
  let done = 0;
  for (const batch of batches) {
    const translated = await translateBatch(batch, targetLocale);
    for (const [key, value] of Object.entries(translated)) {
      merged[key] = value;
    }
    done += batch.length;
    console.log(`[${targetLocale}] ${done}/${entriesToTranslate.length}`);
  }

  await writeJson(targetFile, unflatten(merged));
  console.log(`[${targetLocale}] wrote ${targetFile}`);
}

async function main() {
  const source = await readJson(SOURCE_FILE);
  const sourceFlat = flatten(source);

  for (const locale of Object.keys(LOCALES)) {
    await translateLocale(locale, sourceFlat);
  }

  console.log("All locales translated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
