'use client';

import './overlay.css';
import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { animate, type Layer, type Playback } from '../../../engine';
import { UIMotion } from '../../../tokens/motion-tokens';
import { useOverlayEntry } from './layer';
import { useReturnFocus, useFocusTrap } from './focus';
import { ovPanelElement } from './panel';

const SM = UIMotion;

let ovLocks = 0;
let ovSavedOverflow = '';
let ovSavedPad = '';
function useScrollLock() {
  useEffect(() => {
    if (++ovLocks === 1) {
      const body = document.body;
      const gutter = window.innerWidth - document.documentElement.clientWidth;
      ovSavedOverflow = body.style.overflow;
      ovSavedPad = body.style.paddingRight;
      body.style.overflow = 'hidden';
      if (gutter > 0) body.style.paddingRight = (parseFloat(getComputedStyle(body).paddingRight) || 0) + gutter + 'px';
    }
    return () => {
      if (--ovLocks === 0) {
        document.body.style.overflow = ovSavedOverflow;
        document.body.style.paddingRight = ovSavedPad;
      }
    };
  }, []);
}

let ovInertCount = 0;
const ovInerted = new Set<HTMLElement>();
function useInertOutside() {
  useEffect(() => {
    if (++ovInertCount === 1) {
      for (const el of Array.from(document.body.children) as HTMLElement[]) {
        if (el.hasAttribute('data-overlay-root') || el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.inert)
          continue;
        el.inert = true;
        ovInerted.add(el);
      }
    }
    return () => {
      if (--ovInertCount === 0) {
        ovInerted.forEach((el) => {
          el.inert = false;
        });
        ovInerted.clear();
      }
    };
  }, []);
}

const ovScrimTiming = {
  open: { duration: SM.dur.slow, ease: SM.ease.entrance },
  close: { duration: SM.dur.base, ease: SM.ease.standard },
};

export function ovModalPlays(layer: HTMLElement, dir: 'open' | 'close', slot: Layer[]): Playback[] {
  const scrimEl = layer.querySelector<HTMLElement>('.overlay-scrim');
  const slotEl = layer.querySelector<HTMLElement>('.overlay-slot');
  const plays: Playback[] = [];
  if (scrimEl) plays.push(animate(scrimEl, { opacity: dir === 'open' ? [0, 1] : [0], timing: ovScrimTiming[dir] }));
  if (slotEl) plays.push(animate(slotEl, ...slot));
  return plays;
}

function OverlayScrim({ dismissible, onPress }: { dismissible: boolean; onPress: () => void }) {
  const down = useRef(false);
  return (
    <div
      className="overlay-scrim"
      aria-hidden="true"
      onPointerDown={(e) => {
        down.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (dismissible && down.current && e.target === e.currentTarget) onPress();
      }}
    ></div>
  );
}

export function ModalShell({
  layerClass,
  slotClass,
  panelId,
  dismissible,
  requestClose,
  asChild = false,
  slotRef: externalSlotRef = null,
  slotProps = {},
  children,
}: {
  layerClass: string;
  slotClass: string;
  panelId: string;
  dismissible: boolean;
  requestClose: () => void;
  asChild?: boolean;
  slotRef?: RefObject<HTMLElement> | null;
  slotProps?: Record<string, any>;
  children: ReactNode;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const internalSlotRef = useRef<HTMLElement>(null);
  const slotRef = externalSlotRef || internalSlotRef;
  const entry = useOverlayEntry({ nodeRef: layerRef, dismissible, requestClose });
  useScrollLock();
  useInertOutside();
  useReturnFocus(layerRef);
  useFocusTrap({ panelRef: slotRef, entry });
  return (
    <div ref={layerRef} className={'overlay-layer ' + layerClass}>
      <OverlayScrim dismissible={dismissible} onPress={requestClose} />
      {ovPanelElement({
        asChild,
        children,
        nodeRef: slotRef,
        className: 'overlay-slot ' + slotClass,
        panelProps: { id: panelId, tabIndex: -1, ...slotProps },
      })}
    </div>
  );
}
