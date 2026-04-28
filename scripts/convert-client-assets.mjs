// Convert client-supplied images to optimized WebP in /public/assets/v2/
// Requires: sharp (already installed via Payload dep)

import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const SRC = "/Users/simonazoulay/Downloads/COLLECTE IMAGES";
const DEST = "/Users/simonazoulay/the-grid/public/assets/v2";

// [sourcePath, targetPath, width, height?, fit?, quality?, extract?]
// width/height in px, fit = cover|contain|inside|cover-top
// extract = { left, top, width, height } — optional pre-crop applied BEFORE
// resize (lets us frame the subject before the cover crop).
const JOBS = [
  // ===== HOMEPAGE =====
  // Hero (landscape 1920x1080 style) — Pierre cockpit
  ["HOMEPAGE/Pierre Gasly GP Singapore 2025_ Crédit GregoireTruchetjpg.jpg", "home/hero.webp", 1920, 1080, "cover", 78],
  ["HOMEPAGE/Pierre Gasly GP Singapore 2025_ Crédit GregoireTruchetjpg.jpg", "home/hero-mobile.webp", 900, 1600, "cover", 75],
  // About teaser on home (Isack profile shot works well - signing autographs = human moment)
  ["HOMEPAGE/Isack Hadjar GP Baku 2025_ Crédit Liam Fabre.jpg", "home/about.webp", 1600, 900, "cover", 78],
  // Services teaser on home — red F1 night blur (dynamic)
  ["HOMEPAGE/@GregoireTruchet-5025.jpg", "home/services.webp", 1600, 900, "cover", 78],
  // Drivers teaser on home — karting
  ["HOMEPAGE/Enzo Deligny karting.JPG", "home/drivers.webp", 1600, 900, "cover", 78],
  // Extra F3 action shot kept as alt
  ["HOMEPAGE/BAR_F3_DL-3462.jpg", "home/f3-action.webp", 1600, 900, "cover", 78],

  // ===== ABOUT =====
  // Core areas — use client's high-res source images, mapped to correct slots
  // 01 Sport Management = Pierre Gasly Singapore 2025 cockpit portrait (BWT
  // helmet, visor up, red halo in foreground). Source is a 3767×5650 portrait
  // at a natural 2:3 ratio, subject (helmet + face) centered vertically. The
  // About card renders this as `aspect-square` with `object-top`, so a
  // 900×1300 cover resize keeps the helmet + face safely inside the top
  // square crop without over-stretching.
  ["HOMEPAGE/Pierre Gasly GP Singapore 2025_ Crédit GregoireTruchetjpg.jpg", "about/core-sport-management.webp", 900, 1300, "cover", 82],
  // 02 Image & Branding = Isack GQ magazine cover (red background)
  ["ABOUT/12.png", "about/core-image-branding.webp", 900, 1300, "cover", 82],
  // 03 Commercial Development = Pierre Gasly portrait (dark, with perfume bottle like Givenchy)
  // Client folder has no exact Gasly/Givenchy shot, use gg25 BTS of Gasly as closest match
  ["ABOUT/gg25-bts-2@2x.avif", "about/core-commercial-development.webp", 900, 1300, "cover", 82],
  // Founder / Guillaume
  ["ABOUT/@GregoireTruchet-7079.jpg", "about/founder.webp", 900, 1200, "cover", 82],
  // Team: Jérémy Satis = bearded, dark-green polo, black headphones, paddock blue bg.
  // Source is 780x606 landscape. Previously targeted 800x1100 which forced a
  // ~1.8x upscale AND cropped tight on the face — the card (aspect-square +
  // object-top) then showed mostly headphones + chin and felt "too zoomed".
  // New target is a natural 900x900 square (tiny 1.3x upscale) cropped around
  // the subject so the card displays the full head + shoulders + green polo
  // without heavy enlargement.
  ["ABOUT/E54FE91C-EF6B-4D5A-9CEE-90F3D087C9DF_1_105_c.avif", "about/team-jeremy.webp", 900, 900, "cover", 85, { left: 162, top: 0, width: 606, height: 606 }],
  // Team: Laura Fredel = no client asset provided — keep empty placeholder, we restore from CDN separately
  // (intentionally no JOB here, see post-processing step in deploy-laura script)
  // ACCÉLÈRE banner — the PNG with subtitle+logos (new client-provided visual)
  ["ABOUT/THE GRID AGENCY WEBSITE 2.0.png", "about/accelere.webp", 1920, 1080, "cover", 85],
  ["ABOUT/THE GRID AGENCY WEBSITE 2.0 (1).png", "about/accelere-alt.webp", 1920, 1080, "cover", 85],
  // About hero: composite Isack (pit) + Gasly (dancing) — use CDN composite source
  // We build a 2x1 composite in the postprocess step (see below)
  // Instagram grid (5 placeholders — use ABOUT varied)
  ["ABOUT/12.png", "about/instagram-1.webp", 800, 800, "cover", 75],
  ["ABOUT/essesmag_1763480808_3768672629783841171_62415384298.jpg", "about/instagram-2.webp", 800, 800, "cover", 75],
  ["ABOUT/gg25-bts-2@2x.avif", "about/instagram-3.webp", 800, 800, "cover", 75],
  ["ABOUT/@GregoireTruchet-6018.jpg.jpeg", "about/instagram-4.webp", 800, 800, "cover", 75],
  ["ABOUT/@GregoireTruchet-2607.jpg", "about/instagram-5.webp", 800, 800, "cover", 75],

  // ===== SERVICES =====
  // Services hero (Isack autograph - crowd, brand moment)
  ["HOMEPAGE/Isack Hadjar GP Baku 2025_ Crédit Liam Fabre.jpg", "services/hero.webp", 1920, 1080, "cover", 78],
  // Talent cards (5) - Mentorship, Commercial, Network, Contracts, Branding
  ["SERVICES/PARTIE 1 SPORTIF/@GregoireTruchet-8277.jpg", "services/talent-mentorship.webp", 700, 1100, "cover", 78],
  // Commercial = GQ magazine - crop to remove white borders via sharp extract
  ["SERVICES/PARTIE 1 SPORTIF/GQ_ME_MOTY_HYPE_2025_ISACK2.webp", "services/talent-commercial.webp", 700, 1100, "cover", 80],
  ["SERVICES/PARTIE 1 SPORTIF/AI208553.jpg", "services/talent-network.webp", 700, 1100, "cover", 78],
  ["SERVICES/PARTIE 1 SPORTIF/@GregoireTruchet-9102 (2).jpg", "services/talent-contracts.webp", 700, 1100, "cover", 78],
  ["SERVICES/PARTIE 1 SPORTIF/f7330b69-d810-4a45-bbd4-cbeaa67d8b13.jpg", "services/talent-branding.webp", 700, 1100, "cover", 78],
  // Hintsa partner (gym scene)
  ["SERVICES/PARTIE 1 SPORTIF/BAR_F3_DL-4018.jpg", "services/hintsa.webp", 1600, 900, "cover", 78],
  // Value cards (5): Strategy (intro flip card), Partnerships, Network, Activation, Private
  // Strategy & Positioning = Reebok × Pierre Gasly campaign shot (portrait, dark bg).
  // Source is ~800x862 (near-square). We keep the subject centred with a cover
  // resize into the same 700x1100 portrait slot the other value cards use, so the
  // five cards in the grid stay visually consistent.
  ["SERVICES/PARTIE 2 COMMERCIAL/HP_Reebok__Pierre_Gasly_3_3230966c-6fbf-4899-84f7-b5dd8e62579c.webp", "services/value-strategy.webp", 700, 1100, "cover", 80],
  ["SERVICES/PARTIE 2 COMMERCIAL/@GregoireTruchet-3504.jpg", "services/value-partnerships.webp", 700, 1100, "cover", 78],
  ["SERVICES/PARTIE 2 COMMERCIAL/@GregoireTruchet-5857.jpg", "services/value-network.webp", 700, 1100, "cover", 78],
  ["SERVICES/PARTIE 2 COMMERCIAL/@GregoireTruchet-7100.jpg", "services/value-activation.webp", 700, 1100, "cover", 78],
  ["SERVICES/PARTIE 2 COMMERCIAL/@GregoireTruchet-3224.jpg", "services/value-private.webp", 700, 1100, "cover", 78],
  // Case studies (3): left=Sauber, center=AlphaTauri Fantom, right=Nyck de Vries Omnes
  ["SERVICES/PARTIE 2 COMMERCIAL/Sauber x Everdome .jpeg", "services/case-left.webp", 700, 900, "cover", 80],
  ["SERVICES/PARTIE 2 COMMERCIAL/Scuderia Alpha Tauri x Fantom.avif", "services/case-center.webp", 700, 900, "cover", 80],
  ["SERVICES/PARTIE 2 COMMERCIAL/Nyck de Vries x Omnes.webp", "services/case-right.webp", 700, 900, "cover", 80],

  // ===== DRIVERS =====
  // Hero collage (mosaic)
  ["DRIVERS/THE GRID AGENCY WEBSITE 2.0 (2).png", "drivers/hero-collage.webp", 1920, 1080, "cover", 78],
  // Icones 14 drivers
  ["DRIVERS/ICONES/PIERRE GASLY.jpg", "drivers/icones/driver-01-gasly.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/ISACK HADJAR.webp", "drivers/icones/driver-02-hadjar.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/KUSH MAINI.webp", "drivers/icones/driver-03-maini.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/FRÉDÉRIC MAKOWIECKI.jpg", "drivers/icones/driver-04-makowiecki.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/ALESSANDRO GIUSTI.jpeg", "drivers/icones/driver-05-giusti.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/ENZO DELIGNY.jpg", "drivers/icones/driver-06-deligny.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/ANDREA DUPE.png", "drivers/icones/driver-07-dupe.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/NATHAN TYE JNR.jpeg", "drivers/icones/driver-08-tye.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/VIVEK KANTHAN.jpg", "drivers/icones/driver-09-kanthan.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/JACK ILIFFE.jpg", "drivers/icones/driver-10-iliffe.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/LOUIS COCHET.jpg", "drivers/icones/driver-11-cochet.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/LUKA SCELLES.JPG", "drivers/icones/driver-12-scelles.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/ALESSANDRO TRUCHOT.JPG", "drivers/icones/driver-13-truchot.webp", 600, 750, "cover", 80],
  ["DRIVERS/ICONES/STAN RATAJSKI.jpg", "drivers/icones/driver-14-ratajski.webp", 600, 750, "cover", 80],

  // ===== CONTACT =====
  ["CONTACT/@GregoireTruchet-4486.jpg", "contact/backdrop.webp", 1920, 1080, "cover", 80],
];

