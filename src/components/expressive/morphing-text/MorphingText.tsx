'use client';

import './morphing-text.css';

import { useEffect, useId, useRef, type CSSProperties, type HTMLAttributes } from 'react';

import type { DataAttributes } from '../../../dom-props';
import { loop } from '../../../engine';
import { UIMotion } from '../../../tokens/motion-tokens';
import { cx } from '../../internal/utils/cx';

const DEFAULT_HOLD_MS = 1500;
const MORPH_MS = 900;
const OUT_STAGGER = 0.18;
const OUT_WINDOW = 0.82;
const IN_LEAD = 0.14;
const IN_STAGGER = 0.18;
const IN_WINDOW = 0.68;
const SMEAR_CURVE = 1.1;
const FUSE_OPACITY_CURVE = 0.42;
const LETTER_BLUR_EM = 0.115;
const OUT_RISE_EM = 0.05;
const IN_DROP_EM = 0.06;
const OUT_SHRINK = 0.02;
const IN_SCALE_FLOOR = 0.98;
const IN_GROWTH = 0.02;
const THRESHOLD_BLUR_RATIO = 0.023;
const THRESHOLD_SWELL_RATIO = 0.0104;
const ALPHA_GAIN = 21;
const ALPHA_BIAS = -8.4;
const FILTER_REGION_X = '-30%';
const FILTER_REGION_Y = '-60%';
const FILTER_REGION_WIDTH = '160%';
const FILTER_REGION_HEIGHT = '220%';
const RULE_MIN_WIDTH = 2;
const SETTLED = 0.001;
const FALLBACK_FONT_SIZE = 48;
const LETTER_CLASS = 'morphing-text__letter';
const FUSED_CLASS = 'morphing-text__stage--fused';
const BLUR_PROPERTY = '--morphing-text-letter-blur';
const HEAT_PROPERTY = '--morphing-text-heat';

const THRESHOLD_MATRIX = `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${ALPHA_GAIN} ${ALPHA_BIAS}`;

const clampUnit = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const letterProgress = (progress: number, lead: number, stagger: number, span: number, index: number, count: number) =>
  clampUnit((progress - (lead + stagger * (count > 1 ? index / (count - 1) : 0))) / span);

interface Parts {
  root: HTMLElement;
  stage: HTMLElement;
  outgoing: HTMLElement;
  incoming: HTMLElement;
  rule: HTMLElement;
  label: HTMLElement;
  threshold: SVGFEGaussianBlurElement;
  filterId: string;
}

interface Cycle {
  index: number;
  elapsed: number;
  held: boolean;
  resting: boolean;
  progress: number;
  out: HTMLElement[];
  into: HTMLElement[];
  widthOut: number;
  widthIn: number;
  fontSize: number;
}

function writeLetters(host: HTMLElement, word: string) {
  host.textContent = '';
  const letters: HTMLElement[] = [];
  for (const character of word) {
    if (character === ' ') {
      host.appendChild(document.createTextNode(' '));
      continue;
    }
    const span = document.createElement('span');
    span.className = LETTER_CLASS;
    span.textContent = character;
    host.appendChild(span);
    letters.push(span);
  }
  return letters;
}

function paintLetter(el: HTMLElement, blur: number, opacity: number, shift: number, scale: number) {
  el.style.setProperty(BLUR_PROPERTY, blur.toFixed(4));
  el.style.opacity = clampUnit(opacity).toFixed(3);
  el.style.translate = `0 ${shift.toFixed(4)}em`;
  el.style.scale = scale.toFixed(4);
}

function fuse(parts: Parts, on: boolean) {
  parts.stage.classList.toggle(FUSED_CLASS, on);
  parts.stage.style.filter = on ? `url(#${parts.filterId})` : '';
}

function measure(parts: Parts, cycle: Cycle) {
  cycle.widthOut = parts.outgoing.getBoundingClientRect().width;
  cycle.widthIn = parts.incoming.getBoundingClientRect().width;
  cycle.fontSize = parseFloat(getComputedStyle(parts.stage).fontSize) || FALLBACK_FONT_SIZE;
}

