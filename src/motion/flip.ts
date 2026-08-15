'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';
import {
  dropShared,
  flip,
  keepShared,
  measure,
  readShared,
  type Box,
  type FlipOptions,
  type Playback,
} from '../engine';
import { UIMotion } from '../tokens/motion-tokens';

export type FlipTuning = FlipOptions;

export function useFlip<T extends HTMLElement>(
  sharedId: string | null,
  tuning: FlipTuning = {},
  enabled = true,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const privateBox = useRef<Box | null>(null);
  const playing = useRef<{ play: Playback; el: T } | null>(null);
  const { size, timing } = tuning;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const live = playing.current;
    const from = live && live.el === el ? measure(el) : sharedId === null ? privateBox.current : readShared(sharedId);
    live?.play.stop();
    const settled = measure(el);
    if (sharedId === null) privateBox.current = settled;
    else keepShared(sharedId, settled);
    const next = from && !UIMotion.reduced ? flip(el, from, { size, timing }) : null;
    playing.current = next ? { play: next, el } : null;
    next?.finished.then(() => {
      if (playing.current?.play === next) playing.current = null;
    });
  });

  useLayoutEffect(() => {
    if (!enabled || sharedId === null) return;
    return () => {
      const live = playing.current;
      if (live) {
        const box = measure(live.el);
        if (box.width && box.height) keepShared(sharedId, box);
        live.play.stop();
      }
      const mine = readShared(sharedId);
      queueMicrotask(() => {
        if (readShared(sharedId) === mine) dropShared(sharedId);
      });
    };
  }, [sharedId, enabled]);

  return ref;
}
