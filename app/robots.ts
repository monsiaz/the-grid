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
    // The index already references every per-locale sitemap; listing each
    // locale individually would create duplicate EN entries in robots.txt.
    sitemap: [`${siteUrl}/sitemap-index.xml`],
    host: siteUrl,
  };
}
