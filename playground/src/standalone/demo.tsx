import type { ReactNode } from 'react';
import { Table, type TableColumn } from '@zyncat/ui/table';
import { Toaster, toast } from '@zyncat/ui/toast';

/* Regression harness for cross-component CSS coupling: this module graph
   contains ONLY @zyncat/ui/table and @zyncat/ui/toast (plus whatever the
   entry file adds). Table renders .cbx/.odo/.btn vocabularies - since the
   ownership fix (CheckGlyph/Odometer carry their CSS; renderers import
   button.css), their styles ride in with the table import itself. The two
   twins must therefore render IDENTICALLY; if this page ever shows naked
   checkboxes, a digit strip, or a gray Clear button again, the coupling
   has crept back. The SPA playground can never catch that - it imports
   every component, so every stylesheet is always present. */

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
    'Painted by checkbox.css, which now travels with Table via the shared CheckGlyph - the native input must be invisible, the box styled.',
  ],
  [
    'Select a row → the bulk bar',
    'The "N selected" odometer clips to one digit (odometer.css rides with the shared Odometer) and the built-in Clear button is styled (Table imports button.css for the .btn it renders).',
  ],
  [
    'Fire the toast → its Undo action',
    'The .btn btn--secondary btn--sm action is styled - Toast imports button.css too.',
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
      <p
        style={{
          font: 'var(--type-micro)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-subtle)',
        }}
      >
        standalone import test — module graph: @zyncat/ui/table + @zyncat/ui/toast
        {healed ? ' + checkbox + button + badge' : ' only'}
      </p>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 650, letterSpacing: '-0.01em', margin: '4px 0 8px' }}>
        {healed ? 'Same page, healed' : 'What a real app gets from `import … from ‘@zyncat/ui/table’`'}
      </h1>
      <p style={{ color: 'var(--text-muted, #666)', maxWidth: 620 }}>
        {healed
          ? 'Identical demo code, plus Checkbox, Button and Badge rendered below. Before the ownership fix this page looked right while the other twin broke; now both must match, because Table no longer depends on unrelated imports being present.'
          : 'Nothing here is mocked — this is the shipped Table and toast, importing only their own subpaths. Every vocabulary they render must arrive styled through their own module graph.'}
      </p>
      {extras}
      <ol style={{ margin: '12px 0 28px', paddingLeft: 20, maxWidth: 640 }}>
        {CHECKS.map(([what, why]) => (
          <li key={what} style={{ margin: '6px 0' }}>
            <strong>{what}.</strong> <span style={{ color: 'var(--text-muted, #666)' }}>{why}</span>
          </li>
        ))}
      </ol>

      <Table<Deploy> ariaLabel="Deploys" columns={COLUMNS} rows={ROWS} selectable density="compact" />

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
          <a href="/broken.html">← back to the minimal-graph twin</a>
        ) : (
          <a href="/fixed.html">compare the twin — same code + three extra component imports →</a>
        )}
      </p>
    </main>
  );
}
