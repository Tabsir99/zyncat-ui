// Renders one component's page: prerendered SEO content (title, blurb, and the
// code example plus props table from registry) followed by the live demos. The
// demos are client-only: server rendering never touches their observers,
// portals, or date machinery, while the static content above stays crawlable.
import { Head, ClientOnly } from 'vite-react-ssg';
import type { Doc } from './registry';
import { Example } from './kit';
import { PropsTable } from './PropsTable';

const SITE = 'https://ui.zyncat.app';

export function PageView({ doc }: { doc: Doc }) {
  const { slug, label, blurb, Component, example, props, types } = doc;
  const title = `${label} - Zyncat UI`;
  const url = `${SITE}/${slug}`;
  return (
    <article className="page">
      <Head>
        <title>{title}</title>
        <meta name="description" content={blurb} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={blurb} />
        <meta property="og:url" content={url} />
      </Head>

      <header className="page__head">
        <h1 className="page__title">{label}</h1>
        <p className="page__blurb">{blurb}</p>
      </header>

      {example ? <Example code={example} /> : null}

      <div className="page__body">
        <ClientOnly>{() => <Component />}</ClientOnly>
      </div>

      {props && props.length > 0 ? <PropsTable rows={props} /> : null}
      {types?.map((type) => (
        <PropsTable key={type.name} rows={type.rows} title={type.name} />
      ))}
    </article>
  );
}
