import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cancel, confirm, intro, isCancel, log, outro, select, spinner } from '@clack/prompts';

import {
  detectPm,
  findAppEntry,
  findOwnRoot,
  installedVersion,
  isOlder,
  majorOf,
  PACKAGE_MANAGERS,
  pmVersion,
  readJson,
  type PackageJson,
  type PackageManager,
} from './detect';
import { runInstall, type InstallFailure, type InstallProgress } from './install';
import { accentDeep, bold, dim, red } from './palette';
import {
  arrow,
  bar,
  check,
  kilobytes,
  row,
  seconds,
  shimmer,
  skip,
  SPINNER_DELAY,
  SPINNER_FRAMES,
  styleFrame,
  wordmark,
} from './ui';

export interface InitFlags {
  yes: boolean;
  pm?: PackageManager;
}

const PACKAGE = '@zyncat/ui';
const MCP_SERVER_ENTRY = { command: 'node', args: ['./node_modules/@zyncat/ui/dist/mcp.js'] };
const STYLES_IMPORT = "import '@zyncat/ui/styles.css';";
const DOCS_URL = 'https://ui.zyncat.app';

const interactive = () => Boolean(process.stdout.isTTY && process.stdin.isTTY);

let installTouchedProject = false;

function bail(message: string, hint?: string): never {
  log.error(message);
  if (hint) log.message(dim(hint), { spacing: 0 });
  outro(
    red(installTouchedProject ? 'Stopped here - the install ran, nothing else was wired.' : 'Nothing was changed.'),
  );
  process.exit(1);
}

async function pickPm(cwd: string, targetPkg: PackageJson, flags: InitFlags): Promise<PackageManager> {
  if (flags.pm) return flags.pm;
  const detected = detectPm(cwd, targetPkg);
  if (detected) return detected;
  if (!interactive() || flags.yes) return 'npm';
  const choice = await select<PackageManager>({
    message: 'No lockfile found - which package manager runs this project?',
    options: PACKAGE_MANAGERS.map((pm) => ({ value: pm, label: pm })),
  });
  if (isCancel(choice)) {
    cancel('Cancelled - nothing was changed.');
    process.exit(130);
  }
  return choice;
}

const ADD_COMMAND: Record<PackageManager, string> = {
  pnpm: 'pnpm add',
  npm: 'npm install',
  yarn: 'yarn add',
  bun: 'bun add',
};

interface Plan {
  specs: string[];
  restore: boolean;
  reactNote: string | null;
}

interface Wired {
  line: string;
  done: boolean;
  hint?: string;
}

async function planInstall(cwd: string, targetPkg: PackageJson, flags: InitFlags, version: string): Promise<Plan> {
  const deps = { ...targetPkg.dependencies, ...targetPkg.devDependencies };
  const specs: string[] = [];
  let reactNote: string | null = null;

  const hasPackage = PACKAGE in deps;
  const onDisk = installedVersion(cwd, PACKAGE);
  const outdated = onDisk !== null && isOlder(onDisk, version);
  if (!hasPackage || outdated) specs.push(outdated ? `${PACKAGE}@^${version}` : PACKAGE);

  if (!('react' in deps)) {
    specs.push('react', 'react-dom');
  } else {
    const major = majorOf(deps.react) ?? majorOf(installedVersion(cwd, 'react') ?? undefined);
    if (major !== null && major < 19) {
      let upgrade = flags.yes;
      if (!flags.yes && interactive()) {
        const answer = await confirm({
          message: `React ${major} is installed, and ${PACKAGE} needs React 19. Upgrade react and react-dom?`,
        });
        if (isCancel(answer)) {
          cancel('Cancelled - nothing was changed.');
          process.exit(130);
        }
        upgrade = answer;
      }
      if (upgrade) specs.push('react@^19', 'react-dom@^19');
      else reactNote = `React ${major} stays as it is - ${PACKAGE} requires React 19, so upgrade before shipping.`;
    }
  }

  return { specs, restore: hasPackage && onDisk === null, reactNote };
}

