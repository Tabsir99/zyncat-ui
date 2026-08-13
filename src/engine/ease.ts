import type { Bezier, MotionTransition } from '../tokens/motion-tokens';

const NAMED: Record<string, Bezier> = {
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  circIn: [0.55, 0, 1, 0.45],
  circOut: [0, 0.55, 0.45, 1],
  circInOut: [0.85, 0, 0.15, 1],
  backIn: [0.36, 0, 0.66, -0.56],
  backOut: [0.34, 1.56, 0.64, 1],
  backInOut: [0.68, -0.6, 0.32, 1.6],
  anticipate: [0.38, -0.4, 0.88, 1.08],
};

export type EaseValue = NonNullable<MotionTransition['ease']>;

const toBezier = (ease: EaseValue): Bezier => (typeof ease === 'string' ? (NAMED[ease] ?? NAMED.easeInOut) : ease);

const cssBezier = (ease: EaseValue): string => `cubic-bezier(${toBezier(ease).join(',')})`;

const isSegmented = (ease: unknown): ease is EaseValue[] =>
  Array.isArray(ease) && (Array.isArray(ease[0]) || typeof ease[0] === 'string');

const ARRIVAL = 0.99;
const SETTLE_BAND = 0.002;
const MAX_SPRING_SECONDS = 4;
const SETTLE_LIMIT = 2.5;
const SETTLE_STEP = 1 / 240;
const OMEGA_PROBE = 0.1;
const OMEGA_CEILING = 1e5;

function springAt(zeta: number, omega: number, t: number): number {
  const decay = Math.exp(-zeta * omega * t);
  if (zeta < 1) {
    const damped = omega * Math.sqrt(1 - zeta * zeta);
    return 1 - decay * (Math.cos(damped * t) + ((zeta * omega) / damped) * Math.sin(damped * t));
  }
  return 1 - decay * (1 + omega * t);
}

function omegaForArrival(zeta: number, visual: number): number {
  let hi = OMEGA_PROBE / visual;
  while (hi < OMEGA_CEILING && springAt(zeta, hi, visual) < ARRIVAL) hi *= 2;
  let lo = hi / 2;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (springAt(zeta, mid, visual) < ARRIVAL) lo = mid;
    else hi = mid;
  }
  return hi;
}

function settleSeconds(zeta: number, omega: number, visual: number): number {
  let last = SETTLE_STEP;
  for (let t = SETTLE_STEP; t < MAX_SPRING_SECONDS; t += SETTLE_STEP) {
    if (Math.abs(springAt(zeta, omega, t) - 1) >= SETTLE_BAND) last = t;
  }
  return Math.min(MAX_SPRING_SECONDS, visual * SETTLE_LIMIT, last + SETTLE_STEP);
}

const SAMPLE_MS = 4;
const MIN_SAMPLES = 24;
const MAX_SAMPLES = 120;

const trim = (n: number) => Math.round(n * 1e4) / 1e4;

function toLinearEasing(at: (progress: number) => number, durationMs: number): string {
  const steps = Math.min(MAX_SAMPLES, Math.max(MIN_SAMPLES, Math.round(durationMs / SAMPLE_MS)));
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) points.push(String(trim(at(i / steps))));
  return `linear(${points.join(',')})`;
}

interface SpringCurve {
  duration: number;
  easing: string;
}

const springCache = new Map<string, SpringCurve>();

function springCurve(visual: number, bounce: number): SpringCurve {
  const key = `${visual}:${bounce}`;
  const cached = springCache.get(key);
  if (cached) return cached;
  const zeta = Math.min(1, Math.max(0.05, 1 - bounce));
  const omega = omegaForArrival(zeta, visual);
  const seconds = settleSeconds(zeta, omega, visual);
  const duration = seconds * 1000;
  const at = (progress: number) => (progress >= 1 ? 1 : springAt(zeta, omega, progress * seconds));
  const curve: SpringCurve = { duration, easing: toLinearEasing(at, duration) };
  springCache.set(key, curve);
  return curve;
}

export interface Timing extends Omit<MotionTransition, 'ease'> {
  ease?: EaseValue | EaseValue[];
  times?: number[];
  fill?: FillMode;
}

export interface ResolvedTiming {
  duration: number;
  delay: number;
  easing: string;
  segments: string[] | null;
}

export function resolveTiming(timing: Timing = {}): ResolvedTiming {
  const delay = (timing.delay ?? 0) * 1000;
  const spring = timing.type === 'spring' || (timing.visualDuration != null && !timing.type);
  if (spring) {
    const visual = Math.max(timing.visualDuration ?? timing.duration ?? 0.3, 0.01);
    const curve = springCurve(visual, timing.bounce ?? 0);
    return { duration: curve.duration, delay, easing: curve.easing, segments: null };
  }
  const duration = (timing.duration ?? 0.3) * 1000;
  const ease = timing.ease;
  if (isSegmented(ease)) return { duration, delay, easing: 'linear', segments: ease.map(cssBezier) };
  const bezier = ease === undefined ? NAMED.easeInOut : toBezier(ease);
  return { duration, delay, easing: cssBezier(bezier), segments: null };
}
