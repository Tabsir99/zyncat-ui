/* motion-tokens.ts - the JSandCSS motion bridge; Motion code reads these token values, never hardcodes them. */

export interface MotionTransition {
  type?: 'spring' | 'tween' | 'inertia' | 'keyframes';
  duration?: number;
  ease?: Bezier | 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'circIn' | 'circOut' | 'circInOut' | 'backIn' | 'backOut' | 'backInOut' | 'anticipate';
  bounce?: number;
  visualDuration?: number;
  delay?: number;
}

export type Bezier = [number, number, number, number];

/* The canonical token names live in motion-scale.ts; the MotionTokens shape and any
   component prop unions (e.g. Collapse duration/ease) derive from them, so a token
   added or renamed there propagates everywhere by type. */
import type { DurationToken, EaseToken } from './motion-scale';
export type { DurationToken, EaseToken } from './motion-scale';

export interface MotionTokens {
  /** seconds - fast 0.14 - base 0.2 - slow 0.3 - slower 0.45 - slowest 0.9 */
  dur: Record<DurationToken, number>;
  ease: Record<EaseToken, Bezier>;
  /** ready-made Motion transitions */
  t: { enter: MotionTransition; exit: MotionTransition; layout: MotionTransition; settle: MotionTransition };
  reduced: boolean;
}

const DEFAULT_DUR: MotionTokens['dur'] = { fast: 0.14, base: 0.2, slow: 0.3, slower: 0.45, slowest: 0.9 };
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
      settle: reduced ? { duration: 0 } : { type: 'spring', visualDuration: dur.fast, bounce: 0.25 },
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
      slower: seconds('--duration-slower', DEFAULT_DUR.slower),
      slowest: seconds('--duration-slowest', DEFAULT_DUR.slowest),
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
