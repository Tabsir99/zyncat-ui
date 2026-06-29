'use client';

/* DateField.tsx — date picker.
   ─────────────────────────────────────────────────────────────────────────
   Opinionated, not a public API: ONE way to pick a date. A field (the Input
   vocabulary on a button) opens a popover — a month calendar with timezone
   context — and commits LIVE on day pick; Done just closes.

     <DateField
       label="Start date"
       value="2026-06-12"            // wall-clock 'YYYY-MM-DD'
       onChange={(v) => …}
       timezone="Europe/Riga"        // display context (IANA name)
       min="2026-06-11"
     />

   OPINIONS (documented in DateField.prompt.md):
     • the value is a WALL-CLOCK date string in the target timezone.
       Converting to an instant is the app's job; the panel footer shows
       which timezone the date belongs to.
     • commit is LIVE — picking a day updates the value immediately.
     • weeks start Monday; the grid is ALWAYS 6 rows so the panel never
       changes height; adjacent-month days stay visible (quiet) and pickable.
     • selection travels — the tinted pill FLIPs between days (layoutId,
       t.settle); month changes slide directionally (imperative keyframes on
       the persistent grid — the Tabs remount lesson); hover is Tabs' gliding
       pill, grid edition (one shared layoutId node, atomic remount).

   STRUCTURE: the panel is its OWN component (DtpPanel), mounted by Overlay
   only while open — so every open starts fresh (view re-seeds from the
   value) and the mount effect can seed focus into the day grid (the panel
   portals to <body>; without this, keyboard users could never reach it).
   Esc/outside-press close via the overlay stack; useReturnFocus puts focus
   back on the trigger.

   Primitives consumed (A8): Overlay (popover existence/placement/dismiss),
   the .fld Input vocabulary (trigger chrome + label/message states), .btn
   (Done), Icon. */

import * as React from 'react';
import type { ReactNode } from 'react';
import { motion, animate } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon } from '../icon/Icon';
import { Overlay } from '../overlay/Overlay';
import { FieldShell, useControllable } from './field-shell';
import { GlidePill, useGlide } from './glide-pill';
import {
  MONTHS as DTF_MONTHS,
  DOW as DTF_DOW,
  pad as dtfPad,
  key as dtfKey,
  parse as dtfParse,
  today as dtfToday,
  grid as dtfGrid,
  tzLabel as dtfTzLabel,
} from './date-utils';

const { useState, useRef, useEffect, useId } = React;
const dtfMotion = motion;
const dtfAnimate = animate;
const dtfSM = UIMotion;

/* 'Jun 12' (year only when it isn't the current one) */
function dtfDisplay(key: string | null): string | null {
  if (!key) return null;
  const d = dtfParse(key);
  const mon = DTF_MONTHS[d.getMonth()].slice(0, 3);
  const year = d.getFullYear() === new Date().getFullYear() ? '' : ', ' + d.getFullYear();
  return mon + ' ' + dtfPad(d.getDate()) + year;
}

export interface DtpPanelProps {
  val: string | null;
  commit: (key: string) => void;
  min?: string;
  max?: string;
  timezone?: string;
  label?: string;
  close: () => void;
  slot?: ReactNode;
}

/* ── the popover panel · mounted only while open ─────────────────────────
   Owns view + roving focus, so each open starts at the picked month.
   `val` (a 'YYYY-MM-DD' key or null) and `commit` come from the field. */
