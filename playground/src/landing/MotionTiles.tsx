import { useState } from 'react';
import { Button } from 'premium-ds/button';
import { Table, type TableColumn } from 'premium-ds/table';
import { Tabs } from 'premium-ds/tabs';
import { toast } from 'premium-ds/toast';
import { Icon } from '../icon';
import { BENCH_BASE, type BenchRow } from './data';

export function GlideTile() {
  const [tab, setTab] = useState('overview');
  return (
    <div className="ld-tile" data-reveal>
      <div className="ld-tile__demo">
        <Tabs
          label="Glide demo"
          items={[
            { value: 'overview', label: 'Overview' },
            { value: 'activity', label: 'Activity', count: 12 },
            { value: 'members', label: 'Members', count: 8 },
            { value: 'billing', label: 'Billing' },
          ]}
          value={tab}
          onChange={(v) => setTab(v)}
        />
      </div>
      <div className="ld-tile__meta">
        <h3>Hover glides. Selection follows.</h3>
        <p>
          One persistent pill tracks the pointer; one ink bar tracks state. Nothing blinks in and
          out of existence.
        </p>
        <span className="ld-tile__token">--ease-glide</span>
      </div>
    </div>
  );
}

export function ToastTile() {
  return (
    <div className="ld-tile" data-reveal>
      <div className="ld-tile__demo ld-tile__demo--row">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => toast.success('Deploy promoted to production')}
        >
          Success
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            toast.promise(new Promise((res) => setTimeout(res, 1600)), {
              loading: 'Rolling back…',
              success: 'Rolled back to v214',
            })
          }
        >
          Promise
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            toast.error('Payment failed', {
              description: 'Card declined by issuer.',
              action: { label: 'Retry', onClick: () => toast.success('Payment recovered') },
            })
          }
        >
          Error
        </Button>
      </div>
      <div className="ld-tile__meta">
        <h3>Toasts with choreography.</h3>
        <p>
          A real queue: stack, coalesce, swipe to dismiss. Promise toasts morph in place instead of
          swapping.
        </p>
        <span className="ld-tile__token">toast.promise()</span>
      </div>
    </div>
  );
}

const BENCH_COLUMNS: TableColumn<BenchRow>[] = [
  { key: 'rank', mono: true, render: (r) => `#${r.rank}` },
  { key: 'service', strong: true, grow: true },
  { key: 'p99', mono: true, align: 'end', render: (r) => `${r.p99} ms` },
];

export function FlipTile() {
  const [rows, setRows] = useState(BENCH_BASE);

  const rerun = () => {
    const jittered = rows
      .map((r) => ({ ...r, p99: Math.max(18, Math.round(r.p99 * (0.45 + Math.random() * 1.3))) }))
      .sort((a, b) => a.p99 - b.p99)
      .map((r, i) => ({ ...r, rank: i + 1 }));
    setRows(jittered);
  };

  return (
    <div className="ld-tile ld-tile--wide" data-reveal>
      <div className="ld-tile__demo ld-tile__demo--fill">
        <Table<BenchRow> label="p99 latency leaderboard" columns={BENCH_COLUMNS} rows={rows} density="compact" />
      </div>
      <div className="ld-tile__meta">
        <h3>Rows FLIP, never teleport.</h3>
        <p>
          Re-sort, archive, filter — rows travel to their new position, so your eye never loses the
          one it was following.
        </p>
        <Button
          size="sm"
          variant="secondary"
          iconLeft={<Icon name="shuffle" size="sm" />}
          onClick={rerun}
        >
          Re-run benchmark
        </Button>
        <span className="ld-tile__token">--transition-layout</span>
      </div>
    </div>
  );
}

export function DurationTile() {
  return (
    <div className="ld-tile ld-tile--stat" data-reveal>
      <p className="ld-tile__big">
        180<em>ms</em>
      </p>
      <div className="ld-tile__meta">
        <p>
          <code>--duration-base</code> — the whole system swings on three durations and five
          curves. Retime two tokens, retime the app.
        </p>
      </div>
    </div>
  );
}
