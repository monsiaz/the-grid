import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) throw new Error("OPENAI_API_KEY not set");

const MANIFEST = "/Users/simonazoulay/the-grid/public/_manifest/image-descriptions.json";
const data = JSON.parse(readFileSync(MANIFEST, "utf8"));

// Key images we want high-precision descriptions for
const CRITICAL = [
  "ABOUT/12.png",
  "ABOUT/250130_FWS_archive_161512.jpg",
  "ABOUT/@GregoireTruchet-2607.jpg",
  "ABOUT/@GregoireTruchet-6018.jpg.jpeg",
  "ABOUT/@GregoireTruchet-7079.jpg",
  "ABOUT/essesmag_1763480808_3768672629783841171_62415384298.jpg",
  "ABOUT/gg25-bts-2@2x.avif",
  "ABOUT/photo pro.jpg",
  "ABOUT/THE GRID AGENCY WEBSITE 2.0.png",
  "ABOUT/THE GRID AGENCY WEBSITE 2.0 (1).png",
  "ABOUT/E54FE91C-EF6B-4D5A-9CEE-90F3D087C9DF_1_105_c.avif",
  "HOMEPAGE/BAR_F3_DL-3462.jpg",
  "HOMEPAGE/Enzo Deligny karting.JPG",
  "HOMEPAGE/Isack Hadjar GP Baku 2025_ Crédit Liam Fabre.jpg",
  "HOMEPAGE/Pierre Gasly GP Singapore 2025_ Crédit GregoireTruchetjpg.jpg",
  "HOMEPAGE/@GregoireTruchet-5025.jpg",
  "HOMEPAGE/Untitled design (6).png",
  "CONTACT/@GregoireTruchet-4486.jpg",
  "SERVICES/PARTIE 1 SPORTIF/@GregoireTruchet-0277.jpg",
  "SERVICES/PARTIE 1 SPORTIF/@GregoireTruchet-8277.jpg",
  "SERVICES/PARTIE 1 SPORTIF/@GregoireTruchet-9102 (2).jpg",
  "SERVICES/PARTIE 1 SPORTIF/AI208553.jpg",
  "SERVICES/PARTIE 1 SPORTIF/BAR_F3_DL-4018.jpg",
  "SERVICES/PARTIE 1 SPORTIF/BCN_GP_SR-8171.jpg",
  "SERVICES/PARTIE 1 SPORTIF/GQ_ME_MOTY_HYPE_2025_ISACK2.webp",
  "SERVICES/PARTIE 1 SPORTIF/f7330b69-d810-4a45-bbd4-cbeaa67d8b13.jpg",
  "SERVICES/PARTIE 2 COMMERCIAL/@GregoireTruchet-3224.jpg",
  "SERVICES/PARTIE 2 COMMERCIAL/@GregoireTruchet-3504.jpg",
  "SERVICES/PARTIE 2 COMMERCIAL/@GregoireTruchet-5857.jpg",
  "SERVICES/PARTIE 2 COMMERCIAL/@GregoireTruchet-7100.jpg",
  "SERVICES/PARTIE 2 COMMERCIAL/Fabio Quartararo x Lif3.avif",
  "SERVICES/PARTIE 2 COMMERCIAL/HP_Reebok__Pierre_Gasly_3_3230966c-6fbf-4899-84f7-b5dd8e62579c.webp",
  "SERVICES/PARTIE 2 COMMERCIAL/Nyck de Vries x Omnes.webp",
  "SERVICES/PARTIE 2 COMMERCIAL/Pierre Gasly x Givenchy.jpg",
  "SERVICES/PARTIE 2 COMMERCIAL/Pierre Gasly x H. Moser & Cie .jpg",
  "SERVICES/PARTIE 2 COMMERCIAL/Sauber x Everdome .jpeg",
  "SERVICES/PARTIE 2 COMMERCIAL/Scuderia Alpha Tauri x Fantom.avif",
  "DRIVERS/THE GRID AGENCY WEBSITE 2.0 (2).png",
];

const COLLECTE = "/Users/simonazoulay/Downloads/COLLECTE IMAGES";

const SYSTEM = `You are describing a specific image for a motorsport management agency website.
Be SPECIFIC about:
  - Named driver if you can identify them (Pierre Gasly, Isack Hadjar, Enzo Deligny, Fred Makowiecki, Kush Maini, Alessandro Giusti, Nathan Tye Jr, Stan Ratajski, Andrea Dupe, Jack Iliffe, Louis Cochet, Luka Scelles, Vivek Kanthan, Alessandro Truchot, Fabio Quartararo, Nyck de Vries, Guillaume Le Goff, Jérémy Satis, Laura Fredel).
  - Precise action (karting, F3, F1, signing autographs, gym training, portrait shoot, paddock discussion, brand campaign, podium, magazine cover, race celebration).
  - Setting (street, gym, circuit, paddock, pit-lane, garage, studio, office).
  - Brand/partners visible (Alpine, Red Bull, Racing Bulls, BWT, Givenchy, Reebok, Moser, Hintsa, Everdome, Omnes, Lif3, Fantom, CÔME, GRID).

Return strict JSON: { "description": "<=35 words, factual, English>", "subject": "<concise subject label>", "tags": ["..."], "drivers": ["list of named drivers visible"] }.
Example: { "description": "Pierre Gasly deadlifting in gym, wearing black Alpine Formula 1 training kit.", "subject": "Pierre Gasly gym training", "tags":["pierre-gasly","training","gym","alpine"], "drivers":["Pierre Gasly"] }`;

function preview(src) {
  const cache = `/tmp/about-vision/_hi/${Buffer.from(src).toString("base64url").slice(0, 40)}.jpg`;
  try {
    execFileSync("mkdir", ["-p", "/tmp/about-vision/_hi"]);
    if (!existsSync(cache)) {
      execFileSync("magick", [src, "-resize", "1024x1024>", "-quality", "85", cache], { stdio: "ignore" });
    }
  } catch (e) { return null; }
  return cache;
}

let refined = 0;
for (const rel of CRITICAL) {
  const src = path.join(COLLECTE, rel);
  const key = `Downloads/COLLECTE IMAGES/${rel}`;
  if (!existsSync(src)) { console.warn("MISSING", rel); continue; }
  const prev = preview(src);
  if (!prev) continue;
  const b64 = readFileSync(prev).toString("base64");
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0,
      max_tokens: 250,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: [
          { type: "text", text: `File: ${rel}` },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${b64}`, detail: "high" } },
        ] },
      ],
    }),
  });
  if (!r.ok) { console.error(`ERR ${rel}:`, r.status, (await r.text()).slice(0,200)); continue; }
  const j = await r.json();
  try {
    const parsed = JSON.parse(j.choices[0].message.content);
    data[key] = {
      ...(data[key] || {}),
      description: parsed.description,
      subject: parsed.subject || null,
      tags: parsed.tags || [],
      drivers: parsed.drivers || [],
      path: src,
      refined: true,
    };
    refined++;
    console.log(`[${rel}] ${parsed.description}`);
  } catch (e) { console.error("parse", rel, e.message); }
}

writeFileSync(MANIFEST, JSON.stringify(data, null, 2));
console.log(`\nRefined ${refined} entries`);
