'use client';

/* GlidePill + useGlide - one persistent pill that springs between hovered items, never a per-item
   remount (so it can't be clipped by a per-item wrapper the way a re-parented layoutId node can).
   Container-relative and scroll-aware, so it works in scrolling lists (Select) and static grids
   (DatePicker) alike. The pill animates real width/height - no transform scale - so it never reads
   as collapse/expand between differently sized items. Its look comes from the passed className;
   this module ships no CSS. */

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
      /* container-content coords (+ scroll) so the pill stays pinned to its item when the list
         scrolls; scroll is 0 for static grids, so this is a no-op there. */
      setRect({
        x: tb.left - cb.left + c.scrollLeft,
        y: tb.top - cb.top + c.scrollTop,
        width: tb.width,
        height: tb.height,
      });
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
