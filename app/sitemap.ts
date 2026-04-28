import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { getPayloadClient } from "@/lib/payload";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { detectTranslatedLocales } from "@/lib/docTranslations";

/** Same rationale as `[locale]/layout`: don’t require a live DB during Vercel build. */
export const dynamic = "force-dynamic";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/drivers", changeFrequency: "weekly", priority: 0.9 },
  { path: "/news", changeFrequency: "daily", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
];

const NEWS_PROBE_FIELDS = ["title", "introParagraphs", "bodyParagraphs", "excerpt"];
const DRIVER_PROBE_FIELDS = [
  "name",
  "role",
  "detail.profileParagraphs",
  "detail.careerParagraphs",
  "detail.agencyParagraphs",
  "detail.profileTitle",
];

function parseDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

function buildLocalizedUrl(siteUrl: string, locale: Locale, routePath: string): string {
  const clean = routePath === "/" ? "" : routePath.replace(/^\/|\/$/g, "");
  if (locale === defaultLocale) {
    return clean ? `${siteUrl}/${clean}/` : `${siteUrl}/`;
  }
  return clean ? `${siteUrl}/${locale}/${clean}/` : `${siteUrl}/${locale}/`;
}

function buildAlternates(
  siteUrl: string,
  routePath: string,
  translatedLocales?: Locale[] | null,
): Record<string, string> {
  const allowed = new Set<Locale>(translatedLocales ?? locales);
  allowed.add(defaultLocale);
  const alternates: Record<string, string> = {
    "x-default": buildLocalizedUrl(siteUrl, defaultLocale, routePath),
  };
  for (const l of locales) {
    if (!allowed.has(l)) continue;
    alternates[l] = buildLocalizedUrl(siteUrl, l, routePath);
  }
  return alternates;
}

export async function generateSitemaps() {
  return locales.map((locale) => ({ id: locale }));
}

export default async function sitemap(props: {
  id: Promise<string> | string;
}): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const rawId = typeof props.id === "string" ? props.id : await props.id;
  const locale = (locales as readonly string[]).includes(rawId)
    ? (rawId as Locale)
    : defaultLocale;

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: buildLocalizedUrl(siteUrl, locale, route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: buildAlternates(siteUrl, route.path),
    },
  }));

  try {
    const payload = await getPayloadClient();

    const [drivers, news] = await Promise.all([
      payload.find({ collection: "drivers", limit: 200, depth: 0, locale }),
      payload.find({ collection: "news", limit: 500, depth: 0, sort: "-createdAt", locale }),
    ]);

    for (const doc of drivers.docs) {
      const slug = (doc as { slug?: string }).slug;
      if (!slug) continue;
      const path = `/drivers/${slug}`;
      const { translatedLocales } = await detectTranslatedLocales({
        payload,
        collection: "drivers",
        docId: (doc as { id: number }).id,
        probeFields: DRIVER_PROBE_FIELDS,
      });
      if (locale !== defaultLocale && !translatedLocales.includes(locale)) continue;
      entries.push({
        url: buildLocalizedUrl(siteUrl, locale, path),
        lastModified: parseDate((doc as { updatedAt?: string }).updatedAt),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: buildAlternates(siteUrl, path, translatedLocales),
        },
      });
    }

    for (const doc of news.docs) {
      const slug = (doc as { slug?: string }).slug;
      if (!slug) continue;
      const path = `/news/${slug}`;
      const { translatedLocales } = await detectTranslatedLocales({
        payload,
        collection: "news",
        docId: (doc as { id: number }).id,
        probeFields: NEWS_PROBE_FIELDS,
      });
      if (locale !== defaultLocale && !translatedLocales.includes(locale)) continue;
      entries.push({
        url: buildLocalizedUrl(siteUrl, locale, path),
        lastModified: parseDate((doc as { updatedAt?: string }).updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: buildAlternates(siteUrl, path, translatedLocales),
        },
      });
    }
  } catch (error) {
    console.error("[sitemap] failed to fetch dynamic routes:", error);
  }

  return entries;
}
