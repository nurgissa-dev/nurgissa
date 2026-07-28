import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let basePath = "";

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "nurgissa";
  basePath = `/${repo}`;
}

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
