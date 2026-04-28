import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { getSiteUrl } from "@/lib/siteUrl";

/**
 * Sitewide resolver of "sister page" URLs per locale.
 *
 * Usage:
 *   const { hreflang, switcher, canonical } = buildRouteAlternates({
 *     currentLocale,
 *     pathSegment: "/news/my-slug",
 *     translatedLocales: ["en", "fr"],      // optional: emit hreflang only for these
 *     fallbackListPath: "/news",            // optional: where switcher sends if no sister page
 *   });
 *
 *   - `hreflang`: map of locale → absolute URL, ready for <link rel="alternate" /> emission.
 *     Only contains entries for `translatedLocales` (+ always current locale + x-default).
 *   - `switcher`: map of locale → absolute URL, always complete for all 7 locales.
 *     For untranslated locales, falls back to `fallbackListPath` in that locale
 *     (NEVER to the homepage). Used by the locale switcher UI.
 *   - `canonical`: self URL for the current locale.
 */

export type RouteAlternates = {
  canonical: string;
  hreflang: Record<string, string>;
  switcher: Record<Locale, { url: string; translated: boolean }>;
  xDefault: string;
};

function joinPath(...parts: string[]): string {
  const clean = parts
    .map((p) => p.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
  return clean ? `/${clean}/` : "/";
}

function localePath(locale: Locale, pathSegment: string): string {
  if (locale === defaultLocale) return joinPath(pathSegment);
  return joinPath(locale, pathSegment);
}

export function buildRouteAlternates(opts: {
  currentLocale: Locale;
  pathSegment: string;
  translatedLocales?: Locale[] | null;
  fallbackListPath?: string;
}): RouteAlternates {
  const siteUrl = getSiteUrl();
  const translated = opts.translatedLocales
    ? new Set<Locale>(opts.translatedLocales)
    : new Set<Locale>(locales);
  translated.add(opts.currentLocale);
  translated.add(defaultLocale);

  const fallback = opts.fallbackListPath ?? "/";

  const hreflang: Record<string, string> = {};
  const switcher: Record<Locale, { url: string; translated: boolean }> = {} as Record<
    Locale,
    { url: string; translated: boolean }
  >;

  for (const l of locales) {
    const isTranslated = translated.has(l);
    const target = isTranslated ? opts.pathSegment : fallback;
    const absolute = `${siteUrl}${localePath(l, target)}`;
    switcher[l] = { url: absolute, translated: isTranslated };
    if (isTranslated) {
      hreflang[l] = `${siteUrl}${localePath(l, opts.pathSegment)}`;
    }
  }

  const xDefault = `${siteUrl}${localePath(defaultLocale, opts.pathSegment)}`;
  hreflang["x-default"] = xDefault;

  const canonical = `${siteUrl}${localePath(opts.currentLocale, opts.pathSegment)}`;

  return { canonical, hreflang, switcher, xDefault };
}
