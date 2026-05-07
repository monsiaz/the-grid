import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  locales,
  defaultLocale,
  openGraphLocale,
  type Locale,
} from "@/i18n/config";
import { getSiteUrl } from "@/lib/siteUrl";

type BuildMetadataOptions = {
  locale: Locale;
  pathSegment: string;
  namespace: "home" | "about" | "services" | "drivers" | "news" | "contact" | "privacy";
  titleOverride?: string;
  descriptionOverride?: string;
  keywordsExtra?: string[];
  ogImage?: string;
  /**
   * Optional override for hreflang emission. When provided, only these entries
   * are emitted as alternates.languages. Use this for dynamic routes where a
   * translation may not exist in every locale yet (avoid lying to Google).
   * Keys can be Locale codes OR "x-default". Values must be absolute URLs.
   */
  alternatesOverride?: Record<string, string>;
  /**
   * Optional canonical override (absolute URL). Useful for dynamic routes.
   */
  canonicalOverride?: string;
};

/**
 * Shape of the editable `seo` group injected by `fields/seoField.ts` on
 * every page-global and on the News + Drivers collections. All four fields
 * are optional; consumers must treat empty strings as "no override".
 */
export type SeoGroup = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
};

/**
 * Pulls override values from a Payload `seo` group. Empty strings are
 * normalized to `undefined` so callers can use `??` to fall through to the
 * existing i18n / hardcoded defaults.
 */
export function pickSeoOverrides(seo: SeoGroup | null | undefined): {
  titleOverride?: string;
  descriptionOverride?: string;
  keywordsExtra?: string[];
  ogImage?: string;
} {
  const trim = (v: unknown): string | undefined => {
    if (typeof v !== "string") return undefined;
    const t = v.trim();
    return t.length > 0 ? t : undefined;
  };
  const keywordsRaw = trim(seo?.keywords);
  return {
    titleOverride: trim(seo?.metaTitle),
    descriptionOverride: trim(seo?.metaDescription),
    keywordsExtra: keywordsRaw
      ? keywordsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined,
    ogImage: trim(seo?.ogImage),
  };
}

function normalizePath(segment: string): string {
  if (!segment || segment === "/") return "/";
  const p = segment.startsWith("/") ? segment : `/${segment}`;
  return p.replace(/\/+$/, "");
}

function withTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

function buildLocalizedPath(locale: Locale, pathSegment: string): string {
  const clean = pathSegment === "/" ? "" : pathSegment.replace(/^\/|\/$/g, "");
  let path: string;
  if (locale === defaultLocale) {
    path = clean ? `/${clean}` : "/";
  } else {
    path = clean ? `/${locale}/${clean}` : `/${locale}`;
  }
  return withTrailingSlash(path);
}

export async function buildI18nMetadata({
  locale,
  pathSegment,
  namespace,
  titleOverride,
  descriptionOverride,
  keywordsExtra,
  ogImage = "/images/hero.webp",
  alternatesOverride,
  canonicalOverride,
}: BuildMetadataOptions): Promise<Metadata> {
  const SITE_URL = getSiteUrl();
  const SITE_NAME = "The Grid Agency";
  const metaT = await getTranslations({ locale, namespace: "meta" });
  const normalized = normalizePath(pathSegment);

  const title =
    titleOverride ??
    (namespace === "home"
      ? metaT("home.title")
      : (metaT(`${namespace}.title` as const) as string));

  const description =
    descriptionOverride ??
    (namespace === "home"
      ? metaT("home.description")
      : (metaT(`${namespace}.description` as const) as string));

  const ogImageAlt = metaT("ogImageAlt");
  const keywords = Array.from(
    new Set(
      [
        ...metaT("keywords").split(",").map((s) => s.trim()),
        ...(keywordsExtra ?? []).map((s) => s.trim()),
      ].filter(Boolean),
    ),
  );

  let languageAlternates: Record<string, string>;
  if (alternatesOverride && Object.keys(alternatesOverride).length > 0) {
    languageAlternates = { ...alternatesOverride };
    if (!languageAlternates["x-default"]) {
      languageAlternates["x-default"] = `${SITE_URL}${buildLocalizedPath(defaultLocale, normalized)}`;
    }
  } else {
    languageAlternates = {
      "x-default": `${SITE_URL}${buildLocalizedPath(defaultLocale, normalized)}`,
    };
    for (const l of locales) {
      languageAlternates[l] = `${SITE_URL}${buildLocalizedPath(l, normalized)}`;
    }
  }

  const canonicalPath = buildLocalizedPath(locale, normalized);
  const canonicalAbsolute = canonicalOverride ?? `${SITE_URL}${canonicalPath}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalAbsolute,
      languages: languageAlternates,
    },
    openGraph: {
      type: "website",
      locale: openGraphLocale[locale],
      alternateLocale: (Object.values(openGraphLocale) as string[]).filter(
        (l) => l !== openGraphLocale[locale],
      ),
      url: canonicalAbsolute,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
