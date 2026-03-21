import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "localhost" },
      { hostname: "placehold.co" },
    ],
  },
  typedRoutes: true,
};

export default nextConfig;
