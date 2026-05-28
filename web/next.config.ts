import type { NextConfig } from "next";

/** GitHub Pages project site: https://organizacionuade.github.io/FoodSense/ */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/FoodSense" : "";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
