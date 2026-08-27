'use client';

import { useState } from 'react';
import Link from 'next/link';

import { DOCS, GROUPS, type Doc } from '../content/registry';
import { Icon } from './icon';
import { Breadcrumbs, CodeBlock, ExampleCard, InstallationBox } from './kit';
import { PropsTable } from './PropsTable';
import { TableOfContents } from './TableOfContents';

export function PageView({ doc }: { doc: Doc }) {
  const { slug, label, blurb, HeroComponent, heroCode, examples, props, types } = doc;

  const [heroTab, setHeroTab] = useState<'preview' | 'code'>('preview');
  const [heroKey, setHeroKey] = useState(0);
  const [pageCopied, setPageCopied] = useState(false);

  const group = GROUPS.find((g) => g.docs.some((d) => d.slug === slug));
  const groupTitle = group?.title ?? 'Components';

  const currentIndex = DOCS.findIndex((d) => d.slug === slug);
  const prevDoc = currentIndex > 0 ? DOCS[currentIndex - 1] : null;
  const nextDoc = currentIndex < DOCS.length - 1 ? DOCS[currentIndex + 1] : null;

  const handleCopyPage = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const pageSnippet = `// ${label} - Zyncat UI\n// ${blurb}\n\n${heroCode || `import { ${label} } from '@zyncat/ui/${slug}';\nimport '@zyncat/ui/${slug}.css';`}`;
      navigator.clipboard.writeText(pageSnippet);
      setPageCopied(true);
      setTimeout(() => setPageCopied(false), 2000);
    }
  };

  const handleHeroReplay = () => {
    setHeroKey((k) => k + 1);
  };

  return (
    <div className="doc-layout">
      <article className="page">
        <Breadcrumbs group={groupTitle} label={label} />

        <header className="page__head">
          <div className="page__title-row">
            <h1 className="page__title">{label}</h1>
            <div className="page__actions">
              <button
                type="button"
                className="btn-page-action"
                onClick={handleCopyPage}
                aria-label="Copy page code"
                title="Copy component code to clipboard"
              >
                <Icon name={pageCopied ? 'check' : 'copy'} size="sm" />
                <span>{pageCopied ? 'Copied' : 'Copy Page'}</span>
              </button>
              <div className="page__nav-arrows">
                {prevDoc ? (
                  <Link
                    href={`/${prevDoc.slug}`}
                    className="btn-icon-nav"
                    title={`Previous: ${prevDoc.label}`}
                    aria-label={`Previous component: ${prevDoc.label}`}
                  >
                    <Icon name="arrow-left" size="sm" />
                  </Link>
                ) : (
                  <span className="btn-icon-nav btn-icon-nav--disabled">
                    <Icon name="arrow-left" size="sm" />
                  </span>
                )}
                {nextDoc ? (
                  <Link
                    href={`/${nextDoc.slug}`}
                    className="btn-icon-nav"
                    title={`Next: ${nextDoc.label}`}
                    aria-label={`Next component: ${nextDoc.label}`}
                  >
                    <Icon name="arrow-right" size="sm" />
                  </Link>
                ) : (
                  <span className="btn-icon-nav btn-icon-nav--disabled">
                    <Icon name="arrow-right" size="sm" />
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="page__blurb">{blurb}</p>
        </header>

        {/* Guide Content (Introduction, Installation, MCP) */}
        {doc.Content ? (
          <div className="doc-guide-content">
            <doc.Content />
          </div>
        ) : null}

        {/* Hero Interactive Preview / Code block */}
        {HeroComponent ? (
          <section className="hero-preview" id="preview">
            <div className="hero-preview__tabs-bar">
              <div className="hero-preview__tabs">
                <button
                  type="button"
                  className={`hero-preview__tab ${heroTab === 'preview' ? 'hero-preview__tab--active' : ''}`}
                  onClick={() => setHeroTab('preview')}
                >
                  Preview
                </button>
                {heroCode ? (
                  <button
                    type="button"
                    className={`hero-preview__tab ${heroTab === 'code' ? 'hero-preview__tab--active' : ''}`}
                    onClick={() => setHeroTab('code')}
                  >
                    Code
                  </button>
                ) : null}
              </div>
              <div className="hero-preview__actions">
                <button
                  type="button"
                  className="hero-preview__btn-icon"
                  onClick={handleHeroReplay}
                  title="Restart component animation"
                  aria-label="Restart component animation"
                >
                  <Icon name="arrow-counter-clockwise" size="sm" />
                </button>
              </div>
            </div>

            {heroTab === 'preview' ? (
              <div className="hero-preview__canvas" key={heroKey}>
                <div className="hero-preview__inner">
                  <HeroComponent />
                </div>
              </div>
            ) : heroCode ? (
              <div className="hero-preview__code">
                <CodeBlock code={heroCode} language="tsx" />
              </div>
            ) : null}
          </section>
        ) : null}

        {/* Examples Section */}
        {examples && examples.length > 0 ? (
          <section className="doc-section" id="examples">
            <div className="section-head">
              <h2 className="section-head__title">Examples</h2>
            </div>
            <div className="examples-list">
              {examples.map((ex) => (
                <div key={ex.id} className="example-block" id={`example-${ex.id}`}>
                  <h3 className="example-block__title">{ex.title}</h3>
                  {ex.description ? <p className="example-block__desc">{ex.description}</p> : null}
                  <ExampleCard Component={ex.Component} code={ex.code} />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Installation */}
        {!doc.Content ? <InstallationBox slug={slug} /> : null}

        {/* Usage */}
        {!doc.Content && heroCode ? (
          <section className="doc-section" id="usage">
            <div className="section-head">
              <h2 className="section-head__title">Usage</h2>
            </div>
            <CodeBlock code={heroCode} language="tsx" />
            <p className="section-note">
              Compose {label} in your application. No Tailwind or external styling library is required; all styles snap
              directly to Zyncat UI&apos;s CSS custom properties.
            </p>
          </section>
        ) : null}

        {/* Props Reference */}
        {props && props.length > 0 ? (
          <section className="doc-section" id="props">
            <div className="section-head">
              <h2 className="section-head__title">Props</h2>
            </div>
            <PropsTable rows={props} title={label} />
            {types?.map((type) => (
              <PropsTable key={type.name} rows={type.rows} title={type.name} />
            ))}
          </section>
        ) : null}

        {/* Bottom Pagination */}
        <nav className="page-pagination" aria-label="Component navigation">
          {prevDoc ? (
            <Link href={`/${prevDoc.slug}`} className="pagination-card pagination-card--prev">
              <span className="pagination-card__sub">
                <Icon name="arrow-left" size="sm" /> Previous
              </span>
              <span className="pagination-card__title">{prevDoc.label}</span>
            </Link>
          ) : (
            <div className="pagination-card pagination-card--placeholder" />
          )}
          {nextDoc ? (
            <Link href={`/${nextDoc.slug}`} className="pagination-card pagination-card--next">
              <span className="pagination-card__sub">
                Next <Icon name="arrow-right" size="sm" />
              </span>
              <span className="pagination-card__title">{nextDoc.label}</span>
            </Link>
          ) : (
            <div className="pagination-card pagination-card--placeholder" />
          )}
        </nav>

        <footer className="page-footer">
          <span>
            Built by <strong style={{ color: 'var(--text-strong)' }}>Tabsir Ahammed</strong>. The source code is
            available on{' '}
            <a
              href="https://github.com/Tabsir99/zyncat-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="page-footer__link"
            >
              GitHub
            </a>
            .
          </span>
        </footer>
      </article>

      <TableOfContents doc={doc} />
    </div>
  );
}
