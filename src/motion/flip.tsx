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
    if (previous.current && !UIMotion.reduced) {
      const next = flip(el, previous.current, { scale, timing });
      if (next) {
        playing.current?.stop();
        playing.current = next;
      }
    }
    previous.current = measure(el);
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
  const playing = useRef<Playback | null>(null);
  const { scale, timing } = tuning;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = readShared(id);
    if (from && !UIMotion.reduced) {
      const next = flip(el, from, { scale, timing });
      if (next) {
        playing.current?.stop();
        playing.current = next;
      }
    }
    keepShared(id, measure(el));
  });

  useLayoutEffect(() => {
    return () => {
      playing.current?.stop();
      const mine = readShared(id);
      queueMicrotask(() => {
        if (readShared(id) === mine) dropShared(id);
      });
    };
  }, [id]);

  return ref;
}
