/**
 * On-demand revalidation helpers for Payload CMS afterChange / afterDelete hooks.
 *
 * Called directly from Payload hooks (which run inside the Next.js server
 * process on Vercel), so revalidatePath / revalidateTag are available.
 *
 * Pattern: revalidate the EN root path + every locale prefix so ALL language
 * variants of a page are refreshed in one call.
 */
import { revalidatePath } from "next/cache";
import { locales, defaultLocale } from "@/i18n/config";

/** Revalidate a single path in every locale. */
export function revalidateLocalizedPath(
  path: string,
  type: "layout" | "page" = "page",
) {
  // EN lives at root (no prefix)
  revalidatePath(path, type);

  // All other locales get the /<locale>/<path> prefix
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    const localised = path === "/" ? `/${locale}` : `/${locale}${path}`;
    revalidatePath(localised, type);
  }
}

/** Revalidate multiple paths in every locale at once. */
export function revalidateLocalizedPaths(paths: string[]) {
  for (const p of paths) {
    revalidateLocalizedPath(p);
  }
}

/** Refresh SEO discovery files after content changes. */
export function revalidateSitemaps() {
  revalidatePath("/sitemap-index.xml", "page");
  for (const locale of locales) {
    revalidatePath(`/sitemap/${locale}.xml`, "page");
  }
}

/** Helpers per content type ──────────────────────────────────────────── */

export function revalidateHomepage() {
  revalidateLocalizedPath("/", "layout");
}

export function revalidateAbout() {
  revalidateLocalizedPath("/about");
}

export function revalidateServices() {
  revalidateLocalizedPath("/services");
}

export function revalidateContact() {
  revalidateLocalizedPath("/contact");
}

export function revalidateDriversIndex() {
  revalidateLocalizedPath("/drivers");
  revalidateSitemaps();
}

export function revalidateDriverDetail(slug?: string | null) {
  revalidateLocalizedPath("/drivers");
  if (slug) revalidateLocalizedPath(`/drivers/${slug}`);
  revalidateSitemaps();
}

export function revalidateNewsIndex() {
  revalidateLocalizedPath("/news");
  revalidateSitemaps();
}

export function revalidateNewsDetail(slug?: string | null) {
  revalidateLocalizedPath("/news");
  if (slug) revalidateLocalizedPath(`/news/${slug}`);
  revalidateSitemaps();
}

/** SiteSettings is used in the footer which is on every page. */
export function revalidateAll() {
  revalidateLocalizedPath("/", "layout");
}
