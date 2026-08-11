'use client';

import './motion-devtools.css';
import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../primitives/button/Button';
import { Checkbox } from '../primitives/checkbox/Checkbox';
import { Collapse } from '../primitives/collapse/Collapse';
import { motionSlowmo, type SlowmoState } from './slowmo-engine';

export type MotionDevtoolsPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface MotionDevtoolsProps {
  /** Which corner of the viewport to pin to. @default 'bottom-right' */
  placement?: MotionDevtoolsPlacement;
  /** Distance from the viewport edges, in px. @default 16 */
  offset?: number;
  /** Quick-select slow-down factors (1 = real time). @default [1, 2, 4, 8, 16] */
  presets?: number[];
  /** Upper bound of the fine slider. @default 16 */
  maxFactor?: number;
  /** Slow-down factor to start at. @default 1 */
  defaultFactor?: number;
  /** Scale setTimeout/setInterval too, so duration-coupled JS cleanups don't truncate
   *  slowed CSS. Exposed as a live toggle in the panel. @default true */
  scaleTimers?: boolean;
  /** Remember the chosen factor across reloads (localStorage). @default true */
  persist?: boolean;
  /** Start with the full panel open rather than collapsed to its header. @default false */
  defaultOpen?: boolean;
}

const STORAGE_KEY = 'zyncat-ui:motion-devtools';
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

function GaugeGlyph() {
  return (
    <svg className="mdt__glyph" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4a8 8 0 0 1 8 8 8 8 0 0 1-.6 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 4a8 8 0 0 0-8 8 8 8 0 0 0 .6 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path d="M12 12l4-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function MotionDevtools({
  placement = 'bottom-right',
  offset = 16,
  presets = [1, 2, 4, 8, 16],
  maxFactor = 16,
  defaultFactor = 1,
  scaleTimers = true,
  persist = true,
  defaultOpen = false,
}: MotionDevtoolsProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const [snap, setSnap] = useState<SlowmoState>(() => motionSlowmo.get());
  const [timers, setTimers] = useState(scaleTimers);

  useEffect(() => motionSlowmo.subscribe(setSnap), []);

  useEffect(() => {
    setMounted(true);
    let initial: Partial<SlowmoState> = { factor: defaultFactor, paused: false };
    if (persist) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) initial = { ...initial, ...JSON.parse(raw) };
      } catch {}
    }
    motionSlowmo.set(initial);
    if ((initial.factor ?? 1) > 1 || initial.paused) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    motionSlowmo.configure({ scaleTimers: timers });
  }, [timers]);

  useEffect(() => {
    if (!persist) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ factor: snap.factor, paused: snap.paused }));
    } catch {}
  }, [snap.factor, snap.paused, persist]);

  if (!mounted) return null;

  const active = snap.factor > 1 || snap.paused;
  const rootClass = ['mdt', `mdt--${placement}`, active ? 'mdt--active' : '', snap.paused ? 'mdt--paused' : '']
    .filter(Boolean)
    .join(' ');

  const setFactor = (factor: number) => motionSlowmo.set({ factor, paused: false });
  const fill = `${((Math.min(snap.factor, maxFactor) - 1) / Math.max(1, maxFactor - 1)) * 100}%`;
  const pillBadge = snap.factor === 1 ? '1×' : `${fmt(snap.factor)}×`;

  return createPortal(
    <div className={rootClass} style={{ '--mdt-offset': `${offset}px` } as CSSProperties}>
      <div className={'mdt__panel' + (open ? ' is-open' : '')} role="group" aria-label="Motion devtools">
        <button
          className="mdt__head"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          title="Motion devtools"
          aria-label={open ? 'Collapse motion devtools' : 'Expand motion devtools'}
        >
          <GaugeGlyph />
          <span className="mdt__spacer" />
          <span className="mdt__badge">{pillBadge}</span>
          <svg
            className={'mdt__chevron' + (open ? ' mdt__chevron--open' : '')}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            aria-hidden="true"
          >
            <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <Collapse open={open} fade>
          <div className="mdt__body">
            <span className="mdt__title">Motion</span>
            <div className="mdt__readout">
              <span className="mdt__value">
                {snap.paused ? 'Paused' : snap.factor === 1 ? 'Normal' : `${fmt(snap.factor)}×`}
              </span>
              <span className="mdt__unit">{snap.paused ? 'frozen' : snap.factor === 1 ? 'real-time' : 'slower'}</span>
            </div>

            <input
              className="mdt__slider"
              type="range"
              min={1}
              max={maxFactor}
              step={0.5}
              value={Math.min(snap.factor, maxFactor)}
              onChange={(e) => setFactor(Number(e.target.value))}
              style={{ '--mdt-fill': fill } as CSSProperties}
              aria-label="Slow-down factor"
            />

            <div className="mdt__chips">
              {presets.map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={!snap.paused && snap.factor === p ? 'primary' : 'secondary'}
                  onClick={() => setFactor(p)}
                >
                  {p}×
                </Button>
              ))}
            </div>

            <div className="mdt__row">
              <Button
                size="sm"
                variant={snap.paused ? 'primary' : 'secondary'}
                onClick={() => motionSlowmo.set({ paused: !snap.paused })}
              >
                {snap.paused ? 'Resume' : 'Freeze'}
              </Button>
              <Button size="sm" variant="ghost" disabled={!active} onClick={() => motionSlowmo.reset()}>
                Reset
              </Button>
            </div>

            <div className="mdt__opt">
              <Checkbox size="sm" checked={timers} onChange={(e) => setTimers(e.target.checked)} label="Scale timers" />
              <p className="mdt__hint">
                Slows CSS, Motion &amp; WAAPI together. Timer scaling keeps duration-based cleanups from cutting
                animations short.
              </p>
            </div>
          </div>
        </Collapse>
      </div>
    </div>,
    document.body,
  );
}

export { motionSlowmo, type SlowmoState } from './slowmo-engine';
export default MotionDevtools;
