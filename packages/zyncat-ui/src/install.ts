import { spawn } from 'node:child_process';

import type { PackageManager } from './detect';

export type InstallStage = 'resolving' | 'fetching' | 'linking';

export interface InstallProgress {
  stage: InstallStage;
  resolved: number;
  satisfied: number;
  fetchingId: string | null;
  fetchingSize: number;
  fetchingDone: number;
}

export interface InstallResult {
  added: number;
  roots: { name: string; version: string }[];
  ms: number;
}

export interface InstallFailure {
  code: number;
  detail: string[];
}

interface Handle {
  done: Promise<InstallResult>;
  cancel: () => void;
}

const PM_ADD: Record<PackageManager, string[]> = {
  pnpm: ['add'],
  npm: ['install', '--no-fund', '--no-audit'],
  yarn: ['add'],
  bun: ['add'],
};

const PM_RESTORE: Record<PackageManager, string[]> = {
  pnpm: ['install'],
  npm: ['install', '--no-fund', '--no-audit'],
  yarn: ['install'],
  bun: ['install'],
};

export function runInstall(
  pm: PackageManager,
  specs: string[],
  cwd: string,
  onProgress: (progress: InstallProgress) => void,
): Handle {
  const base = specs.length ? PM_ADD[pm] : PM_RESTORE[pm];
  const args = [...base, ...specs];
  if (pm === 'pnpm') args.push('--reporter=ndjson');

  const startedAt = performance.now();
  const child = spawn(pm, args, { cwd, shell: process.platform === 'win32', stdio: ['ignore', 'pipe', 'pipe'] });

  const progress: InstallProgress = {
    stage: 'resolving',
    resolved: 0,
    satisfied: 0,
    fetchingId: null,
    fetchingSize: 0,
    fetchingDone: 0,
  };
  let added = 0;
  const roots: InstallResult['roots'] = [];
  const errors: string[] = [];
  const tail: string[] = [];
  let cancelled = false;

  const keepTail = (chunk: string) => {
    for (const line of chunk.split('\n')) if (line.trim()) tail.push(line);
    if (tail.length > 20) tail.splice(0, tail.length - 20);
  };

  const onEvent = (event: Record<string, unknown>) => {
    const name = event.name;
    if (name === 'pnpm:progress') {
      const status = event.status;
      if (status === 'resolved') progress.resolved++;
      if (status === 'fetched' || status === 'found_in_store' || status === 'found_in_local_dir') {
        progress.satisfied++;
        if (event.packageId === progress.fetchingId) progress.fetchingId = null;
        if (progress.stage === 'resolving') progress.stage = 'fetching';
      }
    } else if (name === 'pnpm:fetching-progress') {
      if (event.status === 'started') {
        progress.fetchingId = String(event.packageId ?? '');
        progress.fetchingSize = Number(event.size ?? 0);
        progress.fetchingDone = 0;
      } else if (event.status === 'in_progress' && event.packageId === progress.fetchingId) {
        progress.fetchingDone = Number(event.downloaded ?? 0);
      }
    } else if (name === 'pnpm:stage') {
      if (event.stage === 'importing_started') progress.stage = 'linking';
    } else if (name === 'pnpm:stats') {
      if (typeof event.added === 'number') added += event.added;
    } else if (name === 'pnpm:root') {
      const info = event.added as { name?: string; version?: string } | undefined;
      if (info?.name && info.version) roots.push({ name: info.name, version: info.version });
    } else if (event.level === 'error') {
      const err = event.err as { message?: string } | undefined;
      errors.push(String(err?.message ?? event.message ?? JSON.stringify(event)));
    }
  };

  let buffer = '';
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (chunk: string) => {
    if (pm !== 'pnpm') {
      keepTail(chunk);
      return;
    }
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('{')) continue;
      try {
        onEvent(JSON.parse(line));
      } catch {}
    }
    onProgress(progress);
  });
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', keepTail);

  const done = new Promise<InstallResult>((resolve, reject) => {
    child.on('error', (error) => reject({ code: 1, detail: [error.message] } satisfies InstallFailure));
    child.on('close', (code) => {
      if (cancelled) return;
      if (code === 0) resolve({ added, roots, ms: performance.now() - startedAt });
      else reject({ code: code ?? 1, detail: errors.length ? errors : tail } satisfies InstallFailure);
    });
  });

  return {
    done,
    cancel: () => {
      cancelled = true;
      child.kill('SIGTERM');
    },
  };
}
