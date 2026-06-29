'use client';

/* time-core.tsx — TimeSegments: the segmented HH:MM machine.
   ─────────────────────────────────────────────────────────────────────────
   A time is not text — it's two bounded numbers. So this is NOT an input
   with validation-after: it's a pair of caret-less segments where every
   keystroke is INTERPRETED, never inserted. Letters never echo; there are
   only four digit positions in existence.

     <TimeSegments
       value="09:30"            // canonical 'HH:mm' (24h) | null
       onCommit={(t) => …}      // fires LIVE, the instant both segments exist
       format="24h"             // '24h' | '12h' (display only — storage is 24h)
       minuteStep={5}           // ↑/↓ granularity for minutes (typing is exact)
       min="09:00" max="17:30"  // clamp bounds — saturate, never error
     />

   THE KEYSTROKE MACHINE (per segment, react-aria/native semantics):
     digit    — extends the pending digit when the pair stays in range
                (1 → 13), else starts fresh; a digit that can't start a
                valid pair auto-completes and ADVANCES (hours '3' → 03:,
                minutes '6' → :06). ':' also advances.
     ↑ / ↓    — steps (hours by 1, minutes by minuteStep snapped to its
                grid, meridiem toggles); wraps; an empty segment seeds
                from the current time.
     ⌫        — clears the segment; on an already-empty minutes segment it
                hops back to hours.
     paste    — liberal in ('9:30 pm', '0930'), strict out ('21:30').

   Commit is LIVE-ON-COMPLETION and CLAMPED: a clamp may only judge a
   COMPLETED entry — commits fire when a segment's entry completes (second
   digit, or a first digit that can't extend), on arrow-step, on paste, and
   on blur of a half-entered segment — never while a digit is pending, or
   the clamp would eat the pending digit and make in-range times like 14:00
   untypeable under min=09:00. min/max are saturation bounds, not validity
   tests — a constrained control never shows an error. Clamps reflect back
   into the segments.

   Variant-blind on purpose (A9): no flags, no knowledge of who mounts it —
   TimeField wraps it in the Input vocabulary, DateTimeField seats it in
   the calendar panel. Paint lives in time.css (.tsg). Buildless global was
   window.TimeSegments; a bundled app imports it. */

import * as React from 'react';

const { useState, useRef, useEffect } = React;

type Meridiem = 'AM' | 'PM';
type Segment = 'h' | 'm';
interface Pending {
  seg: Segment;
  d: number;
}

