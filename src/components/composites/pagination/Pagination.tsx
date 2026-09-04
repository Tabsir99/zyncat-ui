'use client';

import './pagination.css';

import { useEffect, useRef, type HTMLAttributes } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { animate } from '../../../engine';
import { slideIn } from '../../../motion/presets';
import { UIMotion } from '../../../tokens/motion-tokens';
import { Icon } from '../../internal/icon/Icon';
import { cx } from '../../internal/utils/cx';
import { Button } from '../../primitives/button/Button';

export interface PaginationProps {
  /** Accessible name for the nav landmark - name the list ("Posts"), not "pagination". @default 'Pagination' */
  ariaLabel?: string;
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
  /** Standard <nav> attributes (style, data-*, aria-*, ...) forwarded to the root. */
  htmlProps?: Omit<HTMLAttributes<HTMLElement>, 'className'> & DataAttributes;
}

function pgnFormat(n: number) {
  return n.toLocaleString('en-US').replace(/,/g, '\u2009');
}

export function Pagination({
  ariaLabel = 'Pagination',
  range,
  total = null,
  hasPrev = false,
  hasNext = false,
  onPrev,
  onNext,
  loading = false,
  className = '',
  htmlProps,
}: PaginationProps) {
  const rangeRef = useRef<HTMLSpanElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const shownRef = useRef<[number, number]>(range);
  const lastDirRef = useRef(0);

  const from = range[0];
  const to = range[1];

  useEffect(() => {
    const pf = shownRef.current[0],
      pt = shownRef.current[1];
    if (pf === from && pt === to) return;
    const dir = from > pf ? 1 : -1;
    shownRef.current = range;
    if (rangeRef.current) animate(rangeRef.current, slideIn(dir * UIMotion.dist.sm, UIMotion.t.enter));
  }, [from, to]);

  useEffect(() => {
    if (loading || document.activeElement !== document.body) return;
    const d = lastDirRef.current;
    if (d === 1 && !hasNext && hasPrev && prevBtnRef.current) prevBtnRef.current.focus();
    if (d === -1 && !hasPrev && hasNext && nextBtnRef.current) nextBtnRef.current.focus();
  }, [loading, hasPrev, hasNext]);

  const prevBusy = loading && lastDirRef.current === -1;
  const nextBusy = loading && lastDirRef.current === 1;

  return (
    <nav className={cx('zc-pgn', className)} aria-label={ariaLabel} aria-busy={loading || undefined} {...htmlProps}>
      <span className="zc-pgn__readout" aria-live="polite">
        <span className="zc-pgn__range" ref={rangeRef}>
          <b>
            {pgnFormat(from)}-{pgnFormat(to)}
          </b>
          {total != null ? <span className="zc-pgn__total"> of {pgnFormat(total)}</span> : null}
        </span>
      </span>
      <div className="zc-pgn__nav">
        <Button
          variant="ghost"
          size="sm"
          ref={prevBtnRef}
          className="zc-pgn__btn zc-pgn__btn--prev"
          loading={prevBusy}
          disabled={!hasPrev || loading}
          htmlProps={{ 'aria-label': 'Previous page' }}
          onClick={() => {
            lastDirRef.current = -1;
            if (onPrev) onPrev();
          }}
        >
          <Icon name="caret-left" size="sm" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          ref={nextBtnRef}
          className="zc-pgn__btn zc-pgn__btn--next"
          loading={nextBusy}
          disabled={!hasNext || loading}
          htmlProps={{ 'aria-label': 'Next page' }}
          onClick={() => {
            lastDirRef.current = 1;
            if (onNext) onNext();
          }}
        >
          <Icon name="caret-right" size="sm" />
        </Button>
      </div>
    </nav>
  );
}
