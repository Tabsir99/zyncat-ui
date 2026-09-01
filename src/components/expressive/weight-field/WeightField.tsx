'use client';

import './weight-field.css';

import { Fragment, useEffect, useRef, type HTMLAttributes } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { loop } from '../../../engine';
import type { WeightFieldStyle } from '../../../tokens/component-styles.generated';
import { UIMotion } from '../../../tokens/motion-tokens';
import { cx } from '../../internal/utils/cx';

const SPRING_PULL = 0.105;
const SPRING_DAMPING = 0.205;
const MAX_STEP = 3;
const FALLOFF_EXPONENT = 1.5;
const VERTICAL_REACH = 0.72;
const WEIGHT_AXIS_MIN = 100;
const WEIGHT_AXIS_MAX = 900;
const MAX_UNITS = 48;
const PAINT_PRECISION = 10000;
const FALLBACK_FONT_SIZE = 16;
const FALLBACK_REACH = 2.6;
const FALLBACK_REST_WEIGHT = 300;
const FALLBACK_PEAK_WEIGHT = 700;
const PULL_PROPERTY = '--weight-field-pull';
const WEIGHT_PROPERTY = '--weight-field-wght';
const REACH_PROPERTY = '--weight-field-reach';
const REST_WEIGHT_PROPERTY = '--weight-field-rest-weight';
const PEAK_WEIGHT_PROPERTY = '--weight-field-peak-weight';

interface Field {
  pull: number[];
  velocity: number[];
  painted: number[];
  centreX: number[];
  centreY: number[];
  radius: number;
  restWeight: number;
  weightSpan: number;
  pointerX: number;
  pointerY: number;
  engaged: boolean;
}

const clamp = (value: number, min: number, max: number) => (value < min ? min : value > max ? max : value);

function planGroups(text: string): string[][] {
  const words = text.split(' ').filter(Boolean);
  const glyphs = words.reduce((total, word) => total + [...word].length, 0);
  if (glyphs <= MAX_UNITS) return words.map((word) => [...word]);
  if (words.length <= MAX_UNITS) return words.map((word) => [word]);
  const capped = words.slice(0, MAX_UNITS - 1).map((word) => [word]);
  capped.push([words.slice(MAX_UNITS - 1).join(' ')]);
  return capped;
}

function readNumber(styles: CSSStyleDeclaration, name: string, fallback: number) {
  const value = parseFloat(styles.getPropertyValue(name));
  return isFinite(value) ? value : fallback;
}

function paint(el: HTMLElement, field: Field, index: number) {
  const pull = Math.round(field.pull[index] * PAINT_PRECISION) / PAINT_PRECISION;
  if (pull === field.painted[index]) return;
  field.painted[index] = pull;
  const weight = clamp(field.restWeight + field.weightSpan * pull, WEIGHT_AXIS_MIN, WEIGHT_AXIS_MAX);
  el.style.setProperty(PULL_PROPERTY, String(pull));
  el.style.setProperty(WEIGHT_PROPERTY, weight.toFixed(0));
}

export interface WeightFieldOwnProps {
  /** The headline the field is built from. Under the animated-unit cap every glyph gets its own spring; past it the split falls back to one spring per word. */
  text: string;
  /** Multiplies the simulation rate; sampled live on every frame. @default 1 */
  speed?: number;
  /** Extra class(es) merged onto the root. */
  className?: string;
  /** Inline styles merged onto the root. */
  style?: WeightFieldStyle;
}

export interface WeightFieldProps extends WeightFieldOwnProps {
  /** Standard <span> attributes (aria-*, data-*, title, ...) forwarded to the root. */
  htmlProps?: Omit<HTMLAttributes<HTMLSpanElement>, keyof WeightFieldOwnProps> & DataAttributes;
}

