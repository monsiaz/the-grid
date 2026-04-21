#!/usr/bin/env node
// Convert every driver article photo from COLLECTE IMAGES/DRIVERS/ARTICLES/
// into optimised WebP variants under public/assets/v2/drivers/articles/<slug>/.
//
// Strategy:
//   - 1200px wide portrait/landscape, quality 82 — plenty for detail-page hero + blocks
//   - Smart attention-based crop to keep the face/subject in frame
//   - Stable, short filename: <slug>-N.webp (1-based index matching source order)
//
// Idempotent: skips the conversion if the target file already exists and is newer.

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_ROOT = "/Users/simonazoulay/Downloads/COLLECTE IMAGES/DRIVERS/ARTICLES";
const DST_ROOT = "/Users/simonazoulay/the-grid/public/assets/v2/drivers/articles";

// Maps the uppercase folder name (as present on disk) to the driver slug
// used in the CMS. The slug is the stable pivot — never change it.
const DIRECTORY_TO_SLUG = {
  "PIERRE GASLY": "pierre-gasly",
  "ISACK HADJAR": "isack-hadjar",
  "FRED MAKOWIECKI": "fred-makowiecki",
  "KUSH MAINI": "kush-maini",
  "ALESSANDRO GIUSTI": "alessandro-giusti",
  "ENZO DELIGNY": "enzo-deligny",
  "ANDREA DUPE": "andrea-dupe",
  "NATHAN TYE JNR": "nathan-tye",
  "VIVEK KANTHAN": "vivek-kanthan",
  "JACK ILIFFE": "jack-iliffe",
  "LOUIS COCHET": "louis-cochet",
  "LUKA SCELLES": "luka-scelles",
  "ALESSANDRO TRUCHOT": "alex-truchot",
  "STAN RATAJSKI": "stan-ratajski",
};

const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG"]);

async function convertOne(src, dst) {
  try {
    const srcStat = await fs.stat(src);
    try {
      const dstStat = await fs.stat(dst);
      if (dstStat.mtimeMs > srcStat.mtimeMs) {
        return { skipped: true };
      }
    } catch {
      /* dst doesn't exist, convert it */
    }

    const info = await sharp(src)
      .rotate() // honour EXIF orientation
      .resize({ width: 1200, height: 1500, fit: "cover", position: "attention", withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(dst);
    return { size: info.size };
  } catch (err) {
    return { error: err.message };
  }
}

async function run() {
  await fs.mkdir(DST_ROOT, { recursive: true });
  const dirs = await fs.readdir(SRC_ROOT);
  const report = [];

  for (const dir of dirs) {
    const slug = DIRECTORY_TO_SLUG[dir];
    if (!slug) {
      console.warn(`⚠ skip unknown directory: ${dir}`);
      continue;
    }
    const srcDir = path.join(SRC_ROOT, dir);
    const dstDir = path.join(DST_ROOT, slug);
    await fs.mkdir(dstDir, { recursive: true });

    const files = (await fs.readdir(srcDir))
      .filter((f) => VALID_EXT.has(path.extname(f)))
      .sort(); // stable order

    const driverReport = { slug, files: [] };
    for (let i = 0; i < files.length; i++) {
      const src = path.join(srcDir, files[i]);
      const dst = path.join(dstDir, `${slug}-${i + 1}.webp`);
      const res = await convertOne(src, dst);
      driverReport.files.push({ src: files[i], dst: path.basename(dst), ...res });
    }
    report.push(driverReport);
    console.log(`✓ ${slug.padEnd(20)} → ${driverReport.files.length} file(s)`);
  }

  console.log("\n=== REPORT ===");
  for (const r of report) {
    for (const f of r.files) {
      const info = f.error ? `ERR ${f.error}` : f.skipped ? "skipped" : `${Math.round(f.size / 1024)}KB`;
      console.log(`  ${r.slug}-${f.dst.match(/-(\d+)\.webp$/)?.[1]} ← ${f.src}  (${info})`);
    }
  }
  await fs.writeFile(
    path.join(DST_ROOT, "_report.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
