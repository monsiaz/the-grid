import type { NextConfig } from "next";

const cdnBase = "https://cdn.orbs.cloud/the-grid";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
