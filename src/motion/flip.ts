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
import { sharedSlot } from '../shared-slot';
import { UIMotion } from '../tokens/motion-tokens';

export type FlipTuning = FlipOptions;

const sharedOwner = sharedSlot('motion.flip-owner@1', () => new Map<string, HTMLElement>());

const usable = (box: Box | null): box is Box => !!box && box.width > 0 && box.height > 0;

export function useFlip<T extends HTMLElement>(
  sharedId: string | null,
  tuning: FlipTuning = {},
  enabled = true,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const playing = useRef<{ play: Playback; el: T } | null>(null);
  const interrupted = useRef<Box | null>(null);
  const { size, timing } = tuning;
  const lastCommitted = enabled && sharedId === null && ref.current ? measure(ref.current) : null;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const live = playing.current;
    let from: Box | null;
    if (sharedId === null) from = lastCommitted;
    else if (live && live.el === el) from = measure(el);
    else if (interrupted.current) from = interrupted.current;
    else from = sharedOwner.get(sharedId) === el ? null : readShared(sharedId);
    live?.play.stop();
    if (sharedId !== null) {
      keepShared(sharedId, measure(el));
      sharedOwner.set(sharedId, el);
    }
    const next = usable(from) && !UIMotion.reduced ? flip(el, from, { size, timing }) : null;
    playing.current = next ? { play: next, el } : null;
    interrupted.current = next ? from : null;
    next?.finished.then(() => {
      if (playing.current?.play === next) {
        playing.current = null;
        interrupted.current = null;
      }
    });
  });

  useLayoutEffect(() => {
    if (!enabled || sharedId === null) return;
    return () => {
      const live = playing.current;
      let box: Box | null = live ? measure(live.el) : null;
      live?.play.stop();
      playing.current = null;
      if (!usable(box)) box = ref.current ? measure(ref.current) : null;
      if (usable(box)) keepShared(sharedId, box);
      const mine = readShared(sharedId);
      queueMicrotask(() => {
        if (readShared(sharedId) === mine) dropShared(sharedId);
        const owner = sharedOwner.get(sharedId);
        if (owner && !owner.isConnected) sharedOwner.delete(sharedId);
      });
    };
  }, [sharedId, enabled]);

  return ref;
}
