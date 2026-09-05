import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 2592000,
    deviceSizes: [480, 640, 750, 828, 1080, 1200],
    imageSizes: [32, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
