import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from "next-intl/plugin";

const cdnBase = "https://cdn.orbs.cloud/the-grid";
const cdnHost = "cdn.orbs.cloud";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /** `true` breaks Payload admin deep links (e.g. `/admin/globals/homepage/`) — segment count / routing. */
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "country-flag-icons",
      "framer-motion",
    ],
    // Fewer Turbopack workers keeps peak RAM and Neon concurrency lower during `next build`.
    cpus: 2,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/images/:path*",
          destination: `${cdnBase}/:path*`,
        },
      ],
    };
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [50, 60, 65, 70, 75, 80, 85, 90, 92, 95, 100],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    remotePatterns: [
      {
        protocol: "https",
        hostname: cdnHost,
        pathname: "/the-grid/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(withPayload(nextConfig));
