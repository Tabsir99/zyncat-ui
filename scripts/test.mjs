#!/usr/bin/env node
import { spawn } from 'node:child_process';

const LOCK_PATH = '/tmp/zyncat-ui-browser-test.lock';
const LOCK_WAIT_SECONDS = 2400;

const argv = process.argv.slice(2);
const passthrough = [];
let project = null;

for (const arg of argv) {
  if (arg === '--unit') project = 'unit';
  else if (arg === '--browser') project = 'browser';
  else passthrough.push(arg);
}

if (!project) {
  const paths = passthrough.filter((a) => !a.startsWith('-'));
  if (paths.length) {
    if (paths.every((p) => p.includes('.unit.test'))) project = 'unit';
    else if (paths.every((p) => p.includes('.browser.test'))) project = 'browser';
  }
}

const vitest = ['exec', 'vitest', 'run', ...(project ? ['--project', project] : []), ...passthrough];
const serialize = project !== 'unit';

if (serialize) {
  process.stderr.write(
    `[test] browser runs are serialized machine-wide; waiting for ${LOCK_PATH} if another run holds it\n`,
  );
}

const command = serialize
  ? { file: 'flock', args: ['-w', String(LOCK_WAIT_SECONDS), LOCK_PATH, 'pnpm', ...vitest] }
  : { file: 'pnpm', args: vitest };

const child = spawn(command.file, command.args, { stdio: 'inherit' });

child.on('exit', (code, signal) => {
  if (code === 1 && serialize) process.exitCode = 1;
  else if (signal) process.exitCode = 1;
  else process.exitCode = code ?? 1;
});

child.on('error', (error) => {
  process.stderr.write(`[test] failed to start ${command.file}: ${error.message}\n`);
  process.exitCode = 1;
});
