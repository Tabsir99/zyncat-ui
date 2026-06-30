// Docs-only chrome. A page is a stack of labelled demo tiles; the page header
// (title + blurb) is rendered by PageView from the registry, so a page file is
// pure demos. Not part of the library.
import type { ReactNode } from 'react';

export function Demo({
  label,
  fill,
  children,
}: {
  label?: string;
  fill?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={fill ? 'demo demo--fill' : 'demo'}>
      {label ? <span className="demo__label">{label}</span> : null}
      <div className="demo__row">{children}</div>
    </div>
  );
}

// Prerendered usage snippet shown above a component's live demos. Static text,
// so the example is crawlable and visible before hydration.
export function Example({ code, label = 'Usage' }: { code: string; label?: string }) {
  return (
    <section className="example" aria-label={label}>
      <span className="example__label">{label}</span>
      <pre className="example__code">
        <code>{code}</code>
      </pre>
    </section>
  );
}
