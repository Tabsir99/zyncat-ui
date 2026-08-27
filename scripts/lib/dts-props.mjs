import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

import { ROOT } from './entries.mjs';

export function typesFileBySubpath() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const map = new Map();
  for (const [key, value] of Object.entries(pkg.exports))
    if (value && typeof value === 'object' && typeof value.types === 'string')
      map.set(key.replace(/^\.\//, ''), join(ROOT, value.types));
  return map;
}

const isLibrarySymbol = (symbol) => {
  const declaration = symbol.declarations?.[0];
  return Boolean(declaration) && !declaration.getSourceFile().fileName.includes('node_modules');
};

const isComponentExport = (name) => /^[A-Z]/.test(name);

export const NATIVE_PROP_RE = /^(on[A-Z]\w*|id|className|style|key|ref|role|type|children)$/;

export const componentSpecific = (names) => [...names].filter((name) => !NATIVE_PROP_RE.test(name)).sort();

export function publicPropsBySubpath(subpaths) {
  const typesFile = typesFileBySubpath();
  const files = subpaths.map((subpath) => typesFile.get(subpath)).filter((f) => f && existsSync(f));
  const program = ts.createProgram(files, { noEmit: true, skipLibCheck: true, strict: true, jsx: ts.JsxEmit.ReactJSX });
  const checker = program.getTypeChecker();

  const found = new Map();
  for (const subpath of subpaths) {
    const file = typesFile.get(subpath);
    if (!file || !existsSync(file)) continue;
    const sourceFile = program.getSourceFile(file);
    const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) continue;

    const names = new Set();
    for (const exported of checker.getExportsOfModule(moduleSymbol)) {
      if (!isComponentExport(exported.getName()) || !exported.declarations?.length) continue;
      const type = checker.getTypeOfSymbolAtLocation(exported, exported.declarations[0]);
      for (const signature of type.getCallSignatures()) {
        const parameter = signature.getParameters()[0];
        if (!parameter?.declarations?.length) continue;
        const propsType = checker.getTypeOfSymbolAtLocation(parameter, parameter.declarations[0]);
        for (const prop of checker.getPropertiesOfType(propsType).filter(isLibrarySymbol)) names.add(prop.getName());
      }
    }
    found.set(subpath, names);
  }
  return found;
}
