'use client';

/* DrpPanel - the portaled range-calendar surface for DateRangeField: a two-click
   anchor+hover range, quick-range presets, one or two months, band + cap painting.
   Lives in its own module so the field file stays a thin wrapper (mirrors calendar-panel);
   also owns the range-text formatter the trigger display reuses. */

import './date-picker.css';
import { Fragment, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon } from '../icon/Icon';
import { Button } from '../button/Button';
import { GlidePill, useGlide, useLayoutSelfHeal } from '../motion/glide';
import { useDayFocus } from './use-day-focus';
import { MONTHS, DOW, pad, key as toKey, parse, today, add, col, grid, tzLabel, within } from './date-utils';

/** A date range as wall-clock 'YYYY-MM-DD' endpoints, inclusive. */
export interface DateRange {
  /** Range start, inclusive - `'YYYY-MM-DD'`. */
  start: string;
  /** Range end, inclusive - `'YYYY-MM-DD'`. Never before `start`. */
  end: string;
}

interface DrpPreset {
  id: string;
  label: string;
  start: string;
  end: string;
}

function drpDisplay(key: string, withYear: boolean): string {
  const d = parse(key);
  const mon = MONTHS[d.getMonth()].slice(0, 3);
  return mon + ' ' + pad(d.getDate()) + (withYear ? ', ' + d.getFullYear() : '');
}
export function drpRangeText(start: string, end: string): string {
  const sameYear = parse(start).getFullYear() === parse(end).getFullYear();
  const curYear = new Date().getFullYear();
  const startYr = !sameYear || parse(start).getFullYear() !== curYear;
  const endYr = parse(end).getFullYear() !== curYear;
  return drpDisplay(start, startYr) + ' - ' + drpDisplay(end, endYr);
}
const drpDays = (start: string, end: string): number => Math.round((+parse(end) - +parse(start)) / 86400000) + 1;

function drpPresets(): DrpPreset[] {
  const t = today();
  const now = new Date();
  const firstThis = toKey(new Date(now.getFullYear(), now.getMonth(), 1));
  const firstPrev = toKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const lastPrev = toKey(new Date(now.getFullYear(), now.getMonth(), 0));
  const jan1 = toKey(new Date(now.getFullYear(), 0, 1));
  return [
    { id: 'today', label: 'Today', start: t, end: t },
    { id: 'yest', label: 'Yesterday', start: add(t, -1), end: add(t, -1) },
    { id: '7d', label: 'Last 7 days', start: add(t, -6), end: t },
    { id: '30d', label: 'Last 30 days', start: add(t, -29), end: t },
    { id: 'mtd', label: 'This month', start: firstThis, end: t },
    { id: 'lastm', label: 'Last month', start: firstPrev, end: lastPrev },
    { id: '90d', label: 'Last 90 days', start: add(t, -89), end: t },
    { id: 'ytd', label: 'Year to date', start: jan1, end: t },
  ];
}

interface DrpPanelProps {
  value: DateRange | null;
  commit: (value: DateRange) => void;
  close: () => void;
  min?: string;
  max?: string;
  timezone?: string;
  label?: string;
  months: number;
  layout: 'popover' | 'sheet';
}

