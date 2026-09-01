'use client';

import { useEffect, useRef, useState } from 'react';

import type { Doc } from '../content/registry';
import { Icon } from './icon';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

const ACTIVE_LINE = 108;

function buildItems(doc: Doc): TocItem[] {
  if (doc.toc && doc.toc.length > 0) {
    return doc.toc;
  }

  const items: TocItem[] = [];

  if (doc.Playground) {
    items.push({ id: 'playground', title: 'Playground', level: 2 });
  }

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

  return items;
}

export function TableOfContents({ doc }: { doc: Doc }) {
  const items = buildItems(doc);
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');
  const [marker, setMarker] = useState<{ top: number; height: number } | null>(null);
  const linkRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const clickLockRef = useRef<string | null>(null);

  useEffect(() => {
    clickLockRef.current = null;
    const ids = buildItems(doc).map((i) => i.id);
    if (ids.length === 0) return;

    const readActive = () => {
      if (clickLockRef.current) {
        setActiveId(clickLockRef.current);
        return;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(ids[ids.length - 1]);
        return;
      }
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_LINE) {
          current = id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    const releaseLock = () => {
      if (!clickLockRef.current) return;
      clickLockRef.current = null;
      readActive();
    };

    readActive();
    window.addEventListener('scroll', readActive, { passive: true });
    window.addEventListener('resize', readActive);
    window.addEventListener('wheel', releaseLock, { passive: true });
    window.addEventListener('touchstart', releaseLock, { passive: true });
    window.addEventListener('pointerdown', releaseLock);
    window.addEventListener('keydown', releaseLock);
    return () => {
      window.removeEventListener('scroll', readActive);
      window.removeEventListener('resize', readActive);
      window.removeEventListener('wheel', releaseLock);
      window.removeEventListener('touchstart', releaseLock);
      window.removeEventListener('pointerdown', releaseLock);
      window.removeEventListener('keydown', releaseLock);
    };
  }, [doc]);

  useEffect(() => {
    const el = linkRefs.current[activeId];
    if (el) {
      setMarker({ top: el.offsetTop, height: el.offsetHeight });
    }
  }, [activeId, doc]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      clickLockRef.current = id;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <aside className="toc">
      <div className="toc__group">
        <p className="toc__title">On this page</p>
        <nav className="toc__nav">
          {marker ? (
            <span className="toc__marker" style={{ top: marker.top, height: marker.height }} aria-hidden />
          ) : null}
          {items.map((item) => (
            <button
              key={item.id}
              ref={(el) => {
                linkRefs.current[item.id] = el;
              }}
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
        </div>
      </div>
    </aside>
  );
}
