// Demo data for the landing page's live fragments. Deliberately shaped like a
// real ops surface (deploys, latency) so the components are shown doing the
// job the library is pitched for.

export type DeployStatus = 'live' | 'building' | 'failed' | 'queued';
export type DeployEnv = 'production' | 'preview';

export interface Deploy {
  id: string;
  service: string;
  status: DeployStatus;
  env: DeployEnv;
  owner: string;
  duration: string;
  durationS: number;
  when: string;
  whenTs: number;
}

export const DEPLOYS: Deploy[] = [
  {
    id: 'd1',
    service: 'web-dashboard',
    status: 'live',
    env: 'production',
    owner: 'Ana Ng',
    duration: '1m 42s',
    durationS: 102,
    when: '2m ago',
    whenTs: 2,
  },
  {
    id: 'd2',
    service: 'api-gateway',
    status: 'building',
    env: 'production',
    owner: 'Bo Park',
    duration: '48s',
    durationS: 48,
    when: 'now',
    whenTs: 0,
  },
  {
    id: 'd3',
    service: 'billing-worker',
    status: 'live',
    env: 'production',
    owner: 'Cira Diaz',
    duration: '2m 05s',
    durationS: 125,
    when: '14m ago',
    whenTs: 14,
  },
  {
    id: 'd4',
    service: 'auth-service',
    status: 'failed',
    env: 'preview',
    owner: 'Dee Okafor',
    duration: '31s',
    durationS: 31,
    when: '26m ago',
    whenTs: 26,
  },
  {
    id: 'd5',
    service: 'search-indexer',
    status: 'live',
    env: 'production',
    owner: 'Eli Stone',
    duration: '3m 10s',
    durationS: 190,
    when: '1h ago',
    whenTs: 60,
  },
  {
    id: 'd6',
    service: 'email-relay',
    status: 'queued',
    env: 'preview',
    owner: 'Fang Wu',
    duration: '—',
    durationS: 0,
    when: '2h ago',
    whenTs: 120,
  },
];

export interface BenchRow {
  id: string;
  rank: number;
  service: string;
  p99: number;
}

export const BENCH_BASE: BenchRow[] = [
  { id: 'b1', rank: 1, service: 'auth-service', p99: 38 },
  { id: 'b2', rank: 2, service: 'api-gateway', p99: 61 },
  { id: 'b3', rank: 3, service: 'billing-worker', p99: 87 },
  { id: 'b4', rank: 4, service: 'search-indexer', p99: 132 },
];
