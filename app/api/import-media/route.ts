import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { getPayloadClient } from "@/lib/payload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 800;

type Source = {
  absPath: string;
  relPath: string;
  category: string;
  driverSlug?: string;
  tags: string[];
  alt: string;
};

const CATEGORY_BY_FOLDER: Record<string, string> = {
  HOMEPAGE: "homepage",
  ABOUT: "about",
  SERVICES: "services",
  CONTACT: "contact",
  DRIVERS: "drivers-grid",
  "DRIVERS/ICONES": "drivers-grid",
  "DRIVERS/ARTICLES": "drivers-articles",
  "LOGO THE GRID": "brand",
};

const DRIVER_SLUG_BY_NAME: Record<string, string> = {
  "PIERRE GASLY": "pierre-gasly",
  "ISACK HADJAR": "isack-hadjar",
  "KUSH MAINI": "kush-maini",
  "FRED MAKOWIECKI": "fred-makowiecki",
  "FRÉDÉRIC MAKOWIECKI": "fred-makowiecki",
  "ALESSANDRO GIUSTI": "alessandro-giusti",
  "ENZO DELIGNY": "enzo-deligny",
  "ANDREA DUPE": "andrea-dupe",
  "NATHAN TYE": "nathan-tye",
  "NATHAN TYE JNR": "nathan-tye",
  "VIVEK KANTHAN": "vivek-kanthan",
  "JACK ILIFFE": "jack-iliffe",
  "LOUIS COCHET": "louis-cochet",
  "LUKA SCELLES": "luka-scelles",
  "ALEX TRUCHOT": "alex-truchot",
  "ALESSANDRO TRUCHOT": "alex-truchot",
  "STAN RATAJSKI": "stan-ratajski",
};

const SKIP_EXT = new Set([".ai", ".pdf", ".svg"]);
const IMAGE_EXT = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif", ".gif"]);

async function walk(dir: string, out: string[] = []): Promise<string[]> {
  type FsEntry = { name: string; isDirectory: () => boolean };
  let entries: FsEntry[] = [];
  try {
    entries = (await fs.readdir(dir, { withFileTypes: true })) as unknown as FsEntry[];
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, String(e.name));
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

function slugify(s: string) {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

function classifyFromCollecte(absPath: string, collecteRoot: string): Source | null {
  const rel = path.relative(collecteRoot, absPath);
  const parts = rel.split(path.sep);
  if (parts.length < 2) return null;
  const ext = path.extname(rel).toLowerCase();
  if (SKIP_EXT.has(ext)) return null;
  if (!IMAGE_EXT.has(ext)) return null;
  const top = parts[0].toUpperCase();
  let category = CATEGORY_BY_FOLDER[top] || "other";
  let driverSlug: string | undefined;
  const tags: string[] = ["collecte", top.toLowerCase()];
  if (top === "DRIVERS" && parts[1].toUpperCase() === "ICONES") {
    category = "drivers-grid";
    const driverName = path.parse(parts[2] || "").name.toUpperCase();
    driverSlug = DRIVER_SLUG_BY_NAME[driverName];
    if (driverSlug) tags.push(driverSlug);
  } else if (top === "DRIVERS" && parts[1].toUpperCase() === "ARTICLES") {
    category = "drivers-articles";
    const driverName = (parts[2] || "").toUpperCase();
    driverSlug = DRIVER_SLUG_BY_NAME[driverName];
    if (driverSlug) tags.push(driverSlug);
  } else if (top === "SERVICES") {
    category = "services";
    tags.push(slugify(parts[1] || ""));
  } else if (top === "ABOUT") {
    category = "about";
  } else if (top === "HOMEPAGE") {
    category = "homepage";
  } else if (top === "CONTACT") {
    category = "contact";
  } else if (top === "LOGO THE GRID") {
    category = "brand";
  }
  const alt = path.parse(rel).name.replace(/[_-]+/g, " ").trim();
  return {
    absPath,
    relPath: rel,
    category,
    driverSlug,
    tags,
    alt,
  };
}

function classifyFromPublic(absPath: string, publicRoot: string): Source | null {
  const rel = path.relative(publicRoot, absPath);
  const ext = path.extname(rel).toLowerCase();
  if (!IMAGE_EXT.has(ext)) return null;
  const parts = rel.split(path.sep);
  let category = "other";
  const tags: string[] = ["site", "public"];
  if (parts[0] === "assets" && parts[1] === "v2") {
    const section = parts[2];
    if (section === "home") category = "homepage";
    else if (section === "about") category = "about";
    else if (section === "services") category = "services";
    else if (section === "contact") category = "contact";
    else if (section === "drivers") category = parts[3] === "icones" ? "drivers-grid" : "drivers-detail";
  } else if (parts[0] === "images") {
    if (parts[1] === "drivers") category = "drivers-detail";
    else if (parts[1] === "news") category = "news";
    else if (parts[1] === "about") category = "about";
    else if (parts[1] === "services") category = "services";
    else if (parts[1] === "contact") category = "contact";
    else if (parts[1] === "home" || parts.length === 2) category = "homepage";
  }
  const alt = path.parse(rel).name.replace(/[_-]+/g, " ").trim();
  return {
    absPath,
    relPath: rel,
    category,
    tags,
    alt,
  };
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "disabled in production" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "1";
  const limit = parseInt(searchParams.get("limit") || "0", 10) || 0;

  const body = await request.json().catch(() => ({}));
  const collecteRoot: string = body.collecteRoot || "/Users/simonazoulay/Downloads/COLLECTE IMAGES";
  const publicRoot: string = path.join(process.cwd(), "public");

  const payload = await getPayloadClient();

  const sources: Source[] = [];
  const collecteFiles = await walk(collecteRoot);
  for (const f of collecteFiles) {
    const src = classifyFromCollecte(f, collecteRoot);
    if (src) sources.push(src);
  }
  const publicFiles = await walk(publicRoot);
  for (const f of publicFiles) {
    const src = classifyFromPublic(f, publicRoot);
    if (src) sources.push(src);
  }

  const slice = limit > 0 ? sources.slice(0, limit) : sources;

  const log: string[] = [];
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const src of slice) {
    try {
      if (!force) {
        const existing = await payload.find({
          collection: "media",
          where: { source: { equals: src.relPath } },
          limit: 1,
          depth: 0,
        });
        if (existing.totalDocs > 0) {
          skipped += 1;
          continue;
        }
      }
      const buffer = await fs.readFile(src.absPath);
      const originalName = path.basename(src.absPath);
      const ext = path.extname(originalName).toLowerCase();
      const mime =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
            ? "image/webp"
            : ext === ".avif"
              ? "image/avif"
              : ext === ".gif"
                ? "image/gif"
                : "image/jpeg";
      await payload.create({
        collection: "media",
        data: {
          alt: src.alt,
          category: src.category,
          driverSlug: src.driverSlug,
          tags: src.tags.map((t) => ({ tag: t })),
          source: src.relPath,
        },
        file: {
          data: buffer,
          name: originalName,
          size: buffer.byteLength,
          mimetype: mime,
        },
      });
      imported += 1;
      if (imported % 10 === 0) log.push(`${imported} imported (last: ${src.relPath})`);
    } catch (e) {
      errors += 1;
      log.push(`ERR ${src.relPath}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return NextResponse.json({
    success: true,
    totalCandidates: sources.length,
    processed: slice.length,
    imported,
    skipped,
    errors,
    log,
  });
}