export function DtpPanel({ val, commit, min, max, timezone, label, close, slot }: DtpPanelProps) {
  const seed = val ? dtfParse(val) : new Date();
  const [view, setView] = useState<{ y: number; m: number }>({
    y: seed.getFullYear(),
    m: seed.getMonth(),
  });
  const [focusKey, setFocusKey] = useState<string>(val || dtfToday());

  const daysRef = useRef<HTMLDivElement>(null);
  const prevViewRef = useRef<number | null>(null);
  const pendingFocusRef = useRef(false);
  const uid = useId();
  const pillId = 'dtp-pill-' + uid;

  /* the gliding hover (Tabs' second motion, grid edition): ONE PERSISTENT
     pill that TRAVELS to the hovered cell. It never remounts, so the spring
     retargets mid-flight (velocity carries) instead of re-easing a fresh
     tween from rest at every cell boundary — that remount-restart was the
     stop-start stutter (and the reason setTimeout(0) "helped": it only
     dodged the remount-timing race; a persistent node removes it outright).
     useGlide owns the geometry, measured against the grid; the grid's
     pointerleave fades the pill out in place. Disabled days don't fire
     pointerenter, so the pill HOLDS over them — same as Tabs. */
  const glide = useGlide(daysRef);

  const inRange = (key: string): boolean => (!min || key >= min) && (!max || key <= max);

  function pickDay(key: string) {
    if (!inRange(key)) return;
    pendingFocusRef.current = true;
    setFocusKey(key);
    const d = dtfParse(key);
    goToMonth(d.getFullYear(), d.getMonth());
    commit(key);
  }

  /* ── month navigation + directional slide (persistent node) ────────────*/
  function goToMonth(y: number, m: number) {
    setView((v) => (v.y === y && v.m === m ? v : { y: y, m: m }));
  }
  function nav(dir: number) {
    const d = new Date(view.y, view.m + dir, 1);
    goToMonth(d.getFullYear(), d.getMonth());
  }
  /* today-jump — NAVIGATION, not commit (it lives in the nav cluster):
     slides the view home and seats keyboard focus on today's cell.
     Disabled while already viewing the current month — the button
     doubles as a "you are here" signal. */
  const dtfNow = new Date();
  const viewIsCurrent = view.y === dtfNow.getFullYear() && view.m === dtfNow.getMonth();
  function goToToday() {
    const key = dtfToday();
    const d = dtfParse(key);
    pendingFocusRef.current = true;
    setFocusKey(key);
    goToMonth(d.getFullYear(), d.getMonth());
  }
  const viewIdx = view.y * 12 + view.m;
  useEffect(() => {
    const prev = prevViewRef.current;
    prevViewRef.current = viewIdx;
    const el = daysRef.current;
    if (prev == null || prev === viewIdx || !el) return;
    const dir = viewIdx > prev ? 1 : -1;
    dtfAnimate(
      el,
      { x: [dir * 16, 0], opacity: [0, 1] },
      { duration: dtfSM.t.enter.duration, ease: dtfSM.t.enter.ease },
    );
  }, [viewIdx]);

  /* seed focus into the grid on open — the panel lives in a portal at the
     end of <body>, so without this it is unreachable from the trigger */
  useEffect(() => {
    const el = daysRef.current;
    if (!el) return;
    const btn =
      el.querySelector('[tabindex="0"]:not(:disabled)') ||
      el.querySelector('.dtp__day:not(:disabled)');
    if (btn) (btn as HTMLElement).focus({ preventScroll: true });
  }, []);

  /* focus follows keyboard travel across month boundaries */
  useEffect(() => {
    if (!pendingFocusRef.current || !daysRef.current) return;
    pendingFocusRef.current = false;
    const btn = daysRef.current.querySelector('[data-key="' + focusKey + '"]');
    if (btn) (btn as HTMLElement).focus({ preventScroll: true });
  }, [focusKey, viewIdx]);

  function moveFocus(deltaDays: number, deltaMonths: number) {
    const d = dtfParse(focusKey);
    if (deltaMonths) d.setMonth(d.getMonth() + deltaMonths);
    if (deltaDays) d.setDate(d.getDate() + deltaDays);
    const key = dtfKey(d);
    pendingFocusRef.current = true;
    setFocusKey(key);
    goToMonth(d.getFullYear(), d.getMonth());
  }
  function onGridKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const k = e.key;
    if (k === 'ArrowLeft') moveFocus(-1, 0);
    else if (k === 'ArrowRight') moveFocus(1, 0);
    else if (k === 'ArrowUp') moveFocus(-7, 0);
    else if (k === 'ArrowDown') moveFocus(7, 0);
    else if (k === 'PageUp') moveFocus(0, -1);
    else if (k === 'PageDown') moveFocus(0, 1);
    else if (k === 'Home') moveFocus(-((dtfParse(focusKey).getDay() + 6) % 7), 0);
    else if (k === 'End') moveFocus(6 - ((dtfParse(focusKey).getDay() + 6) % 7), 0);
    else if (k === 'Enter' || k === ' ') pickDay(focusKey);
    else return;
    e.preventDefault();
  }

  /* ── render ───────────────────────────────────────────────────────────*/
  const days = dtfGrid(view.y, view.m);
  const todayKey = dtfToday();
  const selKey = val || null;
  const gridKeys = days.map(dtfKey);
  const tabKey =
    gridKeys.indexOf(focusKey) >= 0
      ? focusKey
      : selKey && gridKeys.indexOf(selKey) >= 0
        ? selKey
        : gridKeys.indexOf(todayKey) >= 0
          ? todayKey
          : dtfKey(new Date(view.y, view.m, 1));

  const prevEnd = dtfKey(new Date(view.y, view.m, 0));
  const nextStart = dtfKey(new Date(view.y, view.m + 1, 1));
  const canPrev = !min || prevEnd >= min;
  const canNext = !max || nextStart <= max;

  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w++) weeks.push(days.slice(w * 7, w * 7 + 7));

  return (
    <div className="dtp" role="dialog" aria-label={label || 'Pick a date'}>
      <div className="dtp__cal">
        <div className="dtp__head">
          <span className="dtp__month" aria-live="polite">
            {DTF_MONTHS[view.m]} <span className="dtp__year">{view.y}</span>
          </span>
          <div className="dtp__navs">
            <button
              type="button"
              className="dtp__nav"
              aria-label="Previous month"
              disabled={!canPrev}
              onClick={() => nav(-1)}
            >
              <Icon name="caret-left" size="sm" />
            </button>
            <button
              type="button"
              className="dtp__nav"
              aria-label="Go to today"
              disabled={viewIsCurrent}
              onClick={goToToday}
            >
              <Icon name="calendar-dot" size="sm" />
            </button>
            <button
              type="button"
              className="dtp__nav"
              aria-label="Next month"
              disabled={!canNext}
              onClick={() => nav(1)}
            >
              <Icon name="caret-right" size="sm" />
            </button>
          </div>
        </div>
        <div className="dtp__dow" aria-hidden="true">
          {DTF_DOW.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div
          className="dtp__days"
          ref={daysRef}
          role="grid"
          aria-label="Calendar"
          onKeyDown={onGridKeyDown}
          onPointerLeave={glide.leave}
        >
          {weeks.map((week, wi) => (
            <div key={wi} role="row" className="dtp__row">
              {week.map((d) => {
                const key = dtfKey(d);
                const out = d.getMonth() !== view.m;
                const sel = key === selKey;
                const cls = [
                  'dtp__day',
                  out ? 'is-out' : '',
                  sel ? 'is-selected' : '',
                  key === todayKey ? 'is-today' : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <button
                    key={key}
                    type="button"
                    role="gridcell"
                    data-key={key}
                    className={cls}
                    disabled={!inRange(key)}
                    tabIndex={key === tabKey ? 0 : -1}
                    aria-selected={sel || undefined}
                    aria-label={
                      DTF_MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()
                    }
                    onClick={() => pickDay(key)}
                    onPointerEnter={(e) => glide.enter(e.currentTarget)}
                  >
                    {sel ? (
                      <dtfMotion.span
                        className="dtp__pill"
                        layoutId={pillId}
                        transition={dtfSM.t.settle}
                        aria-hidden="true"
                      ></dtfMotion.span>
                    ) : null}
                    <span className="dtp__num">{d.getDate()}</span>
                    {key === todayKey ? (
                      <span className="dtp__dot" aria-hidden="true"></span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
          <GlidePill className="dtp__hover" rect={glide.rect} active={glide.active} />
        </div>
      </div>

      {slot || null}

      <div className="dtp__foot">
        {timezone ? <span className="dtp__tz">{dtfTzLabel(timezone, selKey)}</span> : null}
        <span className="dtp__footSpacer"></span>
        <button type="button" className="btn btn--primary btn--sm" onClick={close}>
          Done
        </button>
      </div>
    </div>
  );
}

export interface DateFieldProps {
  /** Controlled value, 'YYYY-MM-DD'. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  /** IANA timezone name (e.g. 'Europe/Riga') — display context only, shown
      with its GMT offset in the panel footer. */
  timezone?: string;
  /** Earliest pickable date, 'YYYY-MM-DD', inclusive. */
  min?: string;
  /** Latest pickable date, 'YYYY-MM-DD', inclusive. */
  max?: string;
  /** Asterisk on the label. */
  required?: boolean;
  /** Danger border + message color (.fld is-error). */
  invalid?: boolean;
  /** Helper / error text under the field. */
  message?: string;
  disabled?: boolean;
  className?: string;
}

/* ── the field ───────────────────────────────────────────────────────────*/
export function DateField({
  value, // controlled: 'YYYY-MM-DD' | null
  defaultValue = null,
  onChange,
  label,
  placeholder = 'Pick a date',
  timezone, // IANA name — display context only
  min, // 'YYYY-MM-DD' (inclusive)
  max,
  required = false,
  invalid = false,
  message,
  disabled = false,
  className = '',
}: DateFieldProps) {
  const [val, commit] = useControllable(value, defaultValue, onChange);
  const display = dtfDisplay(val);

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
      <Overlay trigger={trigger} side="bottom" align="start">
        {(api) => (
          <DtpPanel
            val={val}
            commit={commit}
            close={api.close}
            min={min}
            max={max}
            timezone={timezone}
            label={label}
          />
        )}
      </Overlay>
    </FieldShell>
  );
}
