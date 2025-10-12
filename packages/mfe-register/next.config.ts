import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/register",
  
  // Habilita webpack polling para hot reload no Docker
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
