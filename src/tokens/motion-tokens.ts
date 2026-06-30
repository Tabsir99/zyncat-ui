/* motion-tokens.ts - the JSandCSS motion bridge; Motion code reads these token values, never hardcodes them. */

import type { Transition } from 'motion/react';

export type Bezier = [number, number, number, number];

export interface MotionTokens {
  /** seconds - fast 0.12 - base 0.18 - slow 0.26 */
  dur: { fast: number; base: number; slow: number };
  ease: { standard: Bezier; entrance: Bezier; exit: Bezier; spring: Bezier; glide: Bezier };
  /** ready-made Motion transitions */
  t: { enter: Transition; exit: Transition; layout: Transition; settle: Transition };
  reduced: boolean;
}

const DEFAULT_DUR: MotionTokens['dur'] = { fast: 0.12, base: 0.18, slow: 0.26 };
const DEFAULT_EASE: MotionTokens['ease'] = {
  standard: [0.2, 0, 0, 1],
  entrance: [0.16, 1, 0.3, 1],
  exit: [0.4, 0, 1, 1],
  spring: [0.34, 1.4, 0.5, 1],
  glide: [0.55, 0, 0.15, 1],
};

function build(dur: MotionTokens['dur'], ease: MotionTokens['ease']): MotionTokens {
  const reduced = dur.base <= 0.005; // reduced motion collapses durations to ~1ms
  return {
    dur,
    ease,
    reduced,
    t: {
      enter: { duration: dur.base, ease: ease.entrance },
      exit: { duration: dur.fast, ease: ease.exit },
      layout: { duration: dur.slow, ease: ease.entrance },
      settle: reduced
        ? { duration: 0 }
        : { type: 'spring', visualDuration: dur.base, bounce: 0.22 },
    },
  };
}

function readFromDom(): MotionTokens {
  const cs = getComputedStyle(document.documentElement);
  const seconds = (name: string, fallback: number): number => {
    const v = cs.getPropertyValue(name).trim();
    const n = v.slice(-2) === 'ms' ? parseFloat(v) / 1000 : parseFloat(v);
    return isNaN(n) ? fallback : n;
  };
  const bezier = (name: string, fallback: Bezier): Bezier => {
    const m = cs.getPropertyValue(name).match(/-?[\d.]+/g);
    return m && m.length === 4 ? (m.map(Number) as Bezier) : fallback;
  };
  return build(
    {
      fast: seconds('--duration-fast', DEFAULT_DUR.fast),
      base: seconds('--duration-base', DEFAULT_DUR.base),
      slow: seconds('--duration-slow', DEFAULT_DUR.slow),
    },
    {
      standard: bezier('--ease-standard', DEFAULT_EASE.standard),
      entrance: bezier('--ease-entrance', DEFAULT_EASE.entrance),
      exit: bezier('--ease-exit', DEFAULT_EASE.exit),
      spring: bezier('--ease-spring', DEFAULT_EASE.spring),
      glide: bezier('--ease-glide', DEFAULT_EASE.glide),
    },
  );
}

export const UIMotion: MotionTokens =
  typeof document !== 'undefined' ? readFromDom() : build(DEFAULT_DUR, DEFAULT_EASE);

export default UIMotion;
