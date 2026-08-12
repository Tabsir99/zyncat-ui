import { resolveTiming, type Timing } from './ease';

export const clock = { scale: 1 };

export interface Playback {
  stop(): void;
  finished: Promise<void>;
}

type Vec = [number, number];
export type Size = number | 'auto';

export interface Layer {
  x?: number[];
  y?: number[];
  scale?: number[] | Vec[];
  opacity?: number[];
  width?: Size[];
  height?: Size[];
  timing?: Timing;
}

const RESET: Record<string, string> = { translate: '0px 0px', scale: '1' };
const AUTO_METRIC = { width: 'offsetWidth', height: 'offsetHeight' } as const;
const SIZES = ['width', 'height'] as const;

function measureAuto(el: HTMLElement, key: 'width' | 'height'): number {
  const saved = el.style.getPropertyValue(key);
  el.style.setProperty(key, 'auto');
  const measured = el[AUTO_METRIC[key]];
  if (saved) el.style.setProperty(key, saved);
  else el.style.removeProperty(key);
  return measured;
}

function held(list: number[], index: number): number {
  return list[Math.min(index, list.length - 1)];
}

function currentValue(el: HTMLElement, key: string): string {
  const raw = getComputedStyle(el).getPropertyValue(key).trim();
  return raw && raw !== 'none' ? raw : RESET[key];
}

function compile(el: HTMLElement, layer: Layer) {
  const frames: Record<string, string[]> = {};
  const autoKeys: string[] = [];

  if (layer.x?.length || layer.y?.length) {
    const x = layer.x?.length ? layer.x : [0];
    const y = layer.y?.length ? layer.y : [0];
    const count = Math.max(x.length, y.length);
    frames.translate = Array.from({ length: count }, (_, i) => `${held(x, i)}px ${held(y, i)}px`);
  }
  if (layer.scale) frames.scale = layer.scale.map((v) => (typeof v === 'number' ? String(v) : `${v[0]} ${v[1]}`));
  if (layer.opacity) frames.opacity = layer.opacity.map(String);

  for (const key of SIZES) {
    const list = layer[key];
    if (!list) continue;
    if (list[list.length - 1] === 'auto') autoKeys.push(key);
    const measured = list.includes('auto') ? measureAuto(el, key) : 0;
    frames[key] = list.map((v) => `${v === 'auto' ? measured : v}px`);
  }

  for (const [key, list] of Object.entries(frames)) if (list.length === 1) list.unshift(currentValue(el, key));
  return { frames, autoKeys };
}

const owned = new WeakMap<HTMLElement, Map<string, Animation>>();

function claim(el: HTMLElement, keys: string[], animation: Animation | null): void {
  const map = owned.get(el) ?? new Map<string, Animation>();
  owned.set(el, map);
  for (const key of keys) {
    const previous = map.get(key);
    if (previous && previous !== animation) previous.cancel();
    if (animation) map.set(key, animation);
    else map.delete(key);
  }
}

function play(el: HTMLElement, layer: Layer): Playback | null {
  const { frames, autoKeys } = compile(el, layer);
  const keys = Object.keys(frames);
  if (!keys.length) return null;

  const timing = layer.timing;
  const resolved = resolveTiming(timing);

  if (resolved.duration <= 0) {
    claim(el, keys, null);
    if (timing?.fill !== 'none') for (const key of keys) el.style.setProperty(key, frames[key][frames[key].length - 1]);
    return null;
  }

  const shaped: PropertyIndexedKeyframes = { ...frames };
  if (timing?.times) shaped.offset = timing.times;
  if (resolved.segments) shaped.easing = resolved.segments;

  const animation = el.animate(shaped, {
    duration: resolved.duration,
    delay: resolved.delay,
    easing: resolved.easing,
    fill: timing?.fill ?? 'both',
  });
  animation.playbackRate = 1 / clock.scale;
  claim(el, keys, animation);

  const finished = animation.finished.then(
    (): void => {
      if (!autoKeys.length) return;
      animation.commitStyles();
      animation.cancel();
      for (const key of autoKeys) el.style.setProperty(key, 'auto');
    },
    (): void => {},
  );

  return { stop: () => animation.cancel(), finished };
}

const settled: Playback = { stop() {}, finished: Promise.resolve() };

export function animate(el: HTMLElement, ...layers: Layer[]): Playback {
  const plays: Playback[] = [];
  for (const layer of layers) {
    const started = play(el, layer);
    if (started) plays.push(started);
  }
  if (!plays.length) return settled;
  if (plays.length === 1) return plays[0];
  return {
    stop: () => {
      for (const started of plays) started.stop();
    },
    finished: Promise.all(plays.map((started) => started.finished)).then((): void => {}),
  };
}
