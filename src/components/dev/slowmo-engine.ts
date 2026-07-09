/* Motion slow-mo engine - a framework-agnostic time-scaler that reaches EVERY place
   this design system (and its host app) can drive animation from. There is no single
   clock the browser exposes, so slowing "everything" means intercepting each layer that
   owns a timeline. Applying a factor to one of them (say, CSS) leaves the others at full
   speed - the whole point is to cover all of them at once, in sync.

   Layers, and why each is needed:

   1. CSS transitions + @keyframes  (browser compositor clock)
        Every duration in this system flows through the --duration-* tokens, so scaling
        those five custom properties on <html> slows all token-driven CSS at once. This
        also re-inflates the reduced-motion 1ms collapse on purpose: a motion debugger
        should let you SEE motion even when the OS asks to minimize it.

   2. Motion / framer-motion  (its own JS frame loop)
        Motion keeps time in `frameData.timestamp`. Flipping MotionGlobalConfig.useManualTiming
        makes the whole engine read that field instead of performance.now(), and a rAF loop
        advances it at realDelta/factor - slowing springs, layout/FLIP, AnimatePresence and
        imperative animate() uniformly, no matter how each component configured its transition.
        Motion also "accelerates" opacity/transform onto WAAPI (the browser clock, immune to
        the manual clock) and stamps those animations' startTime from the manual clock - which
        would desync them. Clearing `acceleratedValues` for the duration keeps every Motion
        animation on the single JS clock, sidestepping that entirely.

   3. setTimeout / setInterval
        A few components schedule DOM cleanup a duration later (glint strip, StatusBadge word
        drop) assuming the CSS animation has finished. Scaling CSS without scaling these timers
        makes them fire early and truncate the animation. Scaling timers keeps them in step and
        gives a coherent global slow-mo (toast dwell, tooltip delay, ...). Opt-out via options.

   4. Element.prototype.animate  (raw WAAPI, host-app coverage)
        Anything - app code or a third-party lib - that animates via WAAPI directly. New
        animations get their playbackRate scaled; the reference is tracked so a live factor
        change (or pause) applies to it immediately.

   5. document.getAnimations() sweep on activation
        Catches whatever was already mid-flight the instant you switch slow-mo on (running CSS
        animations, in-flight WAAPI) so nothing finishes at full speed under you.

   Every layer installs on activate, reconfigures live on factor/pause change, and fully
   restores on deactivate. Pause freezes the Motion clock, sets live animations to
   playbackRate 0, and parks CSS at an effectively-infinite duration. */

import { frameData, MotionGlobalConfig, acceleratedValues } from 'motion/react';

export interface SlowmoState {
  /** 1 = real time. >1 = that many times slower (4 = quarter speed). */
  factor: number;
  /** Freeze motion in place - useful for inspecting a transition mid-flight. */
  paused: boolean;
}

export interface SlowmoOptions {
  /** Also scale setTimeout/setInterval so duration-coupled JS cleanups don't truncate
   *  slowed CSS. Turn off if stretched app timers get in your way. @default true */
  scaleTimers: boolean;
}

/** Canonical --duration-* scale (ms), mirrored from tokens/motion.css. Used as the scaling
 *  base so slow-mo works even when reduced-motion has collapsed the live tokens to 1ms. */
const CANONICAL: Record<string, number> = {
  '--duration-fast': 140,
  '--duration-base': 200,
  '--duration-slow': 300,
  '--duration-slower': 450,
  '--duration-spin': 600,
  '--duration-pulse': 1600,
};
const DURATION_TOKENS = Object.keys(CANONICAL);
/** Below this the live token is a reduced-motion collapse (1ms), not a real base - scale the canonical instead. */
const COLLAPSED_MS = 4;
/** Parked duration while paused: long enough to read as frozen, short of the setTimeout wrap-around cliff. */
const FROZEN_MS = 600_000;
/** setTimeout clamps delays above ~2^31 to 0 (fires immediately). Stay well under. */
const MAX_TIMER_DELAY = 2 ** 30;

const clamp = (min: number, max: number, v: number) => (v < min ? min : v > max ? max : v);
const hasDOM = typeof document !== 'undefined' && typeof window !== 'undefined';
const hasMotion = !!frameData && !!MotionGlobalConfig && acceleratedValues instanceof Set;

