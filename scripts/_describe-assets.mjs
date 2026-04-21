import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY not set");

const COLLECTE_ROOT = "/Users/simonazoulay/Downloads/COLLECTE IMAGES";
const PUBLIC_ROOT = "/Users/simonazoulay/the-grid/public";
const OUT = "/Users/simonazoulay/the-grid/public/_manifest/image-descriptions.json";
const CACHE_DIR = "/tmp/about-vision/_preview";

if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
if (!existsSync(path.dirname(OUT))) mkdirSync(path.dirname(OUT), { recursive: true });

const SKIP_EXT = new Set([".ai", ".pdf", ".svg"]);
const ALLOW_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic"]);

function* walk(root) {
  for (const entry of readdirSync(root)) {
    if (entry.startsWith(".")) continue;
    const p = path.join(root, entry);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (entry === "_backup" || entry === "_manifest") continue;
      yield* walk(p);
    } else {
      yield p;
    }
  }
}

const tasks = [];
for (const root of [COLLECTE_ROOT, PUBLIC_ROOT]) {
  if (!existsSync(root)) continue;
  for (const f of walk(root)) {
    const ext = path.extname(f).toLowerCase();
    if (SKIP_EXT.has(ext) || !ALLOW_EXT.has(ext)) continue;
    tasks.push(f);
  }
}

// Load existing to resume
let existing = {};
if (existsSync(OUT)) {
  try { existing = JSON.parse(readFileSync(OUT, "utf8")); } catch { existing = {}; }
}

function normalizePreview(src) {
  const hash = Buffer.from(src).toString("base64url").slice(0, 40);
  const cache = path.join(CACHE_DIR, `${hash}.jpg`);
  if (existsSync(cache)) return cache;
  try {
    execFileSync("magick", [src, "-resize", "800x800>", "-quality", "82", cache], { stdio: "ignore" });
    return cache;
  } catch {
    return null;
  }
}

const SYSTEM = `You describe an image for an asset library of a motorsport management agency website (The Grid Agency).
Return ONE short concise English description (max 20 words), focused on WHAT is visible:
  - Who (named driver if identifiable from helmet/livery/overall/logo/photo: Pierre Gasly, Isack Hadjar, Enzo Deligny, Pierre Gasly, Fred Makowiecki, Kush Maini, Alessandro Giusti, Nathan Tye, Stan Ratajski, Andrea Dupe, Jack Iliffe, Louis Cochet, Luka Scelles, Vivek Kanthan, Alessandro Truchot, Guillaume Le Goff, Jérémy Satis, Laura Fredel).
  - What action (driving, podium, signing autographs, portrait, paddock, karting, F3, F1, team briefing, boxing training, campaign shoot, magazine cover, brand partnership).
  - Key brand/asset if visible (Alpine, Red Bull, Renault, Givenchy, Reebok, Moser, Everdome, Omnes, Lif3, Fantom, Hintsa, CÔME).
  - Setting/context (grand prix circuit, karting track, photo studio, gym, etc.).
Reply strict JSON: { "description": "...", "subject": "primary subject short label", "tags": ["tag1","tag2",...] }`;

const results = { ...existing };
let done = 0;
const total = tasks.length;
console.log(`Processing ${total} images, ${Object.keys(existing).length} cached.`);

for (const file of tasks) {
  const key = path.relative("/Users/simonazoulay", file);
  if (results[key]?.description) { done++; continue; }
  const prev = normalizePreview(file);
  if (!prev) { console.warn(`skip ${file}`); continue; }
  const b64 = readFileSync(prev).toString("base64");
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 150,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: [
          { type: "text", text: path.basename(file) },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${b64}`, detail: "low" } },
        ] },
      ],
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    console.error(`[${key}] ERROR ${r.status}: ${t.slice(0, 200)}`);
    continue;
  }
  const j = await r.json();
  try {
    const parsed = JSON.parse(j.choices[0].message.content);
    results[key] = {
      description: parsed.description,
      subject: parsed.subject || null,
      tags: parsed.tags || [],
      path: file,
    };
    done++;
    if (done % 10 === 0) {
      writeFileSync(OUT, JSON.stringify(results, null, 2));
      console.log(`  ${done}/${total}`);
    }
  } catch (e) {
    console.error(`[${key}] parse error`, e.message);
  }
}

writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log(`\nWrote ${Object.keys(results).length} entries to ${OUT}`);
