import type { NextConfig } from 'next';

/**
 * Next.js plugin that configures Turbopack to resolve @zyncat/ui
 * imports to TypeScript source, enabling live HMR without a build step.
 */
export declare function withZyncatUI(nextConfig?: NextConfig): NextConfig;
