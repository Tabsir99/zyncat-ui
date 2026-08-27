import { withZyncatUI } from '../../next.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: false,
  images: { unoptimized: true },
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

export default withZyncatUI(nextConfig);