export function WeightField({ text, speed = 1, className = '', style, htmlProps }: WeightFieldProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const unitsRef = useRef<(HTMLElement | null)[]>([]);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const units = unitsRef.current.filter((el): el is HTMLElement => el !== null);
    const size = units.length;
    if (!size) return;

    const field: Field = {
      pull: new Array<number>(size).fill(0),
      velocity: new Array<number>(size).fill(0),
      painted: new Array<number>(size).fill(NaN),
      centreX: new Array<number>(size).fill(0),
      centreY: new Array<number>(size).fill(0),
      radius: 1,
      restWeight: FALLBACK_REST_WEIGHT,
      weightSpan: FALLBACK_PEAK_WEIGHT - FALLBACK_REST_WEIGHT,
      pointerX: 0,
      pointerY: 0,
      engaged: false,
    };

    const measure = () => {
      const rootBox = root.getBoundingClientRect();
      const styles = getComputedStyle(root);
      const fontSize = parseFloat(styles.fontSize) || FALLBACK_FONT_SIZE;
      field.radius = Math.max(1, readNumber(styles, REACH_PROPERTY, FALLBACK_REACH) * fontSize);
      field.restWeight = readNumber(styles, REST_WEIGHT_PROPERTY, FALLBACK_REST_WEIGHT);
      field.weightSpan = readNumber(styles, PEAK_WEIGHT_PROPERTY, FALLBACK_PEAK_WEIGHT) - field.restWeight;
      for (let i = 0; i < size; i++) {
        const box = units[i].getBoundingClientRect();
        field.centreX[i] = box.left - rootBox.left + box.width / 2;
        field.centreY[i] = box.top - rootBox.top + box.height / 2;
      }
    };

    const settle = () => {
      for (let i = 0; i < size; i++) {
        field.pull[i] = 0;
        field.velocity[i] = 0;
        field.painted[i] = NaN;
        paint(units[i], field, i);
      }
    };

    measure();

    const controller = new AbortController();
    let resizes: ResizeObserver | null = null;
    let live = true;

    if (!UIMotion.reduced) {
      const signal = controller.signal;
      root.addEventListener(
        'pointermove',
        (event) => {
          const box = root.getBoundingClientRect();
          field.pointerX = event.clientX - box.left;
          field.pointerY = event.clientY - box.top;
          field.engaged = true;
        },
        { signal },
      );
      root.addEventListener(
        'pointerleave',
        () => {
          field.engaged = false;
        },
        { signal },
      );
      resizes = new ResizeObserver(measure);
      resizes.observe(root);
      void document.fonts.ready.then(() => {
        if (live) measure();
      });
    }

    const playback = loop(
      (k) => {
        const step = Math.min(MAX_STEP, k);
        for (let i = 0; i < size; i++) {
          let target = 0;
          if (field.engaged) {
            const dx = field.pointerX - field.centreX[i];
            const dy = (field.pointerY - field.centreY[i]) * VERTICAL_REACH;
            const reach = 1 - Math.hypot(dx, dy) / field.radius;
            if (reach > 0) target = Math.pow(reach, FALLOFF_EXPONENT);
          }
          const velocity =
            field.velocity[i] + ((target - field.pull[i]) * SPRING_PULL - field.velocity[i] * SPRING_DAMPING) * step;
          field.velocity[i] = velocity;
          field.pull[i] += velocity * step;
          paint(units[i], field, i);
        }
      },
      { el: root, speed: () => speedRef.current, snap: settle },
    );

    return () => {
      live = false;
      playback.stop();
      resizes?.disconnect();
      controller.abort();
    };
  }, [text]);

  let slot = -1;

  return (
    <span ref={rootRef} className={cx('weight-field', className)} style={style} {...htmlProps}>
      <span className="weight-field__label">{text}</span>
      <span className="weight-field__glyphs" aria-hidden="true">
        {planGroups(text).map((group, index) => {
          const pieces = group.map((piece) => {
            const at = ++slot;
            return (
              <span
                key={at}
                className="weight-field__unit"
                ref={(el) => {
                  unitsRef.current[at] = el;
                }}
              >
                {piece}
              </span>
            );
          });
          return (
            <Fragment key={index}>
              {index ? ' ' : null}
              {pieces.length > 1 ? <span className="weight-field__word">{pieces}</span> : pieces}
            </Fragment>
          );
        })}
      </span>
    </span>
  );
}
