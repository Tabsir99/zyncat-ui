import { resolveTiming, type Timing } from './ease';

export const clock = { scale: 1 };

export interface Playback {
  stop(): void;
  finished: Promise<void>;
}

export type StyleValue = number | string;
export type Keyframes = Record<string, StyleValue | StyleValue[]>;

const UNITLESS = new Set([
  'opacity',
  'scale',
  'zIndex',
  'flexGrow',
  'flexShrink',
  'order',
  'lineHeight',
  'fontWeight',
  'transform',
]);

const RESET: Record<string, string> = { translate: '0px 0px', scale: '1', rotate: '0deg', filter: 'none' };

const AUTO_METRIC: Record<string, 'offsetHeight' | 'offsetWidth'> = { height: 'offsetHeight', width: 'offsetWidth' };

const kebab = (key: string) => (key.startsWith('--') ? key : key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`));

const toCss = (key: string, value: StyleValue) =>
  typeof value === 'number' && !UNITLESS.has(key) ? `${value}px` : String(value);

export function setStyle(el: HTMLElement, key: string, value: StyleValue): void {
  el.style.setProperty(kebab(key), toCss(key, value));
}

function currentValue(el: HTMLElement, key: string): string | null {
  const raw = getComputedStyle(el).getPropertyValue(kebab(key)).trim();
  if (raw && raw !== 'none') return raw;
  return RESET[key] ?? null;
}

const asList = (value: StyleValue | StyleValue[]) => (Array.isArray(value) ? value : [value]);

function measureAuto(el: HTMLElement, key: string): number {
  const property = kebab(key);
  const saved = el.style.getPropertyValue(property);
  el.style.setProperty(property, 'auto');
  const measured = el[AUTO_METRIC[key]];
  if (saved) el.style.setProperty(property, saved);
  else el.style.removeProperty(property);
  return measured;
}

function resolveFrames(el: HTMLElement, keyframes: Keyframes) {
  const frames: Record<string, string[]> = {};
  const autoKeys: string[] = [];
  for (const [key, raw] of Object.entries(keyframes)) {
    let values = asList(raw);
    if (AUTO_METRIC[key] && values.includes('auto')) {
      if (values[values.length - 1] === 'auto') autoKeys.push(key);
      const measured = measureAuto(el, key);
      values = values.map((value) => (value === 'auto' ? measured : value));
    }
    const list = values.map((value) => toCss(key, value));
    if (list.length === 1) {
      const from = currentValue(el, key);
      if (from !== null) list.unshift(from);
    }
    frames[key] = list;
  }
  return { frames, autoKeys };
}

const owned = new WeakMap<HTMLElement, Map<string, Animation>>();

function claim(el: HTMLElement, keys: string[], animation: Animation): void {
  const map = owned.get(el) ?? new Map<string, Animation>();
  owned.set(el, map);
  for (const key of keys) {
    const previous = map.get(key);
    if (previous && previous !== animation) previous.cancel();
    map.set(key, animation);
  }
}

const settled: Playback = { stop() {}, finished: Promise.resolve() };

export interface AnimateOptions {
  fill?: FillMode;
}

export function animate(
  el: HTMLElement,
  keyframes: Keyframes,
  timing?: Timing,
  options: AnimateOptions = {},
): Playback {
  const resolved = resolveTiming(timing);
  const { frames, autoKeys } = resolveFrames(el, keyframes);
  const keys = Object.keys(frames);
  if (!keys.length) return settled;

  if (resolved.duration <= 0) {
    if (options.fill !== 'none') for (const key of keys) setStyle(el, key, frames[key][frames[key].length - 1]);
    return settled;
  }

  const shaped: PropertyIndexedKeyframes = { ...frames };
  if (timing?.times) shaped.offset = timing.times;
  if (resolved.segments) shaped.easing = resolved.segments;

  const animation = el.animate(shaped, {
    duration: resolved.duration,
    delay: resolved.delay,
    easing: resolved.easing,
    fill: options.fill ?? 'both',
  });
  animation.playbackRate = 1 / clock.scale;
  claim(el, keys, animation);

  const finished = animation.finished.then(
    (): void => {
      if (!autoKeys.length) return;
      animation.commitStyles();
      animation.cancel();
      for (const key of autoKeys) el.style.setProperty(kebab(key), 'auto');
    },
    (): void => {},
  );

  return { stop: () => animation.cancel(), finished };
}
