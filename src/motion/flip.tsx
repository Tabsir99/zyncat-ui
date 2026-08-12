'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';
import { dropShared, flip, keepShared, measure, readShared, type Box, type Playback, type Timing } from '../engine';
import { UIMotion } from '../tokens/motion-tokens';

export interface FlipTuning {
  scale?: boolean;
  timing?: Timing;
}

export function useSelfFlip<T extends HTMLElement>(tuning: FlipTuning = {}): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const previous = useRef<Box | null>(null);
  const playing = useRef<Playback | null>(null);
  const { scale, timing } = tuning;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
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

export function useSharedFlip<T extends HTMLElement>(id: string, tuning: FlipTuning = {}): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const playing = useRef<{ play: Playback; el: T } | null>(null);
  const { scale, timing } = tuning;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
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
    return () => {
      playing.current?.play.stop();
      const mine = readShared(id);
      queueMicrotask(() => {
        if (readShared(id) === mine) dropShared(id);
      });
    };
  }, [id]);

  return ref;
}
