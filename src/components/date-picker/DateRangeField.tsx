'use client';

/* DateRangeField.tsx — date-range picker.
   ─────────────────────────────────────────────────────────────────────────
   A9 SIBLING of DateField: a different value shape ({ start, end }) owns its
   own component. It reuses DateField's day-cell vocabulary (the .dtp__*
   classes) but the STATE is range-native and lives here end-to-end — there is
   no shared core that knows "which variant is calling".

     <DateRangeField
       label="Reporting period"
       value={{ start: '2026-06-12', end: '2026-06-18' }}   // | null
       onChange={(r) => …}                                   // { start, end }
       min="2026-01-01" max="2026-12-31"
     />

   THE SELECTION MODEL (Linear/Notion, the expected one):
     • 1st click sets the ANCHOR. While only the anchor exists, hover (or
       arrow-key) shows a LIVE PREVIEW band from anchor to that day, with a
       tentative outlined cap on the provisional end.
     • 2nd click commits — and AUTO-ORDERS: clicking before the anchor makes
       the earlier day the start. No rejection, no error state, ever.
     • clicking a COMPLETE range starts fresh. Commit is HONEST — onChange
       fires only when both ends exist (a lone anchor never commits).
     • presets (analytics) commit immediately and move the view to show the
       result.

   RESPONSIVE: the SAME Overlay switches mode by viewport — anchored popover
   with two months ≥640px, bottom SHEET with one month below it. The
   breakpoint is read through useResponsiveOverlayMode() — STAGED as a shared
   util proposal (A6): every overlay-bearing field wants this, so it belongs
   in the shared layer, not hardcoded per component.

   Primitives consumed (A8): Overlay (popover|sheet existence/placement/
   dismiss/drag), the .fld Input vocabulary, Icon. */

import * as React from 'react';
import { motion } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon } from '../icon/Icon';
import { Overlay } from '../overlay/Overlay';
import { FieldShell, useControllable } from './field-shell';
import { GlidePill, useGlide } from './glide-pill';
import {
  MONTHS as DRP_MONTHS,
  DOW as DRP_DOW,
  pad as drpPad,
  key as drpKey,
  parse as drpParse,
  today as drpToday,
  add as drpAdd,
  col as drpCol,
  grid as drpGrid,
  tzLabel as drpTzLabel,
} from './date-utils';

const { useState, useRef, useEffect } = React;
const drpMotion = motion;
const drpSM = UIMotion;

/** A date range as wall-clock 'YYYY-MM-DD' endpoints, inclusive. */
export interface DateRange {
  start: string;
  end: string;
}

interface DrpPreset {
  id: string;
  label: string;
  start: string;
  end: string;
}

function drpDisplay(key: string, withYear: boolean): string {
  const d = drpParse(key);
  const mon = DRP_MONTHS[d.getMonth()].slice(0, 3);
  return mon + ' ' + drpPad(d.getDate()) + (withYear ? ', ' + d.getFullYear() : '');
}
function drpRangeText(start: string, end: string): string {
  const sameYear = drpParse(start).getFullYear() === drpParse(end).getFullYear();
  const curYear = new Date().getFullYear();
  const startYr = !sameYear || drpParse(start).getFullYear() !== curYear;
  const endYr = drpParse(end).getFullYear() !== curYear;
  return drpDisplay(start, startYr) + ' – ' + drpDisplay(end, endYr);
}
const drpDays = (start: string, end: string): number =>
  Math.round((+drpParse(end) - +drpParse(start)) / 86400000) + 1;

