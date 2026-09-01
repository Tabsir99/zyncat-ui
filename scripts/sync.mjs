import { lane, report, script, tool } from './lib/run.mjs';

const startedAt = Date.now();

const results = await lane([
  script('sync:theme', 'gen-theme.mjs'),
  script('sync:exports', 'sync-exports.mjs', '--write'),
  script('sync:tsconfig', 'sync-tsconfig.mjs'),
  tool('build:js', 'tsup'),
  tool('build:types', 'tsc', '-p', 'tsconfig.build.json', '--emitDeclarationOnly'),
  script('docs:props', 'gen-props.mjs'),
  script('sync:skill', 'gen-skill.mjs'),
]);

const failures = report(results, (Date.now() - startedAt) / 1000);
process.exit(failures ? 1 : 0);
