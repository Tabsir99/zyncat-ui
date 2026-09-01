'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Badge } from '@zyncat/ui/badge';
import { Button } from '@zyncat/ui/button';
import { TabPanel, Tabs } from '@zyncat/ui/tabs';
import { toast } from '@zyncat/ui/toast-store';
import { Tooltip } from '@zyncat/ui/tooltip';

import { DOCS, GROUPS, NEW_SLUGS, type Doc } from '../content/registry';
import { Icon } from './icon';
import { CodeBlock, ExampleCard, InstallationBox } from './kit';
import { PropsTable } from './PropsTable';
import { TableOfContents } from './TableOfContents';

export function PageView({ doc }: { doc: Doc }) {
  const { slug, label, headline, blurb, HeroComponent, Playground, heroCode, examples, props, types } = doc;

  const [heroTab, setHeroTab] = useState('preview');
  const [heroDir, setHeroDir] = useState<1 | -1 | 0>(0);
  const [heroKey, setHeroKey] = useState(0);

  const group = GROUPS.find((g) => g.docs.some((d) => d.slug === slug));
  const groupTitle = group?.title ?? 'Components';

  const currentIndex = DOCS.findIndex((d) => d.slug === slug);
  const prevDoc = currentIndex > 0 ? DOCS[currentIndex - 1] : null;
  const nextDoc = currentIndex < DOCS.length - 1 ? DOCS[currentIndex + 1] : null;

  const heroItems = [{ value: 'preview', label: 'Preview' }];
  if (heroCode) heroItems.push({ value: 'code', label: 'Code' });

  const handleCopyPage = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const pageSnippet =
        heroCode || `import { ${label} } from '@zyncat/ui/${slug}';\nimport '@zyncat/ui/${slug}.css';`;
      navigator.clipboard.writeText(pageSnippet);
      toast.success('Page code copied', { description: `${label} — ready to paste.` });
    }
  };

  const handleHeroReplay = () => {
    setHeroKey((k) => k + 1);
  };

  return (
    <div className="doc-layout" key={slug}>
      <article className="page">
        <div className="eyebrow">
          <span className="eyebrow__left">{groupTitle}</span>
          <span className="eyebrow__meta">{doc.Content ? 'Zyncat UI — Rev 0.11' : `@zyncat/ui/${slug}`}</span>
        </div>

        <header className="page__head">
          <div className="page__title-row">
            <h1 className="page__title">{headline ?? label}</h1>
            {doc.Content ? null : (
              <div className="page__actions">
                <Button variant="secondary" size="sm" onClick={handleCopyPage} aria-label="Copy page code">
                  <Icon name="copy" size="sm" />
                  Copy page
                </Button>
                <div className="page__nav-arrows">
                  {prevDoc ? (
                    <Tooltip content={prevDoc.label} placement="bottom">
                      <Link
                        href={`/${prevDoc.slug}`}
                        className="btn-icon-nav"
                        aria-label={`Previous component: ${prevDoc.label}`}
                      >
                        <Icon name="arrow-left" size="sm" />
                      </Link>
                    </Tooltip>
                  ) : (
                    <span className="btn-icon-nav btn-icon-nav--disabled">
                      <Icon name="arrow-left" size="sm" />
                    </span>
                  )}
                  {nextDoc ? (
                    <Tooltip content={nextDoc.label} placement="bottom">
                      <Link
                        href={`/${nextDoc.slug}`}
                        className="btn-icon-nav"
                        aria-label={`Next component: ${nextDoc.label}`}
                      >
                        <Icon name="arrow-right" size="sm" />
                      </Link>
                    </Tooltip>
                  ) : (
                    <span className="btn-icon-nav btn-icon-nav--disabled">
                      <Icon name="arrow-right" size="sm" />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <p className="page__blurb">{blurb}</p>
        </header>

        {doc.Content ? (
          <div className="doc-guide-content">
            <doc.Content />
          </div>
        ) : null}

        {Playground ? (
          <section className="playground-section" id="playground">
            <Playground />
          </section>
        ) : null}

        {HeroComponent ? (
          <section className="hero-preview" id="preview">
            <div className="hero-preview__tabs-bar">
              <Tabs
                items={heroItems}
                value={heroTab}
                onChange={(v, d) => {
                  setHeroTab(v);
                  setHeroDir(d);
                }}
                name={`hero-${slug}`}
                ariaLabel={`${label} demo view`}
                className="plate-tabs"
              />
              <div className="hero-preview__actions">
                {NEW_SLUGS.has(slug) ? (
                  <Badge tone="info" size="sm">
                    New in 0.11
                  </Badge>
                ) : null}
                <Tooltip content="Replay the demo" placement="bottom">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleHeroReplay}
                    aria-label="Restart component animation"
                  >
                    <Icon name="arrow-counter-clockwise" size="sm" />
                  </Button>
                </Tooltip>
              </div>
            </div>

            <TabPanel name={`hero-${slug}`} tab={heroTab} dir={heroDir}>
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
            </TabPanel>
          </section>
        ) : null}

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

        {!doc.Content ? <InstallationBox slug={slug} /> : null}

        {!doc.Content && heroCode ? (
          <section className="doc-section" id="usage">
            <div className="section-head">
              <h2 className="section-head__title">Usage</h2>
            </div>
            <CodeBlock code={heroCode} language="tsx" />
            <p className="section-note">
              Compose {label} in your application. No Tailwind or external styling library is required; every value
              resolves from Zyncat UI&apos;s token vocabulary.
            </p>
          </section>
        ) : null}

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
          <span>Set in Geist &amp; Newsreader — animated by the house engine</span>
          <span className="page-footer__row">
            Zyncat UI · Rev 0.11 · MIT · Built by Tabsir Ahammed · Source on{' '}
            <a
              href="https://github.com/Tabsir99/zyncat-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="page-footer__link"
            >
              GitHub
            </a>
          </span>
        </footer>
      </article>

      <TableOfContents doc={doc} />
    </div>
  );
}