function draw(parts: Parts, cycle: Cycle, progress: number) {
  cycle.progress = progress;
  const heat = Math.sin(progress * Math.PI);

  if (progress <= SETTLED || progress >= 1 - SETTLED) {
    const arrived = progress >= 1 - SETTLED;
    fuse(parts, false);
    for (const el of cycle.out) paintLetter(el, 0, arrived ? 0 : 1, 0, 1);
    for (const el of cycle.into) paintLetter(el, 0, arrived ? 1 : 0, 0, 1);
  } else {
    fuse(parts, true);
    parts.threshold.setAttribute(
      'stdDeviation',
      (cycle.fontSize * (THRESHOLD_BLUR_RATIO + THRESHOLD_SWELL_RATIO * heat)).toFixed(3),
    );
    for (let i = 0; i < cycle.out.length; i++) {
      const p = letterProgress(progress, 0, OUT_STAGGER, OUT_WINDOW, i, cycle.out.length);
      paintLetter(
        cycle.out[i],
        LETTER_BLUR_EM * Math.pow(p, SMEAR_CURVE),
        Math.pow(1 - p, FUSE_OPACITY_CURVE),
        -OUT_RISE_EM * p,
        1 - OUT_SHRINK * p,
      );
    }
    for (let i = 0; i < cycle.into.length; i++) {
      const p = letterProgress(progress, IN_LEAD, IN_STAGGER, IN_WINDOW, i, cycle.into.length);
      paintLetter(
        cycle.into[i],
        LETTER_BLUR_EM * Math.pow(1 - p, SMEAR_CURVE),
        Math.pow(p, FUSE_OPACITY_CURVE),
        IN_DROP_EM * (1 - p),
        IN_SCALE_FLOOR + IN_GROWTH * p,
      );
    }
  }

  const width = cycle.widthOut + (cycle.widthIn - cycle.widthOut) * easeInOut(progress);
  parts.rule.style.width = `${Math.max(RULE_MIN_WIDTH, width).toFixed(2)}px`;
  parts.rule.style.setProperty(HEAT_PROPERTY, heat.toFixed(3));
}

function build(parts: Parts, cycle: Cycle, words: string[]) {
  const current = words[cycle.index % words.length];
  cycle.out = writeLetters(parts.outgoing, current);
  cycle.into = writeLetters(parts.incoming, words[(cycle.index + 1) % words.length]);
  parts.label.textContent = current;
  measure(parts, cycle);
}

function settle(parts: Parts, cycle: Cycle, words: string[]) {
  cycle.index = 0;
  cycle.elapsed = 0;
  cycle.held = false;
  cycle.resting = true;
  build(parts, cycle, words);
  draw(parts, cycle, 0);
}

export interface MorphingTextOwnProps {
  /** The words to cycle through, in order; the last one morphs back into the first. Fewer than two words renders as still type. */
  words: string[];
  /** How long a word rests fully legible before the next morph starts, in milliseconds; sampled live. @default 1500 */
  hold?: number;
  /** Multiplies the simulation rate; sampled live on every frame. @default 1 */
  speed?: number;
  /** Extra class(es) merged onto the root. */
  className?: string;
  /** Inline styles merged onto the root. */
  style?: CSSProperties;
}

export interface MorphingTextProps extends MorphingTextOwnProps {
  /** Standard <span> attributes (aria-*, data-*, title, ...) forwarded to the root. */
  htmlProps?: Omit<HTMLAttributes<HTMLSpanElement>, keyof MorphingTextOwnProps> & DataAttributes;
}

