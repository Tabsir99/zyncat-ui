// Renders one component's page: the header from registry metadata, then the
// component's own demos as the body. Only the active route mounts, so a page's
// observers, portals, and date machinery exist only while you're looking at it.
import type { Doc } from './registry';

export function PageView({ doc }: { doc: Doc }) {
  const { label, blurb, Component } = doc;
  return (
    <article className="page">
      <header className="page__head">
        <h1 className="page__title">{label}</h1>
        <p className="page__blurb">{blurb}</p>
      </header>
      <div className="page__body">
        <Component />
      </div>
    </article>
  );
}
