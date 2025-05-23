import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/surveyor-kpi",
  assetPrefix: "/surveyor-kpi"
};

export default nextConfig;
