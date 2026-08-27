'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { GROUPS } from '../content/registry';
import { Icon } from './icon';

interface CommandMenuProps {
  open: boolean;
  onClose: () => void;
}

interface SearchItem {
  slug: string;
  label: string;
  blurb: string;
  groupTitle: string;
}

export function CommandMenu({ open, onClose }: CommandMenuProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const allItems: SearchItem[] = GROUPS.flatMap((g) =>
    g.docs.map((d) => ({ slug: d.slug, label: d.label, blurb: d.blurb, groupTitle: g.title })),
  );

  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.blurb.toLowerCase().includes(query.toLowerCase()) ||
          item.groupTitle.toLowerCase().includes(query.toLowerCase()) ||
          item.slug.toLowerCase().includes(query.toLowerCase()),
      )
    : allItems;

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          router.push(`/${filtered[selectedIndex].slug}`);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filtered, selectedIndex, router, onClose]);

  if (!open) return null;

  return (
    <div className="cmd-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cmd-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-search">
          <Icon name="magnifying-glass" size="md" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-input"
            placeholder="Search documentation, components..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="cmd-badge">ESC</span>
        </div>

        <div className="cmd-list">
          {filtered.length === 0 ? (
            <div className="cmd-empty">No results found for &ldquo;{query}&rdquo;</div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.slug}
                type="button"
                className={`cmd-item ${i === selectedIndex ? 'cmd-item--selected' : ''}`}
                onClick={() => {
                  router.push(`/${item.slug}`);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <div className="cmd-item__icon">
                  <Icon name="code" size="sm" />
                </div>
                <div className="cmd-item__text">
                  <div className="cmd-item__top">
                    <span className="cmd-item__label">{item.label}</span>
                    <span className="cmd-item__group">{item.groupTitle}</span>
                  </div>
                  <span className="cmd-item__blurb">{item.blurb}</span>
                </div>
                <Icon name="arrow-right" size="sm" />
              </button>
            ))
          )}
        </div>

        <div className="cmd-footer">
          <div className="cmd-footer__hint">
            <span className="cmd-key">↑</span>
            <span className="cmd-key">↓</span> Navigate
          </div>
          <div className="cmd-footer__hint">
            <span className="cmd-key">↵</span> Select
          </div>
          <div className="cmd-footer__hint">
            <span className="cmd-key">ESC</span> Close
          </div>
        </div>
      </div>
    </div>
  );
}
