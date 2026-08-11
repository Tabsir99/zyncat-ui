'use client';

import { useCallback, useEffect, useRef, useState, type HTMLAttributes, type RefObject } from 'react';
import { motion } from 'motion/react';
import type { DataAttributes } from '../dom-props';
import { UIMotion, type MotionTokens } from '../tokens/motion-tokens';

const SM = UIMotion;

export interface GlideRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GlideApi {
  rect: GlideRect | null;
  active: boolean;
  enter: (el: HTMLElement | null) => void;
  leave: () => void;
}

export function useGlide<T extends HTMLElement = HTMLElement>(containerRef: RefObject<T | null>): GlideApi {
  const [rect, setRect] = useState<GlideRect | null>(null);
  const [active, setActive] = useState(false);
  const enter = useCallback(
    (el: HTMLElement | null) => {
      const c = containerRef.current;
      if (!c || !el) return;
      const cb = c.getBoundingClientRect();
      const tb = el.getBoundingClientRect();
      const sx = c.offsetWidth ? cb.width / c.offsetWidth : 1;
      const sy = c.offsetHeight ? cb.height / c.offsetHeight : 1;
      setRect({
        x: (tb.left - cb.left) / sx + c.scrollLeft,
        y: (tb.top - cb.top) / sy + c.scrollTop,
        width: tb.width / sx,
        height: tb.height / sy,
      });
      setActive(true);
    },
    [containerRef],
  );
  const leave = useCallback(() => setActive(false), []);
  return { rect, active, enter, leave };
}

export function useLayoutSelfHeal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const onLayoutAnimationComplete = useCallback(() => {
    if (ref.current) ref.current.style.removeProperty('transform');
  }, []);
  return { ref, onLayoutAnimationComplete };
}

export interface GlidePillProps {
  className?: string;
  rect: GlideRect | null;
  active: boolean;
  motionToken?: keyof MotionTokens['t'];
  /** Standard <span> attributes forwarded to the pill (decorative; aria-hidden). */
  htmlProps?: HTMLAttributes<HTMLSpanElement> & DataAttributes;
}

export function GlidePill({ className, rect, active, motionToken = 'settle', htmlProps }: GlidePillProps) {
  const wasActive = useRef(false);
  useEffect(() => {
    wasActive.current = active;
  });
  const travel = wasActive.current && active ? SM.t[motionToken] : { duration: 0 };
  return (
    <motion.span
      {...(htmlProps as Record<string, unknown>)}
      className={htmlProps?.className ? className + ' ' + htmlProps.className : className}
      aria-hidden="true"
      initial={false}
      animate={{
        x: rect ? rect.x : 0,
        y: rect ? rect.y : 0,
        width: rect ? rect.width : 0,
        height: rect ? rect.height : 0,
        opacity: active && rect ? 1 : 0,
      }}
      transition={{
        x: travel,
        y: travel,
        width: travel,
        height: travel,
        opacity: { duration: SM.dur.fast, ease: active ? SM.ease.standard : SM.ease.exit },
      }}
    ></motion.span>
  );
}