// Build a 2:1 composite (Isack pit + Gasly dancing) for the About hero,
// using the same clean source images the CDN version is built from.
async function buildAboutHeroComposite() {
  const OUT = path.join(DEST, "about/hero.webp");
  const W = 2880, H = 1350;
  const halfW = W / 2;

  const leftSrc = path.join(SRC, "ABOUT/@GregoireTruchet-6018.jpg.jpeg");
  const rightSrc = path.join(SRC, "ABOUT/essesmag_1763480808_3768672629783841171_62415384298.jpg");

  const leftBuf = await sharp(leftSrc, { failOn: "none" })
    .resize(halfW, H, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
  const rightBuf = await sharp(rightSrc, { failOn: "none" })
    .resize(halfW, H, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();

  await sharp({ create: { width: W, height: H, channels: 3, background: "#000" } })
    .composite([
      { input: leftBuf, left: 0, top: 0 },
      { input: rightBuf, left: halfW, top: 0 },
    ])
    .webp({ quality: 82, effort: 6 })
    .toFile(OUT);

  const stat = await fs.stat(OUT);
  console.log(`OK  about/hero.webp (composite 2x1)  ${(stat.size / 1024).toFixed(1)} KB`);
}

async function run() {
  let ok = 0, fail = 0;
  for (const [src, dst, w, h, fit = "cover", q = 80, extract] of JOBS) {
    const srcPath = path.join(SRC, src);
    const dstPath = path.join(DEST, dst);
    try {
      await fs.mkdir(path.dirname(dstPath), { recursive: true });
      const pipeline = sharp(srcPath, { failOn: "none" });
      if (extract) {
        // Pre-crop to a specific region of the source BEFORE resizing so the
        // subsequent `cover` resize doesn't over-crop or heavily upscale.
        pipeline.extract(extract);
      }
      if (h) {
        if (fit === "cover-top") {
          pipeline.resize(w, h, { fit: "cover", position: "top" });
        } else {
          pipeline.resize(w, h, { fit });
        }
      } else {
        pipeline.resize(w);
      }
      await pipeline.webp({ quality: q, effort: 6 }).toFile(dstPath);
      const stat = await fs.stat(dstPath);
      console.log(`OK  ${dst}  ${(stat.size / 1024).toFixed(1)} KB`);
      ok++;
    } catch (e) {
      console.error(`FAIL ${src} -> ${dst}:`, e.message);
      fail++;
    }
  }
  try {
    await buildAboutHeroComposite();
    ok++;
  } catch (e) {
    console.error("FAIL about hero composite:", e.message);
    fail++;
  }
  console.log(`\nDone. ${ok} ok, ${fail} failed.`);
}

run();
