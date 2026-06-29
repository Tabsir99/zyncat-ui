// Docs-only chrome. A page is a stack of labelled demo tiles; the page header
// (title + blurb) is rendered by PageView from the registry, so a page file is
// pure demos. Not part of the library.
import type { ReactNode } from 'react';

export function Demo({ label, fill, children }: { label?: string; fill?: boolean; children: ReactNode }) {
  return (
    <div className={fill ? 'demo demo--fill' : 'demo'}>
      {label ? <span className="demo__label">{label}</span> : null}
      <div className="demo__row">{children}</div>
    </div>
  );
}
