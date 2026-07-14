// @ts-check
import { readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Next.js plugin that configures Turbopack to resolve premium-ds
 * component imports to TypeScript source, enabling live HMR without
 * a build step.
 *
 * Sets `turbopack.root` to the common ancestor of the consuming project
 * and the premium-ds package so Turbopack's filesystem scope includes
 * the source tree (which may live outside the project when linked).
 *
 * @param {import('next').NextConfig} nextConfig
 * @returns {import('next').NextConfig}
 */
export function withPremiumDS(nextConfig = {}) {
  const pkgDir = dirname(fileURLToPath(import.meta.url));
  const pkg = JSON.parse(
    readFileSync(resolve(pkgDir, "package.json"), "utf-8"),
  );

  const projectDir = process.cwd();
  const root = commonAncestor(projectDir, pkgDir);

  /** @type {Record<string, string>} */
  const aliases = {};

  for (const [subpath, conditions] of Object.entries(pkg.exports)) {
    if (
      typeof conditions === "object" &&
      conditions !== null &&
      "source" in conditions
    ) {
      const bare = subpath.slice(2);
      const abs = resolve(pkgDir, conditions.source);
      aliases[`premium-ds/${bare}`] = `./${relative(root, abs)}`;
    }
  }

  return {
    ...nextConfig,
    transpilePackages: Array.from(
      new Set([...(nextConfig.transpilePackages ?? []), "premium-ds"]),
    ),
    turbopack: {
      ...nextConfig.turbopack,
      root,
      resolveAlias: {
        ...nextConfig.turbopack?.resolveAlias,
        ...aliases,
      },
    },
  };
}

/**
 * Returns the deepest directory that is an ancestor of both paths.
 * @param {string} a
 * @param {string} b
 * @returns {string}
 */
function commonAncestor(a, b) {
  const aParts = a.split("/");
  const bParts = b.split("/");
  const common = [];
  for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    if (aParts[i] === bParts[i]) common.push(aParts[i]);
    else break;
  }
  return common.join("/") || "/";
}