export interface TimeSegmentsProps {
  value?: string | null; // 'HH:mm' | null
  onCommit?: (value: string) => void;
  format?: '24h' | '12h';
  minuteStep?: number;
  min?: string | null; // 'HH:mm' — clamp bounds (lexical compare is safe)
  max?: string | null;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

const tsgPad = (n: number): string => String(n).padStart(2, '0');
const tsgDisp12 = (h24: number): number => ((h24 + 11) % 12) + 1;
const tsgToH24 = (d12: number, mer: Meridiem): number => (d12 % 12) + (mer === 'PM' ? 12 : 0);

/* one digit into a bounded two-digit segment.
   pend = previously typed digit (or null). Returns the new value and
   whether the segment is saturated (can't accept another digit). */
function tsgFeed(pend: number | null, d: number, hi: number): { val: number; done: boolean } {
  if (pend != null) {
    const n = pend * 10 + d;
    if (n <= hi) return { val: n, done: true };
  }
  return { val: d, done: d * 10 > hi };
}

export function TimeSegments({
  value = null, // 'HH:mm' | null
  onCommit,
  format = '24h',
  minuteStep = 5,
  min = null, // 'HH:mm' — clamp bounds (lexical compare is safe)
  max = null,
  disabled = false,
  ariaLabel = 'Time',
  className = '',
}: TimeSegmentsProps) {
  const is12 = format === '12h';
  const seed = value ? value.split(':').map(Number) : [null, null];

  const [h, setHState] = useState<number | null>(seed[0]); // canonical 0–23
  const [m, setMState] = useState<number | null>(seed[1]);
  const [mer, setMer] = useState<Meridiem>(seed[0] != null && seed[0] >= 12 ? 'PM' : 'AM');
  const [pend, setPendState] = useState<Pending | null>(null); // { seg, d } — mid-entry digit

  /* live mirrors — blur fires SYNCHRONOUSLY (before React re-renders) when
     focus moves between segments, so blur-commit must read these refs,
     never possibly-stale closure state */
  const hLive = useRef<number | null>(seed[0]);
  const mLive = useRef<number | null>(seed[1]);
  const pendLive = useRef<Pending | null>(null);
  const setH = (v: number | null) => {
    hLive.current = v;
    setHState(v);
  };
  const setM = (v: number | null) => {
    mLive.current = v;
    setMState(v);
  };
  const setPend = (v: Pending | null) => {
    pendLive.current = v;
    setPendState(v);
  };

  const hRef = useRef<HTMLSpanElement>(null);
  const mRef = useRef<HTMLSpanElement>(null);
  const merRef = useRef<HTMLSpanElement>(null);
  const lastRef = useRef<string | null>(value || null); // last committed — guards the sync

  /* external value changes (controlled resets) re-seed the segments;
     our own commits are recognized via lastRef and left alone, so a
     commit never clobbers in-flight typing. */
  useEffect(() => {
    if ((value || null) === lastRef.current) return;
    lastRef.current = value || null;
    const p = value ? value.split(':').map(Number) : [null, null];
    setH(p[0]);
    setM(p[1]);
    if (p[0] != null) setMer(p[0] >= 12 ? 'PM' : 'AM');
    setPend(null);
  }, [value]);

  function tryCommit(nh: number | null, nm: number | null) {
    if (nh == null || nm == null) return;
    let t = tsgPad(nh) + ':' + tsgPad(nm);
    if (min && t < min) t = min; /* saturate, never error */
    if (max && t > max) t = max;
    const p = t.split(':').map(Number);
    if (p[0] !== nh) {
      setH(p[0]);
      setMer(p[0] >= 12 ? 'PM' : 'AM');
      setPend(null);
    }
    if (p[1] !== nm) setM(p[1]);
    if (t === lastRef.current) return;
    lastRef.current = t;
    if (onCommit) onCommit(t);
  }

  const focusSeg = (r: React.RefObject<HTMLSpanElement | null>) => {
    if (r.current) r.current.focus();
  };

  /* ── hours ────────────────────────────────────────────────────────────*/
  function onHKey(e: React.KeyboardEvent<HTMLSpanElement>) {
    const k = e.key;
    if (/^[0-9]$/.test(k)) {
      const pd = pend && pend.seg === 'h' ? pend.d : null;
      const r = tsgFeed(pd, +k, is12 ? 12 : 23);
      const nh = is12 ? tsgToH24(r.val === 0 ? 12 : r.val, mer) : r.val;
      setH(nh);
      if (!is12) setMer(nh >= 12 ? 'PM' : 'AM');
      setPend(r.done ? null : { seg: 'h', d: r.val });
      if (r.done) {
        focusSeg(mRef);
        tryCommit(nh, mLive.current);
      }
    } else if (k === 'ArrowUp' || k === 'ArrowDown') {
      const dir = k === 'ArrowUp' ? 1 : -1;
      const nh = h == null ? new Date().getHours() : (h + dir + 24) % 24;
      setH(nh);
      setMer(nh >= 12 ? 'PM' : 'AM');
      setPend(null);
      tryCommit(nh, mLive.current);
    } else if (k === 'Backspace' || k === 'Delete') {
      setH(null);
      setPend(null);
    } else if (k === 'ArrowRight' || k === ':' || k === ';') {
      focusSeg(mRef);
    } else if (k === 'Tab') {
      return;
    } else if (k.length === 1 && !e.metaKey && !e.ctrlKey) {
      /* swallow */
    } else return;
    e.preventDefault();
  }

  /* ── minutes ──────────────────────────────────────────────────────────*/
  function onMKey(e: React.KeyboardEvent<HTMLSpanElement>) {
    const k = e.key;
    if (/^[0-9]$/.test(k)) {
      const pd = pend && pend.seg === 'm' ? pend.d : null;
      const r = tsgFeed(pd, +k, 59);
      setM(r.val);
      setPend(r.done ? null : { seg: 'm', d: r.val });
      if (r.done) {
        if (is12) focusSeg(merRef);
        tryCommit(hLive.current, r.val);
      }
    } else if (k === 'ArrowUp' || k === 'ArrowDown') {
      const dir = k === 'ArrowUp' ? 1 : -1;
      let nm;
      if (m == null) {
        nm = (Math.round(new Date().getMinutes() / minuteStep) * minuteStep) % 60;
      } else {
        /* step to the NEXT grid point, so 07 + ↑(step 5) lands on 10 */
        const next =
          dir > 0
            ? (Math.floor(m / minuteStep) + 1) * minuteStep
            : (Math.ceil(m / minuteStep) - 1) * minuteStep;
        nm = ((next % 60) + 60) % 60;
      }
      setM(nm);
      setPend(null);
      tryCommit(hLive.current, nm);
    } else if (k === 'Backspace' || k === 'Delete') {
      if (m == null && !(pend && pend.seg === 'm')) {
        focusSeg(hRef);
      } else {
        setM(null);
        setPend(null);
      }
    } else if (k === 'ArrowLeft') {
      focusSeg(hRef);
    } else if (k === 'ArrowRight' && is12) {
      focusSeg(merRef);
    } else if (k === 'Tab') {
      return;
    } else if (k.length === 1 && !e.metaKey && !e.ctrlKey) {
      /* swallow */
    } else return;
    e.preventDefault();
  }

  /* ── meridiem (12h only) — a toggle, never empty ──────────────────────*/
  function setMeridiem(next: Meridiem) {
    setMer(next);
    if (h != null) {
      const nh = tsgToH24(tsgDisp12(h), next);
      setH(nh);
      tryCommit(nh, mLive.current);
    }
  }
  function onMerKey(e: React.KeyboardEvent<HTMLSpanElement>) {
    const k = e.key;
    if (k === 'a' || k === 'A') setMeridiem('AM');
    else if (k === 'p' || k === 'P') setMeridiem('PM');
    else if (k === 'ArrowUp' || k === 'ArrowDown') setMeridiem(mer === 'AM' ? 'PM' : 'AM');
    else if (k === 'ArrowLeft') focusSeg(mRef);
    else if (k === 'Tab') {
      return;
    } else if (k.length === 1 && !e.metaKey && !e.ctrlKey) {
      /* swallow */
    } else return;
    e.preventDefault();
  }

  /* ── paste: liberal in, strict out ────────────────────────────────────*/
  function onPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const txt = (e.clipboardData.getData('text') || '').trim();
    const mt =
      txt.match(/^(\d{1,2})[:h.\s]?(\d{2})?\s*([ap])\.?m?\.?$/i) ||
      txt.match(/^(\d{1,2})[:h.\s]?(\d{2})?$/);
    if (!mt) return;
    e.preventDefault();
    let hh = +mt[1];
    const mm = mt[2] != null ? +mt[2] : 0;
    if (mt[3]) hh = tsgToH24(hh, /^p/i.test(mt[3]) ? 'PM' : 'AM');
    if (hh > 23 || mm > 59) return;
    setH(hh);
    setM(mm);
    setMer(hh >= 12 ? 'PM' : 'AM');
    setPend(null);
    tryCommit(hh, mm);
  }

