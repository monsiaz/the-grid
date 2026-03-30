import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

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

export default withPayload(nextConfig);
