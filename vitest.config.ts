import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';

const BROWSER_INCLUDE = ['src/**/*.browser.test.{ts,tsx}', 'tests/**/*.browser.test.{ts,tsx}'];
const NODE_INCLUDE = ['src/**/*.unit.test.{ts,tsx}', 'tests/**/*.unit.test.{ts,tsx}'];

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

function publishedSubpathAliases() {
  const pkg = JSON.parse(readFileSync(r('./package.json'), 'utf8'));
  return Object.entries(pkg.exports as Record<string, unknown>).flatMap(([subpath, target]) => {
    const source = typeof target === 'string' ? target : (target as { source?: string })?.source;
    if (!source) return [];
    return [{ find: `@zyncat/ui${subpath.slice(1)}`, replacement: r(source) }];
  });
}

export default defineConfig({
  plugins: [react()],
  resolve: { alias: publishedSubpathAliases() },
  test: {
    projects: [
      { extends: true, test: { name: 'unit', environment: 'node', include: NODE_INCLUDE } },
      {
        extends: true,
        test: {
          name: 'browser',
          include: BROWSER_INCLUDE,
          setupFiles: ['./tests/setup.browser.ts'],
          testTimeout: 15_000,
          hookTimeout: 15_000,
          fileParallelism: false,
          maxWorkers: 1,
          browser: {
            enabled: true,
            headless: true,
            screenshotFailures: false,
            provider: playwright({
              launchOptions: { args: ['--disable-dev-shm-usage', '--disable-gpu', '--no-first-run'] },
            }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
