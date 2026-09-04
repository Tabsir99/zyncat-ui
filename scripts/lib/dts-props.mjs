import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from './entries.mjs';

export function typesFileBySubpath() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const map = new Map();
  for (const [key, value] of Object.entries(pkg.exports))
    if (value && typeof value === 'object' && typeof value.types === 'string')
      map.set(key.replace(/^\.\//, ''), join(ROOT, value.types));
  return map;
}

export const NATIVE_PROP_RE = /^(on[A-Z]\w*|id|className|style|key|ref|role|type|children)$/;
