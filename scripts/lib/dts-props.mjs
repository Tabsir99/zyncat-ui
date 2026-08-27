import { existsSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

import { ROOT } from './entries.mjs';

const DIST = join(ROOT, 'dist');

const isLibrarySymbol = (symbol) => {
  const declaration = symbol.declarations?.[0];
  return Boolean(declaration) && !declaration.getSourceFile().fileName.includes('node_modules');
};

const isComponentExport = (name) => /^[A-Z]/.test(name);

export const NATIVE_PROP_RE = /^(on[A-Z]\w*|id|className|style|key|ref|role|type|children)$/;

export const componentSpecific = (names) => [...names].filter((name) => !NATIVE_PROP_RE.test(name)).sort();

export function publicPropsBySubpath(subpaths) {
  const files = subpaths.map((subpath) => join(DIST, `${subpath}.d.ts`)).filter(existsSync);
  const program = ts.createProgram(files, { noEmit: true, skipLibCheck: true, strict: true, jsx: ts.JsxEmit.ReactJSX });
  const checker = program.getTypeChecker();

  const found = new Map();
  for (const subpath of subpaths) {
    const file = join(DIST, `${subpath}.d.ts`);
    if (!existsSync(file)) continue;
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
