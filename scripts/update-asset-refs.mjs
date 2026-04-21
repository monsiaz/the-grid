/**
 * update-asset-refs.mjs
 *
 * Reads scripts/asset-rename-mapping.json and replaces every old asset
 * reference with the new one in all tracked source files.
 *
 * Usage:
 *   node scripts/update-asset-refs.mjs           # dry run (default)
 *   node scripts/update-asset-refs.mjs --apply   # write changes to disk
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { resolve, dirname, join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const APPLY = process.argv.includes("--apply");

// ── load mapping ─────────────────────────────────────────────────────────────

const mappingPath = resolve(ROOT, "scripts/asset-rename-mapping.json");
const { renames, extraSubstitutions = [] } = JSON.parse(readFileSync(mappingPath, "utf8"));

// ── source files to scan ─────────────────────────────────────────────────────

const SCAN_DIRS = ["components", "app", "globals", "scripts", "lib", "fields"];
const EXTENSIONS = new Set([".tsx", ".ts", ".mjs"]);
const IGNORE_DIRS = new Set(["node_modules", ".next", ".git", "_backup", "__pycache__"]);

function walkDir(dir, files = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walkDir(full, files);
    } else if (EXTENSIONS.has(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

const sourceFiles = SCAN_DIRS.flatMap((dir) =>
  walkDir(resolve(ROOT, dir))
);

// ── build a flat substitution list from the mapping ──────────────────────────
// Each entry: { oldRef, newRef }

const substitutions = [];
for (const rename of renames) {
  for (let i = 0; i < rename.currentRefs.length; i++) {
    const oldRef = rename.currentRefs[i];
    const newRef = rename.newRefs[i];
    if (oldRef && newRef && oldRef !== newRef) {
      substitutions.push({ oldRef, newRef });
    }
  }
}
// Extra literal string substitutions (e.g. directory-name checks in code)
for (const sub of extraSubstitutions) {
  if (sub.old && sub.new && sub.old !== sub.new) {
    substitutions.push({ oldRef: sub.old, newRef: sub.new });
  }
}

if (substitutions.length === 0) {
  console.log("No ref substitutions defined in the mapping (all currentRefs are empty). Nothing to do.");
  process.exit(0);
}

// ── scan & optionally patch ───────────────────────────────────────────────────

let totalChangedFiles = 0;
let totalChangedRefs = 0;

for (const filePath of sourceFiles) {
  const original = readFileSync(filePath, "utf8");
  let patched = original;
  const changes = [];

  for (const { oldRef, newRef } of substitutions) {
    if (!patched.includes(oldRef)) continue;

    const count = (patched.split(oldRef).length - 1);
    patched = patched.split(oldRef).join(newRef);
    changes.push({ oldRef, newRef, count });
    totalChangedRefs += count;
  }

  if (changes.length === 0) continue;

  const relPath = filePath.replace(ROOT + "/", "");
  totalChangedFiles++;

  console.log(`\n  ${relPath}`);
  for (const { oldRef, newRef, count } of changes) {
    const marker = APPLY ? "[CHANGED]" : "[WOULD CHANGE]";
    console.log(`    ${marker}  "${oldRef}"  →  "${newRef}"  (${count}×)`);
  }

  if (APPLY) {
    writeFileSync(filePath, patched, "utf8");
  }
}

// ── summary ──────────────────────────────────────────────────────────────────

console.log("");
if (APPLY) {
  console.log(`✓ Updated ${totalChangedRefs} ref(s) across ${totalChangedFiles} file(s).`);
} else {
  console.log(`Dry run: would update ${totalChangedRefs} ref(s) across ${totalChangedFiles} file(s).`);
  console.log("Run with --apply to write changes.");
}
console.log("");
