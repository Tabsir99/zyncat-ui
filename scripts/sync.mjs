import { lane, report, script, tool } from './lib/run.mjs';

const startedAt = Date.now();

const results = await lane([
  script('sync:exports', 'sync-exports.mjs', '--write'),
  script('sync:tsconfig', 'sync-tsconfig.mjs'),
  script('docs:gen', 'gen-docs.mjs'),
  tool('build:js', 'tsup'),
  tool('build:types', 'tsc', '-p', 'tsconfig.build.json', '--emitDeclarationOnly'),
  script('docs:props', 'gen-props.mjs'),
  script('sync:llms', 'check-llms.mjs', '--write'),
]);

const failures = report(results, (Date.now() - startedAt) / 1000);
process.exit(failures ? 1 : 0);
