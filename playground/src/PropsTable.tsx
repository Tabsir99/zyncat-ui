// Static prop reference rendered under each component's demos. Prerendered, so
// the prop names, types, and descriptions are crawlable SEO content.
export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export function PropsTable({ rows, title = 'Props' }: { rows: PropRow[]; title?: string }) {
  return (
    <section className="props" aria-label={title}>
      <h2 className="props__title">{title}</h2>
      <div className="props__scroll">
        <table className="props__table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td className="props__name">
                  <code>{r.name}</code>
                  {r.required ? (
                    <span className="props__req" title="Required">
                      *
                    </span>
                  ) : null}
                </td>
                <td className="props__type">
                  <code>{r.type}</code>
                </td>
                <td className="props__default">
                  {r.default ? <code>{r.default}</code> : <span className="props__dash">-</span>}
                </td>
                <td className="props__desc">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
