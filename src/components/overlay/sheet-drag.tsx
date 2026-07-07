'use client';

/* sheet-drag - drag-to-dismiss for Overlay's sheet mode (dismiss - scrim - rubber-band - scroll handoff). */
import './overlay.css';
/* PointerEvent is aliased: React's synthetic type for the React handler below,
   the DOM global (bare `PointerEvent`) for the native window listeners. */
import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { useMotionValue, useTransform, useDragControls, animate, type PanInfo } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';

const SM = UIMotion;

const DISMISS_RATIO = 0.4;
const DISMISS_VELOCITY = 500;
const INTENT_PX = 4;
const STRETCH_MAX = 0.06;

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
  slotRef: RefObject<HTMLElement>;
  enabled: boolean;
  requestClose: () => void;
}) {
  const axis = side === 'bottom' ? 'y' : 'x';
  /* matches the `closed` variant so the scrim starts transparent */
  const travel = useMotionValue<string | number>('100%');
  const stretch = useMotionValue(1);
  const controls = useDragControls();
  const savedUserSelect = useRef<string | null>(null);

  /* suspend selection only while dragging; restore also covers unmount mid-drag */
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
  useEffect(() => restoreSelection, []); // eslint-disable-line react-hooks/exhaustive-deps

  const progress = useTransform(travel, (v) => {
    if (typeof v === 'string') return Math.min(Math.max(parseFloat(v) / 100 || 0, 0), 1);
    const el = slotRef.current;
    const size = el ? (axis === 'y' ? el.offsetHeight : el.offsetWidth) : Infinity;
    return Math.min(Math.max(v / size, 0), 1);
  });
  const scrimOpacity = useTransform(progress, (p) => 1 - p);

  /* pointer intent: watch the first few px, then hand off to drag or to scroll/selection */
  function onPointerDown(e: ReactPointerEvent) {
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
      if (Math.abs(along) <= Math.abs(cross)) return;
      if (scrollable) {
        if (along < 0) return;
        if (axis === 'y' ? scrollable.scrollTop > 0 : scrollable.scrollLeft > 0) return;
      }
      suspendSelection();
      /* framer may not fire onDragEnd (release exactly at threshold), so restore here too - idempotent with the onDragEnd restore */
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

  /* overdrag away from the edge - damped, capped stretch (info.offset is raw; travel is clamped) */
  function onDrag(_ev: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const el = slotRef.current;
    if (!el) return;
    const size = axis === 'y' ? el.offsetHeight : el.offsetWidth;
    const o = info.offset[axis];
    stretch.set(o < 0 ? 1 + Math.min(-o / size, 1) * STRETCH_MAX : 1);
  }

  function onDragEnd(_ev: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    restoreSelection();
    animate(stretch, 1, SM.t.settle);
    const el = slotRef.current;
    if (!el) return;
    const size = axis === 'y' ? el.offsetHeight : el.offsetWidth;
    if (info.offset[axis] > size * DISMISS_RATIO || info.velocity[axis] > DISMISS_VELOCITY)
      requestClose();
  }

  const stretchStyle =
    axis === 'y' ? { scaleY: stretch, originY: 1 } : { scaleX: stretch, originX: 1 };

  const slotProps = enabled
    ? {
        drag: axis,
        dragControls: controls,
        dragListener: false,
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
