import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        // Railway backend — allows any subdomain of railway.app
        protocol: "https",
        hostname: "*.up.railway.app",
      },
    ],
  },
};

export default nextConfig;
