import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function findPackageRoot(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (;;) {
    const pj = join(dir, 'package.json');
    if (existsSync(pj)) {
      try {
        if (JSON.parse(readFileSync(pj, 'utf8')).name === '@zyncat/ui') return dir;
      } catch {}
    }
    const parent = dirname(dir);
    if (parent === dir) throw new Error('@zyncat/ui package root not found');
    dir = parent;
  }
}

const MCP_SERVER_ENTRY = { command: 'node', args: ['./node_modules/@zyncat/ui/dist/mcp.js'] };

const THEME_FILE = 'zyncat.theme.ts';

const THEME_STARTER = `import { defineTheme } from '@zyncat/ui/theme';

export const base = defineTheme({
  color: { accent: 'oklch(0.63 0.118 198)' },
});

export const dark = defineTheme({
  color: { bgApp: 'oklch(0.19 0.008 198)', textBody: 'oklch(0.92 0.004 198)' },
});
`;

function init(): void {
  const packageRoot = findPackageRoot();
  const version = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')).version;
  const target = process.cwd();

  const targetPkgPath = join(target, 'package.json');
  if (existsSync(targetPkgPath)) {
    try {
      if (JSON.parse(readFileSync(targetPkgPath, 'utf8')).name === '@zyncat/ui') {
        console.error('init sets up a consumer project; inside the zyncat-ui repository nothing needs installing.');
        process.exit(1);
      }
    } catch {}
  }

  const skillsSource = join(packageRoot, 'skills');
  if (!existsSync(skillsSource)) {
    console.error(
      `No skills/ directory in the installed @zyncat/ui - reinstall the package (found root: ${packageRoot}).`,
    );
    process.exit(1);
  }
  const skillsDest = join(target, '.claude/skills');
  mkdirSync(skillsDest, { recursive: true });
  const installed: string[] = [];
  for (const name of readdirSync(skillsSource)) {
    cpSync(join(skillsSource, name), join(skillsDest, name), { recursive: true, force: true });
    installed.push(name);
  }

  const mcpPath = join(target, '.mcp.json');
  let config: { mcpServers?: Record<string, unknown> } = {};
  if (existsSync(mcpPath)) {
    try {
      config = JSON.parse(readFileSync(mcpPath, 'utf8'));
    } catch {
      console.error(`${mcpPath} exists but is not valid JSON - fix it, then re-run init.`);
      process.exit(1);
    }
  }
  config.mcpServers = { ...config.mcpServers, 'zyncat-ui': MCP_SERVER_ENTRY };
  writeFileSync(mcpPath, `${JSON.stringify(config, null, 2)}\n`);

  const themePath = join(target, THEME_FILE);
  const themeExisted = existsSync(themePath);
  if (!themeExisted) writeFileSync(themePath, THEME_STARTER);

  console.log(`zyncat-ui init (v${version})`);
  console.log(
    `  skill${installed.length === 1 ? '' : 's'} installed: ${installed.map((s) => `.claude/skills/${s}`).join(', ')}`,
  );
  console.log('  MCP server registered: .mcp.json -> zyncat-ui');
  console.log(
    themeExisted
      ? `  Theme kept: ${THEME_FILE} already exists`
      : `  Theme scaffolded: ${THEME_FILE} - render <ZyncatTheme theme={{ base, dark }} /> at your app root`,
  );
  console.log('  Restart your agent session so it picks both up. Re-run after upgrading @zyncat/ui.');
}

const command = process.argv[2];
if (command === 'init') init();
else {
  console.log('Usage: zyncat-ui init');
  console.log('  Installs the zyncat-ui agent skill into ./.claude/skills, registers the MCP server in ./.mcp.json,');
  console.log(`  and scaffolds ./${THEME_FILE} if it is not there yet.`);
  process.exit(command ? 1 : 0);
}
