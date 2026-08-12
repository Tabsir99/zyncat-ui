'use client';

import { useRef, type RefObject } from 'react';
import { animate } from '../engine';
import { UIMotion as SM } from '../tokens/motion-tokens';

export type GlideApi = ReturnType<typeof useGlide>;

export function useGlide<T extends HTMLElement>(containerRef: RefObject<T | null>) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const visible = useRef(false);

  function enter(target: HTMLElement | null) {
    const box = containerRef.current,
      pill = ref.current;
    if (!box || !pill || !target) return;
    const was = pill.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const s = box.offsetWidth ? b.width / box.offsetWidth : 1;
    pill.style.translate = `${(t.left - b.left) / s + box.scrollLeft}px ${(t.top - b.top) / s + box.scrollTop}px`;
    pill.style.width = `${t.width / s}px`;
    pill.style.height = `${t.height / s}px`;
    const now = pill.getBoundingClientRect();
    animate(pill, { opacity: [1], timing: { duration: SM.dur.fast, ease: SM.ease.standard } });
    const glided = visible.current && !SM.reduced;
    visible.current = true;
    if (!glided) return;
    const timing = { ...SM.t.settle, fill: 'none' as const };
    animate(
      pill,
      { x: [was.left - now.left, 0], y: [was.top - now.top, 0], timing, composite: 'add' },
      { width: [was.width, now.width], height: [was.height, now.height], timing },
    );
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
