'use client';

import { useCallback, useRef, type HTMLAttributes, type RefObject } from 'react';
import { animate } from '../engine';
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

  const enter = useCallback(
    (target: HTMLElement | null) => {
      const container = containerRef.current;
      const pill = ref.current;
      if (!container || !pill || !target) return;

      const cb = container.getBoundingClientRect();
      const tb = target.getBoundingClientRect();
      const sx = container.offsetWidth ? cb.width / container.offsetWidth : 1;
      const sy = container.offsetHeight ? cb.height / container.offsetHeight : 1;

      const travel = visible.current && !SM.reduced ? SM.t[motionToken] : { duration: 0 };
      animate(
        pill,
        {
          translate: `${(tb.left - cb.left) / sx + container.scrollLeft}px ${(tb.top - cb.top) / sy + container.scrollTop}px`,
          width: tb.width / sx,
          height: tb.height / sy,
        },
        travel,
      );
      animate(pill, { opacity: 1 }, { duration: SM.dur.fast, ease: SM.ease.standard });
      visible.current = true;
    },
    [containerRef, motionToken],
  );

  const leave = useCallback(() => {
    const pill = ref.current;
    if (!pill) return;
    visible.current = false;
    animate(pill, { opacity: 0 }, { duration: SM.dur.fast, ease: SM.ease.exit });
  }, []);

  return { ref, enter, leave };
}

export function useLayoutSelfHeal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const onLayoutAnimationComplete = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty('transform');
    el.style.removeProperty('translate');
    el.style.removeProperty('scale');
  }, []);
  return { ref, onLayoutAnimationComplete };
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
