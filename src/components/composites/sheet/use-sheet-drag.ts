'use client';

import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { animate, startDrag, type PanInfo } from '../../../engine';
import { UIMotion } from '../../../tokens/motion-tokens';

const SM = UIMotion;

const DISMISS_RATIO = 0.4;
const DISMISS_VELOCITY = 500;
const INTENT_PX = 4;
const STRETCH_MAX = 0.06;

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

function sheetScrim(slot: HTMLElement | null): HTMLElement | null {
  return slot?.parentElement?.querySelector<HTMLElement>('.overlay-scrim') ?? null;
}

export function sheetSpan(slot: HTMLElement, side: 'right' | 'bottom'): number {
  return side === 'bottom' ? slot.offsetHeight : slot.offsetWidth;
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
  const savedUserSelect = useRef<string | null>(null);

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

  function paint(el: HTMLElement, travel: number, stretch: number) {
    const span = sheetSpan(el, side);
    el.style.translate = axis === 'y' ? `0px ${travel}px` : `${travel}px 0px`;
    el.style.scale = axis === 'y' ? `1 ${stretch}` : `${stretch} 1`;
    const scrim = sheetScrim(el);
    if (scrim) scrim.style.opacity = String(1 - Math.min(Math.max(travel / span, 0), 1));
  }

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
      startDrag(ev, { onMove: onDrag, onEnd: onDragEnd });
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

  function onDrag(info: PanInfo) {
    const el = slotRef.current;
    if (!el) return;
    const o = info.offset[axis];
    const span = sheetSpan(el, side);
    paint(el, Math.max(o, 0), o < 0 ? 1 + Math.min(-o / span, 1) * STRETCH_MAX : 1);
  }

  function onDragEnd(info: PanInfo) {
    restoreSelection();
    const el = slotRef.current;
    if (!el) return;
    const span = sheetSpan(el, side);
    if (info.offset[axis] > span * DISMISS_RATIO || info.velocity[axis] > DISMISS_VELOCITY) {
      requestClose();
      return;
    }
    animate(el, { translate: [[0, 0]], scale: [[1, 1]], timing: SM.t.settle });
    const scrim = sheetScrim(el);
    if (scrim) animate(scrim, { opacity: [1], timing: SM.t.settle });
  }

  return enabled ? { onPointerDown } : {};
}

export { useSheetDrag };
