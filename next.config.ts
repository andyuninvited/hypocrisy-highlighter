import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  outputFileTracingIncludes: { "/api/card/[slug]": ["./assets/fonts/**"] },
};

export default nextConfig;