/* ── presets (analytics) — relative to today ───────────────────────────────*/
function drpPresets(): DrpPreset[] {
  const t = drpToday();
  const now = new Date();
  const firstThis = drpKey(new Date(now.getFullYear(), now.getMonth(), 1));
  const firstPrev = drpKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const lastPrev = drpKey(new Date(now.getFullYear(), now.getMonth(), 0));
  const jan1 = drpKey(new Date(now.getFullYear(), 0, 1));
  return [
    { id: 'today', label: 'Today', start: t, end: t },
    { id: 'yest', label: 'Yesterday', start: drpAdd(t, -1), end: drpAdd(t, -1) },
    { id: '7d', label: 'Last 7 days', start: drpAdd(t, -6), end: t },
    { id: '30d', label: 'Last 30 days', start: drpAdd(t, -29), end: t },
    { id: 'mtd', label: 'This month', start: firstThis, end: t },
    { id: 'lastm', label: 'Last month', start: firstPrev, end: lastPrev },
    { id: '90d', label: 'Last 90 days', start: drpAdd(t, -89), end: t },
    { id: 'ytd', label: 'Year to date', start: jan1, end: t },
  ];
}

/* ── responsive overlay mode — STAGED shared-util proposal (A6) ────────────*/
function useResponsiveOverlayMode(query?: string): boolean {
  const q = query || '(max-width: 640px)';
  const [narrow, setNarrow] = useState(() =>
    typeof matchMedia === 'function' ? matchMedia(q).matches : false,
  );
  useEffect(() => {
    const mq = matchMedia(q);
    const fn = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mq.addEventListener('change', fn);
    setNarrow(mq.matches);
    return () => mq.removeEventListener('change', fn);
  }, [q]);
  return narrow;
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

/* ── the popover/sheet panel · mounted only while open ─────────────────────*/
function DrpPanel({
  value,
  commit,
  close,
  min,
  max,
  timezone,
  label,
  months,
  layout,
}: DrpPanelProps) {
  const seedKey = (value && value.start) || drpToday();
  const seed = drpParse(seedKey);
  const [view, setView] = useState<{ y: number; m: number }>({
    y: seed.getFullYear(),
    m: seed.getMonth(),
  });

  /* anchor !== null ⇒ a range is being dragged open (awaiting the 2nd pick) */
  const [anchor, setAnchor] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState<string>(seedKey);

  const daysRef = useRef<HTMLDivElement>(null);
  const presetsRef = useRef<HTMLDivElement>(null);
  const pendingFocusRef = useRef(false);

  /* gliding hover — ONE PERSISTENT pill per zone (grid + presets): it
     TRAVELS to the hovered cell/preset and never remounts, so the spring
     retargets in flight instead of re-easing a fresh tween at each boundary
     (that remount-restart was the stutter). Each zone's geometry lives in a
     useGlide; `hoverKey` below stays — it drives the preview BAND, not the
     pill. The grid pill rides only while idle (no anchor); once an anchor is
     set the band is the feedback, so the pill steps aside (fades in place). */
  const grid = useGlide(daysRef);
  const presetGlide = useGlide(presetsRef);

  const inBounds = (key: string): boolean => (!min || key >= min) && (!max || key <= max);

  /* effective lo/hi for PAINT: mid-selection ⇒ anchor↔hover; else committed */
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
    const d = drpParse(p.start);
    setView({ y: d.getFullYear(), m: d.getMonth() });
    setFocusKey(p.start);
    commit({ start: p.start, end: p.end });
  }

  /* ── month navigation (steps every visible month together) ──────────────*/
  function nav(dir: number) {
    setView((v) => {
      const d = new Date(v.y, v.m + dir, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  /* directional month slide — a CSS keyframe on a KEYED remount of each day
     grid (see renderMonth). Imperative Motion animate() stalls here because
     it fights the layoutId endpoint caps inside the grid; a CSS animation on
     a fresh-mounted node can't conflict with Motion's layout projection.
     Direction is derived from the viewIdx delta so nav, presets and keyboard
     month jumps all slide; the very first mount (open) gets no slide. */
  const viewIdx = view.y * 12 + view.m;
  const prevViewIdxRef = useRef(viewIdx);
  const navDir = prevViewIdxRef.current === viewIdx ? 0 : viewIdx > prevViewIdxRef.current ? 1 : -1;
  useEffect(() => {
    prevViewIdxRef.current = viewIdx;
  }, [viewIdx]);

  /* seed focus into the grid on open (panel portals to <body>) */
  useEffect(() => {
    const el = daysRef.current;
    if (!el) return;
    const btn =
      el.querySelector('[data-key="' + focusKey + '"]:not(:disabled)') ||
      el.querySelector('.dtp__day:not(:disabled)');
    if (btn) (btn as HTMLElement).focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!pendingFocusRef.current || !daysRef.current) return;
    pendingFocusRef.current = false;
    const btn = daysRef.current.querySelector('[data-key="' + focusKey + '"]');
    if (btn) (btn as HTMLElement).focus({ preventScroll: true });
  }, [focusKey]);

  function moveFocus(deltaDays: number) {
    const key = drpAdd(focusKey, deltaDays);
    const d = drpParse(key);
    pendingFocusRef.current = true;
    setFocusKey(key);
    if (anchor) setHoverKey(key); // keyboard preview
    const first = months === 2 ? view.y * 12 + view.m : view.y * 12 + view.m;
    const idx = d.getFullYear() * 12 + d.getMonth();
    const last = first + (months - 1);
    if (idx < first) setView({ y: d.getFullYear(), m: d.getMonth() });
    else if (idx > last) {
      const back = new Date(d.getFullYear(), d.getMonth() - (months - 1), 1);
      setView({ y: back.getFullYear(), m: back.getMonth() });
    }
  }
  function onGridKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
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

  /* ── one day cell — the band/cap class computation lives here ────────────*/
  const todayKey = drpToday();
  function renderDay(d: Date, viewMonth: number) {
    const key = drpKey(d);
    const out = d.getMonth() !== viewMonth;
    const disabled = !inBounds(key);
    const col = drpCol(d);

    const isLo = lo && key === lo;
    const isHi = hi && key === hi;
    const single = lo && hi && lo === hi;
    const inRange = lo && hi && key >= lo && key <= hi;
    /* the provisional (un-committed) end gets the outlined ghost cap; the
       anchor stays solid so committed-vs-tentative reads at a glance */
    const loGhost = provisional && isLo && lo !== anchor;
    const hiGhost = provisional && isHi && !single && hi !== anchor;

    const band = inRange && !single;
    const extL = band && !isLo && col !== 0;
    const extR = band && !isHi && col !== 6;

    /* a range endpoint that lands on a BOUNDARY date appears in two cells in
       the two-month view (in-day here, out-day in the neighbour). The cap is
       a shared-layoutId node, so it must render in exactly ONE — its home
       (in-month) cell; in one-month view the out-day is the only cell. */
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

    /* pill rides only while idle; once an anchor exists the preview band is
       the feedback, so the pill steps aside (fades in place) */

    return (
      <button
        key={key}
        type="button"
        role="gridcell"
        data-key={key}
        className={cls.join(' ')}
        disabled={disabled}
        tabIndex={key === focusKey ? 0 : -1}
        aria-label={DRP_MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()}
        aria-selected={isLo || isHi || undefined}
        onClick={() => pickDay(key)}
        onPointerEnter={(e) => {
          setHoverKey(key);
          if (!anchor && !disabled) grid.enter(e.currentTarget);
          else grid.leave();
        }}
      >
        {band ? <span className={bandCls.join(' ')} aria-hidden="true"></span> : null}
        {/* endpoint caps are layoutId nodes — they GLIDE between cells (spring
           settle) as the range is dragged open or recommitted, exactly like
           the single-date selection pill travels */}
        {loCap ? (
          <drpMotion.span
            className={'drp__cap' + (loGhost ? ' drp__cap--ghost' : '')}
            layoutId="drp-cap-lo"
            transition={drpSM.t.settle}
            aria-hidden="true"
          ></drpMotion.span>
        ) : null}
        {hiCap ? (
          <drpMotion.span
            className={'drp__cap' + (hiGhost ? ' drp__cap--ghost' : '')}
            layoutId="drp-cap-hi"
            transition={drpSM.t.settle}
            aria-hidden="true"
          ></drpMotion.span>
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
    const cells = drpGrid(y, m);
    const prevEnd = drpKey(new Date(y, m, 0));
    const nextStart = drpKey(new Date(y, m + 1, 1));
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
            {DRP_MONTHS[m]} <span className="dtp__year">{y}</span>
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
          {DRP_DOW.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div
          className="dtp__days"
          role="grid"
          aria-label={DRP_MONTHS[m] + ' ' + y}
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
          <GlidePill
            className="drp__presetGlide"
            rect={presetGlide.rect}
            active={presetGlide.active}
          />
        </div>
        <div
          className="drp__months"
          ref={daysRef}
          onKeyDown={onGridKeyDown}
          onPointerLeave={() => {
            if (anchor) setHoverKey(anchor);
            grid.leave();
          }}
        >
          {months === 2
            ? [renderMonth(0, true, false), renderMonth(1, false, true)]
            : renderMonth(0, true, true)}
          <GlidePill className="dtp__hover" rect={grid.rect} active={grid.active} />
        </div>
      </div>
      <div className="drp__foot">
        <span className={'drp__readout' + (lo && hi ? '' : ' is-empty')}>
          {lo && hi ? (
            <React.Fragment>
              {drpRangeText(lo, hi)}{' '}
              <span className="drp__count">
                · {drpDays(lo, hi)} {drpDays(lo, hi) === 1 ? 'day' : 'days'}
              </span>
            </React.Fragment>
          ) : anchor ? (
            'Pick the end date'
          ) : (
            'Pick a start date'
          )}
        </span>
        {timezone ? <span className="drp__tz">{drpTzLabel(timezone)}</span> : null}
        <span className="drp__footSpacer"></span>
        <button type="button" className="btn btn--primary btn--sm" onClick={close}>
          Done
        </button>
      </div>
    </div>
  );
}

export interface DateRangeFieldProps {
  /** Controlled value — both endpoints, or null when empty. */
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  /** Fires only on a COMPLETE range (a lone anchor never commits). */
  onChange?: (value: DateRange) => void;
  label?: string;
  placeholder?: string;
  /** IANA timezone (e.g. 'Europe/Riga') — display context, shown in the footer. */
  timezone?: string;
  /** Earliest pickable date, 'YYYY-MM-DD', inclusive. */
  min?: string;
  /** Latest pickable date, 'YYYY-MM-DD', inclusive. */
  max?: string;
  required?: boolean;
  invalid?: boolean;
  message?: string;
  disabled?: boolean;
  className?: string;
}

/* ── the field ─────────────────────────────────────────────────────────────*/
export function DateRangeField({
  value, // controlled: { start, end } | null
  defaultValue = null,
  onChange,
  label,
  placeholder = 'Pick a date range',
  timezone,
  min,
  max,
  required = false,
  invalid = false,
  message,
  disabled = false,
  className = '',
}: DateRangeFieldProps) {
  const [val, commit] = useControllable(value, defaultValue, onChange);

  const narrow = useResponsiveOverlayMode();
  const mode = narrow ? 'sheet' : 'popover';

  const display = val && val.start && val.end ? drpRangeText(val.start, val.end) : null;

  const trigger = (
    <button type="button" className="fld__input dtf__trigger" disabled={disabled}>
      {display ? (
        <span className="dtf__value">{display}</span>
      ) : (
        <span className="dtf__placeholder">{placeholder}</span>
      )}
    </button>
  );

  return (
    <FieldShell
      variant="dtf"
      label={label}
      required={required}
      invalid={invalid}
      message={message}
      icon="schedule"
      className={className}
    >
      <Overlay
        trigger={trigger}
        mode={mode}
        side={mode === 'sheet' ? 'bottom' : 'bottom'}
        align="start"
      >
        {(api) => (
          <DrpPanel
            value={val}
            commit={commit}
            close={api.close}
            min={min}
            max={max}
            timezone={timezone}
            label={label}
            months={narrow ? 1 : 2}
            layout={mode}
          />
        )}
      </Overlay>
    </FieldShell>
  );
}
