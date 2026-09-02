import { findOwnRoot, PACKAGE_MANAGERS, type PackageManager } from './detect';
import { init, type InitFlags } from './init';
import { accentDeep, bold, dim } from './palette';
import { arrow, wordmark } from './ui';

function parseFlags(args: string[]): InitFlags | null {
  const flags: InitFlags = { yes: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--yes' || arg === '-y') flags.yes = true;
    else if (arg === '--pm' || arg.startsWith('--pm=')) {
      const value = arg.includes('=') ? arg.split('=')[1] : args[++i];
      if (!PACKAGE_MANAGERS.includes(value as PackageManager)) return null;
      flags.pm = value as PackageManager;
    } else return null;
  }
  return flags;
}

function help(version: string): string {
  const lines = [
    '',
    `  ${wordmark(version)}`,
    '',
    `  ${dim('Sets up @zyncat/ui in a React project: installs the package,')}`,
    `  ${dim('the agent skill, the MCP server, a typed theme and the stylesheet.')}`,
    '',
    `  ${bold('Usage')}`,
    `    zyncat-ui init ${dim('[flags]')}`,
    '',
    `  ${bold('Flags')}`,
    `    --yes, -y     ${dim('accept every default, never prompt')}`,
    `    --pm <name>   ${dim(`force the package manager (${PACKAGE_MANAGERS.join(', ')})`)}`,
    '',
    `  ${dim('Docs')} ${arrow} ${accentDeep('https://ui.zyncat.app')}`,
    '',
  ];
  return lines.join('\n');
}

const [command, ...rest] = process.argv.slice(2);
const { version } = findOwnRoot();

if (command === '--version' || command === '-v') {
  console.log(version);
} else if (command === 'init') {
  const flags = parseFlags(rest);
  if (!flags) {
    console.error(help(version));
    process.exit(1);
  }
  await init(flags);
} else {
  console.log(help(version));
  process.exit(command ? 1 : 0);
}
