import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 4,
  },
  turbopack: {
    // Keep Turbopack's filesystem root pinned to this repository.
    // Next.js 16 docs describe `turbopack.root` as the supported escape hatch
    // when automatic lockfile-based root detection is ambiguous.
    root: process.cwd(),
  },
};

export default nextConfig;