  /* leaving a half-entered segment completes its entry: clear the pending
     digit and commit (clamped) what was typed so far */
  const onSegBlur = (seg: Segment) => () => {
    if (pendLive.current && pendLive.current.seg === seg) {
      setPend(null);
      tryCommit(hLive.current, mLive.current);
    }
  };

  /* pending digit overrides the canonical display, so typing '0' in 12h
     shows '00' (awaiting its pair), not a premature '12' */
  const hText =
    pend && pend.seg === 'h' ? tsgPad(pend.d) : h == null ? '--' : tsgPad(is12 ? tsgDisp12(h) : h);
  const mText = pend && pend.seg === 'm' ? tsgPad(pend.d) : m == null ? '--' : tsgPad(m);

  const segCls = (empty: boolean): string => 'tsg__seg' + (empty ? ' is-empty' : '');
  const tab = disabled ? -1 : 0;

  return (
    <div
      className={('tsg' + (disabled ? ' is-disabled' : '') + ' ' + className).trim()}
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onPaste={onPaste}
    >
      <span
        ref={hRef}
        className={segCls(h == null && !(pend && pend.seg === 'h'))}
        role="spinbutton"
        tabIndex={tab}
        aria-label="Hours"
        aria-valuemin={is12 ? 1 : 0}
        aria-valuemax={is12 ? 12 : 23}
        aria-valuenow={h == null ? undefined : is12 ? tsgDisp12(h) : h}
        aria-valuetext={h == null ? 'Empty' : hText}
        onKeyDown={disabled ? undefined : onHKey}
        onBlur={onSegBlur('h')}
      >
        {hText}
      </span>
      <span className="tsg__sep" aria-hidden="true">
        :
      </span>
      <span
        ref={mRef}
        className={segCls(m == null && !(pend && pend.seg === 'm'))}
        role="spinbutton"
        tabIndex={tab}
        aria-label="Minutes"
        aria-valuemin={0}
        aria-valuemax={59}
        aria-valuenow={m == null ? undefined : m}
        aria-valuetext={m == null ? 'Empty' : mText}
        onKeyDown={disabled ? undefined : onMKey}
        onBlur={onSegBlur('m')}
      >
        {mText}
      </span>
      {is12 ? (
        <span
          ref={merRef}
          className="tsg__seg tsg__seg--mer"
          role="spinbutton"
          tabIndex={tab}
          aria-label="AM or PM"
          aria-valuetext={mer}
          onKeyDown={disabled ? undefined : onMerKey}
        >
          {mer}
        </span>
      ) : null}
    </div>
  );
}
