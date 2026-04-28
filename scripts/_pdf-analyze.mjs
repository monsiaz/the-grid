import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY not set");

const PAGES = [];
for (let i = 1; i <= 18; i++) {
  const p = `/tmp/about-vision/pdf-page-${String(i).padStart(2, "0")}.png`;
  PAGES.push([`p${i}`, p]);
}

const SYSTEM = `You are analysing a feedback PDF from a client.
Each page of the PDF contains one or more screenshots of a website
(The Grid Agency — https://the-grid-sa.vercel.app) annotated with
handwritten/typed notes in FRENCH describing what the client wants to change.

Your job: for the page given, list every concrete client request as JSON.
For each request, detect:
  - page_section:  "homepage" | "about" | "services" | "drivers" | "news" | "footer" | "montages" | "cover" | "other"
  - zone:          short zone label in English (e.g. "hero", "services-carousel", "founder-card", "accelere-banner", "instagram-grid", "driver-stats", "drivers-mosaic", "contact-form-footer")
  - type:          "image-replace" | "image-crop" | "image-add" | "text-change" | "layout" | "behavior" | "bug" | "question"
  - description:   English short description of the request
  - source_visual: short description of the IMAGE currently shown (the screenshot of the site)
  - target_visual: short description of the IMAGE or STATE the client wants instead (often described in the note)
  - quote_fr:      literal french quote from the annotation if visible (<=120 chars)

If the annotation mentions an asset/person (e.g. "Isack Hadjar karting" or "Pierre Gasly Singapore GP"), include it in target_visual.

Reply strict JSON:
{ "page": "pN", "items": [ { ... } ] }
If a page has no items, return items: [].`;

const all = [];
for (const [pid, file] of PAGES) {
  console.log(`[${pid}] analysing ${file}`);
  const b64 = readFileSync(file).toString("base64");
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: [
            { type: "text", text: `Analyse page ${pid}.` },
            { type: "image_url", image_url: { url: `data:image/png;base64,${b64}`, detail: "high" } },
          ],
        },
      ],
    }),
  });
  const j = await r.json();
  if (!r.ok) {
    console.error(`[${pid}] ERROR`, JSON.stringify(j).slice(0, 400));
    all.push({ page: pid, error: j });
    continue;
  }
  const raw = j.choices?.[0]?.message?.content;
  try {
    const parsed = JSON.parse(raw);
    all.push(parsed);
    console.log(`[${pid}] items:`, parsed.items?.length || 0);
  } catch {
    all.push({ page: pid, raw });
  }
}

writeFileSync("/tmp/about-vision/pdf-requests.json", JSON.stringify(all, null, 2));
console.log("\nWritten /tmp/about-vision/pdf-requests.json");
