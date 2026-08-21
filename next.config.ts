import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Shared hosting (e.g. cPanel/CloudLinux) reports the host's full CPU
    // count to the container, but caps actual concurrent processes far
    // lower — spawning a worker per reported CPU exhausts that limit and
    // crashes the build with EAGAIN. Cap the build worker pool instead.
    cpus: 1,
  },
};

export default nextConfig;
