import type { ReactNode } from 'react';
import { Table, type TableColumn } from 'premium-ds/table';
import { Toaster, toast } from 'premium-ds/toast';

/* Standalone repro for the cross-component CSS coupling: this module graph
   contains ONLY premium-ds/table and premium-ds/toast (plus whatever the
   entry file adds). Table renders .cbx/.odo/.btn markup whose styles live in
   checkbox.css / badge.css / button.css — none of which are in this graph,
   so on /broken.html those pieces render as raw, unstyled DOM. The SPA
   playground can never show this: it imports every component, so every
   stylesheet is always present. */

interface Deploy {
  id: number;
  service: string;
  status: string;
  region: string;
}

const ROWS: Deploy[] = [
  { id: 1, service: 'api-gateway', status: 'Live', region: 'fra1' },
  { id: 2, service: 'billing-worker', status: 'Building', region: 'iad1' },
  { id: 3, service: 'web-app', status: 'Live', region: 'fra1' },
  { id: 4, service: 'ingest-stream', status: 'Queued', region: 'syd1' },
];

const COLUMNS: TableColumn<Deploy>[] = [
  { key: 'service', label: 'Service', strong: true, grow: true, sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'region', label: 'Region', mono: true, align: 'end' },
];

const CHECKS: [string, string][] = [
  [
    'Row checkboxes',
    'Table renders the Checkbox primitive’s DOM (.cbx), but the state machine that hides the native input and paints the box lives in checkbox.css.',
  ],
  [
    'Select a row → the bulk bar',
    'The "N selected" count is an odometer (.odo from badge.css — without it every digit strip 0–9 is visible at once) and the built-in Clear button is .btn from button.css.',
  ],
  [
    'Fire the toast → its Undo action',
    'The action renders .btn btn--secondary btn--sm — button.css again.',
  ],
];

export function StandaloneDemo({ healed, extras }: { healed: boolean; extras?: ReactNode }) {
  return (
    <main
      style={{
        maxWidth: 780,
        margin: '48px auto',
        padding: '0 24px 64px',
        fontFamily: 'var(--font-sans, sans-serif)',
        color: 'var(--text-body, #333)',
        lineHeight: 1.55,
      }}
    >
      <Toaster />
      <p style={{ font: 'var(--type-micro)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
        standalone import test — module graph: premium-ds/table + premium-ds/toast{healed ? ' + checkbox + button + badge' : ' only'}
      </p>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 650, letterSpacing: '-0.01em', margin: '4px 0 8px' }}>
        {healed ? 'Same page, healed' : 'What a real app gets from `import … from ‘premium-ds/table’`'}
      </h1>
      <p style={{ color: 'var(--text-muted, #666)', maxWidth: 620 }}>
        {healed
          ? 'Identical demo code. The only difference: this page also uses Checkbox, Button and Badge (below) — so checkbox.css, button.css and badge.css happen to be in the graph, and Table silently heals. Whether Table looks right depends on unrelated imports elsewhere in the app.'
          : 'Nothing here is mocked — this is the shipped Table and toast, with only their own CSS loaded, exactly like a consumer app that imports just these two subpaths.'}
      </p>
      {extras}
      <ol style={{ margin: '12px 0 28px', paddingLeft: 20, maxWidth: 640 }}>
        {CHECKS.map(([what, why]) => (
          <li key={what} style={{ margin: '6px 0' }}>
            <strong>{what}.</strong> <span style={{ color: 'var(--text-muted, #666)' }}>{why}</span>
          </li>
        ))}
      </ol>

      <Table<Deploy>
        label="Deploys"
        columns={COLUMNS}
        rows={ROWS}
        selectable
        density="compact"
      />

      <p style={{ marginTop: 24 }}>
        <button
          type="button"
          onClick={() =>
            toast('Deploy archived', {
              description: 'Look at the Undo button on this toast.',
              action: { label: 'Undo', onClick: () => {} },
            })
          }
        >
          fire a toast with an action
        </button>{' '}
        <span style={{ color: 'var(--text-subtle, #999)' }}>
          (this trigger is a deliberately plain page button — not the library)
        </span>
      </p>

      <p style={{ marginTop: 32, borderTop: '1px solid var(--border-subtle, #ddd)', paddingTop: 16 }}>
        {healed ? (
          <a href="/broken.html">← back to the broken twin</a>
        ) : (
          <a href="/fixed.html">see the healed twin — same code + three CSS-owner imports →</a>
        )}
      </p>
    </main>
  );
}
