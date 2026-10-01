import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a self-contained server in .next/standalone (only the files and
  // node_modules it actually needs) — this is what the Dockerfile ships.
  // Vercel ignores it, so deploying there is unaffected.
  output: "standalone",
};

export default nextConfig;
