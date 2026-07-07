'use client';

/* Pagination - pure cursor strip: mono range readout + prev/next, no page numbers. */

import './pagination.css';
/* The nav arrows render .btn classes - button.css must ride along. */
import '../button/button.css';
import * as React from 'react';
import { animate } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { tokenPx } from '../token-px';
import { Icon } from '../icon/Icon';

export interface PaginationProps {
  /** Accessible name for the nav landmark - name the list ("Posts"), not "pagination". @default 'Pagination' */
  label?: string;
  /** Items currently shown, 1-based inclusive: `[from, to]` (e.g. `[26, 50]`). */
  range: [number, number];
  /** Total item count - render `of N` only when the API reports one; omit for endless lists. */
  total?: number | null;
  /** A previous cursor exists. @default false */
  hasPrev?: boolean;
  /** A next cursor exists. @default false */
  hasNext?: boolean;
  /** Fired when the previous arrow is pressed. */
  onPrev?: () => void;
  /** Fired when the next arrow is pressed. */
  onNext?: () => void;
  /** A page fetch is in flight: both arrows go inert, the clicked arrow carries the spinner. @default false */
  loading?: boolean;
  /** Extra class(es) merged onto the root element. */
  className?: string;
}

const { useEffect, useRef } = React;

/* range-swap travel distance - resolved once, on first use */
let pgnTravelPx: number | null = null;
function pgnTravel() {
  if (pgnTravelPx == null) pgnTravelPx = tokenPx('--space-2');
  return pgnTravelPx;
}

/* thin-space thousands grouping ("48 210") - section E mono-numeral convention */
function pgnFormat(n: number) {
  return n.toLocaleString('en-US').replace(/,/g, '\u2009');
}

export function Pagination({
  label = 'Pagination',
  range,
  total = null,
  hasPrev = false,
  hasNext = false,
  onPrev,
  onNext,
  loading = false,
  className = '',
}: PaginationProps) {
  const rangeRef = useRef<HTMLSpanElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const shownRef = useRef<[number, number]>(range); // last range rendered (skip first mount)
  const lastDirRef = useRef(0); // -1 prev - +1 next - last arrow fired

  const from = range[0];
  const to = range[1];

  /* direction-aware entrance: new numbers arrive from the side you traveled toward (one persistent node, imperative keyframes) */
  useEffect(() => {
    const pf = shownRef.current[0],
      pt = shownRef.current[1];
    if (pf === from && pt === to) return;
    const dir = from > pf ? 1 : -1;
    shownRef.current = range;
    animate(rangeRef.current, { x: [dir * pgnTravel(), 0], opacity: [0, 1] }, UIMotion.t.enter);
  }, [from, to]);

  /* edge disables the focused arrow and focus falls to <body> - hand it to the surviving direction; activeElement guard avoids stealing focus */
  useEffect(() => {
    if (loading || document.activeElement !== document.body) return;
    const d = lastDirRef.current;
    if (d === 1 && !hasNext && hasPrev && prevBtnRef.current) prevBtnRef.current.focus();
    if (d === -1 && !hasPrev && hasNext && nextBtnRef.current) nextBtnRef.current.focus();
  }, [loading, hasPrev, hasNext]);

  const prevBusy = loading && lastDirRef.current === -1;
  const nextBusy = loading && lastDirRef.current === 1;

  return (
    <nav
      className={('pgn ' + className).trim()}
      aria-label={label}
      aria-busy={loading || undefined}
    >
      <span className="pgn__readout" aria-live="polite">
        <span className="pgn__range" ref={rangeRef}>
          <b>
            {pgnFormat(from)}-{pgnFormat(to)}
          </b>
          {total != null ? <span className="pgn__total"> of {pgnFormat(total)}</span> : null}
        </span>
      </span>
      <div className="pgn__nav">
        <button
          type="button"
          ref={prevBtnRef}
          className={
            'btn btn--ghost btn--sm pgn__btn pgn__btn--prev' + (prevBusy ? ' is-loading' : '')
          }
          disabled={!hasPrev || loading}
          aria-label="Previous page"
          onClick={() => {
            lastDirRef.current = -1;
            if (onPrev) onPrev();
          }}
        >
          <Icon name="caret-left" size="sm" />
          {prevBusy ? <span className="btn__spinner" aria-hidden="true"></span> : null}
        </button>
        <button
          type="button"
          ref={nextBtnRef}
          className={
            'btn btn--ghost btn--sm pgn__btn pgn__btn--next' + (nextBusy ? ' is-loading' : '')
          }
          disabled={!hasNext || loading}
          aria-label="Next page"
          onClick={() => {
            lastDirRef.current = 1;
            if (onNext) onNext();
          }}
        >
          <Icon name="caret-right" size="sm" />
          {nextBusy ? <span className="btn__spinner" aria-hidden="true"></span> : null}
        </button>
      </div>
    </nav>
  );
}
