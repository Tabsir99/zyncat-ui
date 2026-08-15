export interface MotionTransition {
  type?: 'spring' | 'tween' | 'inertia' | 'keyframes';
  duration?: number;
  ease?:
    | Bezier
    | 'linear'
    | 'easeIn'
    | 'easeOut'
    | 'easeInOut'
    | 'circIn'
    | 'circOut'
    | 'circInOut'
    | 'backIn'
    | 'backOut'
    | 'backInOut'
    | 'anticipate';
  bounce?: number;
  visualDuration?: number;
  delay?: number;
}

export type Bezier = [number, number, number, number];

import type { DistanceToken, DurationToken, EaseToken, ScaleToken } from './motion-scale';
export type { DistanceToken, DurationToken, EaseToken, ScaleToken } from './motion-scale';

export interface MotionTokens {
  /** seconds - fast 0.14 - base 0.2 - slow 0.3 - slower 0.45 - slowest 0.9 */
  dur: Record<DurationToken, number>;
  ease: Record<EaseToken, Bezier>;
  dist: Record<DistanceToken, number>;
  scale: Record<ScaleToken, number>;
  /** ready-made Motion transitions */
  t: { enter: MotionTransition; exit: MotionTransition; layout: MotionTransition; settle: MotionTransition };
  reduced: boolean;
}

type MotionScales = Pick<MotionTokens, 'dur' | 'ease' | 'dist' | 'scale'>;

const DEFAULT_DUR: MotionTokens['dur'] = { fast: 0.14, base: 0.2, slow: 0.3, slower: 0.45, slowest: 0.9 };
const DEFAULT_EASE: MotionTokens['ease'] = {
  standard: [0.2, 0, 0, 1],
  entrance: [0.16, 1, 0.3, 1],
  exit: [0.4, 0, 1, 1],
  spring: [0.34, 1.4, 0.5, 1],
  glide: [0.55, 0, 0.15, 1],
};
const DEFAULT_DIST: MotionTokens['dist'] = { sm: 8, md: 16, lg: 24 };
const DEFAULT_SCALE: MotionTokens['scale'] = { panel: 0.98, floating: 0.96, chip: 0.9 };

function build(scales: MotionScales): MotionTokens {
  const { dur, ease } = scales;
  const reduced = dur.base <= 0.005;
  return {
    ...scales,
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
  const rootFontSize = parseFloat(cs.fontSize) || 16;
  const seconds = (name: string, fallback: number): number => {
    const v = cs.getPropertyValue(name).trim();
    const n = v.slice(-2) === 'ms' ? parseFloat(v) / 1000 : parseFloat(v);
    return isNaN(n) ? fallback : n;
  };
  const pixels = (name: string, fallback: number): number => {
    const v = cs.getPropertyValue(name).trim();
    const n = parseFloat(v);
    if (isNaN(n)) return fallback;
    return v.endsWith('rem') ? n * rootFontSize : n;
  };
  const ratio = (name: string, fallback: number): number => {
    const n = parseFloat(cs.getPropertyValue(name));
    return isNaN(n) ? fallback : n;
  };
  const bezier = (name: string, fallback: Bezier): Bezier => {
    const m = cs.getPropertyValue(name).match(/-?[\d.]+/g);
    return m && m.length === 4 ? (m.map(Number) as Bezier) : fallback;
  };
  return build({
    dur: {
      fast: seconds('--duration-fast', DEFAULT_DUR.fast),
      base: seconds('--duration-base', DEFAULT_DUR.base),
      slow: seconds('--duration-slow', DEFAULT_DUR.slow),
      slower: seconds('--duration-slower', DEFAULT_DUR.slower),
      slowest: seconds('--duration-slowest', DEFAULT_DUR.slowest),
    },
    ease: {
      standard: bezier('--ease-standard', DEFAULT_EASE.standard),
      entrance: bezier('--ease-entrance', DEFAULT_EASE.entrance),
      exit: bezier('--ease-exit', DEFAULT_EASE.exit),
      spring: bezier('--ease-spring', DEFAULT_EASE.spring),
      glide: bezier('--ease-glide', DEFAULT_EASE.glide),
    },
    dist: {
      sm: pixels('--distance-sm', DEFAULT_DIST.sm),
      md: pixels('--distance-md', DEFAULT_DIST.md),
      lg: pixels('--distance-lg', DEFAULT_DIST.lg),
    },
    scale: {
      panel: ratio('--scale-panel', DEFAULT_SCALE.panel),
      floating: ratio('--scale-floating', DEFAULT_SCALE.floating),
      chip: ratio('--scale-chip', DEFAULT_SCALE.chip),
    },
  });
}

export const UIMotion: MotionTokens =
  typeof document !== 'undefined'
    ? readFromDom()
    : build({ dur: DEFAULT_DUR, ease: DEFAULT_EASE, dist: DEFAULT_DIST, scale: DEFAULT_SCALE });

export default UIMotion;
