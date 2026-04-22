#!/usr/bin/env node
/**
 * Translate the "privacy" namespace from EN into all other locales using gpt-4o-mini.
 * Runs 6 parallel requests (one per locale).
 */
import { readFileSync, writeFileSync } from "fs";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_KEY) {
  throw new Error("OPENAI_API_KEY is required to run this script.");
}

const LOCALES = {
  fr: "French (France)",
  es: "Spanish (Spain)",
  de: "German (Germany)",
  it: "Italian (Italy)",
  nl: "Dutch (Netherlands)",
  zh: "Simplified Chinese (China)",
};

const enPrivacy = JSON.parse(readFileSync("messages/en.json", "utf-8")).privacy;

async function translate(locale, langName) {
  const prompt = `You are a legal translator. Translate the following JSON privacy policy from English to ${langName}.
Rules:
- Keep all JSON keys exactly as-is.
- Preserve email addresses (info@thegrid.agency) verbatim.
- Use formal, professional legal tone.
- Return ONLY valid JSON, no markdown, no explanations.

JSON to translate:
${JSON.stringify(enPrivacy, null, 2)}`;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!r.ok) throw new Error(`OpenAI error: ${r.status}`);
  const d = await r.json();
  return JSON.parse(d.choices[0].message.content);
}

// Run all 6 in parallel
const tasks = Object.entries(LOCALES).map(async ([locale, langName]) => {
  try {
    const translated = await translate(locale, langName);
    const path = `messages/${locale}.json`;
    const data = JSON.parse(readFileSync(path, "utf-8"));
    data.privacy = translated;
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
    console.log(`✅ ${locale}: privacy policy translated`);
  } catch (e) {
    console.error(`❌ ${locale}: ${e.message}`);
  }
});

await Promise.all(tasks);
console.log("Done.");
