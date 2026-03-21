import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "placehold.co"],
    unoptimized: true,
  },
};

export default nextConfig;
