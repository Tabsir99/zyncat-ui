'use client';

import { useCallback, useRef, type HTMLAttributes, type RefObject } from 'react';
import { animate, type Playback } from '../engine';
import type { DataAttributes } from '../dom-props';
import { UIMotion, type MotionTokens } from '../tokens/motion-tokens';

const SM = UIMotion;

export interface GlideApi {
  ref: RefObject<HTMLSpanElement | null>;
  enter: (target: HTMLElement | null) => void;
  leave: () => void;
}

export function useGlide<T extends HTMLElement = HTMLElement>(
  containerRef: RefObject<T | null>,
  motionToken: keyof MotionTokens['t'] = 'settle',
): GlideApi {
  const ref = useRef<HTMLSpanElement | null>(null);
  const visible = useRef(false);
  const travelling = useRef<Playback | null>(null);
  const queued = useRef<HTMLElement | null>(null);

  const enter = useCallback(
    (target: HTMLElement | null) => {
      const container = containerRef.current;
      const pill = ref.current;
      if (!container || !pill || !target) return;

      const instant = !visible.current || SM.reduced;
      if (!instant && travelling.current) {
        queued.current = target;
        return;
      }

      const cb = container.getBoundingClientRect();
      const tb = target.getBoundingClientRect();
      const sx = container.offsetWidth ? cb.width / container.offsetWidth : 1;
      const sy = container.offsetHeight ? cb.height / container.offsetHeight : 1;

      const play = animate(
        pill,
        {
          x: [(tb.left - cb.left) / sx + container.scrollLeft],
          y: [(tb.top - cb.top) / sy + container.scrollTop],
          width: [tb.width / sx],
          height: [tb.height / sy],
          timing: instant ? { duration: 0 } : SM.t[motionToken],
        },
        { opacity: [1], timing: { duration: SM.dur.fast, ease: SM.ease.standard } },
      );
      visible.current = true;
      travelling.current = instant ? null : play;
      if (instant) return;

      play.finished.then(() => {
        if (travelling.current !== play) return;
        travelling.current = null;
        const next = queued.current;
        queued.current = null;
        if (next && visible.current) enter(next);
      });
    },
    [containerRef, motionToken],
  );

  const leave = useCallback(() => {
    const pill = ref.current;
    if (!pill) return;
    visible.current = false;
    queued.current = null;
    animate(pill, { opacity: [0], timing: { duration: SM.dur.fast, ease: SM.ease.exit } });
  }, []);

  return { ref, enter, leave };
}

export interface GlidePillProps {
  className?: string;
  glide: GlideApi;
  /** Standard <span> attributes forwarded to the pill (decorative; aria-hidden). */
  htmlProps?: HTMLAttributes<HTMLSpanElement> & DataAttributes;
}

export function GlidePill({ className, glide, htmlProps }: GlidePillProps) {
  return (
    <span
      {...htmlProps}
      ref={glide.ref}
      className={htmlProps?.className ? className + ' ' + htmlProps.className : className}
      aria-hidden="true"
    ></span>
  );
}
