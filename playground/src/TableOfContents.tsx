import { useEffect, useState } from 'react';
import type { Doc } from './registry';
import { Icon } from './icon';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export function TableOfContents({ doc }: { doc: Doc }) {
  const defaultInitialId = doc.toc?.[0]?.id ?? (doc.HeroComponent ? 'preview' : 'installation');
  const [activeId, setActiveId] = useState<string>(defaultInitialId);

  let items: TocItem[] = [];

  if (doc.toc && doc.toc.length > 0) {
    items = doc.toc;
  } else {
    if (doc.examples && doc.examples.length > 0) {
      items.push({ id: 'examples', title: 'Examples', level: 2 });
      for (const ex of doc.examples) {
        items.push({ id: `example-${ex.id}`, title: ex.title, level: 3 });
      }
    }

    if (!doc.Content) {
      items.push({ id: 'installation', title: 'Installation', level: 2 });
    }
    if (!doc.Content && doc.heroCode) {
      items.push({ id: 'usage', title: 'Usage', level: 2 });
    }

    if ((doc.props && doc.props.length > 0) || (doc.types && doc.types.length > 0)) {
      items.push({ id: 'props', title: 'Props', level: 2 });
      if (doc.props && doc.props.length > 0) {
        items.push({ id: `props-${doc.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, title: doc.label, level: 3 });
      }
      if (doc.types) {
        for (const type of doc.types) {
          items.push({ id: `props-${type.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, title: type.name, level: 3 });
        }
      }
    }
  }

  useEffect(() => {
    setActiveId(doc.toc?.[0]?.id ?? (doc.HeroComponent ? 'preview' : 'installation'));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0% -60% 0%', threshold: 0.1 },
    );

    const headingElements = document.querySelectorAll(
      'section[id], div[id].example-block, section.guide-section[id], div.guide-section[id]',
    );
    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [doc]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <aside className="toc">
      <div className="toc__group">
        <p className="toc__title">On This Page</p>
        <nav className="toc__nav">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`toc__link toc__link--lvl${item.level} ${activeId === item.id ? 'toc__link--active' : ''}`}
              onClick={() => scrollTo(item.id)}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="toc__group toc__group--border">
        <p className="toc__title">Contribute</p>
        <div className="toc__links">
          <a
            href={`https://github.com/Tabsir99/zyncat-ui/issues/new?title=%5BBug%5D%3A+${doc.label}`}
            target="_blank"
            rel="noopener noreferrer"
            className="toc__contrib-link"
          >
            <Icon name="bug" size="sm" />
            <span>Report an issue</span>
          </a>
          <a
            href={`https://github.com/Tabsir99/zyncat-ui/issues/new?title=%5BFeature%5D%3A+${doc.label}`}
            target="_blank"
            rel="noopener noreferrer"
            className="toc__contrib-link"
          >
            <Icon name="lightbulb" size="sm" />
            <span>Request a feature</span>
          </a>
          <a
            href="https://github.com/Tabsir99/zyncat-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="toc__contrib-link"
          >
            <Icon name="pencil-simple" size="sm" />
            <span>Edit this page</span>
          </a>
        </div>
      </div>

      <div className="toc__card">
        <div className="toc__card-badge">
          <span className="toc__card-dot" />
          <span>ZERO DEPENDENCIES</span>
        </div>
        <p className="toc__card-title">
          Build <em>Faster</em> with Zyncat UI
        </p>
        <p className="toc__card-text">
          Accessible, animated UI components crafted for React 19 on a pure CSS token system.
        </p>
        <ul className="toc__card-list">
          <li>✔ React 19 + modern CSS</li>
          <li>✔ ~2.5 kB WAAPI motion engine</li>
          <li>✔ Zero animation dependencies</li>
        </ul>
      </div>
    </aside>
  );
}
