import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Em produção usa variáveis de ambiente, em dev usa Docker
    const mfeLoginUrl = process.env.MFE_LOGIN_URL || "http://mfe-login:3000";
    const mfeRegisterUrl = process.env.MFE_REGISTER_URL || "http://mfe-register:3000";
    
    return [
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