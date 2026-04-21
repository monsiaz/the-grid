import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/",
          "/_next/",
          "/_vercel/",
        ],
      },
      {
        userAgent: ["Googlebot", "Bingbot", "DuckDuckBot"],
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/"],
      },
      {
        userAgent: ["GPTBot", "CCBot", "ClaudeBot", "anthropic-ai", "PerplexityBot", "Google-Extended"],
        allow: "/",
      },
    ],
    sitemap: [
      `${siteUrl}/sitemap-index.xml`,
      ...["en", "fr", "es", "de", "it", "nl", "zh"].map(
        (l) => `${siteUrl}/sitemap/${l}.xml`,
      ),
    ],
    host: siteUrl,
  };
}
