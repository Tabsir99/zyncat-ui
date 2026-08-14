import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { describe, expect, test } from 'vitest';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

interface ExportTarget {
  source?: string;
  types?: string;
  import?: string;
}

const pkg = JSON.parse(readFileSync(r('../package.json'), 'utf8')) as {
  exports: Record<string, string | ExportTarget>;
};

const subpaths = Object.entries(pkg.exports).filter(
  ([subpath]) => subpath !== './package.json' && subpath !== './next',
);

describe('published subpaths', () => {
  test.each(subpaths)('%s resolves to a source file that exists', (_subpath, target) => {
    const source = typeof target === 'string' ? target : target.source;
    expect(source, 'no source declared').toBeDefined();
    expect(existsSync(r('../' + source!)), `missing ${source}`).toBe(true);
  });

  test.each(subpaths.filter(([, t]) => typeof t !== 'string'))(
    '%s declares both types and an import entry',
    (_subpath, target) => {
      const entry = target as ExportTarget;
      expect(entry.types).toMatch(/^\.\/dist\/.+\.d\.ts$/);
      expect(entry.import).toMatch(/^\.\/dist\/.+\.js$/);
    },
  );
});
