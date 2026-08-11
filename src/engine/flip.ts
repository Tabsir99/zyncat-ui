import { animate, type Playback } from './animate';
import type { Timing } from './ease';

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const MOVE_EPSILON = 0.5;
const SCALE_EPSILON = 0.01;

export function measure(el: HTMLElement): Box {
  const rect = el.getBoundingClientRect();
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

const shared = new Map<string, Box>();

export function keepShared(key: string, box: Box): void {
  shared.set(key, box);
}

export function readShared(key: string): Box | null {
  return shared.get(key) ?? null;
}

export function dropShared(key: string): void {
  shared.delete(key);
}

export interface FlipOptions {
  scale?: boolean;
  timing?: Timing;
}

export function flip(el: HTMLElement, from: Box, options: FlipOptions = {}): Playback | null {
  const to = measure(el);
  if (!to.width || !to.height) return null;

  const dx = from.left - to.left;
  const dy = from.top - to.top;
  const sx = options.scale === false ? 1 : from.width / to.width;
  const sy = options.scale === false ? 1 : from.height / to.height;

  const moved = Math.abs(dx) > MOVE_EPSILON || Math.abs(dy) > MOVE_EPSILON;
  const scaled = Math.abs(sx - 1) > SCALE_EPSILON || Math.abs(sy - 1) > SCALE_EPSILON;
  if (!moved && !scaled) return null;

  const keyframes = scaled
    ? { translate: [`${dx}px ${dy}px`, '0px 0px'], scale: [`${sx} ${sy}`, '1 1'] }
    : { translate: [`${dx}px ${dy}px`, '0px 0px'] };

  return animate(el, keyframes, options.timing, { fill: 'none' });
}