function renderProgress(pm: PackageManager, progress: InstallProgress | null, tick: number): string {
  if (pm !== 'pnpm') return shimmer(`Installing with ${pm}`, tick);
  if (!progress || progress.stage === 'resolving') {
    const found = progress?.resolved ? dim(` ${progress.resolved} found`) : '';
    return `${shimmer('Resolving dependencies', tick)}${found}`;
  }
  if (progress.stage === 'linking') return `${shimmer('Linking packages', tick)} ${bar(1)}`;
  const ratio = progress.resolved ? progress.satisfied / progress.resolved : 0;
  const counts = dim(`${progress.satisfied}/${progress.resolved}`);
  let current = '';
  if (progress.fetchingId && progress.fetchingSize) {
    const name = progress.fetchingId.split('@').slice(0, -1).join('@') || progress.fetchingId;
    const bytes = progress.fetchingDone
      ? `${kilobytes(progress.fetchingDone)} / ${kilobytes(progress.fetchingSize)}`
      : kilobytes(progress.fetchingSize);
    current = dim(` · ${name} ${bytes}`);
  }
  return `${shimmer('Fetching packages', tick)} ${bar(ratio)} ${counts}${current}`;
}

async function installPhase(pm: PackageManager, plan: Plan, cwd: string): Promise<{ line: string } | null> {
  if (!plan.specs.length && !plan.restore) {
    const version = installedVersion(cwd, PACKAGE);
    log.message(`${bold(PACKAGE)} ${dim(`${version} already installed`)}`, { symbol: check });
    return null;
  }

  const live = interactive();
  const spin = spinner({ indicator: 'timer', frames: SPINNER_FRAMES, delay: SPINNER_DELAY, styleFrame });
  let progress: InstallProgress | null = null;
  let tick = 0;

  const handle = runInstall(pm, plan.restore ? [] : plan.specs, cwd, (latest) => {
    progress = latest;
  });

  let interval: ReturnType<typeof setInterval> | undefined;
  if (live) {
    spin.start(renderProgress(pm, progress, tick));
    interval = setInterval(() => {
      tick++;
      spin.message(renderProgress(pm, progress, tick));
    }, SPINNER_DELAY);
  } else {
    log.message(
      dim(plan.restore ? `Restoring node_modules with ${pm}` : `Installing ${plan.specs.join(' ')} with ${pm}`),
    );
  }

  const finish = () => {
    if (interval) clearInterval(interval);
    if (live) spin.clear();
  };

  const cancelInstall = () => {
    handle.cancel();
    finish();
    cancel('Cancelled - the install was stopped before it finished.');
    process.exit(130);
  };
  if (live) process.once('SIGINT', cancelInstall);

  try {
    const result = await handle.done;
    if (live) process.removeListener('SIGINT', cancelInstall);
    finish();
    const version = result.roots.find((entry) => entry.name === PACKAGE)?.version ?? installedVersion(cwd, PACKAGE);
    const react = result.roots.find((entry) => entry.name === 'react');
    const parts = [
      `${bold(PACKAGE)} ${dim(version ?? '')}`.trimEnd(),
      result.added ? dim(`${result.added} package${result.added === 1 ? '' : 's'}`) : '',
      react ? dim(`react ${react.version}`) : '',
      dim(seconds(result.ms)),
    ].filter(Boolean);
    return { line: parts.join(dim(' · ')) };
  } catch (failure) {
    if (live) process.removeListener('SIGINT', cancelInstall);
    finish();
    const { detail } = failure as InstallFailure;
    log.error(`${pm} could not finish the install.`);
    for (const line of detail.slice(-12)) log.message(dim(line), { spacing: 0 });
    outro(red('Fix the install error above, then re-run init.'));
    process.exit(1);
  }
}

async function alignVersion(pm: PackageManager, cwd: string, version: string): Promise<void> {
  const onDisk = installedVersion(cwd, PACKAGE);
  if (!onDisk || !isOlder(onDisk, version)) return;
  log.warn(
    `${PACKAGE} ${onDisk} resolved from this project's range, older than the CLI (${version}) - upgrading so the skill and MCP server match.`,
  );
  const upgraded = await installPhase(pm, { specs: [`${PACKAGE}@^${version}`], restore: false, reactNote: null }, cwd);
  if (upgraded) log.message(upgraded.line, { symbol: check });
}

function sourceRoot(cwd: string, ownRoot: string): string {
  const installed = join(cwd, 'node_modules', PACKAGE);
  if (existsSync(join(installed, 'skills'))) return installed;
  return ownRoot;
}

