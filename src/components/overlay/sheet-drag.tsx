'use client';

/* sheet-drag.tsx — drag-to-dismiss mechanics for Overlay's sheet mode.
   ─────────────────────────────────────────────────────────────────────────
   One hook, four behaviors:

     dismiss      drag toward the docked edge; release past 40% travel OR
                  with a flick (≥500 px/s) closes — otherwise it springs back
     scrim        opacity = 1 − travel progress (a MotionValue chain off the
                  panel's axis transform), so the scrim tracks entrance, drag
                  and exit physically instead of on its own clock
     rubber-band  dragging AWAY from the edge never detaches the panel —
                  travel is clamped at the edge (elastic 0) and the overdrag
                  becomes a SCALE STRETCH anchored at the docked edge, so the
                  panel stretches instead of revealing the scrim behind it;
                  it springs back to rest on release (the brand settle)
     handoff      inside a scrollable region the gesture belongs to the
                  scroll: drag engages only when the movement is along the
                  dismiss axis, toward the edge, and the scrollable is at its
                  start. Drag never auto-starts (dragListener:false) — a
                  pointer-intent listener calls dragControls.start() once the
                  gesture qualifies. Give inner scroll regions
                  `overscroll-behavior: contain` so touch scrolling can't
                  chain past the sheet.

   The axis MotionValue is shared with the slot's variants (style + variants
   write the same value), which is what lets enter/exit and drag compose.
   Thresholds are interaction mechanics, not design tokens — named consts. */
import * as React from 'react';
import { useMotionValue, useTransform, useDragControls, animate, type PanInfo } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';

const sdSM = UIMotion;
const { useEffect: sdUseEffect, useRef: sdUseRef } = React;

const DISMISS_RATIO = 0.4; // fraction of panel size dragged
const DISMISS_VELOCITY = 500; // px/s flick
const INTENT_PX = 4; // movement before we judge the gesture
const STRETCH_MAX = 0.06; // max scale overdrag away from the edge

/* nearest scrollable ancestor of `node`, stopping at the slot */
function findScrollable(node: EventTarget | null, stop: HTMLElement | null): HTMLElement | null {
  let el = node instanceof Element ? node : null;
  while (el && el !== stop) {
    const s = getComputedStyle(el);
    if (
      /(auto|scroll)/.test(s.overflowY + s.overflowX) &&
      (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth)
    )
      return el as HTMLElement;
    el = el.parentElement;
  }
  return null;
}

function useSheetDrag({
  side,
  slotRef,
  enabled,
  requestClose,
}: {
  side: 'right' | 'bottom';
  slotRef: React.RefObject<HTMLElement>;
  enabled: boolean;
  requestClose: () => void;
}) {
  const axis = side === 'bottom' ? 'y' : 'x';
  /* matches the `closed` variant so the scrim starts transparent */
  const travel = useMotionValue<string | number>('100%');
  const stretch = useMotionValue(1);
  const controls = useDragControls();
  const savedUserSelect = sdUseRef<string | null>(null);

  /* selection is suspended only while a drag is engaged; restore covers
     unmount-mid-drag too */
  function suspendSelection() {
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
    savedUserSelect.current = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
  }
  function restoreSelection() {
    if (savedUserSelect.current === null) return;
    document.body.style.userSelect = savedUserSelect.current;
    savedUserSelect.current = null;
  }
  sdUseEffect(() => restoreSelection, []); // eslint-disable-line react-hooks/exhaustive-deps

  const progress = useTransform(travel, (v) => {
    if (typeof v === 'string') return Math.min(Math.max(parseFloat(v) / 100 || 0, 0), 1);
    const el = slotRef.current;
    const size = el ? (axis === 'y' ? el.offsetHeight : el.offsetWidth) : Infinity;
    return Math.min(Math.max(v / size, 0), 1);
  });
  const scrimOpacity = useTransform(progress, (p) => 1 - p);

  /* pointer intent: watch the first few px, then either hand the gesture to
     the drag or leave it to the scroll/selection it belongs to */
  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    const startX = e.clientX,
      startY = e.clientY;
    const scrollable = findScrollable(e.target, slotRef.current);
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX,
        dy = ev.clientY - startY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < INTENT_PX) return;
      cleanup();
      const along = axis === 'y' ? dy : dx;
      const cross = axis === 'y' ? dx : dy;
      if (Math.abs(along) <= Math.abs(cross)) return; // not our axis
      if (scrollable) {
        if (along < 0) return; // gesture scrolls content
        if (axis === 'y' ? scrollable.scrollTop > 0 : scrollable.scrollLeft > 0) return;
      }
      suspendSelection(); // a drag, not a selection
      /* restore must not depend on framer promoting the session to a real
         drag (release exactly at the threshold → no onDragEnd). Idempotent
         with the onDragEnd restore. */
      window.addEventListener('pointerup', restoreSelection, { once: true });
      window.addEventListener('pointercancel', restoreSelection, { once: true });
      controls.start(ev);
    };
    const cleanup = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', cleanup);
      window.removeEventListener('pointercancel', cleanup);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', cleanup);
    window.addEventListener('pointercancel', cleanup);
  }

  /* overdrag away from the edge → stretch (heavily damped, capped).
     info.offset is the raw pointer delta — travel itself is clamped. */
  function onDrag(_ev: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const el = slotRef.current;
    if (!el) return;
    const size = axis === 'y' ? el.offsetHeight : el.offsetWidth;
    const o = info.offset[axis];
    stretch.set(o < 0 ? 1 + Math.min(-o / size, 1) * STRETCH_MAX : 1);
  }

  function onDragEnd(_ev: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    restoreSelection();
    animate(stretch, 1, sdSM.t.settle); // spring back to rest
    const el = slotRef.current;
    if (!el) return;
    const size = axis === 'y' ? el.offsetHeight : el.offsetWidth;
    if (info.offset[axis] > size * DISMISS_RATIO || info.velocity[axis] > DISMISS_VELOCITY)
      requestClose();
  }

  const stretchStyle =
    axis === 'y'
      ? { scaleY: stretch, originY: 1 } // anchored at the bottom edge
      : { scaleX: stretch, originX: 1 }; // anchored at the right edge

  const slotProps = enabled
    ? {
        drag: axis,
        dragControls: controls,
        dragListener: false, // pointer-intent starts it, not framer
        dragMomentum: false,
        dragConstraints: { top: 0, bottom: 0, left: 0, right: 0 },
        /* away from the edge: hard clamp (stretch covers it); toward: free */
        dragElastic: axis === 'y' ? { top: 0, bottom: 1 } : { left: 0, right: 1 },
        onPointerDown,
        onDrag,
        onDragEnd,
        style: { [axis]: travel, ...stretchStyle },
      }
    : { style: { [axis]: travel } }; // scrim coupling still applies

  return { slotProps, scrimOpacity };
}

export { useSheetDrag };