/* the popover/sheet panel, mounted only while open */
export function DrpPanel({ value, commit, close, min, max, timezone, label, months, layout }: DrpPanelProps) {
  const seedKey = (value && value.start) || today();
  const seed = parse(seedKey);
  const [view, setView] = useState<{ y: number; m: number }>({ y: seed.getFullYear(), m: seed.getMonth() });

  /* anchor !== null - a range is being dragged open (awaiting the 2nd pick) */
  const [anchor, setAnchor] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState<string>(seedKey);

  const daysRef = useRef<HTMLDivElement>(null);
  const presetsRef = useRef<HTMLDivElement>(null);
  const armFocus = useDayFocus(daysRef, focusKey);

  /* gliding hover pill per zone (see ../motion/glide); hoverKey drives the preview band, not the pill - the pill idles once an anchor is set. */
  const gridGlide = useGlide(daysRef);
  const presetGlide = useGlide(presetsRef);
  /* the caps FLIP between cells while the popover may still be scale-entering - self-heal at rest */
  const healLo = useLayoutSelfHeal<HTMLSpanElement>();
  const healHi = useLayoutSelfHeal<HTMLSpanElement>();

  const inBounds = (key: string): boolean => within(key, min, max);

  /* effective lo/hi for PAINT: mid-selection - anchorandhover; else committed */
  let lo: string | null = null,
    hi: string | null = null,
    provisional = false;
  if (anchor) {
    const other = hoverKey || anchor;
    lo = anchor < other ? anchor : other;
    hi = anchor < other ? other : anchor;
    provisional = true;
  } else if (value && value.start && value.end) {
    lo = value.start;
    hi = value.end;
  }

  function pickDay(key: string) {
    if (!inBounds(key)) return;
    if (!anchor) {
      setAnchor(key);
      setHoverKey(key);
    } else {
      const start = anchor < key ? anchor : key;
      const end = anchor < key ? key : anchor;
      setAnchor(null);
      setHoverKey(null);
      commit({ start: start, end: end });
    }
  }

  function applyPreset(p: DrpPreset) {
    setAnchor(null);
    setHoverKey(null);
    const d = parse(p.start);
    setView({ y: d.getFullYear(), m: d.getMonth() });
    setFocusKey(p.start);
    commit({ start: p.start, end: p.end });
  }

  function nav(dir: number) {
    setView((v) => {
      const d = new Date(v.y, v.m + dir, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  /* directional month slide via CSS keyframe on a keyed grid remount - Motion animate() fights the layoutId caps; direction from the viewIdx delta, the first mount gets none. */
  const viewIdx = view.y * 12 + view.m;
  const prevViewIdxRef = useRef(viewIdx);
  const navDir = prevViewIdxRef.current === viewIdx ? 0 : viewIdx > prevViewIdxRef.current ? 1 : -1;
  useEffect(() => {
    prevViewIdxRef.current = viewIdx;
  }, [viewIdx]);

  function moveFocus(deltaDays: number) {
    const key = add(focusKey, deltaDays);
    const d = parse(key);
    armFocus();
    setFocusKey(key);
    if (anchor) setHoverKey(key);
    const first = view.y * 12 + view.m;
    const idx = d.getFullYear() * 12 + d.getMonth();
    const last = first + (months - 1);
    if (idx < first) setView({ y: d.getFullYear(), m: d.getMonth() });
    else if (idx > last) {
      const back = new Date(d.getFullYear(), d.getMonth() - (months - 1), 1);
      setView({ y: back.getFullYear(), m: back.getMonth() });
    }
  }
  function onGridKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const k = e.key;
    if (k === 'ArrowLeft') moveFocus(-1);
    else if (k === 'ArrowRight') moveFocus(1);
    else if (k === 'ArrowUp') moveFocus(-7);
    else if (k === 'ArrowDown') moveFocus(7);
    else if (k === 'PageUp') {
      nav(-1);
      return;
    } else if (k === 'PageDown') {
      nav(1);
      return;
    } else if (k === 'Enter' || k === ' ') pickDay(focusKey);
    else if (k === 'Escape' && anchor) {
      setAnchor(null);
      setHoverKey(null);
    } else return;
    e.preventDefault();
  }

  const todayKey = today();
  function renderDay(d: Date, viewMonth: number) {
    const key = toKey(d);
    const out = d.getMonth() !== viewMonth;
    const disabled = !inBounds(key);
    const dayCol = col(d);

    const isLo = lo && key === lo;
    const isHi = hi && key === hi;
    const single = lo && hi && lo === hi;
    const inRange = lo && hi && key >= lo && key <= hi;
    /* the provisional (un-committed) end gets the outlined ghost cap; the anchor stays solid. */
    const loGhost = provisional && isLo && lo !== anchor;
    const hiGhost = provisional && isHi && !single && hi !== anchor;

    const band = inRange && !single;
    const extL = band && !isLo && dayCol !== 0;
    const extR = band && !isHi && dayCol !== 6;

    /* a boundary date shows in two cells (two-month view); the cap is a shared-layoutId node, so render it in exactly one - the in-month cell. */
    const capHere = months === 1 || !out;
    const loCap = isLo && capHere;
    const hiCap = isHi && !single && capHere;

    const cls = ['dtp__day'];
    if (out) cls.push('is-out');
    if (inRange) cls.push('is-in-range');
    if ((loGhost || hiGhost) && capHere) cls.push('is-cap-ghost');
    else if (loCap || hiCap) cls.push('is-cap');

    const bandCls = ['drp__band'];
    if (extL) bandCls.push('drp__band--extL');
    if (extR) bandCls.push('drp__band--extR');
    if (!extL) bandCls.push('drp__band--roundL');
    if (!extR) bandCls.push('drp__band--roundR');

    return (
      <button
        key={key}
        type="button"
        role="gridcell"
        data-key={key}
        className={cls.join(' ')}
        disabled={disabled}
        tabIndex={key === focusKey ? 0 : -1}
        aria-label={MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()}
        aria-selected={isLo || isHi || undefined}
        onClick={() => pickDay(key)}
        onPointerEnter={(e) => {
          setHoverKey(key);
          if (!anchor && !disabled) gridGlide.enter(e.currentTarget);
          else gridGlide.leave();
        }}
      >
        {band ? <span className={bandCls.join(' ')} aria-hidden="true"></span> : null}
        {loCap ? (
          <motion.span
            className={'drp__cap' + (loGhost ? ' drp__cap--ghost' : '')}
            layoutId="drp-cap-lo"
            transition={UIMotion.t.settle}
            aria-hidden="true"
            ref={healLo.ref}
            onLayoutAnimationComplete={healLo.onLayoutAnimationComplete}
          ></motion.span>
        ) : null}
        {hiCap ? (
          <motion.span
            className={'drp__cap' + (hiGhost ? ' drp__cap--ghost' : '')}
            layoutId="drp-cap-hi"
            transition={UIMotion.t.settle}
            aria-hidden="true"
            ref={healHi.ref}
            onLayoutAnimationComplete={healHi.onLayoutAnimationComplete}
          ></motion.span>
        ) : null}
        <span className="dtp__num">{d.getDate()}</span>
        {key === todayKey ? <span className="dtp__dot" aria-hidden="true"></span> : null}
      </button>
    );
  }

  function renderMonth(offset: number, withPrev: boolean, withNext: boolean) {
    const base = new Date(view.y, view.m + offset, 1);
    const y = base.getFullYear(),
      m = base.getMonth();
    const cells = grid(y, m);
    const prevEnd = toKey(new Date(y, m, 0));
    const nextStart = toKey(new Date(y, m + 1, 1));
    return (
      <div className="dtp__cal" key={offset}>
        <div className={'drp__mhead' + (withNext && !withPrev ? ' drp__mhead--right' : '')}>
          {withPrev ? (
            <button
              type="button"
              className="dtp__nav"
              aria-label="Previous month"
              disabled={min && prevEnd < min}
              onClick={() => nav(-1)}
            >
              <Icon name="caret-left" size="sm" />
            </button>
          ) : null}
          <span className="dtp__month">
            {MONTHS[m]} <span className="dtp__year">{y}</span>
          </span>
          {withNext ? (
            <button
              type="button"
              className="dtp__nav"
              aria-label="Next month"
              disabled={max && nextStart > max}
              onClick={() => nav(1)}
            >
              <Icon name="caret-right" size="sm" />
            </button>
          ) : null}
        </div>
        <div className="dtp__dow" aria-hidden="true">
          {DOW.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div
          className="dtp__days"
          role="grid"
          aria-label={MONTHS[m] + ' ' + y}
          key={'days-' + viewIdx + '-' + offset}
          data-enter={navDir || undefined}
        >
          {cells.map((d) => renderDay(d, m))}
        </div>
      </div>
    );
  }

  const presets = drpPresets();
  function presetActive(p: DrpPreset): boolean {
    return value && value.start === p.start && value.end === p.end;
  }

  return (
    <div
      className={'drp' + (layout === 'sheet' ? ' drp--sheet' : '')}
      role="dialog"
      aria-label={label || 'Pick a date range'}
    >
      <div className="drp__body">
        <div
          className="drp__presets"
          role="group"
          aria-label="Quick ranges"
          ref={presetsRef}
          onPointerLeave={presetGlide.leave}
        >
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              className={'drp__preset' + (presetActive(p) ? ' is-active' : '')}
              onPointerEnter={(e) => presetGlide.enter(e.currentTarget)}
              onClick={() => applyPreset(p)}
            >
              {p.label}
            </button>
          ))}
          <GlidePill className="drp__presetGlide" rect={presetGlide.rect} active={presetGlide.active} />
        </div>
        <div
          className="drp__months"
          ref={daysRef}
          onKeyDown={onGridKeyDown}
          onPointerLeave={() => {
            if (anchor) setHoverKey(anchor);
            gridGlide.leave();
          }}
        >
          {months === 2 ? [renderMonth(0, true, false), renderMonth(1, false, true)] : renderMonth(0, true, true)}
          <GlidePill className="dtp__hover" rect={gridGlide.rect} active={gridGlide.active} />
        </div>
      </div>
      <div className="drp__foot">
        <span className={'drp__readout' + (lo && hi ? '' : ' is-empty')}>
          {lo && hi ? (
            <Fragment>
              {drpRangeText(lo, hi)}{' '}
              <span className="drp__count">
                - {drpDays(lo, hi)} {drpDays(lo, hi) === 1 ? 'day' : 'days'}
              </span>
            </Fragment>
          ) : anchor ? (
            'Pick the end date'
          ) : (
            'Pick a start date'
          )}
        </span>
        {timezone ? <span className="drp__tz">{tzLabel(timezone)}</span> : null}
        <span className="drp__footSpacer"></span>
        <Button variant="primary" size="sm" onClick={close}>
          Done
        </Button>
      </div>
    </div>
  );
}
