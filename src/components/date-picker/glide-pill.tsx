'use client';

/* glide-pill.tsx — GlidePill + useGlide: the gliding hover highlight.
   ─────────────────────────────────────────────────────────────────────────
   Variant-blind presentational mechanics (A9: the "stateless mechanics +
   presentational chrome" a shared core may legitimately hold — owns NO state,
   knows nothing of who mounts it). ONE pill that GLIDES between cells instead
   of per-cell backgrounds (the Tabs second-motion). Used identically by the
   calendar day hover (DateField, DateRangeField) and the range presets rail.

   ── Why this is a PERSISTENT node, not a per-cell remount ──────────────────
   The earlier version mounted the pill INSIDE the hovered cell and moved it by
   swapping which cell carried a shared `layoutId`. Every cell crossing
   therefore unmounted the node from cell A and mounted a fresh one in cell B,
   and framer-motion started a brand-new fixed-`duration` tween from rest each
   time. Cross several cells quickly and you get N sequential tweens, each
   re-easing in from zero velocity — the visible "stops and starts again"
   stutter. (That is also why a `setTimeout(0)` band-aid "helped": it only
   dodged the remount-timing race for a frame; it never removed it.)

   The fix is to STOP remounting. One pill is mounted ONCE per hover zone as an
   absolutely-positioned child of the zone container, and it TRAVELS to the
   hovered target via a spring (`t.settle`). A persistent node lets the engine
   RETARGET the in-flight spring on every move — velocity carries across cell
   boundaries, so it reads as one continuous glide with no restart, and no
   setTimeout is needed. Cells are uniform, so day grids animate transform +
   opacity only (CLAUDE.md §C); the presets rail can change width between
   labels, so width/height travel with the spring too (kept crisp by animating
   real size, never a radius-distorting scale).

   ── Contract ──────────────────────────────────────────────────────────────
   useGlide(containerRef) → { rect, active, enter, leave }
     containerRef  the positioned zone the pill lives in and is measured against
     enter(el)     measure el's box relative to the container, light the pill
     leave()       fade the pill out IN PLACE (rect is kept, so it doesn't fly
                   back to a corner; the next enter jumps there while hidden)
   <GlidePill className rect active />  the single node; place it as the last
     child of the same container. Buildless globals were window.GlidePill /
     .useGlide; a bundled app imports these. */

import * as React from 'react';
import type { RefObject } from 'react';
import { m } from 'motion/react';
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
  /* `wasActive` trails one render behind: the FIRST appearance lands in place
     (no fly-in from the corner), every move after that travels on the spring. */
  const wasActive = useRef(false);
  useEffect(() => {
    wasActive.current = active;
  });
  const travel = wasActive.current && active ? SM.t.settle : { duration: 0 };
  return (
    <m.span
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
    ></m.span>
  );
}
