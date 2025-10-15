import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  
  async rewrites() {
    const mfeLoginUrl = process.env.MFE_LOGIN_URL || "http://mfe-login:3000";
    const mfeRegisterUrl = process.env.MFE_REGISTER_URL || "http://mfe-register:3000";
    const mfeHomeUrl = process.env.MFE_HOME_URL || "http://mfe-home:3000";
    
    return [
      {
        source: "/home",
        destination: `${mfeHomeUrl}/home`,
      },
      {
        source: "/home/:path*",
        destination: `${mfeHomeUrl}/home/:path*`,
      },
      {
        source: "/login",
        destination: `${mfeLoginUrl}/login`,
      },
      {
        source: "/login/:path*",
        destination: `${mfeLoginUrl}/login/:path*`,
      },
      {
        source: "/register",
        destination: `${mfeRegisterUrl}/register`,
      },
      {
        source: "/register/:path*",
        destination: `${mfeRegisterUrl}/register/:path*`,
      },
    ];
  },
};


export default nextConfig;