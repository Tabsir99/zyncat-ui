import { useMemo, useState } from 'react';
import { Avatar } from 'premium-ds/avatar';
import { Badge } from 'premium-ds/badge';
import { Button } from 'premium-ds/button';
import { Pagination } from 'premium-ds/pagination';
import { Table, type TableColumn } from 'premium-ds/table';
import { Tabs } from 'premium-ds/tabs';
import { toast } from 'premium-ds/toast';
import { DEPLOYS, type Deploy, type DeployStatus } from './data';

const STATUS: Record<DeployStatus, { tone: 'success' | 'warning' | 'danger' | 'neutral'; label: string; live?: boolean }> = {
  live: { tone: 'success', label: 'Live' },
  building: { tone: 'warning', label: 'Building', live: true },
  failed: { tone: 'danger', label: 'Failed' },
  queued: { tone: 'neutral', label: 'Queued' },
};

const COLUMNS: TableColumn<Deploy>[] = [
  { key: 'service', label: 'Service', strong: true, grow: true, sortable: true },
  {
    key: 'status',
    label: 'Status',
    render: (r) => {
      const s = STATUS[r.status];
      return (
        <Badge tone={s.tone} dot live={s.live} pill>
          {s.label}
        </Badge>
      );
    },
  },
  {
    key: 'owner',
    label: 'Owner',
    hideBelow: 'md',
    render: (r) => (
      <span className="ld-owner">
        <Avatar name={r.owner} size="xs" />
        {r.owner}
      </span>
    ),
  },
  {
    key: 'duration',
    label: 'Build',
    mono: true,
    align: 'end',
    sortable: true,
    sortBy: (r) => r.durationS,
  },
  {
    key: 'when',
    label: 'Deployed',
    mono: true,
    align: 'end',
    hideBelow: 'sm',
    sortable: true,
    sortBy: (r) => r.whenTs,
  },
];

export function HeroConsole() {
  const [env, setEnv] = useState('all');
  const [rows, setRows] = useState(DEPLOYS);

  const visible = useMemo(
    () => (env === 'all' ? rows : rows.filter((r) => r.env === env)),
    [env, rows],
  );
  const count = (e: string) => rows.filter((r) => r.env === e).length;

  return (
    <div className="ld-console" aria-label="Live demo — deploy console built from premium-ds">
      <div className="ld-console__bar">
        <span className="ld-console__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="ld-console__title">acme / deploys</span>
        <Badge tone="success" dot live size="sm">
          Operational
        </Badge>
      </div>

      <div className="ld-console__tabs">
        <Tabs
          label="Filter deploys by environment"
          items={[
            { value: 'all', label: 'All', count: rows.length },
            { value: 'production', label: 'Production', count: count('production') },
            { value: 'preview', label: 'Preview', count: count('preview') },
          ]}
          value={env}
          onChange={(v) => setEnv(v)}
        />
      </div>

      <div className="ld-console__body">
        <Table<Deploy>
          label="Recent deploys"
          columns={COLUMNS}
          rows={visible}
          density="compact"
          selectable
          defaultSort={{ key: 'when', dir: 'asc' }}
          bulkActions={(keys, clear) => (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  clear();
                  toast.success(`${keys.length} deploy${keys.length > 1 ? 's' : ''} promoted`);
                }}
              >
                Promote
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setRows((all) => all.filter((r) => !keys.includes(r.id)));
                  clear();
                  toast(`${keys.length} archived`, {
                    description: 'Rows FLIP out — nothing teleports.',
                  });
                }}
              >
                Archive
              </Button>
            </>
          )}
          empty={
            <div className="ld-console__empty">
              <p>Every deploy archived. Satisfying, right?</p>
              <Button size="sm" variant="secondary" onClick={() => setRows(DEPLOYS)}>
                Restore data
              </Button>
            </div>
          }
        />
      </div>
      <div className="ld-console__foot">
        <Pagination
          label="Deploys"
          range={[visible.length ? 1 : 0, visible.length]}
          total={visible.length}
        />
      </div>
    </div>
  );
}
