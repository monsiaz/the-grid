#!/bin/bash
# ============================================================
#  apply-asset-renames.sh
#  Run from the project root:  bash scripts/apply-asset-renames.sh
#
#  What this script does:
#   1. Creates a timestamped backup of public/assets/v2/
#   2. Renames the files listed in scripts/asset-rename-mapping.json
#      (file-system only — source-code refs are handled separately
#       by update-asset-refs.mjs)
#
#  DRY RUN by default. Pass --apply to actually rename files.
# ============================================================
set -euo pipefail

DRY_RUN=true
if [[ "${1:-}" == "--apply" ]]; then
  DRY_RUN=false
fi

BACKUP_DIR="public/assets/_backup_rename_$(date +%Y%m%d_%H%M%S)"

if $DRY_RUN; then
  echo ""
  echo "======================================================"
  echo "  DRY RUN — no files will be changed"
  echo "  Pass --apply to execute the renames."
  echo "======================================================"
  echo ""
else
  echo ""
  echo "======================================================"
  echo "  APPLYING renames + backup"
  echo "======================================================"
  echo ""

  mkdir -p "$BACKUP_DIR"
  echo "→ Backing up public/assets/v2/ → $BACKUP_DIR/v2/ ..."
  cp -r public/assets/v2/ "$BACKUP_DIR/v2/"
  echo "  Backup complete."
  echo ""
fi

# ── helper ────────────────────────────────────────────────────────────────────
do_rename() {
  local SRC="$1"
  local DST="$2"

  if [[ ! -f "$SRC" ]]; then
    echo "  [SKIP]  $SRC — file not found"
    return
  fi

  if $DRY_RUN; then
    echo "  [DRY]   mv $SRC"
    echo "          → $DST"
  else
    mkdir -p "$(dirname "$DST")"
    mv "$SRC" "$DST"
    echo "  [DONE]  $SRC → $DST"
  fi
}

# ── renames ───────────────────────────────────────────────────────────────────

echo "--- about/ ---"
do_rename \
  "public/assets/v2/about/accelere.webp" \
  "public/assets/v2/about/accelere-banner.webp"

do_rename \
  "public/assets/v2/about/accelere-alt.webp" \
  "public/assets/v2/about/accelere-program.webp"

echo ""
echo "--- contact/ ---"
do_rename \
  "public/assets/v2/contact/backdrop.webp" \
  "public/assets/v2/contact/hero.webp"

echo ""
echo "--- services/ ---"
do_rename \
  "public/assets/v2/services/hintsa.webp" \
  "public/assets/v2/services/hintsa-partner-bg.webp"

echo ""
echo "--- drivers/icones/ → drivers/icons/ (14 files) ---"
do_rename "public/assets/v2/drivers/icones/driver-01-gasly.webp"      "public/assets/v2/drivers/icons/driver-01-gasly.webp"
do_rename "public/assets/v2/drivers/icones/driver-02-hadjar.webp"     "public/assets/v2/drivers/icons/driver-02-hadjar.webp"
do_rename "public/assets/v2/drivers/icones/driver-03-maini.webp"      "public/assets/v2/drivers/icons/driver-03-maini.webp"
do_rename "public/assets/v2/drivers/icones/driver-04-makowiecki.webp" "public/assets/v2/drivers/icons/driver-04-makowiecki.webp"
do_rename "public/assets/v2/drivers/icones/driver-05-giusti.webp"     "public/assets/v2/drivers/icons/driver-05-giusti.webp"
do_rename "public/assets/v2/drivers/icones/driver-06-deligny.webp"    "public/assets/v2/drivers/icons/driver-06-deligny.webp"
do_rename "public/assets/v2/drivers/icones/driver-07-dupe.webp"       "public/assets/v2/drivers/icons/driver-07-dupe.webp"
do_rename "public/assets/v2/drivers/icones/driver-08-tye.webp"        "public/assets/v2/drivers/icons/driver-08-tye.webp"
do_rename "public/assets/v2/drivers/icones/driver-09-kanthan.webp"    "public/assets/v2/drivers/icons/driver-09-kanthan.webp"
do_rename "public/assets/v2/drivers/icones/driver-10-iliffe.webp"     "public/assets/v2/drivers/icons/driver-10-iliffe.webp"
do_rename "public/assets/v2/drivers/icones/driver-11-cochet.webp"     "public/assets/v2/drivers/icons/driver-11-cochet.webp"
do_rename "public/assets/v2/drivers/icones/driver-12-scelles.webp"    "public/assets/v2/drivers/icons/driver-12-scelles.webp"
do_rename "public/assets/v2/drivers/icones/driver-13-truchot.webp"    "public/assets/v2/drivers/icons/driver-13-truchot.webp"
do_rename "public/assets/v2/drivers/icones/driver-14-ratajski.webp"   "public/assets/v2/drivers/icons/driver-14-ratajski.webp"

# Remove the now-empty icones/ directory
if ! $DRY_RUN; then
  if [[ -d "public/assets/v2/drivers/icones" ]]; then
    rmdir "public/assets/v2/drivers/icones" 2>/dev/null && \
      echo "  [DONE]  Removed empty directory public/assets/v2/drivers/icones/" || true
  fi
fi

# ── summary ──────────────────────────────────────────────────────────────────
echo ""
if $DRY_RUN; then
  echo "Dry run complete. Run with --apply to execute."
  echo "Then run: node scripts/update-asset-refs.mjs --apply"
  echo "  to update all source-code references."
else
  echo "File renames complete. Backup saved to: $BACKUP_DIR"
  echo ""
  echo "Next step — update source-code references:"
  echo "  node scripts/update-asset-refs.mjs          # dry run first"
  echo "  node scripts/update-asset-refs.mjs --apply  # then apply"
fi
echo ""
