/**
 * Resolve the canonical public origin of the site for metadata, robots and sitemap.
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL   → explicit override (use this in Vercel env for the
 *                               apex/www domain once plugged, e.g. https://thegrid.agency)
 *   2. VERCEL_PROJECT_PRODUCTION_URL → set automatically on Vercel production
 *   3. https://the-grid-sa.vercel.app → current production fallback
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return stripTrailingSlash(ensureProtocol(explicit));

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) return stripTrailingSlash(ensureProtocol(vercelProd));

  return "https://the-grid-sa.vercel.app";
}

function ensureProtocol(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}
