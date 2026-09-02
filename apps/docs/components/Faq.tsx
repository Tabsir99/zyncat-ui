import type { SeoFaq } from '../content/seo/types';

export function Faq({ items }: { items: SeoFaq[] }) {
  return (
    <section className="doc-section doc-faq" id="faq" aria-labelledby="faq-heading">
      <div className="section-head">
        <h2 id="faq-heading" className="section-head__title">
          Frequently asked questions
        </h2>
      </div>
      <div className="doc-faq__list">
        {items.map((item) => (
          <article className="doc-faq__item" key={item.q}>
            <h3 className="doc-faq__q">{item.q}</h3>
            <p className="doc-faq__a">{item.a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
