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

export function useSelfFlip<T extends HTMLElement>(tuning: FlipTuning = {}, enabled = true): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const previous = useRef<Box | null>(null);
  const playing = useRef<Playback | null>(null);
  const { scale, timing } = tuning;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const from = playing.current ? measure(el) : previous.current;
    playing.current?.stop();
    previous.current = measure(el);
    const next = from && !UIMotion.reduced ? flip(el, from, { scale, timing }) : null;
    playing.current = next;
    next?.finished.then(() => {
      if (playing.current === next) playing.current = null;
    });
  });

  useLayoutEffect(
    () => () => {
      playing.current?.stop();
    },
    [],
  );

  return ref;
}

export function useSharedFlip<T extends HTMLElement>(
  id: string,
  tuning: FlipTuning = {},
  enabled = true,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const playing = useRef<{ play: Playback; el: T } | null>(null);
  const { scale, timing } = tuning;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const live = playing.current;
    const from = live && live.el === el ? measure(el) : readShared(id);
    live?.play.stop();
    keepShared(id, measure(el));
    const next = from && !UIMotion.reduced ? flip(el, from, { scale, timing }) : null;
    playing.current = next ? { play: next, el } : null;
    next?.finished.then(() => {
      if (playing.current?.play === next) playing.current = null;
    });
  });

  useLayoutEffect(() => {
    if (!enabled) return;
    return () => {
      const live = playing.current;
      if (live) {
        const box = measure(live.el);
        if (box.width && box.height) keepShared(id, box);
        live.play.stop();
      }
      const mine = readShared(id);
      queueMicrotask(() => {
        if (readShared(id) === mine) dropShared(id);
      });
    };
  }, [id, enabled]);

  return ref;
}
