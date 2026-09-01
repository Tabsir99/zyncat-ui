'use client';

import './odometer.css';

import { useEffect, useRef, type HTMLAttributes } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { loop } from '../../../engine';
import type { OdometerStyle } from '../../../tokens/component-styles.generated';
import { UIMotion } from '../../../tokens/motion-tokens';
import { cx } from '../../internal/utils/cx';

const DIGITS_PER_RUN = 10;
const STRIP_RUNS = 2;
const SPRING_PULL = 0.05;
const SPRING_DAMPING = 0.185;
const ARRIVAL_MARGIN = 0.5;
const TINT_GAIN = 2.2;
const TINT_CEILING = 0.8;
const TINT_FLOOR = 0.02;
const BLUR_GAIN = 11;
const BLUR_CEILING = 6;
const BLUR_FLOOR = 0.25;

const STRIP_CELLS = Array.from({ length: DIGITS_PER_RUN * STRIP_RUNS }, (_, i) => i % DIGITS_PER_RUN);

interface Column {
  position: number;
  velocity: number;
  target: number;
}

const clampUnit = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function writeColumn(el: HTMLElement, column: Column) {
  const rate = Math.abs(column.velocity);
  const tint = clampUnit(rate * TINT_GAIN) * TINT_CEILING;
  const blur = Math.min(BLUR_CEILING, rate * BLUR_GAIN);
  el.style.translate = `0 calc(var(--odometer-cell) * ${-column.position})`;
  el.style.setProperty('--odometer-velocity', tint > TINT_FLOOR ? tint.toFixed(3) : '0');
  el.style.setProperty('--odometer-blur', blur > BLUR_FLOOR ? blur.toFixed(2) : '0');
}

function stepColumns(columns: Column[], strips: (HTMLElement | null)[], k: number) {
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const el = strips[i];
    if (!column || !el) continue;
    column.velocity += ((column.target - column.position) * SPRING_PULL - column.velocity * SPRING_DAMPING) * k;
    column.position += column.velocity * k;
    if (column.position > DIGITS_PER_RUN && column.target > DIGITS_PER_RUN) {
      column.position -= DIGITS_PER_RUN;
      column.target -= DIGITS_PER_RUN;
    }
    writeColumn(el, column);
  }
}

function snapColumns(columns: Column[], strips: (HTMLElement | null)[]) {
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const el = strips[i];
    if (!column || !el) continue;
    column.position = column.target % DIGITS_PER_RUN;
    column.target = column.position;
    column.velocity = 0;
    writeColumn(el, column);
  }
}

function aimColumns(columns: Column[], digits: string) {
  columns.length = digits.length;
  for (let i = 0; i < digits.length; i++) {
    const column = (columns[i] ??= { position: 0, velocity: 0, target: 0 });
    let target = Number(digits[i]);
    while (target < column.position + ARRIVAL_MARGIN) target += DIGITS_PER_RUN;
    column.target = target;
  }
}

export interface OdometerOwnProps {
  /** The number to roll to. Every digit column carries its own spring, so digits arrive out of sync. */
  value: number;
  /** Renders the value into the displayed string; digits become rolling columns, everything else becomes a static separator. @default String(Math.trunc(value)) */
  format?: (value: number) => string;
  /** Multiplies the simulation rate; sampled live on every frame. @default 1 */
  speed?: number;
  /** Extra class(es) merged onto the root. */
  className?: string;
  /** Inline styles merged onto the root. */
  style?: OdometerStyle;
}

export interface OdometerProps extends OdometerOwnProps {
  /** Standard <span> attributes (aria-*, data-*, title, ...) forwarded to the root. */
  htmlProps?: Omit<HTMLAttributes<HTMLSpanElement>, keyof OdometerOwnProps> & DataAttributes;
}

export function Odometer({ value, format, speed = 1, className = '', style, htmlProps }: OdometerProps) {
  const text = format ? format(value) : String(Math.trunc(value));
  const rootRef = useRef<HTMLSpanElement>(null);
  const stripsRef = useRef<(HTMLElement | null)[]>([]);
  const columnsRef = useRef<Column[]>([]);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const playback = loop((k) => stepColumns(columnsRef.current, stripsRef.current, k), {
      el,
      speed: () => speedRef.current,
      snap: () => snapColumns(columnsRef.current, stripsRef.current),
    });
    return () => playback.stop();
  }, []);

  useEffect(() => {
    aimColumns(columnsRef.current, text.replace(/\D/g, ''));
    if (UIMotion.reduced) snapColumns(columnsRef.current, stripsRef.current);
  }, [text]);

  let digitIndex = -1;

  return (
    <span ref={rootRef} className={cx('odometer', className)} style={style} {...htmlProps}>
      <span className="odometer__label">{text}</span>
      {Array.from(text, (char, i) => {
        if (!/\d/.test(char))
          return (
            <span key={i} className="odometer__separator" aria-hidden="true">
              {char}
            </span>
          );
        const slot = ++digitIndex;
        return (
          <span key={i} className="odometer__col" aria-hidden="true">
            <span
              className="odometer__strip"
              ref={(el) => {
                stripsRef.current[slot] = el;
              }}
            >
              {STRIP_CELLS.map((cell, c) => (
                <span key={c} className="odometer__cell">
                  {cell}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