const state: SlowmoState = { factor: 1, paused: false };
const options: SlowmoOptions = { scaleTimers: true };
const listeners = new Set<(s: SlowmoState) => void>();

let active = false;
/** ms base each token scales from, captured at activation (respects consumer theming). */
let baseMs: Record<string, number> = {};

// --- Motion clock ---
let rafId = 0;
let motionClock = 0;
let lastReal = 0;
let savedManualTiming: boolean | undefined;
let savedAccel: string[] | null = null;

// --- timers ---
type SetTimer = (handler: TimerHandler, timeout?: number, ...args: unknown[]) => number;
let origSetTimeout: SetTimer | null = null;
let origSetInterval: SetTimer | null = null;

// --- WAAPI ---
type AnimateFn = (this: Element, ...args: unknown[]) => Animation;
let origAnimate: AnimateFn | null = null;
/** animation -> its playbackRate before we touched it, so deactivate restores exactly. */
const trackedRates = new Map<Animation, number>();

/* ---------- layer 1: CSS duration tokens ---------- */

function readBaseMs(token: string): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const n = raw.endsWith('ms') ? parseFloat(raw) : raw.endsWith('s') ? parseFloat(raw) * 1000 : parseFloat(raw);
  if (isNaN(n) || n <= COLLAPSED_MS) return CANONICAL[token];
  return n;
}

function applyCssTokens() {
  const root = document.documentElement.style;
  for (const token of DURATION_TOKENS) {
    const ms = state.paused ? FROZEN_MS : baseMs[token] * state.factor;
    root.setProperty(token, `${ms}ms`);
  }
}

function clearCssTokens() {
  const root = document.documentElement.style;
  for (const token of DURATION_TOKENS) root.removeProperty(token);
}

/* ---------- layer 2: Motion JS clock ---------- */

function pumpMotionClock(real: number) {
  const dt = real - lastReal;
  lastReal = real;
  if (!state.paused) motionClock += dt / state.factor;
  frameData.timestamp = motionClock;
  // JSAnimation reads absolute (timestamp - startTime); delta only feeds velocity. Keep it
  // positive when paused (timestamp is frozen, so progress is frozen regardless).
  frameData.delta = state.paused ? 1 : clamp(1, 40, dt / state.factor);
  rafId = requestAnimationFrame(pumpMotionClock);
}

function startMotionClock() {
  if (!hasMotion) return;
  savedManualTiming = MotionGlobalConfig.useManualTiming;
  MotionGlobalConfig.useManualTiming = true;
  // Force Motion off the WAAPI fast-path so opacity/transform animations ride the same JS
  // clock as everything else (and don't get a manual-clock startTime stamped onto the real
  // document timeline). Restored on deactivate.
  savedAccel = [...acceleratedValues];
  acceleratedValues.clear();
  motionClock = performance.now();
  lastReal = motionClock;
  frameData.timestamp = motionClock;
  rafId = requestAnimationFrame(pumpMotionClock);
}

function stopMotionClock() {
  if (!hasMotion) return;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  MotionGlobalConfig.useManualTiming = savedManualTiming;
  // Resync Motion's clock to real time; any in-flight JS animation resumes at full speed.
  frameData.timestamp = performance.now();
  if (savedAccel) {
    for (const v of savedAccel) acceleratedValues.add(v);
    savedAccel = null;
  }
}

/* ---------- layer 3: timers ---------- */

function scaleDelay(delay?: number): number | undefined {
  if (typeof delay !== 'number' || !isFinite(delay)) return delay;
  return Math.min(delay * state.factor, MAX_TIMER_DELAY);
}

function patchTimers() {
  if (origSetTimeout) return;
  origSetTimeout = window.setTimeout as unknown as SetTimer;
  origSetInterval = window.setInterval as unknown as SetTimer;
  const nativeTimeout = origSetTimeout.bind(window);
  const nativeInterval = origSetInterval.bind(window);
  window.setTimeout = ((h: TimerHandler, t?: number, ...a: unknown[]) =>
    nativeTimeout(h, scaleDelay(t), ...a)) as typeof window.setTimeout;
  window.setInterval = ((h: TimerHandler, t?: number, ...a: unknown[]) =>
    nativeInterval(h, scaleDelay(t), ...a)) as typeof window.setInterval;
}

