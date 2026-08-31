import { lane, report, script, tool } from './lib/run.mjs';

const startedAt = Date.now();

const independent = [
  lane([script('check:exports', 'sync-exports.mjs')]),
  lane([script('check:tsconfig', 'sync-tsconfig.mjs', '--check')]),
  lane([tool('typecheck:node', 'tsc', '-p', 'tsconfig.node.json')]),
  lane([tool('format:check', 'prettier', '--check', '--cache', '.')]),
  lane([script('check:css', 'check-css-graph.mjs')]),
  lane([script('check:authoring', 'check-authoring.mjs')]),
  lane([script('check:contracts', 'check-contracts.mjs')]),
  lane([tool('build:js', 'tsup'), tool('build:types', 'tsc', '-p', 'tsconfig.build.json', '--emitDeclarationOnly')]),
];

const first = (await Promise.all(independent)).flat();
const buildBroken = first.some((result) => result.label.startsWith('build:') && result.code);

const distDependent = buildBroken
  ? []
  : [lane([script('check:llms', 'check-llms.mjs')]), lane([script('check:props', 'gen-props.mjs', '--check')])];

const second = (await Promise.all(distDependent)).flat();

const failures = report([...first, ...second], (Date.now() - startedAt) / 1000);
if (buildBroken) console.error('  check:llms and check:props skipped - the build failed.');
process.exit(failures ? 1 : 0);
