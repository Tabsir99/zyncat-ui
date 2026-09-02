'use client';

import { useState } from 'react';

import { Collapse } from '@zyncat/ui/collapse';

import type { SeoFaq } from '../content/seo/types';

const slug = (q: string) =>
  q
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);

export function Faq({ items }: { items: SeoFaq[] }) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(items[0]?.q ?? null);

  return (
    <section className="doc-section doc-faq" id="faq" aria-labelledby="faq-heading">
      <div className="section-head">
        <h2 id="faq-heading" className="section-head__title">
          Frequently asked questions
        </h2>
      </div>
      <div className="doc-faq__list">
        {items.map((item) => {
          const open = openQuestion === item.q;
          const id = slug(item.q);
          return (
            <article className="doc-faq__item" data-open={open ? 'true' : 'false'} key={item.q}>
              <h3 className="doc-faq__q">
                <button
                  type="button"
                  className="doc-faq__trigger"
                  id={`faq-q-${id}`}
                  aria-expanded={open}
                  aria-controls={`faq-a-${id}`}
                  onClick={() => setOpenQuestion(open ? null : item.q)}
                >
                  <span className="doc-faq__label">{item.q}</span>
                  <span className="doc-faq__chevron" aria-hidden="true" />
                </button>
              </h3>
              <Collapse open={open} fade className="doc-faq__region">
                <div id={`faq-a-${id}`} role="region" aria-labelledby={`faq-q-${id}`}>
                  <p className="doc-faq__a">{item.a}</p>
                </div>
              </Collapse>
            </article>
          );
        })}
      </div>
    </section>
  );
}
