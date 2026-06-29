'use client';

/* Pagination.jsx — cursor pagination strip.
   ─────────────────────────────────────────────────────────────────────────
   The API is PURE cursor — there are no offsets and no page numbers,
   so this component never renders `1 2 3 …`. It is the honest cursor shape:
   a mono range readout (`26–50 of 312`) and a prev/next pair. Stateless about
   data: the consumer owns the cursors and fetching; this strip renders the
   contract (range / hasPrev / hasNext / loading) and emits onPrev / onNext.

   Polish lives in three places:
     • the readout slides IN THE DIRECTION OF TRAVEL when the range changes —
       one persistent node driven by imperative keyframes (the Tabs lesson:
       no keyed remount, no AnimatePresence needed for a cut-and-enter);
     • while `loading`, the arrow the user actually clicked carries the
       spinner (Button's own loading affordance), both arrows go inert;
     • reaching an edge disables the button under focus — focus is handed to
       the surviving direction instead of being dropped on <body>.

   Buttons ARE the Button primitive (its class vocabulary: btn--ghost btn--sm,
   .btn__spinner), per A8 — nothing re-invented. All styling in pagination.css. */

import * as React from 'react';
import { animate } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon } from '../icon/Icon';

export interface PaginationProps {
  /**
   * Accessible name for the nav landmark — name the list it pages
   * ("Posts", "Invoices"), not the word "pagination".
   * @default 'Pagination'
   */
  label?: string;
  /** Items currently shown, 1-based inclusive: `[from, to]` (e.g. `[26, 50]`). */
  range: [number, number];
  /**
   * Total item count — render `of N` only when the API reports one.
   * Omit for endless cursor lists (logs, comments).
   */
  total?: number | null;
  /** A previous cursor exists. @default false */
  hasPrev?: boolean;
  /** A next cursor exists. @default false */
  hasNext?: boolean;
  /** Fired when the previous arrow is pressed. */
  onPrev?: () => void;
  /** Fired when the next arrow is pressed. */
  onNext?: () => void;
  /**
   * A page fetch is in flight: both arrows go inert and the arrow the user
   * clicked carries the spinner. Drive this from your query state.
   * @default false
   */
  loading?: boolean;
  className?: string;
}

const { useEffect, useRef } = React;

/* --space-2 in real px. NOTE the rem→px conversion — tokens resolve to
   "0.5rem"; bare parseFloat gives 0.5 (the trap logged in progress.md
   2026-06-10, same fix as overlay-core's ovReadPx / Toast's stackGap). */
let pgnTravelPx: number | null = null;
function pgnTravel() {
  if (pgnTravelPx == null) {
    const cs = getComputedStyle(document.documentElement);
    const v = cs.getPropertyValue('--space-2').trim();
    const n = parseFloat(v);
    pgnTravelPx = v.endsWith('rem') ? n * parseFloat(cs.fontSize) : n;
  }
  return pgnTravelPx;
}

/* §E: numbers precise and consistent — thin-space thousands grouping
   ("48 210"), matching the system's mono-numeral convention. */
function pgnFormat(n: number) {
  return n.toLocaleString('en-US').replace(/,/g, '\u2009');
}

export function Pagination({
  label = 'Pagination', // aria-label for the nav landmark
  range, // [from, to] — 1-based inclusive items shown
  total = null, // optional — omit when the API doesn't report one
  hasPrev = false,
  hasNext = false,
  onPrev,
  onNext,
  loading = false, // fetch in flight — strip goes inert
  className = '',
}: PaginationProps) {
  const rangeRef = useRef<HTMLSpanElement>(null); // the sliding readout node
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const shownRef = useRef<[number, number]>(range); // last range rendered (skip first mount)
  const lastDirRef = useRef(0); // -1 prev · +1 next — last arrow fired

  const from = range[0];
  const to = range[1];

  /* Direction-aware readout entrance: when the range changes, the new
     numbers arrive from the side you traveled toward. One persistent node,
     imperative keyframes (progress.md 2026-06-10, S-tabs addendum). */
  useEffect(() => {
    const pf = shownRef.current[0],
      pt = shownRef.current[1];
    if (pf === from && pt === to) return;
    const dir = from > pf ? 1 : -1;
    shownRef.current = range;
    animate(
      rangeRef.current,
      { x: [dir * pgnTravel(), 0], opacity: [0, 1] },
      UIMotion.t.enter,
    );
  }, [from, to]);

  /* Focus continuity: hitting an edge disables the arrow under focus and
     the browser drops focus to <body>; hand it to the surviving direction.
     The activeElement guard means we never steal focus from elsewhere. */
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
            {pgnFormat(from)}–{pgnFormat(to)}
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
