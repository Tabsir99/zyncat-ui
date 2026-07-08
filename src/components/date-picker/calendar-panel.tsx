'use client';

/* DtpPanel - the portaled month-calendar surface shared by DateField and DateTimeField:
   owns the viewed month + roving focus, glides a hover pill, commits live on day pick.
   Lives here (not in DateField) because DateTimeField mounts it too - a neutral module,
   not a sibling field's internals. */

import './date-picker.css';
/* The footer Done renders .btn classes - button.css must ride along. */
import '../button/button.css';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { motion, animate } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon } from '../icon/Icon';
import { GlidePill, useGlide, useLayoutSelfHeal } from '../motion/glide';
import { useDayFocus } from './use-day-focus';
import { MONTHS, DOW, key as toKey, parse, col, today, grid, tzLabel, within } from './date-utils';

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

/* the popover panel, mounted only while open - owns view + roving focus, so each open starts at the picked month. */
export function DtpPanel({ val, commit, min, max, timezone, label, close, slot }: DtpPanelProps) {
  const seed = val ? parse(val) : new Date();
  const [view, setView] = useState<{ y: number; m: number }>({ y: seed.getFullYear(), m: seed.getMonth() });
  const [focusKey, setFocusKey] = useState<string>(val || today());

  const daysRef = useRef<HTMLDivElement>(null);
  const prevViewRef = useRef<number | null>(null);
  const uid = useId();
  const pillId = 'dtp-pill-' + uid;

  /* gliding hover: one persistent pill that travels to the hovered cell (see ../motion/glide). */
  const glide = useGlide(daysRef);
  /* the popover panel scale-animates on entrance - a pick mid-entrance FLIPs against a
     scaling ancestor, so the pill self-heals to its CSS spot once the travel settles */
  const healPill = useLayoutSelfHeal<HTMLSpanElement>();

  const inRange = (key: string): boolean => within(key, min, max);

  function pickDay(key: string) {
    if (!inRange(key)) return;
    armFocus();
    setFocusKey(key);
    const d = parse(key);
    goToMonth(d.getFullYear(), d.getMonth());
    commit(key);
  }

  function goToMonth(y: number, m: number) {
    setView((v) => (v.y === y && v.m === m ? v : { y: y, m: m }));
  }
  function nav(dir: number) {
    const d = new Date(view.y, view.m + dir, 1);
    goToMonth(d.getFullYear(), d.getMonth());
  }
  /* today-jump is navigation, not commit: slides home + focuses today; disabled while viewing the current month. */
  const now = new Date();
  const viewIsCurrent = view.y === now.getFullYear() && view.m === now.getMonth();
  function goToToday() {
    const key = today();
    const d = parse(key);
    armFocus();
    setFocusKey(key);
    goToMonth(d.getFullYear(), d.getMonth());
  }
  const viewIdx = view.y * 12 + view.m;
  const armFocus = useDayFocus(daysRef, focusKey, viewIdx, '[tabindex="0"]:not(:disabled)');
  useEffect(() => {
    const prev = prevViewRef.current;
    prevViewRef.current = viewIdx;
    const el = daysRef.current;
    if (prev == null || prev === viewIdx || !el) return;
    const dir = viewIdx > prev ? 1 : -1;
    animate(
      el,
      { x: [dir * 16, 0], opacity: [0, 1] },
      { duration: UIMotion.t.enter.duration, ease: UIMotion.t.enter.ease },
    );
  }, [viewIdx]);

  function moveFocus(deltaDays: number, deltaMonths: number) {
    const d = parse(focusKey);
    if (deltaMonths) d.setMonth(d.getMonth() + deltaMonths);
    if (deltaDays) d.setDate(d.getDate() + deltaDays);
    const key = toKey(d);
    armFocus();
    setFocusKey(key);
    goToMonth(d.getFullYear(), d.getMonth());
  }
  function onGridKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const k = e.key;
    if (k === 'ArrowLeft') moveFocus(-1, 0);
    else if (k === 'ArrowRight') moveFocus(1, 0);
    else if (k === 'ArrowUp') moveFocus(-7, 0);
    else if (k === 'ArrowDown') moveFocus(7, 0);
    else if (k === 'PageUp') moveFocus(0, -1);
    else if (k === 'PageDown') moveFocus(0, 1);
    else if (k === 'Home') moveFocus(-col(parse(focusKey)), 0);
    else if (k === 'End') moveFocus(6 - col(parse(focusKey)), 0);
    else if (k === 'Enter' || k === ' ') pickDay(focusKey);
    else return;
    e.preventDefault();
  }

  const days = grid(view.y, view.m);
  const todayKey = today();
  const selKey = val || null;
  const gridKeys = days.map(toKey);
  const tabKey =
    gridKeys.indexOf(focusKey) >= 0
      ? focusKey
      : selKey && gridKeys.indexOf(selKey) >= 0
        ? selKey
        : gridKeys.indexOf(todayKey) >= 0
          ? todayKey
          : toKey(new Date(view.y, view.m, 1));

  const prevEnd = toKey(new Date(view.y, view.m, 0));
  const nextStart = toKey(new Date(view.y, view.m + 1, 1));
  const canPrev = !min || prevEnd >= min;
  const canNext = !max || nextStart <= max;

  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w++) weeks.push(days.slice(w * 7, w * 7 + 7));

  return (
    <div className="dtp" role="dialog" aria-label={label || 'Pick a date'}>
      <div className="dtp__cal">
        <div className="dtp__head">
          <span className="dtp__month" aria-live="polite">
            {MONTHS[view.m]} <span className="dtp__year">{view.y}</span>
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
          {DOW.map((d) => (
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
                const key = toKey(d);
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
                    aria-label={MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()}
                    onClick={() => pickDay(key)}
                    onPointerEnter={(e) => glide.enter(e.currentTarget)}
                  >
                    {sel ? (
                      <motion.span
                        className="dtp__pill"
                        layoutId={pillId}
                        transition={UIMotion.t.settle}
                        aria-hidden="true"
                        ref={healPill.ref}
                        onLayoutAnimationComplete={healPill.onLayoutAnimationComplete}
                      ></motion.span>
                    ) : null}
                    <span className="dtp__num">{d.getDate()}</span>
                    {key === todayKey ? <span className="dtp__dot" aria-hidden="true"></span> : null}
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
        {timezone ? <span className="dtp__tz">{tzLabel(timezone, selKey)}</span> : null}
        <span className="dtp__footSpacer"></span>
        <button type="button" className="btn btn--primary btn--sm" onClick={close}>
          Done
        </button>
      </div>
    </div>
  );
}
