'use client';

/* GlidePill + useGlide - one persistent pill that springs between hovered cells, never a per-cell remount. */

import * as React from 'react';
import type { RefObject } from 'react';
import { motion } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';

const SM = UIMotion;
const { useRef, useState, useEffect, useCallback } = React;

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

export function useGlide<T extends HTMLElement = HTMLElement>(
  containerRef: RefObject<T | null>,
): GlideApi {
  const [rect, setRect] = useState<GlideRect | null>(null);
  const [active, setActive] = useState(false);
  const enter = useCallback(
    (el: HTMLElement | null) => {
      const c = containerRef.current;
      if (!c || !el) return;
      const cb = c.getBoundingClientRect();
      const tb = el.getBoundingClientRect();
      setRect({ x: tb.left - cb.left, y: tb.top - cb.top, width: tb.width, height: tb.height });
      setActive(true);
    },
    [containerRef],
  );
  const leave = useCallback(() => setActive(false), []);
  return { rect, active, enter, leave };
}

export interface GlidePillProps {
  className?: string;
  rect: GlideRect | null;
  active: boolean;
}

export function GlidePill({ className, rect, active }: GlidePillProps) {
  /* `wasActive` trails one render: the first appearance lands in place, later moves travel on the spring. */
  const wasActive = useRef(false);
  useEffect(() => {
    wasActive.current = active;
  });
  const travel = wasActive.current && active ? SM.t.settle : { duration: 0 };
  return (
    <motion.span
      className={className}
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
