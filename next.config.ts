import type { NextConfig } from "next";
import config from "@/config/api";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: config.endpoints.ocr,
        destination: `${config.baseUrl}${config.endpoints.ocr}`,
      },
    ];
  },
};

export default nextConfig;
