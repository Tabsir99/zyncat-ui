import type { NextConfig } from "next";

/**
 * Next.js plugin that configures Turbopack to resolve premium-ds
 * imports to TypeScript source, enabling live HMR without a build step.
 */
export declare function withPremiumDS(nextConfig?: NextConfig): NextConfig;
