'use client';

import { useRef, type RefObject } from 'react';

import { animate, flip, measure, set } from '../engine';
import { UIMotion as SM } from '../tokens/motion-tokens';

export type GlideApi = ReturnType<typeof useGlide>;

export function useGlide<T extends HTMLElement>(containerRef: RefObject<T | null>) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const visible = useRef(false);

  function enter(target: HTMLElement | null) {
    const box = containerRef.current,
      pill = ref.current;
    if (!box || !pill || !target) return;
    const was = measure(pill);
    const b = box.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const s = box.offsetWidth ? b.width / box.offsetWidth : 1;
    set(pill, {
      x: [(t.left - b.left) / s + box.scrollLeft],
      y: [(t.top - b.top) / s + box.scrollTop],
      width: [t.width / s],
      height: [t.height / s],
    });
    animate(pill, { opacity: [1], timing: { duration: SM.dur.fast, ease: SM.ease.standard } });
    const glided = visible.current && !SM.reduced && was.width > 0 && was.height > 0;
    visible.current = true;
    if (glided) flip(pill, was, { size: 'morph', timing: SM.t.settle });
  }

  function leave() {
    visible.current = false;
    if (ref.current) animate(ref.current, { opacity: [0], timing: { duration: SM.dur.fast, ease: SM.ease.exit } });
  }

  return { ref, enter, leave };
}

export function GlidePill({ className, glide }: { className?: string; glide: GlideApi }) {
  return <span ref={glide.ref} className={className} aria-hidden="true" />;
}