export function MorphingText({
  words,
  hold = DEFAULT_HOLD_MS,
  speed = 1,
  className = '',
  style,
  htmlProps,
}: MorphingTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const outgoingRef = useRef<HTMLSpanElement>(null);
  const incomingRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const thresholdRef = useRef<SVGFEGaussianBlurElement>(null);
  const wordsRef = useRef(words);
  const holdRef = useRef(hold);
  const speedRef = useRef(speed);
  const filterId = `morphing-text-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const key = JSON.stringify(words);

  useEffect(() => {
    wordsRef.current = words;
    holdRef.current = Number.isFinite(hold) && hold >= 0 ? hold : DEFAULT_HOLD_MS;
    speedRef.current = speed;
  }, [words, hold, speed]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const outgoing = outgoingRef.current;
    const incoming = incomingRef.current;
    const rule = ruleRef.current;
    const label = labelRef.current;
    const threshold = thresholdRef.current;
    if (!root || !stage || !outgoing || !incoming || !rule || !label || !threshold) return;

    const parts: Parts = { root, stage, outgoing, incoming, rule, label, threshold, filterId };
    const cycle: Cycle = {
      index: 0,
      elapsed: 0,
      held: false,
      resting: true,
      progress: 0,
      out: [],
      into: [],
      widthOut: 0,
      widthIn: 0,
      fontSize: FALLBACK_FONT_SIZE,
    };

    const list = wordsRef.current;
    if (!list.length) {
      outgoing.textContent = '';
      incoming.textContent = '';
      label.textContent = '';
      return;
    }

    build(parts, cycle, list);
    draw(parts, cycle, 0);

    const sizes = new ResizeObserver(() => {
      measure(parts, cycle);
      draw(parts, cycle, cycle.progress);
    });
    sizes.observe(outgoing);
    sizes.observe(incoming);

    if (list.length < 2) return () => sizes.disconnect();

    const controller = new AbortController();
    if (!UIMotion.reduced) {
      const signal = controller.signal;
      root.addEventListener('pointerenter', () => (cycle.held = true), { signal });
      root.addEventListener('pointerleave', () => (cycle.held = false), { signal });
    }

    const playback = loop(
      (_k, dt) => {
        const words = wordsRef.current;
        const holdMs = holdRef.current;
        const span = holdMs + MORPH_MS;

        if (!cycle.held || cycle.elapsed > holdMs) cycle.elapsed += dt;
        if (cycle.elapsed >= span) {
          if (cycle.progress < 1) {
            cycle.elapsed = span;
          } else {
            cycle.elapsed -= span;
            if (cycle.elapsed >= span) cycle.elapsed = 0;
            cycle.index = (cycle.index + 1) % words.length;
            build(parts, cycle, words);
          }
        }
        if (cycle.elapsed < holdMs) {
          if (!cycle.resting) {
            draw(parts, cycle, 0);
            cycle.resting = true;
          }
          return;
        }
        cycle.resting = false;
        draw(parts, cycle, clampUnit((cycle.elapsed - holdMs) / MORPH_MS));
      },
      { el: root, speed: () => speedRef.current, snap: () => settle(parts, cycle, wordsRef.current) },
    );

    return () => {
      playback.stop();
      sizes.disconnect();
      controller.abort();
    };
  }, [key, filterId]);

  return (
    <span ref={rootRef} className={cx('morphing-text', className)} style={style} {...htmlProps}>
      <span ref={labelRef} className="morphing-text__label" />
      <span ref={stageRef} className="morphing-text__stage" aria-hidden="true">
        <span ref={outgoingRef} className="morphing-text__word" />
        <span ref={incomingRef} className="morphing-text__word" />
      </span>
      <span ref={ruleRef} className="morphing-text__rule" aria-hidden="true" />
      <svg className="morphing-text__defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x={FILTER_REGION_X}
            y={FILTER_REGION_Y}
            width={FILTER_REGION_WIDTH}
            height={FILTER_REGION_HEIGHT}
          >
            <feGaussianBlur ref={thresholdRef} in="SourceGraphic" stdDeviation="0" result="soft" />
            <feColorMatrix in="soft" type="matrix" values={THRESHOLD_MATRIX} />
          </filter>
        </defs>
      </svg>
    </span>
  );
}
