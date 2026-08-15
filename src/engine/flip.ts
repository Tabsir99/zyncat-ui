import { animate, type Layer, type Playback } from './animate';
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
  return { left: rect.left + window.scrollX, top: rect.top + window.scrollY, width: rect.width, height: rect.height };
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
  /** How a changed box size is reconciled: cheap scale correction, a real width/height morph, or left alone. */
  size?: 'scale' | 'morph' | 'none';
  timing?: Timing;
}

export function flip(el: HTMLElement, from: Box, options: FlipOptions = {}): Playback | null {
  const to = measure(el);
  if (!to.width || !to.height) return null;

  const size = options.size ?? 'scale';
  const dx = from.left - to.left;
  const dy = from.top - to.top;
  const sx = from.width / to.width;
  const sy = from.height / to.height;

  const moved = Math.abs(dx) > MOVE_EPSILON || Math.abs(dy) > MOVE_EPSILON;
  const resized = size !== 'none' && (Math.abs(sx - 1) > SCALE_EPSILON || Math.abs(sy - 1) > SCALE_EPSILON);
  if (!moved && !resized) return null;

  const timing = { ...options.timing, fill: 'none' as const };
  const layers: Layer[] = [{ x: [dx, 0], y: [dy, 0], timing, composite: 'add' }];
  if (resized && size === 'scale')
    layers.push({
      scale: [
        [sx, sy],
        [1, 1],
      ],
      timing,
    });
  if (resized && size === 'morph')
    layers.push({ width: [from.width, to.width], height: [from.height, to.height], timing });

  return animate(el, ...layers);
}
