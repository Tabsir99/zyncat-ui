export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

function formatType(typeStr: string): string {
  if (!typeStr) return 'unknown';

  let s = typeStr.trim();

  // Strip complex Omit HTML type noise
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

  // Clean common React namespace boilerplate
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

export function PropsTable({ rows, title = 'Props' }: { rows: PropRow[]; title?: string }) {
  const id = `props-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  // Filter out redundant internal htmlProps if bare attributes are forwarded
  const cleanedRows = rows.map((r) => ({
    ...r,
    displayName: r.name === 'htmlProps' ? '...htmlAttributes' : r.name,
    displayType: formatType(r.type),
  }));

  return (
    <section className="props-section" aria-label={title} id={id}>
      <h3 className="props-title">{title}</h3>
      <div className="props-table-wrapper">
        <table className="props-table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Prop</th>
              <th style={{ width: '30%' }}>Type</th>
              <th style={{ width: '16%' }}>Default</th>
              <th style={{ width: '34%' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {cleanedRows.map((r) => (
              <tr key={r.name}>
                <td className="props-td-name">
                  <code className="prop-badge prop-badge--name">{r.displayName}</code>
                  {r.required ? (
                    <span className="prop-required" title="Required">
                      *
                    </span>
                  ) : null}
                </td>
                <td className="props-td-type">
                  <code className="prop-badge prop-badge--type">{r.displayType}</code>
                </td>
                <td className="props-td-default">
                  {r.default ? (
                    <code className="prop-badge prop-badge--default">{r.default}</code>
                  ) : (
                    <span className="prop-dash">-</span>
                  )}
                </td>
                <td className="props-td-desc">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
