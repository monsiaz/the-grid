import { getSiteUrl } from "@/lib/siteUrl";
import { locales } from "@/i18n/config";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const siteUrl = getSiteUrl();
  const now = new Date().toISOString();

  const sitemaps = locales
    .map(
      (locale) => `  <sitemap>
    <loc>${siteUrl}/sitemap/${locale}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
