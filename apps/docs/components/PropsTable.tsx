'use client';

import { Table, type TableColumn } from '@zyncat/ui/table';

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface DisplayRow extends PropRow {
  displayName: string;
  displayType: string;
}

function formatType(typeStr: string): string {
  if (!typeStr) return 'unknown';

  let s = typeStr.trim();

  if (
    s.startsWith('Omit<InputHTMLAttributes') ||
    s.startsWith('Omit<HTMLAttributes') ||
    s.startsWith('Omit<ButtonHTMLAttributes') ||
    s.startsWith('Omit<TextareaHTMLAttributes')
  ) {
    return 'HTMLAttributes';
  }
  if (s.includes('ButtonRestProps')) {
    return 'ButtonHTMLAttributes';
  }

  s = s.replace(/React\.MouseEventHandler<[^>]+>/g, '(e: MouseEvent) => void');
  s = s.replace(/React\.ChangeEventHandler<[^>]+>/g, '(e: ChangeEvent) => void');
  s = s.replace(/React\.PointerEventHandler<[^>]+>/g, '(e: PointerEvent) => void');
  s = s.replace(/React\.KeyboardEventHandler<[^>]+>/g, '(e: KeyboardEvent) => void');
  s = s.replace(/React\.FocusEventHandler<[^>]+>/g, '(e: FocusEvent) => void');
  s = s.replace(/React\.FormEventHandler<[^>]+>/g, '(e: FormEvent) => void');
  s = s.replace(/\bReact\.ReactNode\b/g, 'ReactNode');
  s = s.replace(/\bReact\.CSSProperties\b/g, 'CSSProperties');
  s = s.replace(/\bReact\.Ref<([^>]+)>/g, 'Ref<$1>');

  return s;
}

const COLUMNS: TableColumn<DisplayRow>[] = [
  {
    key: 'name',
    label: 'Prop',
    render: (r) => (
      <code className="prop-name">
        {r.displayName}
        {r.required ? (
          <span className="prop-required" title="Required">
            *
          </span>
        ) : null}
      </code>
    ),
  },
  { key: 'type', label: 'Type', render: (r) => <code className="prop-type">{r.displayType}</code> },
  {
    key: 'default',
    label: 'Default',
    render: (r) =>
      r.default ? <code className="prop-default">{r.default}</code> : <span className="prop-dash">—</span>,
  },
  {
    key: 'description',
    label: 'Description',
    grow: true,
    render: (r) => <span className="props-td-desc">{r.description}</span>,
  },
];

export function PropsTable({ rows, title = 'Props' }: { rows: PropRow[]; title?: string }) {
  const id = `props-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  const displayRows: DisplayRow[] = rows.map((r) => ({
    ...r,
    displayName: r.name === 'htmlProps' ? '...htmlAttributes' : r.name,
    displayType: formatType(r.type),
  }));

  return (
    <section className="props-section" aria-label={title} id={id}>
      <h3 className="props-title">{title}</h3>
      <Table columns={COLUMNS} rows={displayRows} rowKey="name" ariaLabel={`${title} props`} density="compact" />
    </section>
  );
}
