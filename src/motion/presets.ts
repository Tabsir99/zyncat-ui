import type { Layer } from '../engine';

type LayerTiming = Layer['timing'];

export const popIn = (scale: number, timing: LayerTiming): Layer => ({ opacity: [0, 1], scale: [scale, 1], timing });

export const popOut = (scale: number, timing: LayerTiming): Layer => ({ opacity: [0], scale: [scale], timing });

export const slideIn = (distance: number, timing: LayerTiming): Layer => ({
  x: [distance, 0],
  opacity: [0, 1],
  timing,
});