function wireSkill(cwd: string, packageRoot: string, pm: PackageManager): Wired {
  const source = join(packageRoot, 'skills');
  if (!existsSync(source)) {
    const onDisk = installedVersion(cwd, PACKAGE);
    return {
      line: row('Agent skill', `skipped · ${PACKAGE}${onDisk ? ` ${onDisk}` : ''} ships no skills/`),
      done: false,
      hint: `Upgrade it with ${ADD_COMMAND[pm]} ${PACKAGE}@latest, then re-run init.`,
    };
  }
  const dest = join(cwd, '.claude/skills');
  const existed = existsSync(join(dest, 'zyncat-ui'));
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(source))
    cpSync(join(source, name), join(dest, name), { recursive: true, force: true });
  return { line: row('Agent skill', `.claude/skills/zyncat-ui · ${existed ? 'refreshed' : 'installed'}`), done: true };
}

function wireMcp(cwd: string): Wired {
  const path = join(cwd, '.mcp.json');
  let config: { mcpServers?: Record<string, unknown> } = {};
  if (existsSync(path)) {
    const parsed = readJson(path);
    if (!parsed) bail(`.mcp.json exists but is not valid JSON - fix it, then re-run init.`);
    config = parsed as typeof config;
  }
  const existed = JSON.stringify(config.mcpServers?.['zyncat-ui']) === JSON.stringify(MCP_SERVER_ENTRY);
  config.mcpServers = { ...config.mcpServers, 'zyncat-ui': MCP_SERVER_ENTRY };
  writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`);
  return { line: row('MCP server', existed ? '.mcp.json · kept' : `.mcp.json ${arrow} zyncat-ui`), done: true };
}

function wireStyles(cwd: string): Wired {
  const entry = findAppEntry(cwd);
  if (!entry)
    return {
      line: row('Stylesheet', 'no app entry found · add the import yourself'),
      done: false,
      hint: `Put ${STYLES_IMPORT} at your app root, above your own stylesheets.`,
    };
  const path = join(cwd, entry);
  const text = readFileSync(path, 'utf8');
  if (text.includes('@zyncat/ui/styles.css'))
    return { line: row('Stylesheet', `${entry} · already imported`), done: true };
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(eol);
  let at = 0;
  while (at < lines.length && (lines[at].trim() === '' || /^(['"])use [\w-]+\1;?$/.test(lines[at].trim()))) at++;
  lines.splice(at, 0, STYLES_IMPORT);
  writeFileSync(path, lines.join(eol));
  return { line: row('Stylesheet', `${entry} · import added`), done: true };
}

export async function init(flags: InitFlags): Promise<void> {
  const startedAt = performance.now();
  const { root: ownRoot, version } = findOwnRoot();
  const cwd = process.cwd();

  intro(wordmark(version));

  const targetPkgPath = join(cwd, 'package.json');
  const targetPkg = readJson(targetPkgPath);
  if (!targetPkg) {
    bail(
      'No package.json here - init sets up an existing React app.',
      `Create one first (pnpm create vite my-app, pnpm create next-app my-app), then run init inside it.`,
    );
  }
  if (targetPkg.name === PACKAGE || targetPkg.name === 'zyncat-ui') {
    bail('This is the zyncat-ui repository - init sets up a consumer project.');
  }

  const pm = await pickPm(cwd, targetPkg, flags);
  const pmVer = pmVersion(pm);
  const project = targetPkg.name ?? 'unnamed project';
  log.message(dim(`${project} · ${pm}${pmVer ? ` ${pmVer}` : ''}`));

  const plan = await planInstall(cwd, targetPkg, flags, version);
  const installed = await installPhase(pm, plan, cwd);
  installTouchedProject = true;
  if (installed) log.message(installed.line, { symbol: check });
  if (plan.reactNote) log.warn(plan.reactNote);
  await alignVersion(pm, cwd, version);

  const packageRoot = sourceRoot(cwd, ownRoot);
  const rows: Wired[] = [wireSkill(cwd, packageRoot, pm), wireMcp(cwd), wireStyles(cwd)];
  for (const [index, entry] of rows.entries()) {
    log.message(entry.line, { symbol: entry.done ? check : skip, spacing: index === 0 ? 1 : 0 });
    if (entry.hint) log.message(dim(entry.hint), { spacing: 0 });
  }

  log.message(`${dim('Docs')} ${arrow} ${accentDeep(DOCS_URL)}`);
  const skipped = rows.filter((entry) => !entry.done).length;
  const closing = skipped
    ? `${bold(`Done in ${seconds(performance.now() - startedAt)}.`)} ${skipped} step${skipped === 1 ? '' : 's'} left for you, above.`
    : `${bold(`Ready in ${seconds(performance.now() - startedAt)}.`)} Restart your agent session to load the skill.`;
  outro(closing);
}