function restoreTimers() {
  if (origSetTimeout) window.setTimeout = origSetTimeout as typeof window.setTimeout;
  if (origSetInterval) window.setInterval = origSetInterval as typeof window.setInterval;
  origSetTimeout = origSetInterval = null;
}

/* ---------- layers 4 + 5: WAAPI playbackRate ---------- */

function liveRate(): number {
  return state.paused ? 0 : 1 / state.factor;
}

function track(anim: Animation, original: number) {
  if (trackedRates.has(anim)) return;
  trackedRates.set(anim, original);
  const forget = () => trackedRates.delete(anim);
  anim.finished.then(forget).catch(forget); // infinite animations never resolve - dropped on deactivate
}

function patchAnimate() {
  if (origAnimate) return;
  origAnimate = Element.prototype.animate as unknown as AnimateFn;
  const original = origAnimate;
  Element.prototype.animate = function (this: Element, ...args: unknown[]): Animation {
    const anim = original.apply(this, args);
    try {
      track(anim, anim.playbackRate);
      anim.playbackRate = liveRate();
    } catch {
      /* detached / cross-origin - leave it */
    }
    return anim;
  } as typeof Element.prototype.animate;
}

function restoreAnimate() {
  if (origAnimate) Element.prototype.animate = origAnimate as typeof Element.prototype.animate;
  origAnimate = null;
}

function sweepExisting() {
  const rate = liveRate();
  for (const anim of document.getAnimations()) {
    try {
      track(anim, anim.playbackRate);
      anim.playbackRate = rate;
    } catch {
      /* ignore */
    }
  }
}

function applyTrackedRates() {
  const rate = liveRate();
  for (const anim of trackedRates.keys()) {
    try {
      anim.playbackRate = rate;
    } catch {
      /* ignore */
    }
  }
}

function restoreTrackedRates() {
  for (const [anim, original] of trackedRates) {
    try {
      anim.playbackRate = original;
    } catch {
      /* ignore */
    }
  }
  trackedRates.clear();
}

/* ---------- orchestration ---------- */

function install() {
  active = true;
  baseMs = {};
  for (const token of DURATION_TOKENS) baseMs[token] = readBaseMs(token);
  applyCssTokens();
  startMotionClock();
  if (options.scaleTimers) patchTimers();
  patchAnimate();
  sweepExisting();
}

function reconfigure() {
  applyCssTokens();
  applyTrackedRates();
  // motion clock + timers read `state` live, no restart needed
}

function uninstall() {
  active = false;
  clearCssTokens();
  stopMotionClock();
  restoreTimers();
  restoreAnimate();
  restoreTrackedRates();
}

function notify() {
  const snapshot = { ...state };
  for (const cb of listeners) cb(snapshot);
}

function shouldBeActive(): boolean {
  return state.factor > 1 || state.paused;
}

/** Imperative control surface - drive slow-mo from a console, a hotkey, or the panel.
 *  Safe to call during SSR (no-ops the DOM work, still tracks state for hydration). */
export const motionSlowmo = {
  /** Current state (a copy). */
  get(): SlowmoState {
    return { ...state };
  },

  /** Merge a partial state. factor is clamped to [1, 64]. */
  set(patch: Partial<SlowmoState>): void {
    if (typeof patch.factor === 'number') state.factor = clamp(1, 64, patch.factor);
    if (typeof patch.paused === 'boolean') state.paused = patch.paused;

    if (hasDOM) {
      const wantActive = shouldBeActive();
      if (!active && wantActive) install();
      else if (active && !wantActive) uninstall();
      else if (active) reconfigure();
    }
    notify();
  },

  /** Tune engine behaviour (e.g. stop scaling timers). Applies immediately if active. */
  configure(patch: Partial<SlowmoOptions>): void {
    if (typeof patch.scaleTimers === 'boolean' && patch.scaleTimers !== options.scaleTimers) {
      options.scaleTimers = patch.scaleTimers;
      if (active) options.scaleTimers ? patchTimers() : restoreTimers();
    }
  },

  /** Convenience: back to real time and unpaused. */
  reset(): void {
    this.set({ factor: 1, paused: false });
  },

  /** Subscribe to state changes; returns an unsubscribe fn. */
  subscribe(cb: (s: SlowmoState) => void): () => void {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export type MotionSlowmo = typeof motionSlowmo;
