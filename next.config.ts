import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ac.goit.global",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
